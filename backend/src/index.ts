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

app.post('/applications/:id/validate', async (req, res) => {
  const { id } = req.params;
  const { nombres, apellidos, numeroDocumento, fechaNacimiento } = req.body;

  const existing = await prisma.application.findUnique({
    where: { id: Number(id) },
  });

  app.get('/applications/:id', async (req, res) => {
  const { id } = req.params;

  const application = await prisma.application.findUnique({
    where: { id: Number(id) },
  });

  if (!application) {
    return res.status(404).json({ error: 'Solicitud no encontrada' });
  }

  res.json(application);
});

  if (!existing) {
    return res.status(404).json({ error: 'Solicitud no encontrada' });
  }

  await new Promise((resolve) => setTimeout(resolve, 1500));

  const documentValid = Math.random() > 0.15;
  const nameMatch = documentValid ? Math.random() > 0.1 : false;

  const razonesPositivas: string[] = [];
  const razonesNegativas: string[] = [];

  const datosCompletos = Boolean(
    existing.phone && existing.email && existing.city &&
    nombres && apellidos && numeroDocumento && fechaNacimiento
  );

  let score = 0;

  if (datosCompletos) {
    score += 20;
    razonesPositivas.push('Información completa');
  } else {
    razonesNegativas.push('Faltan datos por completar');
  }

  if (nombres && apellidos && numeroDocumento) {
    score += 20;
    razonesPositivas.push('Documento leído correctamente');
  }

  if (documentValid) {
    score += 30;
    razonesPositivas.push('Documento validado');
  } else {
    razonesNegativas.push('No pudimos validar el documento');
  }

  score += 15;
  razonesPositivas.push('Información confirmada');

  const hasAlerts = !nameMatch && documentValid;
  if (!hasAlerts && documentValid) {
    score += 15;
    razonesPositivas.push('Sin alertas');
  } else if (hasAlerts) {
    razonesNegativas.push('El nombre no coincide completamente con el documento');
  }

  let veredicto: string;
  if (!documentValid) {
    veredicto = 'not_validated';
    score = Math.min(score, 40);
  } else if (hasAlerts || score < 85) {
    veredicto = 'requires_review';
  } else {
    veredicto = 'validated';
  }

  const razones = [...razonesPositivas, ...razonesNegativas].join('|');

  const application = await prisma.application.update({
    where: { id: Number(id) },
    data: {
      nombres,
      apellidos,
      numeroDocumento,
      fechaNacimiento,
      score,
      veredicto,
      razones,
      status: 'validated',
    },
  });

  res.json(application);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});