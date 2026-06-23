const { PrismaClient } = require('@prisma/client');
const { mockProperties } = require('../../src/data/mockProperties');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding properties...');
  for (const p of mockProperties) {
    await prisma.property.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        title: p.title,
        description: p.description,
        priceUsd: Number(p.priceUsd),
        status: p.status,
        statusText: p.statusText,
        type: p.type,
        typeText: p.typeText,
        location: p.location,
        district: p.district,
        city: p.city,
        beds: p.beds,
        baths: Number(p.baths),
        area: p.area,
        parking: p.parking,
        yearBuilt: p.yearBuilt,
        isFeatured: Boolean(p.isFeatured),
        isExclusive: Boolean(p.isExclusive),
        isNew: Boolean(p.isNew),
        agentName: p.agent?.name || null,
        agentPhone: p.agent?.phone || null,
        agentEmail: p.agent?.email || null,
        agentImage: p.agent?.image || null,
        images: {
          create: (p.images || []).map((url) => ({ url }))
        },
        amenities: {
          create: (p.amenities || []).map((name) => ({ name }))
        }
      }
    });
  }
  // Ensure an admin user exists (upsert with scrypt hash)
  const adminEmail = 'admin@local.test';
  const adminPass = 'admin123';
  const crypto = require('crypto');
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await new Promise((resolve, reject) => {
    crypto.scrypt(adminPass, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString('hex'));
    });
  });
  const hash = `${salt}:${derivedKey}`;
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: 'Admin', passwordHash: hash, role: 'admin' },
    create: { name: 'Admin', email: adminEmail, passwordHash: hash, role: 'admin' }
  });
  console.log('Upserted admin user:', adminEmail, adminPass);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
