import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://asianfarmcenter.com';

    // Fetch products and categories for dynamic sitemap
    // For now, we will add static pages and fetch dynamic if possible, 
    // but to avoid build errors if backend is down, we might wrap in try/catch or just list static for now.
    // The user wants "First results", so dynamic sitemap is important.

    let products = [];
    let categories = [];

    try {
        // We use the internal API URL if available (during build) or public
        const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

        // Fetch products
        const productsRes = await fetch(`${apiUrl}/products?limit=1000`);
        if (productsRes.ok) {
            const productData = await productsRes.json();
            products = productData.products || [];
        }

        // Fetch categories
        const categoriesRes = await fetch(`${apiUrl}/categories`);
        if (categoriesRes.ok) {
            categories = await categoriesRes.json();
        }

    } catch (error) {
        console.warn('Failed to fetch dynamic data for sitemap', error);
    }

    const staticRoutes = [
        '',
        '/about',
        '/products',
        '/categories',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    const productRoutes = products.map((product: any) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: new Date(product.updatedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    const categoryRoutes = categories.map((category: any) => ({
        url: `${baseUrl}/products?categorySlug=${category.slug}`,
        lastModified: new Date(), // Categories don't have updateAt usually exposed but we can default
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
