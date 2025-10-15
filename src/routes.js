export default function setupRoutes(app) {
  const db = () => app.locals.db;

  app.get('/health', async (req, res) => {
    try {
      await db().command({ ping: 1 });
      res.status(200).json({ status: 'ok', db: 'connected' });
    } catch (err) {
      console.error('Health check failed:', err);
      res.status(500).json({ status: 'error', db: 'disconnected' });
    }
  });

  app.get('/api/todos', async (req, res) => {
    try {
      const todos = await db().collection('todos').find({}).toArray();
      res.json(todos);
    } catch (err) {
      console.error('Error fetching todos:', err.message);
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
  });

  app.post('/api/todos', async (req, res) => {
    try {
      const todo = req.body;
      await db().collection('todos').insertOne(todo);
      res.status(201).json(todo);
    } catch (err) {
      console.error('Error inserting todo:', err.message);
      res.status(500).json({ error: 'Failed to add todo' });
    }
  });
}