import { BaseRepository } from "./baseRepository";
import { getDb } from "../db";

export interface Task {
  id?: number;
  title: string;
  description?: string;
  completed?: boolean;
}

export class TaskRepository extends BaseRepository<Task> {
  constructor() {
    super("tasks");
  }

  async create(task: Task): Promise<void> {
    const db = await getDb();
    await db.execute(
      "INSERT INTO tasks (title, description, completed) VALUES ($1, $2, $3)",
      [task.title, task.description || "", task.completed ? 1 : 0]
    );
  }

  async update(id: number, task: Partial<Task>): Promise<void> {
    const db = await getDb();
    const sets: string[] = [];
    const values: any[] = [];
    let i = 1;

    if (task.title !== undefined) {
      sets.push(`title = $${i++}`);
      values.push(task.title);
    }
    if (task.description !== undefined) {
      sets.push(`description = $${i++}`);
      values.push(task.description);
    }
    if (task.completed !== undefined) {
      sets.push(`completed = $${i++}`);
      values.push(task.completed ? 1 : 0);
    }

    if (sets.length === 0) return;

    values.push(id);
    await db.execute(
      `UPDATE tasks SET ${sets.join(", ")} WHERE id = $${i}`,
      values
    );
  }
}

export const taskRepository = new TaskRepository();
