use agql::{InputObject, Object};
use async_graphql as agql;
use sqlx::PgPool;

use crate::{
    db::{HatenaStarRecord, PageRecord},
    model::Page,
};

use super::{DeletedPage, HatenaStar};

#[derive(InputObject)]
pub struct CreatePageInput {
    title: String,
    source: String,
}

#[derive(InputObject)]
pub struct UpdatePageInput {
    id: i32,
    title: Option<String>,
    source: Option<String>,
}
#[derive(InputObject)]
pub struct DeletePageInput {
    id: i32,
}

#[derive(InputObject)]
pub struct GiveHatenaStarInput {
    page_id: i32,
    quote: Option<String>,
    color: i32,
}

pub struct Mutation;

#[Object]
impl Mutation {
    async fn create_page(
        &self,
        ctx: &agql::Context<'_>,
        input: CreatePageInput,
    ) -> Result<Page, agql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let mut tx = pool.begin().await?;
        let now = chrono::Utc::now().naive_utc();
        let sql = "
            insert into pages (
                title, source, create_time, update_time
            )
            values (
                $1, $2, $3, $4
            )
            returning
                id, title, source, create_time, update_time
            ;
        ";
        let page_record: PageRecord = sqlx::query_as(sql)
            .bind(&input.title)
            .bind(&input.source)
            .bind(&now)
            .bind(&now)
            .fetch_one(&mut tx)
            .await?;
        let sql = "
            insert into page_revisions (
                page_id, source, author, create_time
            ) values (
                $1, $2, $3, $4
            );
        ";
        sqlx::query(sql)
            .bind(page_record.id)
            .bind(&input.source)
            .bind("example")
            .bind(page_record.update_time)
            .execute(&mut tx)
            .await?;
        tx.commit().await?;
        let gpl_page = page_record.into();
        Ok(gpl_page)
    }

    async fn update_page(
        &self,
        ctx: &agql::Context<'_>,
        input: UpdatePageInput,
    ) -> Result<Option<Page>, agql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let mut tx = pool.begin().await?;
        let now = chrono::Utc::now().naive_utc();
        if let Some(title) = input.title {
            let sql = "
            update pages
            set
                title = $1
                , update_time = $2
            where
                id = $3
            returning
                id
            ;
            ";
            let id: Option<(i32,)> = sqlx::query_as(sql)
                .bind(&title)
                .bind(&now)
                .bind(&input.id)
                .fetch_optional(&mut tx)
                .await?;
            if id.is_none() {
                return Ok(None);
            }
        };

        if let Some(source) = &input.source {
            let sql = "
            update pages
            set
                source = $1
                , update_time = $2
            where
                id = $3
            returning
                id
            ;
            ";
            let id: Option<(i32,)> = sqlx::query_as(sql)
                .bind(&source)
                .bind(&now)
                .bind(&input.id)
                .fetch_optional(&mut tx)
                .await?;
            if id.is_none() {
                return Ok(None);
            }

            let sql = "
                insert into page_revisions (
                    page_id, source, author, create_time
                ) values (
                    $1, $2, $3, $4
                );
            ";
            sqlx::query(sql)
                .bind(input.id)
                .bind(&source)
                .bind("example") // FIXME
                .bind(&now)
                .execute(&mut tx)
                .await?;
        }

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
                id = $1
            ;
        ";
        let page_record: Option<PageRecord> = sqlx::query_as(sql)
            .bind(input.id)
            .fetch_optional(&mut tx)
            .await?;
        tx.commit().await?;
        let gpl_page = page_record.map(Into::into);
        Ok(gpl_page)
    }

    async fn delete_page(
        &self,
        ctx: &agql::Context<'_>,
        input: DeletePageInput,
    ) -> Result<Option<DeletedPage>, agql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let mut tx = pool.begin().await?;
        let sql = "delete from pages where id = $1;";
        let result = sqlx::query(sql).bind(input.id).execute(&mut tx).await?;
        if result.rows_affected() == 0 {
            return Ok(None);
        }
        let sql = "delete from page_revisions where page_id = $1";
        sqlx::query(sql).bind(input.id).execute(&mut tx).await?;
        tx.commit().await?;
        Ok(Some(DeletedPage { id: input.id }))
    }

    async fn give_hatena_star(
        &self,
        ctx: &agql::Context<'_>,
        input: GiveHatenaStarInput,
    ) -> Result<HatenaStar, agql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let sql = "
            insert into hatena_stars (
                page_id, quote, color
            )
            values (
                $1, $2, $3
            )
            returning
                id, page_id, quote, color
        ";
        let hatena_star: HatenaStarRecord = sqlx::query_as(sql)
            .bind(input.page_id)
            .bind(input.quote)
            .bind(input.color)
            .fetch_one(pool)
            .await?;
        Ok(hatena_star.into())
    }
}
