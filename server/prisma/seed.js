import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const SAMPLE_IMAGE =
  'https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fill/sample.jpg';

const categories = [
  {
    name: 'Jerseys',
    slug: 'jerseys',
    description: 'Club jerseys, vintage shirts, fan tops and team apparel.',
    sortOrder: 1,
  },
  {
    name: 'Training Equipment',
    slug: 'training-equipment',
    description: 'Balls, boots, cones, bibs, nets, gloves and all training gear.',
    sortOrder: 2,
  },
  {
    name: 'Custom Kits',
    slug: 'custom-kits',
    description: 'Fully custom team kits, tracksuits and branded apparel packages.',
    sortOrder: 3,
  },
  {
    name: 'Trophies and Medals',
    slug: 'trophies-and-medals',
    description: 'Trophies, medals and awards for schools, clubs and tournaments.',
    sortOrder: 4,
  },
];

const legacyCategories = [
  { name: 'Club Jerseys', slug: 'club-jerseys', sortOrder: 101 },
  { name: 'Vintage Jerseys', slug: 'vintage-jerseys', sortOrder: 102 },
  { name: 'Custom Team Kits', slug: 'custom-team-kits', sortOrder: 103 },
  { name: 'Football Boots', slug: 'football-boots', sortOrder: 104 },
  { name: 'Goalkeeper Gloves', slug: 'goalkeeper-gloves', sortOrder: 105 },
  { name: 'Balls', slug: 'balls', sortOrder: 106 },
  { name: 'Branded T-Shirts', slug: 'branded-t-shirts', sortOrder: 107 },
  { name: 'Goal Nets', slug: 'goal-nets', sortOrder: 108 },
  { name: 'Pool Tables', slug: 'pool-tables', sortOrder: 109 },
  { name: 'Sports Accessories', slug: 'sports-accessories', sortOrder: 110 },
];

const siteSettings = [
  { key: 'business_name', value: 'Aaron Jersey World', type: 'STRING', group: 'general', isPublic: true },
  { key: 'tagline', value: 'Your Life Partner', type: 'STRING', group: 'general', isPublic: true },
  {
    key: 'address',
    value: 'Kampala, Arua Park Plaza, Uganda',
    type: 'STRING',
    group: 'contact',
    isPublic: true,
  },
  {
    key: 'phone_primary',
    value: '+256 781 161690',
    type: 'STRING',
    group: 'contact',
    isPublic: true,
  },
  {
    key: 'phone_secondary',
    value: '+256 781 712276',
    type: 'STRING',
    group: 'contact',
    isPublic: true,
  },
  {
    key: 'phone_tertiary',
    value: '+256 792 773146',
    type: 'STRING',
    group: 'contact',
    isPublic: true,
  },
  {
    key: 'email',
    value: 'info@aaronjerseyworld.com',
    type: 'STRING',
    group: 'contact',
    isPublic: true,
  },
  {
    key: 'whatsapp_number',
    value: process.env.WHATSAPP_NUMBER || '256781161690',
    type: 'STRING',
    group: 'contact',
    isPublic: true,
  },
  {
    key: 'business_hours',
    value: 'Mon–Sat: 9:00 AM – 7:00 PM | Sun: 10:00 AM – 4:00 PM',
    type: 'STRING',
    group: 'contact',
    isPublic: true,
  },
  {
    key: 'google_maps_embed_url',
    value: process.env.GOOGLE_MAPS_EMBED_URL || '',
    type: 'STRING',
    group: 'contact',
    isPublic: true,
  },
  {
    key: 'social_facebook',
    value: '',
    type: 'STRING',
    group: 'social',
    isPublic: true,
  },
  {
    key: 'social_instagram',
    value: '',
    type: 'STRING',
    group: 'social',
    isPublic: true,
  },
  {
    key: 'social_twitter',
    value: '',
    type: 'STRING',
    group: 'social',
    isPublic: true,
  },
  {
    key: 'social_tiktok',
    value: '',
    type: 'STRING',
    group: 'social',
    isPublic: true,
  },
  {
    key: 'developer_credit',
    value: 'Designed and developed by [DEVELOPER OR COMPANY NAME]',
    type: 'STRING',
    group: 'general',
    isPublic: true,
  },
  {
    key: 'about_intro',
    value:
      'Aaron Jersey World supplies jerseys, sportswear, sports equipment, trophies, medals and professional branding for individuals, teams, schools and organisations in Kampala.',
    type: 'STRING',
    group: 'about',
    isPublic: true,
  },
];

const APPAREL_SIZES = ['M', 'L', 'XL'];

const CATALOGUE_PRODUCT_SLUGS = [
  'jerseys',
  'training-equipment',
  'custom-kits',
  'trophies-and-medals',
];

const products = [
  {
    name: 'Jerseys',
    slug: 'jerseys',
    categorySlug: 'jerseys',
    shortDescription: 'Club jerseys, vintage shirts, fan tops and team apparel.',
    description:
      'Browse our jersey range for clubs, schools, fan groups and teams. Custom names, numbers and sponsor branding available on request.',
    sku: 'AJW-CAT-JER',
    priceType: 'REQUEST_PRICE',
    isFeatured: false,
    stockStatus: 'CONTACT_FOR_AVAILABILITY',
    brandingAvailable: true,
    variants: APPAREL_SIZES.map((size) => ({ size, colour: 'Assorted' })),
  },
  {
    name: 'Training Equipment',
    slug: 'training-equipment',
    categorySlug: 'training-equipment',
    shortDescription: 'Balls, boots, cones, bibs, nets, gloves and all training gear.',
    description:
      'Training and match equipment for academies, schools and clubs. Request a quote for boots, balls, nets, bibs and accessories.',
    sku: 'AJW-CAT-TRN',
    priceType: 'REQUEST_PRICE',
    isFeatured: false,
    stockStatus: 'CONTACT_FOR_AVAILABILITY',
    variants: [{ size: 'Standard', colour: 'Assorted' }],
  },
  {
    name: 'Custom Kits',
    slug: 'custom-kits',
    categorySlug: 'custom-kits',
    shortDescription: 'Fully custom team kits, tracksuits and branded apparel packages.',
    description:
      'Full custom kit packages for teams and institutions — jerseys, shorts, socks, tracksuits and branded sets made to order.',
    sku: 'AJW-CAT-KIT',
    priceType: 'REQUEST_PRICE',
    isFeatured: false,
    stockStatus: 'MADE_TO_ORDER',
    brandingAvailable: true,
    minimumOrderQuantity: 10,
    variants: APPAREL_SIZES.map((size) => ({ size, colour: 'Custom' })),
  },
  {
    name: 'Trophies and Medals',
    slug: 'trophies-and-medals',
    categorySlug: 'trophies-and-medals',
    shortDescription: 'Trophies, medals and awards for schools, clubs and tournaments.',
    description:
      'Trophies, medals and presentation awards for sports days, leagues, tournaments and corporate events. Bulk orders welcome.',
    sku: 'AJW-CAT-TRP',
    priceType: 'REQUEST_PRICE',
    isFeatured: false,
    stockStatus: 'MADE_TO_ORDER',
    brandingAvailable: true,
    variants: [{ size: 'Standard', colour: 'Assorted' }],
  },
];

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_INITIAL_PASSWORD;

  if (!email || !password) {
    console.warn('[Seed] Skipping admin — set ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD in .env');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { fullName: 'Site Administrator', passwordHash, role: 'ADMIN', isActive: true },
    create: {
      fullName: 'Site Administrator',
      email,
      passwordHash,
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log(`[Seed] Admin user ready: ${email}`);
}

async function seedSiteSettings() {
  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }
  console.log(`[Seed] ${siteSettings.length} site settings upserted`);
}

async function seedCategories() {
  const categoryMap = {};

  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder,
        isActive: true,
        imageUrl: SAMPLE_IMAGE,
        imagePublicId: 'demo/sample',
      },
      create: {
        ...category,
        imageUrl: SAMPLE_IMAGE,
        imagePublicId: 'demo/sample',
        isActive: true,
      },
    });
    categoryMap[category.slug] = record.id;
  }

  for (const category of legacyCategories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { isActive: false },
      create: {
        ...category,
        description: 'Legacy category — use the main catalogue categories instead.',
        isActive: false,
        imageUrl: SAMPLE_IMAGE,
        imagePublicId: 'demo/sample',
      },
    });
  }

  console.log(`[Seed] ${categories.length} main categories upserted (${legacyCategories.length} legacy hidden)`);
  await migrateProductsToMainCategories(categoryMap);
  return categoryMap;
}

async function migrateProductsToMainCategories(categoryMap) {
  const remap = {
    'club-jerseys': 'jerseys',
    'vintage-jerseys': 'jerseys',
    'branded-t-shirts': 'jerseys',
    'football-boots': 'training-equipment',
    'goalkeeper-gloves': 'training-equipment',
    balls: 'training-equipment',
    'goal-nets': 'training-equipment',
    'sports-accessories': 'training-equipment',
    'custom-team-kits': 'custom-kits',
    'pool-tables': 'trophies-and-medals',
  };

  for (const [legacySlug, mainSlug] of Object.entries(remap)) {
    const targetCategoryId = categoryMap[mainSlug];
    if (!targetCategoryId) continue;

    const legacyCategory = await prisma.category.findUnique({ where: { slug: legacySlug } });
    if (!legacyCategory) continue;

    const result = await prisma.product.updateMany({
      where: { categoryId: legacyCategory.id },
      data: { categoryId: targetCategoryId },
    });

    if (result.count > 0) {
      console.log(`[Seed] Moved ${result.count} products from ${legacySlug} → ${mainSlug}`);
    }
  }
}

async function removeExtraCatalogueProducts() {
  const extras = await prisma.product.findMany({
    where: {
      OR: [
        { name: { startsWith: '[Sample]' } },
        { slug: { startsWith: 'sample-' } },
        { slug: { notIn: CATALOGUE_PRODUCT_SLUGS } },
      ],
    },
    select: { id: true, slug: true },
  });

  if (extras.length === 0) {
    console.log('[Seed] No extra catalogue products to remove');
    return;
  }

  await prisma.product.deleteMany({
    where: { id: { in: extras.map((product) => product.id) } },
  });

  console.log(`[Seed] Removed ${extras.length} extra catalogue products`);
}

async function seedProducts(categoryMap) {
  for (const product of products) {
    const { categorySlug, variants, ...productData } = product;
    const categoryId = categoryMap[categorySlug];

    if (!categoryId) {
      console.warn(`[Seed] Skipping product ${product.slug} — category not found`);
      continue;
    }

    const record = await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...productData, categoryId, isActive: true },
      create: { ...productData, categoryId, isActive: true },
    });

    const existingImages = await prisma.productImage.count({ where: { productId: record.id } });
    if (existingImages === 0) {
      await prisma.productImage.create({
        data: {
          productId: record.id,
          secureUrl: SAMPLE_IMAGE,
          publicId: 'demo/sample',
          altText: `${product.name} — Aaron Jersey World`,
          sortOrder: 0,
          isPrimary: true,
          width: 800,
          height: 800,
        },
      });
    }

    for (const variant of variants) {
      const existing = await prisma.productVariant.findFirst({
        where: {
          productId: record.id,
          size: variant.size,
          colour: variant.colour,
          version: variant.version ?? null,
        },
      });

      if (!existing) {
        await prisma.productVariant.create({
          data: {
            productId: record.id,
            ...variant,
          },
        });
      }
    }
  }

  console.log(`[Seed] ${products.length} catalogue products upserted`);
}

async function seedTestimonials() {
  const testimonials = [
    {
      customerName: 'Sample Customer A',
      organisation: 'Sample Football Club (Dev Data)',
      content:
        'This is sample testimonial content for development only. Replace with real approved testimonials from the admin dashboard.',
      rating: 5,
      isApproved: true,
      isFeatured: true,
    },
    {
      customerName: 'Sample Customer B',
      organisation: 'Sample School (Dev Data)',
      content:
        'Sample development testimonial. Aaron Jersey World supports schools and institutions with kits, medals and branding.',
      rating: 5,
      isApproved: true,
      isFeatured: false,
    },
  ];

  const count = await prisma.testimonial.count();
  if (count === 0) {
    await prisma.testimonial.createMany({ data: testimonials });
    console.log(`[Seed] ${testimonials.length} sample testimonials created`);
  } else {
    console.log('[Seed] Testimonials already exist — skipping');
  }
}

async function seedBanners() {
  const count = await prisma.banner.count();
  if (count > 0) {
    console.log('[Seed] Banners already exist — skipping');
    return;
  }

  await prisma.banner.create({
    data: {
      title: 'Sample Hero Banner',
      subtitle: 'Development placeholder — manage banners from admin dashboard',
      imageUrl: SAMPLE_IMAGE,
      imagePublicId: 'demo/sample',
      buttonText: 'Explore Products',
      buttonUrl: '/products',
      isActive: true,
      sortOrder: 0,
    },
  });

  console.log('[Seed] Sample banner created');
}

async function main() {
  console.log('[Seed] Starting Aaron Jersey World database seed...');

  await seedAdmin();
  await seedSiteSettings();
  const categoryMap = await seedCategories();
  await removeExtraCatalogueProducts();
  await seedProducts(categoryMap);
  await seedTestimonials();
  await seedBanners();

  console.log('[Seed] Completed successfully');
}

main()
  .catch((error) => {
    console.error('[Seed] Failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
