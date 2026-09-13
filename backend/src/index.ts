import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { prisma } from './config/prisma';

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = 3000;

app.use(cors());
app.use(express.json());

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

app.post('/applications/:id/ocr', async (req, res) => {
  const { id } = req.params;

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const posiblesPersonas = [
    { nombres: 'Juan Carlos', apellidos: 'Pérez Gómez' },
    { nombres: 'María Fernanda', apellidos: 'Rodríguez López' },
    { nombres: 'Andrés Felipe', apellidos: 'Martínez Torres' },
  ];
  const persona = posiblesPersonas[Math.floor(Math.random() * posiblesPersonas.length)];
  const numeroDocumento = String(Math.floor(1000000000 + Math.random() * 9000000000));

  const application = await prisma.application.update({
    where: { id: Number(id) },
    data: {
      nombres: persona.nombres,
      apellidos: persona.apellidos,
      numeroDocumento,
      fechaNacimiento: '1995-03-15',
      status: 'ocr_completed',
    },
  });

  res.json(application);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});