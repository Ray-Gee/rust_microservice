use agql::Object;
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
    ) -> Result<Vec<Page>, agql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let sql =
            "select id, title, source, create_time, update_time from pages where &@~ $1 limit 20;";
        let page_records: Vec<PageRecord> =
            sqlx::query_as(sql).bind(&query).fetch_all(pool).await?;
        let pages = page_records.into_iter().map(Into::into).collect();
        Ok(pages)
    }
}
