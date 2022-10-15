use chrono::NaiveDateTime;
use sqlx::FromRow;

#[derive(Debug, FromRow)]
pub struct PageRecord {
    pub id: i32,
    pub title: String,
    pub source: String,
    pub create_time: NaiveDateTime,
    pub update_time: NaiveDateTime,
}

#[derive(Debug, FromRow)]
pub struct HatenaStarRecord {
    pub id: i32,
    pub page_id: i32,
    pub quote: Option<String>,
    pub color: i32,
}
