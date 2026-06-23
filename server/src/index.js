const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cors = require('cors');

dotenv.config({ path: __dirname + '/../.env' });

const app = express();
app.use(express.json());

// CORS - allow Vite dev server origins and local testing
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.options('*', cors());

const prisma = new PrismaClient();

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Auth endpoints
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'User exists' });
    // hash password using scrypt
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = await new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey.toString('hex'));
      });
    });
    const hash = `${salt}:${derivedKey}`;
    const user = await prisma.user.create({ data: { name, email, passwordHash: hash } });
    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET);
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.passwordHash || !user.passwordHash.includes(':')) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const [salt, key] = user.passwordHash.split(':');
    const derivedKey = await new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey.toString('hex'));
      });
    });
    const ok = crypto.timingSafeEqual(Buffer.from(key, 'hex'), Buffer.from(derivedKey, 'hex'));
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Helper to protect routes
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing authorization' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid authorization' });
  try {
    const payload = jwt.verify(parts[1], process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/properties', async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '20', 10);
  const skip = (page - 1) * limit;

  const props = await prisma.property.findMany({
    skip,
    take: limit,
    include: { images: true, amenities: true }
  });

  res.json(props.map(p => ({
    ...p,
    images: p.images.map(i => i.url),
    amenities: p.amenities.map(a => a.name)
  })));
});

app.get('/properties/:id', async (req, res) => {
  const id = req.params.id;
  const prop = await prisma.property.findUnique({ where: { id }, include: { images: true, amenities: true } });
  if (!prop) return res.status(404).json({ error: 'Not found' });
  res.json({
    ...prop,
    images: prop.images.map(i => i.url),
    amenities: prop.amenities.map(a => a.name)
  });
});

app.post('/properties', requireAuth, async (req, res) => {
  const data = req.body;
  try {
    const created = await prisma.property.create({
      data: {
        title: data.title,
        description: data.description,
        priceUsd: Number(data.priceUsd) || 0,
        status: data.status || 'sale',
        statusText: data.statusText || '',
        type: data.type || 'house',
        typeText: data.typeText || '',
        location: data.location || '',
        district: data.district || '',
        city: data.city || '',
        beds: Number(data.beds) || 0,
        baths: Number(data.baths) || 0,
        area: Number(data.area) || 0,
        parking: Number(data.parking) || 0,
        yearBuilt: Number(data.yearBuilt) || 0,
        isFeatured: Boolean(data.isFeatured),
        isExclusive: Boolean(data.isExclusive),
        isNew: Boolean(data.isNew),
        agentName: data.agentName || null,
        agentPhone: data.agentPhone || null,
        agentEmail: data.agentEmail || null,
        agentImage: data.agentImage || null,
        images: data.images ? { create: data.images.map(url => ({ url })) } : undefined,
        amenities: data.amenities ? { create: data.amenities.map(name => ({ name })) } : undefined
      }
    });

    const prop = await prisma.property.findUnique({ where: { id: created.id }, include: { images: true, amenities: true } });
    res.status(201).json({
      ...prop,
      images: prop.images.map(i => i.url),
      amenities: prop.amenities.map(a => a.name)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

app.put('/properties/:id', requireAuth, async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    // Update scalar fields
    const updated = await prisma.property.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        priceUsd: Number(data.priceUsd) || 0,
        status: data.status,
        statusText: data.statusText,
        type: data.type,
        typeText: data.typeText,
        location: data.location,
        district: data.district,
        city: data.city,
        beds: Number(data.beds) || 0,
        baths: Number(data.baths) || 0,
        area: Number(data.area) || 0,
        parking: Number(data.parking) || 0,
        yearBuilt: Number(data.yearBuilt) || 0,
        isFeatured: Boolean(data.isFeatured),
        isExclusive: Boolean(data.isExclusive),
        isNew: Boolean(data.isNew),
        agentName: data.agentName || null,
        agentPhone: data.agentPhone || null,
        agentEmail: data.agentEmail || null,
        agentImage: data.agentImage || null
      }
    });

    // Replace images and amenities if provided
    if (Array.isArray(data.images)) {
      await prisma.image.deleteMany({ where: { propertyId: id } });
      await prisma.image.createMany({ data: data.images.map(url => ({ url, propertyId: id })) });
    }
    if (Array.isArray(data.amenities)) {
      await prisma.amenity.deleteMany({ where: { propertyId: id } });
      await prisma.amenity.createMany({ data: data.amenities.map(name => ({ name, propertyId: id })) });
    }

    const prop = await prisma.property.findUnique({ where: { id }, include: { images: true, amenities: true } });
    res.json({
      ...prop,
      images: prop.images.map(i => i.url),
      amenities: prop.amenities.map(a => a.name)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

app.delete('/properties/:id', requireAuth, async (req, res) => {
  const id = req.params.id;
  try {
    await prisma.image.deleteMany({ where: { propertyId: id } });
    await prisma.amenity.deleteMany({ where: { propertyId: id } });
    await prisma.property.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
