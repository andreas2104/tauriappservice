use serde::{Deserialize, Serialize};
use sqlx::{sqlite::SqlitePool, FromRow};
use std::sync::Arc;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Task {
    pub id: Option<i64>,
    pub title: String,
    pub description: Option<String>,
    pub completed: bool,
}

pub struct TaskRepository {
    pool: Arc<SqlitePool>,
}

impl TaskRepository {
    pub fn new(pool: Arc<SqlitePool>) -> Self {
        Self { pool }
    }

    pub async fn create(&self, task: &Task) -> Result<(), sqlx::Error> {
        sqlx::query(
            "INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)"
        )
        .bind(&task.title)
        .bind(&task.description)
        .bind(task.completed)
        .execute(&*self.pool)
        .await?;
        Ok(())
    }

    pub async fn get_all(&self) -> Result<Vec<Task>, sqlx::Error> {
        let tasks = sqlx::query_as::<_, Task>("SELECT * FROM tasks")
            .fetch_all(&*self.pool)
            .await?;
        Ok(tasks)
    }

    pub async fn get_by_id(&self, id: i64) -> Result<Option<Task>, sqlx::Error> {
        let task = sqlx::query_as::<_, Task>("SELECT * FROM tasks WHERE id = ?")
            .bind(id)
            .fetch_optional(&*self.pool)
            .await?;
        Ok(task)
    }

    pub async fn update(&self, id: i64, task: &Task) -> Result<(), sqlx::Error> {
        sqlx::query(
            "UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?"
        )
        .bind(&task.title)
        .bind(&task.description)
        .bind(task.completed)
        .bind(id)
        .execute(&*self.pool)
        .await?;
        Ok(())
    }

    pub async fn delete(&self, id: i64) -> Result<(), sqlx::Error> {
        sqlx::query("DELETE FROM tasks WHERE id = ?")
            .bind(id)
            .execute(&*self.pool)
            .await?;
        Ok(())
    }
}
