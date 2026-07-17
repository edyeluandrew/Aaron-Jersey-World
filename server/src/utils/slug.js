export function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function generateUniqueSlug(prisma, model, baseText, excludeId = null) {
  const baseSlug = slugify(baseText);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const where = excludeId ? { slug, NOT: { id: excludeId } } : { slug };
    const existing = await prisma[model].findFirst({ where });

    if (!existing) return slug;

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}
