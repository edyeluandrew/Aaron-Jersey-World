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

const products = [
  {
    name: 'Premier Club Home Jersey 2026',
    slug: 'premier-club-home-jersey-2026',
    categorySlug: 'jerseys',
    shortDescription: 'Replica-style home jersey for clubs and tournaments.',
    description:
      'Quality home jersey suitable for local clubs, schools and tournaments. Custom names, numbers and sponsor logos available on request.',
    sku: 'AJW-JER-001',
    priceType: 'STARTING_FROM',
    price: 85000,
    isPriceVisible: true,
    isFeatured: true,
    stockStatus: 'IN_STOCK',
    brandingAvailable: true,
    variants: APPAREL_SIZES.map((size) => ({ size, colour: 'Red', version: 'Home' })),
  },
  {
    name: 'Classic Vintage Football Shirt',
    slug: 'classic-vintage-football-shirt',
    categorySlug: 'jerseys',
    shortDescription: 'Retro-inspired football shirt for collectors and fan groups.',
    description:
      'Classic vintage-style football shirt. Exact designs and availability confirmed on enquiry. Ideal for fan clubs and commemorative events.',
    sku: 'AJW-JER-002',
    priceType: 'REQUEST_PRICE',
    isFeatured: true,
    stockStatus: 'CONTACT_FOR_AVAILABILITY',
    brandingAvailable: false,
    variants: APPAREL_SIZES.map((size) => ({ size, colour: 'Blue/White', version: 'Retro' })),
  },
  {
    name: 'Branded Team T-Shirt',
    slug: 'branded-team-t-shirt',
    categorySlug: 'jerseys',
    shortDescription: 'Custom T-shirts for teams, schools and corporate events.',
    description:
      'Branded team T-shirts for corporate, school, birthday and association events. Upload your logo when requesting a quote.',
    sku: 'AJW-JER-003',
    priceType: 'REQUEST_PRICE',
    isFeatured: true,
    stockStatus: 'MADE_TO_ORDER',
    brandingAvailable: true,
    minimumOrderQuantity: 10,
    variants: APPAREL_SIZES.map((size) => ({ size, colour: 'White' })),
  },
  {
    name: 'Full Custom Team Kit Package',
    slug: 'full-custom-team-kit-package',
    categorySlug: 'custom-kits',
    shortDescription: 'Jersey, shorts and socks — full team kit package.',
    description:
      'Complete custom team kit including home and away options, name/number printing and team crest branding. Minimum quantities apply.',
    sku: 'AJW-KIT-001',
    priceType: 'REQUEST_PRICE',
    isFeatured: true,
    stockStatus: 'MADE_TO_ORDER',
    brandingAvailable: true,
    minimumOrderQuantity: 15,
    variants: [
      ...APPAREL_SIZES.map((size) => ({ size, colour: 'Custom', version: 'Full Kit' })),
      { size: 'Youth', colour: 'Custom', version: 'Full Kit' },
    ],
  },
  {
    name: 'Club Tracksuit Set',
    slug: 'club-tracksuit-set',
    categorySlug: 'custom-kits',
    shortDescription: 'Custom tracksuit for teams and academies.',
    description: 'Club tracksuit set with custom crest and sponsor placement options. Made to order for teams and institutions.',
    sku: 'AJW-KIT-002',
    priceType: 'REQUEST_PRICE',
    stockStatus: 'MADE_TO_ORDER',
    brandingAvailable: true,
    variants: APPAREL_SIZES.map((size) => ({ size, colour: 'Navy' })),
  },
  {
    name: 'Pro Strike Football Boots',
    slug: 'pro-strike-football-boots',
    categorySlug: 'training-equipment',
    shortDescription: 'Firm-ground football boots in multiple sizes.',
    description: 'Pro Strike firm-ground football boots for match and training use. Available in sizes 40–44.',
    sku: 'AJW-TRN-001',
    priceType: 'STARTING_FROM',
    price: 120000,
    isPriceVisible: true,
    stockStatus: 'IN_STOCK',
    variants: [
      { size: '40', colour: 'Black/White' },
      { size: '42', colour: 'Black/White' },
      { size: '44', colour: 'Black/White' },
    ],
  },
  {
    name: 'Match Goalkeeper Gloves',
    slug: 'match-goalkeeper-gloves',
    categorySlug: 'training-equipment',
    shortDescription: 'Padded match gloves with wrist strap.',
    description: 'Match-quality goalkeeper gloves with padded palms and secure wrist strap. Sizes 8–10.',
    sku: 'AJW-TRN-002',
    priceType: 'FIXED',
    price: 45000,
    isPriceVisible: true,
    stockStatus: 'LOW_STOCK',
    variants: [
      { size: '8', colour: 'Green' },
      { size: '9', colour: 'Green' },
      { size: '10', colour: 'Green' },
    ],
  },
  {
    name: 'FIFA Quality Match Football',
    slug: 'fifa-quality-match-football',
    categorySlug: 'training-equipment',
    shortDescription: 'Size 5 match football for leagues and schools.',
    description: 'FIFA quality size 5 match football suitable for leagues, schools and tournament play.',
    sku: 'AJW-TRN-003',
    priceType: 'FIXED',
    price: 65000,
    isPriceVisible: true,
    isFeatured: true,
    stockStatus: 'IN_STOCK',
    variants: [{ size: '5', colour: 'White/Black' }],
  },
  {
    name: 'Training Football Size 4',
    slug: 'training-football-size-4',
    categorySlug: 'training-equipment',
    shortDescription: 'Youth training ball for academies and schools.',
    description: 'Size 4 training football ideal for youth academies, schools and development sessions.',
    sku: 'AJW-TRN-004',
    priceType: 'STARTING_FROM',
    price: 35000,
    isPriceVisible: true,
    stockStatus: 'IN_STOCK',
    variants: [{ size: '4', colour: 'Orange' }],
  },
  {
    name: 'Training Cone Set (50 pcs)',
    slug: 'training-cone-set-50',
    categorySlug: 'training-equipment',
    shortDescription: '50-piece cone set for coaching sessions.',
    description: 'Durable training cone set for drills, academies and coaching sessions.',
    sku: 'AJW-TRN-005',
    priceType: 'FIXED',
    price: 55000,
    isPriceVisible: true,
    stockStatus: 'IN_STOCK',
    variants: [{ size: 'Standard', colour: 'Orange' }],
  },
  {
    name: 'Mesh Training Bibs (10 pack)',
    slug: 'mesh-training-bibs-10-pack',
    categorySlug: 'training-equipment',
    shortDescription: 'Colour-coded bibs for training and scrimmages.',
    description: 'Mesh training bibs pack for drills, scrimmages and team sessions.',
    sku: 'AJW-TRN-006',
    priceType: 'FIXED',
    price: 40000,
    isPriceVisible: true,
    stockStatus: 'IN_STOCK',
    variants: [{ size: 'Adult', colour: 'Multi' }],
  },
  {
    name: 'Heavy Duty Goal Net',
    slug: 'heavy-duty-goal-net',
    categorySlug: 'training-equipment',
    shortDescription: 'Full-size goal net for clubs and schools.',
    description: 'Heavy duty full-size goal net suitable for schools, clubs and community pitches.',
    sku: 'AJW-TRN-007',
    priceType: 'STARTING_FROM',
    price: 180000,
    isPriceVisible: true,
    stockStatus: 'CONTACT_FOR_AVAILABILITY',
    variants: [{ size: 'Full Size', colour: 'White' }],
  },
  {
    name: 'Branded Sports Cap',
    slug: 'branded-sports-cap',
    categorySlug: 'training-equipment',
    shortDescription: 'Embroidered cap for teams and events.',
    description: 'Branded sports cap with embroidery for teams, fan groups and corporate events.',
    sku: 'AJW-TRN-008',
    priceType: 'STARTING_FROM',
    price: 25000,
    isPriceVisible: true,
    stockStatus: 'IN_STOCK',
    brandingAvailable: true,
    variants: [{ size: 'One Size', colour: 'Black' }],
  },
  {
    name: 'Match Whistle and Card Set',
    slug: 'match-whistle-card-set',
    categorySlug: 'training-equipment',
    shortDescription: 'Referee accessory bundle for match officials.',
    description: 'Match whistle and card set for referees and tournament organisers.',
    sku: 'AJW-TRN-009',
    priceType: 'FIXED',
    price: 18000,
    isPriceVisible: true,
    stockStatus: 'IN_STOCK',
    variants: [{ size: 'Standard', colour: 'Black' }],
  },
  {
    name: 'Gold Tournament Trophy',
    slug: 'gold-tournament-trophy',
    categorySlug: 'trophies-and-medals',
    shortDescription: 'Premium trophy for events and tournaments.',
    description:
      'Gold-accent tournament trophy with custom engraving available. Bulk tournament packages on request.',
    sku: 'AJW-TRP-001',
    priceType: 'STARTING_FROM',
    price: 95000,
    isPriceVisible: true,
    isFeatured: true,
    stockStatus: 'IN_STOCK',
    brandingAvailable: true,
    variants: [{ size: 'Medium', colour: 'Gold', version: 'Cup' }],
  },
  {
    name: 'Event Medal Set (Gold/Silver/Bronze)',
    slug: 'event-medal-set',
    categorySlug: 'trophies-and-medals',
    shortDescription: 'Medal set with ribbons for competitions.',
    description: 'Gold, silver and bronze medal set with ribbons for sports days and tournaments. Custom event branding available.',
    sku: 'AJW-MED-001',
    priceType: 'REQUEST_PRICE',
    stockStatus: 'MADE_TO_ORDER',
    brandingAvailable: true,
    minimumOrderQuantity: 20,
    variants: [{ size: 'Standard', colour: 'Mixed', version: 'Set of 3' }],
  },
  {
    name: 'School Sports Day Medal Pack',
    slug: 'school-sports-day-medal-pack',
    categorySlug: 'trophies-and-medals',
    shortDescription: 'Bulk medals for school sports days.',
    description: 'Bulk medal pack for inter-house competitions and school sports days. Custom school branding available.',
    sku: 'AJW-MED-002',
    priceType: 'REQUEST_PRICE',
    stockStatus: 'MADE_TO_ORDER',
    brandingAvailable: true,
    minimumOrderQuantity: 50,
    variants: [{ size: 'Standard', colour: 'Gold/Silver/Bronze' }],
  },
  {
    name: 'Pool Table 7ft',
    slug: 'pool-table-7ft',
    categorySlug: 'trophies-and-medals',
    shortDescription: '7ft pool table for institutions and recreation spaces.',
    description:
      'Professional 7ft pool table for institutions, clubs and recreation spaces. Delivery and setup quoted separately.',
    sku: 'AJW-REC-001',
    priceType: 'REQUEST_PRICE',
    stockStatus: 'CONTACT_FOR_AVAILABILITY',
    variants: [{ size: '7ft', colour: 'Green' }],
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

async function removeSampleProducts() {
  const sampleProducts = await prisma.product.findMany({
    where: {
      OR: [{ name: { startsWith: '[Sample]' } }, { slug: { startsWith: 'sample-' } }],
    },
    select: { id: true, name: true },
  });

  if (sampleProducts.length === 0) {
    console.log('[Seed] No sample products to remove');
    return;
  }

  await prisma.product.deleteMany({
    where: { id: { in: sampleProducts.map((product) => product.id) } },
  });

  console.log(`[Seed] Removed ${sampleProducts.length} sample products`);
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
  await removeSampleProducts();
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
