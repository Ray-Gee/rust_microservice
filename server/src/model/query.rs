use agql::{
    connection::{Connection, Edge, EmptyFields},
    Object,
};
use async_graphql as agql;
use sqlx::PgPool;

use crate::db::PageRecord;

use super::Page;

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn answer(&self, ctx: &agql::Context<'_>) -> Result<i32, agql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let (answer,): (i32,) = sqlx::query_as("select 423;").fetch_one(pool).await?;
        Ok(answer)
    }

    async fn page(&self, ctx: &agql::Context<'_>, id: i32) -> Result<Option<Page>, agql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let page_record: Option<PageRecord> = sqlx::query_as(
            "select id, title, source, create_time, update_time from pages where id = $1;",
        )
        .bind(id)
        .fetch_optional(pool)
        .await?;
        let page = page_record.map(Into::into);
        Ok(page)
    }

    async fn page_by_title(
        &self,
        ctx: &agql::Context<'_>,
        title: String,
    ) -> Result<Option<Page>, agql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let page_record: Option<PageRecord> = sqlx::query_as(
            "select id, title, source, create_time, update_time from pages where title = $1;",
        )
        .bind(title)
        .fetch_optional(pool)
        .await?;
        let page = page_record.map(Into::into);
        Ok(page)
    }

    async fn search_page(
        &self,
        ctx: &async_graphql::Context<'_>,
        query: String,
        after: Option<String>,
        before: Option<String>,
        first: Option<i32>,
        last: Option<i32>,
    ) -> Result<Connection<usize, Page, EmptyFields, EmptyFields>, agql::Error> {
        if query.trim().is_empty() {
            return Ok(Connection::new(false, false));
        }
        //     let pool = ctx.data::<PgPool>()?;
        //     let sql = "select id, title, source, create_time, update_time
        //         from
        //             pages
        //         where
        //             &@~ $1
        //         order by
        //             pgroonga_score(tableoid, ctid)
        //         limit 20;";
        //     let page_records: Vec<PageRecord> =
        //         sqlx::query_as(sql).bind(&query).fetch_all(pool).await?;
        //     let pages = page_records.into_iter().map(Into::into).collect();
        //     Ok(pages)
        // }
        let (first, last) = if matches!((first, last), (None, None)) {
            (Some(20), None)
        } else {
            (first, last)
        };
        let pool = ctx.data::<PgPool>()?;
        agql::connection::query(
            after,
            before,
            first,
            last,
            |after: Option<usize>, before, first, last| async move {
                let (offset, limit, page_records): (usize, usize, Vec<PageRecord>) =
                    match (first, last) {
                        (Some(first), None) => {
                            let (limit, offset) = match (after, before) {
                                (None, None) => (first, 0),
                                (None, Some(before)) => (first.min(before), 0),
                                (Some(after), None) => (first, after + 1),
                                (Some(after), Some(before)) => {
                                    (first.min(before - (after + 1)), after + 1)
                                }
                            };
                            let sql = "
                                select
                                    id
                                    , title
                                    , source
                                    , create_time
                                    , update_time
                                from
                                    pages
                                where
                                    source &@~ $1
                                order by
                                    pgroonga_score(tableoid, cid)
                                    , id
                                limit
                                    $2
                                offset
                                    $3
                                ";
                            let mut records = sqlx::query_as(sql)
                                .bind(&query)
                                .bind(limit as i64 + 1)
                                .bind(offset as i64)
                                .fetch_all(pool)
                                .await?;
                            (offset, limit, records)
                        }
                        (None, Some(_last)) => return Err("last is not supported".into()),
                        _ => unreachable!(),
                    };
                let has_previous_page = offset > 0;
                let has_next_page = limit < page_records.len();
                let mut connection =
                    Connection::<_, Page, _, _>::new(has_previous_page, has_next_page);
                let edges =
                    page_records
                        .into_iter()
                        .take(limit)
                        .enumerate()
                        .map(|(index, record)| {
                            let page = record.into();
                            Edge::new(offset + index, page)
                        });
                connection.append(edges);
                Ok::<_, agql::Error>(connection)
            },
        )
        .await
    }

    async fn im_feeling_lucky(
        &self,
        ctx: &async_graphql::Context<'_>,
    ) -> Result<Page, agql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let sql = "
            select
                id
                , title
                , source
                , create_time
                , update_time
            from
                pages
            order by
                random()
            limit
                1
        ";
        let page_record: PageRecord = sqlx::query_as(sql).fetch_one(pool).await?;
        Ok(page_record.into())
    }
}

#[cfg(test)]
mod tests {
    #[test]
    fn test_pagination() {
        fn limit_offset<T>(seq: &[T], (limit, offset): (usize, usize)) -> &[T] {
            &seq[offset..][..limit]
        }
        fn make_limit_offset(
            first: usize,
            after: Option<usize>,
            before: Option<usize>,
        ) -> (usize, usize) {
            match (after, before) {
                (None, None) => (first, 0),
                (None, Some(before)) => (first.min(before), 0),
                (Some(after), None) => (first, after + 1),
                (Some(after), Some(before)) => (first.min(before - (after + 1)), after + 1),
            }
        }
        let seq: Vec<_> = (0..100).into_iter().collect();

        let first3 = limit_offset(&seq, make_limit_offset(3, None, None));
        assert_eq!(first3, &[0, 1, 2]);

        let first3_after10 = limit_offset(&seq, make_limit_offset(3, Some(10), None));
        assert_eq!(first3_after10, &[11, 12, 13]);

        let first10_before4 = limit_offset(&seq, make_limit_offset(10, None, Some(4)));
        assert_eq!(first10_before4, &[0, 1, 2, 3]);

        let first10_after5_before8 = limit_offset(&seq, make_limit_offset(10, Some(5), Some(8)));
        assert_eq!(first10_after5_before8, &[6, 7]);

        let first10_after5_before30 = limit_offset(&seq, make_limit_offset(10, Some(5), Some(30)));
        assert_eq!(
            first10_after5_before30,
            &[6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        );
    }
}
