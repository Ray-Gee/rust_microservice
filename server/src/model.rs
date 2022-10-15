use self::mutation::Mutation;
use crate::{
    db::{HatenaStarRecord, PageRecord},
    model::query::QueryRoot,
};
use agql::{EmptySubscription, Object, Schema, SimpleObject};
use ammonia::clean;
use async_graphql as agql;
use chrono::NaiveDateTime;
use pulldown_cmark::{html, Options, Parser};
use sqlx::PgPool;

pub mod mutation;
pub mod query;

pub type WikitSchema = Schema<QueryRoot, Mutation, EmptySubscription>;

impl From<PageRecord> for Page {
    fn from(
        PageRecord {
            id,
            title,
            source,
            create_time,
            update_time,
        }: PageRecord,
    ) -> Self {
        Self {
            id,
            title,
            source,
            create_time,
            update_time,
        }
    }
}
#[allow(dead_code)]
#[derive(Debug)]
struct Page {
    id: i32,
    title: String,
    source: String,
    create_time: NaiveDateTime,
    update_time: NaiveDateTime,
}

#[Object]
impl Page {
    async fn id(&self) -> i32 {
        self.id
    }

    async fn title(&self) -> &str {
        &self.title
    }

    async fn source(&self) -> &str {
        &self.source
    }

    async fn body_html(&self) -> Result<String, agql::Error> {
        let mut options = Options::empty();
        options.insert(Options::ENABLE_STRIKETHROUGH);
        let parser = Parser::new_ext(&self.source, options);
        let mut unsafe_html = String::new();
        html::push_html(&mut unsafe_html, parser);
        let safe_html = clean(&*unsafe_html);
        Ok(safe_html)
    }

    async fn create_time(&self) -> NaiveDateTime {
        self.create_time
    }
    async fn update_time(&self) -> NaiveDateTime {
        self.update_time
    }

    async fn hatena_stars(&self, ctx: &agql::Context<'_>) -> Result<Vec<HatenaStar>, agql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let sql = "
        select
            id
            , page_id
            , quote
            , color
        from
            hatena_stars
        where
            page_id = $1
        ";
        let hatena_stars: Vec<HatenaStarRecord> =
            sqlx::query_as(sql).bind(self.id).fetch_all(pool).await?;
        Ok(hatena_stars.into_iter().map(Into::into).collect())
    }
}

#[derive(SimpleObject)]
pub struct DeletedPage {
    id: i32,
}

#[derive(SimpleObject)]
pub struct HatenaStar {
    id: i32,
    page_id: i32,
    quote: Option<String>,
    color: i32,
}

impl From<HatenaStarRecord> for HatenaStar {
    fn from(
        HatenaStarRecord {
            id,
            page_id,
            quote,
            color,
        }: HatenaStarRecord,
    ) -> Self {
        Self {
            id,
            page_id,
            quote,
            color,
        }
    }
}
