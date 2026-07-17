import { prisma } from '../config/database.js';
import { REFERENCE_PREFIXES } from '../constants/index.js';

const PREFIX_MAP = {
  inquiry: REFERENCE_PREFIXES.INQUIRY,
  quote: REFERENCE_PREFIXES.QUOTE,
  branding: REFERENCE_PREFIXES.BRANDING,
  institutional: REFERENCE_PREFIXES.INSTITUTIONAL,
};

export async function generateReferenceNumber(type) {
  const prefix = PREFIX_MAP[type];
  if (!prefix) {
    throw new Error(`Unknown reference number type: ${type}`);
  }

  const year = new Date().getFullYear();

  const counter = await prisma.referenceCounter.upsert({
    where: { prefix_year: { prefix, year } },
    update: { counter: { increment: 1 } },
    create: { prefix, year, counter: 1 },
  });

  const padded = String(counter.counter).padStart(5, '0');
  return `${prefix}-${year}-${padded}`;
}
