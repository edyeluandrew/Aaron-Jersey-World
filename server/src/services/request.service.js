import { prisma } from '../config/database.js';
import { AppError } from '../utils/apiResponse.js';
import { buildPaginationMeta, getPagination } from '../utils/pagination.js';
import { generateReferenceNumber } from './referenceNumber.service.js';

function buildSearchFilter(search, fields) {
  if (!search) return {};

  return {
    OR: fields.map((field) => ({
      [field]: { contains: search, mode: 'insensitive' },
    })),
  };
}

async function listRecords(model, searchFields, query, include = { attachments: true }) {
  const { page, limit, skip } = getPagination(query);
  const where = {
    ...(query.status ? { status: query.status } : {}),
    ...buildSearchFilter(query.search, searchFields),
  };

  const [total, records] = await Promise.all([
    model.count({ where }),
    model.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ createdAt: 'desc' }],
      include,
    }),
  ]);

  return {
    records,
    meta: buildPaginationMeta({ page, limit, total }),
  };
}

async function getRecordById(model, id, include) {
  const record = await model.findUnique({ where: { id }, include });
  if (!record) throw new AppError('Request not found', 404);
  return record;
}

async function updateRecordStatus(model, id, status) {
  const existing = await model.findUnique({ where: { id } });
  if (!existing) throw new AppError('Request not found', 404);

  return model.update({
    where: { id },
    data: { status },
  });
}

async function createAttachments(attachments, parentKey, parentId) {
  if (!attachments?.length) return [];

  return Promise.all(
    attachments.map((attachment) =>
      prisma.requestAttachment.create({
        data: {
          [parentKey]: parentId,
          secureUrl: attachment.secureUrl,
          publicId: attachment.publicId,
          originalName: attachment.originalName,
          mimeType: attachment.mimeType,
          fileSize: attachment.fileSize,
        },
      }),
    ),
  );
}

async function resolveProductId(productId, productSlug) {
  if (productId) return productId;

  if (productSlug) {
    const product = await prisma.product.findFirst({
      where: { slug: productSlug, isActive: true },
      select: { id: true },
    });

    if (!product) {
      throw new AppError('Selected product was not found', 404);
    }

    return product.id;
  }

  return null;
}

async function resolveCategoryId(categoryId, categorySlug) {
  if (categoryId) return categoryId;

  if (categorySlug) {
    const category = await prisma.category.findFirst({
      where: { slug: categorySlug, isActive: true },
      select: { id: true },
    });

    if (!category) {
      throw new AppError('Selected category was not found', 404);
    }

    return category.id;
  }

  return null;
}

function serializeSubmission(record) {
  return {
    id: record.id,
    referenceNumber: record.referenceNumber,
    status: record.status,
    createdAt: record.createdAt,
  };
}

export async function createInquiry(payload) {
  const referenceNumber = await generateReferenceNumber('inquiry');
  const { attachments, ...data } = payload;

  const inquiry = await prisma.inquiry.create({
    data: {
      ...data,
      referenceNumber,
    },
  });

  await createAttachments(attachments, 'inquiryId', inquiry.id);
  return serializeSubmission(inquiry);
}

export async function createQuoteRequest(payload) {
  const referenceNumber = await generateReferenceNumber('quote');
  const { attachments, productId, productSlug, categoryId, categorySlug, ...data } = payload;

  const resolvedProductId = await resolveProductId(productId, productSlug);
  const resolvedCategoryId = await resolveCategoryId(categoryId, categorySlug);

  const quoteRequest = await prisma.quoteRequest.create({
    data: {
      ...data,
      referenceNumber,
      productId: resolvedProductId,
      categoryId: resolvedCategoryId,
    },
  });

  await createAttachments(attachments, 'quoteRequestId', quoteRequest.id);
  return serializeSubmission(quoteRequest);
}

export async function createBrandingRequest(payload) {
  const referenceNumber = await generateReferenceNumber('branding');
  const { attachments, ...data } = payload;

  const brandingRequest = await prisma.brandingRequest.create({
    data: {
      ...data,
      referenceNumber,
    },
  });

  await createAttachments(attachments, 'brandingRequestId', brandingRequest.id);
  return serializeSubmission(brandingRequest);
}

export async function createInstitutionalRequest(payload) {
  const referenceNumber = await generateReferenceNumber('institutional');
  const { attachments, ...data } = payload;

  const institutionalRequest = await prisma.institutionalRequest.create({
    data: {
      ...data,
      referenceNumber,
    },
  });

  await createAttachments(attachments, 'institutionalRequestId', institutionalRequest.id);
  return serializeSubmission(institutionalRequest);
}

const inquirySearchFields = ['referenceNumber', 'fullName', 'phone', 'email', 'subject', 'message'];
const quoteSearchFields = ['referenceNumber', 'customerName', 'organisationName', 'phone', 'email', 'location', 'notes'];
const brandingSearchFields = ['referenceNumber', 'customerName', 'organisationName', 'phone', 'email', 'serviceType', 'description'];
const institutionalSearchFields = [
  'referenceNumber',
  'contactPerson',
  'institutionName',
  'phone',
  'email',
  'location',
  'productsRequired',
  'additionalNotes',
];

export async function listInquiries(query) {
  const { records, meta } = await listRecords(prisma.inquiry, inquirySearchFields, query);
  return { inquiries: records, meta };
}

export async function getInquiryById(id) {
  return getRecordById(prisma.inquiry, id, { attachments: true });
}

export async function updateInquiryStatus(id, status) {
  return updateRecordStatus(prisma.inquiry, id, status);
}

export async function listQuoteRequests(query) {
  const { records, meta } = await listRecords(prisma.quoteRequest, quoteSearchFields, query, {
    attachments: true,
    product: { select: { id: true, name: true, slug: true } },
    category: { select: { id: true, name: true, slug: true } },
  });
  return { quotes: records, meta };
}

export async function getQuoteRequestById(id) {
  return getRecordById(prisma.quoteRequest, id, {
    attachments: true,
    product: { select: { id: true, name: true, slug: true } },
    category: { select: { id: true, name: true, slug: true } },
  });
}

export async function updateQuoteRequestStatus(id, status) {
  return updateRecordStatus(prisma.quoteRequest, id, status);
}

export async function listBrandingRequests(query) {
  const { records, meta } = await listRecords(prisma.brandingRequest, brandingSearchFields, query);
  return { brandingRequests: records, meta };
}

export async function getBrandingRequestById(id) {
  return getRecordById(prisma.brandingRequest, id, { attachments: true });
}

export async function updateBrandingRequestStatus(id, status) {
  return updateRecordStatus(prisma.brandingRequest, id, status);
}

export async function listInstitutionalRequests(query) {
  const { records, meta } = await listRecords(prisma.institutionalRequest, institutionalSearchFields, query);
  return { institutionalRequests: records, meta };
}

export async function getInstitutionalRequestById(id) {
  return getRecordById(prisma.institutionalRequest, id, { attachments: true });
}

export async function updateInstitutionalRequestStatus(id, status) {
  return updateRecordStatus(prisma.institutionalRequest, id, status);
}
