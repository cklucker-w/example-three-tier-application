const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// GET /tasks — list all tasks
app.get('/tasks', async (_req, res) => {
  const { rows } = await db.query('SELECT * FROM tasks ORDER BY created_at ASC');
  res.json(rows);
});

// GET /tasks/:id — fetch a single task by ID
app.get('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { rows } = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// POST /tasks — create a task
app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  if (!title || typeof title!== 'string' ||!title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  const { rows } = await db.query(
    'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
    [title.trim()]
  );
  res.status(201).json(rows[0]);
});

// PATCH /tasks/:id — update a task (complete/uncomplete or rename)
app.patch('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { completed, title } = req.body;

  const { rows } = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });

  const current = rows[0];
  const newCompleted = completed!== undefined? Boolean(completed) : current.completed;
  const newTitle = title!== undefined? title.trim() : current.title;

  const { rows: updated } = await db.query(
    'UPDATE tasks SET completed = $1, title = $2 WHERE id = $3 RETURNING *',
    [newCompleted, newTitle, id]
  );
  res.json(updated[0]);
});

// DELETE /tasks/:id — delete a task
app.delete('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  const { rows } = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });

  await db.query('DELETE FROM tasks WHERE id = $1', [id]);
  res.status(204).send();
});

// GET /tasks/completed — list all completed tasks
app.get('/tasks/completed', async (_req, res) => {
  const { rows } = await db.query('SELECT * FROM tasks WHERE completed = true ORDER BY created_at ASC');
  res.json(rows);
});

// GET /tasks/pending — list all pending (incomplete) tasks
app.get('/tasks/pending', async (_req, res) => {
  const { rows } = await db.query('SELECT * FROM tasks WHERE completed = false ORDER BY created_at ASC');
  res.json(rows);
});

// GET /tasks/stats — get task statistics
app.get('/tasks/stats', async (_req, res) => {
  const { rows } = await db.query(
    'SELECT COUNT(*) as total, SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) as completed, SUM(CASE WHEN completed = false THEN 1 ELSE 0 END) as pending FROM tasks'
  );
  const stats = rows[0];
  res.json({
    total: parseInt(stats.total, 10),
    completed: parseInt(stats.completed || 0, 10),
    pending: parseInt(stats.pending || 0, 10)
  });
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
