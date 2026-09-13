import express from 'express';
import { prisma } from './config/prisma';
import cors from 'cors';
import multer from 'multer';

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());
app.use(express.json());
const PORT = 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servimax KYC backend funcionando' });
});

app.post('/applications', async (req, res) => {
  const { phone, email, city } = req.body;

  const application = await prisma.application.create({
    data: { phone, email, city },
  });

  res.status(201).json(application);
});

app.post(
  '/applications/:id/documents',
  upload.fields([
    { name: 'front', maxCount: 1 },
    { name: 'back', maxCount: 1 },
  ]),
  async (req, res) => {
    const { id } = req.params;
    const files = req.files as {
      front?: Express.Multer.File[];
      back?: Express.Multer.File[];
    };

    const application = await prisma.application.update({
      where: { id: Number(id) },
      data: {
        frontImagePath: files.front?.[0]?.path,
        backImagePath: files.back?.[0]?.path,
        status: 'documents_uploaded',
      },
    });

    res.json(application);
  }
);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});