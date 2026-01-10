import qs from 'qs';
import { STRAPI_URL } from './constants';
import { StrapiResponse, Article, Category } from '@/types';

export function getStrapiURL(path = '') {
    return `${STRAPI_URL}${path}`;
}

export function getStrapiMedia(url: string | null) {
    if (url == null) {
        return null;
    }

    // Return the full URL if the media is hosted on an external provider
    if (url.startsWith('http') || url.startsWith('//')) {
        return url;
    }

    // Otherwise prepend the Strapi URL
    return `${STRAPI_URL}${url}`;
}

export async function fetchAPI<T>(
    path: string,
    urlParamsObject = {},
    options = {}
): Promise<T> {
    // Merge default and user options
    const mergedOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store' as RequestCache, // Ensure fresh data on every request
        ...options,
    };

    // Build request URL
    const queryString = qs.stringify(urlParamsObject, {
        encodeValuesOnly: true, // prettify URL
    });
    const requestUrl = `${getStrapiURL(
        `/api${path}${queryString ? `?${queryString}` : ''}`
    )}`;

    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);

    // Handle response
    if (!response.ok) {
        console.error(response.statusText);
        throw new Error(`An error occurred please try again`);
    }
    const data = await response.json();
    return data;
}

export async function getArticles(params = {}) {
    const defaultParams = {
        populate: ['coverImage', 'category', 'author.avatar'],
        sort: ['publishedAt:desc'],
    };
    return fetchAPI<StrapiResponse<Article[]>>('/articles', {
        ...defaultParams,
        ...params,
    });
}

export async function getArticleBySlug(slug: string) {
    const params = {
        filters: { slug },
        populate: ['coverImage', 'category', 'author.avatar'],
    };
    const data = await fetchAPI<StrapiResponse<Article[]>>('/articles', params);
    return data.data[0];
}

export async function getCategories() {
    return fetchAPI<StrapiResponse<Category[]>>('/categories', { populate: '*' });
}

export async function getCategoryBySlug(slug: string) {
    const params = {
        filters: { slug },
    };
    const data = await fetchAPI<StrapiResponse<Category[]>>('/categories', params);
    return data.data[0];
}

export async function getArticlesByCategory(slug: string) {
    const params = {
        filters: {
            category: {
                slug: {
                    $eq: slug
                }
            }
        },
        populate: ['coverImage', 'category', 'author.avatar'],
        sort: ['publishedAt:desc'],
    };
    return fetchAPI<StrapiResponse<Article[]>>('/articles', params);
}

export async function searchArticles(query: string) {
    const params = {
        filters: {
            $or: [
                {
                    title: {
                        $containsi: query,
                    },
                },
                {
                    excerpt: {
                        $containsi: query,
                    },
                },
                {
                    slug: {
                        $containsi: query,
                    },
                },
            ],
        },
        populate: ['coverImage', 'category', 'author.avatar'],
        sort: ['publishedAt:desc'],
    };
    return fetchAPI<StrapiResponse<Article[]>>('/articles', params);
}
