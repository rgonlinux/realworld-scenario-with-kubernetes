import express from 'express';
import setupRoutes from './routes.js';

const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(express.static('public'));

export default app;
setupRoutes(app);