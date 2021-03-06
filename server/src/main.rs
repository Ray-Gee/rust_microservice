use agql::{
    http::{playground_source, GraphQLPlaygroundConfig},
    EmptySubscription, Schema,
};
use async_graphql as agql;
use async_graphql_rocket::{GraphQLQuery, GraphQLRequest, GraphQLResponse};
use model::{mutation::Mutation, query::QueryRoot, WikitSchema};
use rocket::{http::Method, response::content, State};
use rocket_cors::AllowedOrigins;
use rocket_cors::CorsOptions;
use sqlx::postgres::PgPoolOptions;

mod db;
mod model;

#[rocket::get("/")]
fn graphql_playground() -> content::Html<String> {
    content::Html(playground_source(GraphQLPlaygroundConfig::new("/graphql")))
}

#[rocket::get("/graphql?<query..>")]
async fn graphql_query(schema: &State<WikitSchema>, query: GraphQLQuery) -> GraphQLResponse {
    query.execute(schema).await
}

#[rocket::post("/graphql", data = "<request>", format = "application/json")]
async fn graphql_request(schema: &State<WikitSchema>, request: GraphQLRequest) -> GraphQLResponse {
    request.execute(schema).await
}

#[rocket::launch]
async fn rocket() -> _ {
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect("postgres:///wikit_dev")
        .await
        .unwrap();
    let schema = Schema::build(QueryRoot, Mutation, EmptySubscription)
        .data(pool)
        .finish();
    let cors = cors_options().to_cors().unwrap();
    rocket::build()
        .manage(schema)
        .mount(
            "/",
            rocket::routes![graphql_playground, graphql_query, graphql_request],
        )
        .attach(cors)
}

fn cors_options() -> CorsOptions {
    let allowed_origins =
        AllowedOrigins::some_exact(&["http://localhost:3000", "http://127.0.0.1:8000"]);

    CorsOptions {
        allowed_origins,
        allowed_methods: vec![Method::Get, Method::Post]
            .into_iter()
            .map(Into::into)
            .collect(),
        allow_credentials: true,
        ..Default::default()
    }
}
