use anyhow::Result;
use async_graphql as agql;
use agql:: {
    http::{playground_source, GraphQLPlaygroundConfig},
    EmptyMutation, EmptySubscription, Schema, Object, SimpleObject,
};
use async_graphql_rocket::{GraphQLQuery, GraphQLRequest, GraphQLResponse};
use rocket::{response::content, State};
use sqlx::{postgres::PgPoolOptions, PgPool};

struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn answer(&self, ctx: &agql::Context<'_>) -> Result<i32, agql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let (answer,): (i32,) = sqlx::query_as("select 423;").fetch_one(pool).await?;
        Ok(answer)
    }
}

#[derive(SimpleObject)]
struct Page {
    id: i32,
    title: String,
    body_html: String,
}

struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn create_page(&self, ctx: &agql::Context<'_>) -> Result<Page, agql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let mut tx = pool.begin().await?;
        sqlx::query_as("insert")
        todo!();
    }
}

type WikitSchema = Schema<QueryRoot, EmptyMutation, EmptySubscription>;

#[rocket::get("/")]
fn graphql_playground() -> content::Html<String> {
    content::Html(playground_source(GraphQLPlaygroundConfig::new("/graphql")))
}

#[rocket::get("/graphql?<query..>")]
async fn graphql_query(schema: &State<WikitSchema>, query: GraphQLQuery) -> GraphQLResponse {
    query.execute(schema).await
}

#[rocket::post("/graphql", data = "<request>", format = "application/json")]
async fn graphql_request(
    schema: &State<WikitSchema>,
    request: GraphQLRequest,
) -> GraphQLResponse {
    request.execute(schema).await
}

#[rocket::launch]
async fn rocket() -> _ {
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect("postgres:///wikit_dev")
        .await
        .unwrap();
    let query_root = QueryRoot;
    let schema = Schema::build(query_root, EmptyMutation, EmptySubscription)
        .data(pool)
        .finish();
    rocket::build().manage(schema).mount(
        "/",
        rocket::routes![graphql_query, graphql_request, graphql_playground])
}
