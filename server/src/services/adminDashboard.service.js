import { prisma } from '../config/database.js';
import { HOMEPAGE_MARQUEE_IMAGE_LIMIT, MAIN_CATEGORY_SLUGS } from '../constants/catalogue.js';

function buildRequestNotifications(stats) {
  const notifications = [];

  if (stats.newInquiries > 0) {
    notifications.push({
      id: 'new-inquiries',
      type: 'warning',
      title: 'New inquiries',
      message: `${stats.newInquiries} new customer inquir${stats.newInquiries === 1 ? 'y needs' : 'ies need'} a response.`,
      href: '/admin/inquiries',
    });
  }

  if (stats.pendingQuotes > 0) {
    notifications.push({
      id: 'pending-quotes',
      type: 'warning',
      title: 'Pending quote requests',
      message: `${stats.pendingQuotes} quote request${stats.pendingQuotes === 1 ? '' : 's'} still need follow-up.`,
      href: '/admin/quotes',
    });
  }

  if (stats.brandingRequests > 0) {
    notifications.push({
      id: 'branding-requests',
      type: 'info',
      title: 'Branding requests',
      message: `${stats.brandingRequests} branding request${stats.brandingRequests === 1 ? '' : 's'} waiting for review.`,
      href: '/admin/branding',
    });
  }

  if (stats.institutionalRequests > 0) {
    notifications.push({
      id: 'institutional-requests',
      type: 'info',
      title: 'Institutional requests',
      message: `${stats.institutionalRequests} institutional request${stats.institutionalRequests === 1 ? '' : 's'} waiting for review.`,
      href: '/admin/institutional',
    });
  }

  return notifications;
}

async function buildHomepageNotifications() {
  const products = await prisma.product.findMany({
    where: { slug: { in: MAIN_CATEGORY_SLUGS } },
    select: {
      id: true,
      name: true,
      slug: true,
      images: {
        select: { showInHomeMarquee: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  const notifications = [];

  for (const product of products) {
    const totalImages = product.images.length;
    const marqueeCount = product.images.filter((image) => image.showInHomeMarquee).length;
    const href = `/admin/products/${product.id}/edit`;

    if (totalImages === 0) {
      notifications.push({
        id: `marquee-no-photos-${product.slug}`,
        type: 'warning',
        title: `${product.name} needs photos`,
        message: 'Add product photos and pick up to 7 for the homepage marquee.',
        href,
      });
      continue;
    }

    if (marqueeCount < HOMEPAGE_MARQUEE_IMAGE_LIMIT) {
      notifications.push({
        id: `marquee-incomplete-${product.slug}`,
        type: 'info',
        title: `${product.name} homepage marquee`,
        message:
          marqueeCount === 0
            ? `No marquee photos selected yet. Choose up to ${HOMEPAGE_MARQUEE_IMAGE_LIMIT} photos for the homepage.`
            : `${marqueeCount}/${HOMEPAGE_MARQUEE_IMAGE_LIMIT} marquee photos selected. Add ${HOMEPAGE_MARQUEE_IMAGE_LIMIT - marqueeCount} more for the best homepage look.`,
        href,
      });
    }
  }

  return notifications;
}

export async function getAdminDashboardData() {
  const [
    totalProducts,
    activeProducts,
    outOfStockProducts,
    newInquiries,
    pendingQuotes,
    brandingRequests,
    institutionalRequests,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { stockStatus: 'OUT_OF_STOCK' } }),
    prisma.inquiry.count({ where: { status: 'NEW' } }),
    prisma.quoteRequest.count({ where: { status: { in: ['NEW', 'IN_REVIEW', 'QUOTED'] } } }),
    prisma.brandingRequest.count({ where: { status: { in: ['NEW', 'IN_REVIEW'] } } }),
    prisma.institutionalRequest.count({ where: { status: { in: ['NEW', 'IN_REVIEW'] } } }),
  ]);

  const stats = {
    totalProducts,
    activeProducts,
    outOfStockProducts,
    newInquiries,
    pendingQuotes,
    brandingRequests,
    institutionalRequests,
  };

  const [requestNotifications, homepageNotifications] = await Promise.all([
    Promise.resolve(buildRequestNotifications(stats)),
    buildHomepageNotifications(),
  ]);

  const notifications = [...requestNotifications, ...homepageNotifications];

  return {
    ...stats,
    notifications,
    notificationCount: notifications.length,
  };
}
