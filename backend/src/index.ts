import express from 'express';
import { prisma } from './config/prisma';

const app = express();
const PORT = 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servimax KYC backend funcionando' });
});

app.use(express.json());

app.post('/applications', async (req, res) => {
  const { phone, email, city } = req.body;

  const application = await prisma.application.create({
    data: { phone, email, city },
  });

  res.status(201).json(application);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});