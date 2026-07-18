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

const products = [
  {
    name: '[Sample] Premier Club Home Jersey 2026',
    slug: 'sample-premier-club-home-jersey-2026',
    categorySlug: 'jerseys',
    shortDescription: 'Sample development product — not confirmed current stock.',
    description:
      'This is sample catalogue data for development purposes. A replica-style home jersey suitable for local clubs and tournaments. Custom names, numbers and sponsor logos available on request.',
    sku: 'SAMPLE-JER-001',
    priceType: 'STARTING_FROM',
    price: 85000,
    isPriceVisible: true,
    isFeatured: true,
    stockStatus: 'IN_STOCK',
    brandingAvailable: true,
    variants: [
      { size: 'S', colour: 'Red', version: 'Home' },
      { size: 'M', colour: 'Red', version: 'Home' },
      { size: 'L', colour: 'Red', version: 'Home' },
      { size: 'XL', colour: 'Red', version: 'Home' },
    ],
  },
  {
    name: '[Sample] Classic Vintage Football Shirt',
    slug: 'sample-classic-vintage-football-shirt',
    categorySlug: 'jerseys',
    shortDescription: 'Sample vintage-style jersey for catalogue demonstration.',
    description:
      'Sample development listing. Retro-inspired football shirt for collectors and fan groups. Availability and exact designs confirmed on enquiry.',
    sku: 'SAMPLE-JER-002',
    priceType: 'REQUEST_PRICE',
    isFeatured: true,
    stockStatus: 'CONTACT_FOR_AVAILABILITY',
    brandingAvailable: false,
    variants: [{ size: 'M', colour: 'Blue/White', version: 'Retro' }],
  },
  {
    name: '[Sample] Full Custom Team Kit Package',
    slug: 'sample-full-custom-team-kit-package',
    categorySlug: 'custom-kits',
    shortDescription: 'Jersey, shorts and socks — sample bulk kit listing.',
    description:
      'Sample institutional package listing. Includes home and away options, name/number printing and team crest branding. Minimum quantities apply.',
    sku: 'SAMPLE-KIT-001',
    priceType: 'REQUEST_PRICE',
    isFeatured: true,
    stockStatus: 'MADE_TO_ORDER',
    brandingAvailable: true,
    minimumOrderQuantity: 15,
    variants: [
      { size: 'Youth', colour: 'Custom', version: 'Full Kit' },
      { size: 'Adult', colour: 'Custom', version: 'Full Kit' },
    ],
  },
  {
    name: '[Sample] Pro Strike Football Boots',
    slug: 'sample-pro-strike-football-boots',
    categorySlug: 'training-equipment',
    shortDescription: 'Sample boots listing for development catalogue.',
    description: 'Sample product data. Firm-ground football boots available in multiple sizes. Price confirmed on request.',
    sku: 'SAMPLE-BOT-001',
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
    name: '[Sample] Match Goalkeeper Gloves',
    slug: 'sample-match-goalkeeper-gloves',
    categorySlug: 'training-equipment',
    shortDescription: 'Sample goalkeeper gloves — development data only.',
    description: 'Sample listing for padded match gloves with wrist strap. Sizes subject to availability.',
    sku: 'SAMPLE-GLV-001',
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
    name: '[Sample] FIFA Quality Match Football',
    slug: 'sample-fifa-quality-match-football',
    categorySlug: 'training-equipment',
    shortDescription: 'Sample match ball for catalogue display.',
    description: 'Sample development product. Size 5 match football suitable for leagues and school competitions.',
    sku: 'SAMPLE-BAL-001',
    priceType: 'FIXED',
    price: 65000,
    isPriceVisible: true,
    isFeatured: true,
    stockStatus: 'IN_STOCK',
    variants: [{ size: '5', colour: 'White/Black' }],
  },
  {
    name: '[Sample] Training Football Size 4',
    slug: 'sample-training-football-size-4',
    categorySlug: 'training-equipment',
    shortDescription: 'Sample training ball listing.',
    description: 'Sample catalogue entry for youth and academy training sessions.',
    sku: 'SAMPLE-BAL-002',
    priceType: 'STARTING_FROM',
    price: 35000,
    isPriceVisible: true,
    stockStatus: 'IN_STOCK',
    variants: [{ size: '4', colour: 'Orange' }],
  },
  {
    name: '[Sample] Gold Tournament Trophy',
    slug: 'sample-gold-tournament-trophy',
    categorySlug: 'trophies-and-medals',
    shortDescription: 'Sample trophy for events and tournaments.',
    description:
      'Sample awards catalogue data. Custom engraving and bulk tournament packages available. Gold accent premium finish.',
    sku: 'SAMPLE-TRP-001',
    priceType: 'STARTING_FROM',
    price: 95000,
    isPriceVisible: true,
    isFeatured: true,
    stockStatus: 'IN_STOCK',
    brandingAvailable: true,
    variants: [{ size: 'Medium', colour: 'Gold', version: 'Cup' }],
  },
  {
    name: '[Sample] Event Medal Set (Gold/Silver/Bronze)',
    slug: 'sample-event-medal-set',
    categorySlug: 'trophies-and-medals',
    shortDescription: 'Sample medal set for schools and tournaments.',
    description: 'Sample listing. Medal sets with ribbons for sports days and competitions. Custom event branding available.',
    sku: 'SAMPLE-MED-001',
    priceType: 'REQUEST_PRICE',
    stockStatus: 'MADE_TO_ORDER',
    brandingAvailable: true,
    minimumOrderQuantity: 20,
    variants: [{ size: 'Standard', colour: 'Mixed', version: 'Set of 3' }],
  },
  {
    name: '[Sample] Training Cone Set (50 pcs)',
    slug: 'sample-training-cone-set',
    categorySlug: 'training-equipment',
    shortDescription: 'Sample training cones bundle.',
    description: 'Sample development listing for coaching and academy sessions.',
    sku: 'SAMPLE-TRN-001',
    priceType: 'FIXED',
    price: 55000,
    isPriceVisible: true,
    stockStatus: 'IN_STOCK',
    variants: [{ size: 'Standard', colour: 'Orange' }],
  },
  {
    name: '[Sample] Mesh Training Bibs (10 pack)',
    slug: 'sample-mesh-training-bibs',
    categorySlug: 'training-equipment',
    shortDescription: 'Sample bibs pack for training sessions.',
    description: 'Sample catalogue data. Colour-coded bibs for drills and scrimmages.',
    sku: 'SAMPLE-TRN-002',
    priceType: 'FIXED',
    price: 40000,
    isPriceVisible: true,
    stockStatus: 'IN_STOCK',
    variants: [{ size: 'Adult', colour: 'Multi' }],
  },
  {
    name: '[Sample] Branded Team T-Shirt',
    slug: 'sample-branded-team-t-shirt',
    categorySlug: 'jerseys',
    shortDescription: 'Sample custom T-shirt for teams and events.',
    description:
      'Sample listing. Corporate, school, birthday and association branding available. Upload your logo when requesting a quote.',
    sku: 'SAMPLE-TSH-001',
    priceType: 'REQUEST_PRICE',
    isFeatured: true,
    stockStatus: 'MADE_TO_ORDER',
    brandingAvailable: true,
    minimumOrderQuantity: 10,
    variants: [
      { size: 'S', colour: 'White' },
      { size: 'M', colour: 'White' },
      { size: 'L', colour: 'Black' },
    ],
  },
  {
    name: '[Sample] School Sports Day Medal Pack',
    slug: 'sample-school-sports-day-medal-pack',
    categorySlug: 'trophies-and-medals',
    shortDescription: 'Sample bulk medals for school events.',
    description: 'Sample institutional listing for inter-house and sports day competitions.',
    sku: 'SAMPLE-MED-002',
    priceType: 'REQUEST_PRICE',
    stockStatus: 'MADE_TO_ORDER',
    brandingAvailable: true,
    minimumOrderQuantity: 50,
    variants: [{ size: 'Standard', colour: 'Gold/Silver/Bronze' }],
  },
  {
    name: '[Sample] Heavy Duty Goal Net',
    slug: 'sample-heavy-duty-goal-net',
    categorySlug: 'training-equipment',
    shortDescription: 'Sample goal net for full-size posts.',
    description: 'Sample development product. Suitable for schools, clubs and community pitches.',
    sku: 'SAMPLE-NET-001',
    priceType: 'STARTING_FROM',
    price: 180000,
    isPriceVisible: true,
    stockStatus: 'CONTACT_FOR_AVAILABILITY',
    variants: [{ size: 'Full Size', colour: 'White' }],
  },
  {
    name: '[Sample] Club Tracksuit Set',
    slug: 'sample-club-tracksuit-set',
    categorySlug: 'custom-kits',
    shortDescription: 'Sample tracksuit for teams and academies.',
    description: 'Sample listing with custom crest and sponsor placement options.',
    sku: 'SAMPLE-TRK-001',
    priceType: 'REQUEST_PRICE',
    stockStatus: 'MADE_TO_ORDER',
    brandingAvailable: true,
    variants: [
      { size: 'M', colour: 'Navy' },
      { size: 'L', colour: 'Navy' },
      { size: 'XL', colour: 'Navy' },
    ],
  },
  {
    name: '[Sample] Branded Sports Cap',
    slug: 'sample-branded-sports-cap',
    categorySlug: 'training-equipment',
    shortDescription: 'Sample embroidered cap listing.',
    description: 'Sample accessory for teams, fan groups and corporate events.',
    sku: 'SAMPLE-CAP-001',
    priceType: 'STARTING_FROM',
    price: 25000,
    isPriceVisible: true,
    stockStatus: 'IN_STOCK',
    brandingAvailable: true,
    variants: [{ size: 'One Size', colour: 'Black' }],
  },
  {
    name: '[Sample] Match Whistle and Card Set',
    slug: 'sample-match-whistle-card-set',
    categorySlug: 'training-equipment',
    shortDescription: 'Sample referee accessory bundle.',
    description: 'Sample catalogue entry for match officials and tournament organisers.',
    sku: 'SAMPLE-ACC-001',
    priceType: 'FIXED',
    price: 18000,
    isPriceVisible: true,
    stockStatus: 'IN_STOCK',
    variants: [{ size: 'Standard', colour: 'Black' }],
  },
  {
    name: '[Sample] Pool Table 7ft',
    slug: 'sample-pool-table-7ft',
    categorySlug: 'trophies-and-medals',
    shortDescription: 'Sample recreational pool table listing.',
    description:
      'Sample development listing for institutions and recreation spaces. Delivery and setup quoted separately.',
    sku: 'SAMPLE-POOL-001',
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
          altText: `${product.name} — sample development image`,
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

  console.log(`[Seed] ${products.length} sample products upserted`);
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
