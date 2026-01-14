export interface ImageFormat {
    name: string;
    hash: string;
    ext: string;
    mime: string;
    path: string;
    width: number;
    height: number;
    size: number;
    url: string;
}

export interface Image {
    id: number;
    documentId: string;
    url: string;
    alternativeText: string | null;
    caption: string | null;
    width: number | null;
    height: number | null;
    formats: {
        thumbnail: ImageFormat;
        small?: ImageFormat;
        medium?: ImageFormat;
        large?: ImageFormat;
    } | null;
}

export interface Category {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    description: string | null;
}

export interface Author {
    id: number;
    documentId: string;
    name: string;
    bio: string | null;
    avatar: Image | null;
}

export interface Article {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: any[]; // Blocks content
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
    coverImage: Image | null;
    category: Category | null;
    author: Author | null;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string;
    };

}

export interface Meta {
    pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
    };
}

export interface StrapiResponse<T> {
    data: T;
    meta: Meta;
}
