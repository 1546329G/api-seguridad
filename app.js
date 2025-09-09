
import express from 'express';
import authRouter from './routes/auth.js';
import recordsRouter from './routes/records.js'; // Importa la nueva ruta

const app = express();

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/records', recordsRouter); // Usa la nueva ruta

export default app;