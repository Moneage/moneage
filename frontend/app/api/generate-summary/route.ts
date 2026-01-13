import { NextResponse } from 'next/server';

// Simple in-memory cache
const summaryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(request: Request) {
    try {
        const { articleId, title, content, excerpt } = await request.json();

        if (!title || !content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }

        // Create cache key
        const cacheKey = `${title}-${content.substring(0, 100)}`;

        // Check cache
        const cached = summaryCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return NextResponse.json({
                ...cached.data,
                cached: true,
            });
        }

        // Generate AI summary
        const summary = await generateAISummary(title, content, excerpt);

        // Save to Strapi if articleId is provided
        if (articleId) {
            await saveSummaryToStrapi(articleId, summary);
        }

        // Update cache
        summaryCache.set(cacheKey, {
            data: summary,
            timestamp: Date.now(),
        });

        return NextResponse.json({
            ...summary,
            cached: false,
        });
    } catch (error) {
        console.error('Summary generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate summary' },
            { status: 500 }
        );
    }
}

async function generateAISummary(title: string, content: string, excerpt?: string) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY not set, using fallback summary');
        return generateFallbackSummary(title, excerpt);
    }

    try {
        // Truncate content to avoid token limits (max ~8000 chars)
        const truncatedContent = content.substring(0, 8000);

        const prompt = `Analyze the following article and provide a JSON response with:

1. A concise 2-3 sentence TL;DR summary that captures the main points
2. An SEO-optimized meta description (150-160 characters max)
3. 3-5 relevant keywords

Article Title: ${title}
${excerpt ? `Article Excerpt: ${excerpt}` : ''}
Article Content: ${truncatedContent}

Respond ONLY with valid JSON in this exact format:
{
  "tldr": "2-3 sentence summary here",
  "metaDescription": "150-160 character SEO description here",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}

Keep the TL;DR engaging and informative. Make the meta description compelling for search results. Do not include any markdown formatting or extra text.`;

        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': GEMINI_API_KEY,
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }],
                    }],
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;

        // Parse JSON response
        try {
            // Remove markdown code blocks if present
            const cleanedResponse = aiResponse
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();

            const parsed = JSON.parse(cleanedResponse);

            return {
                tldr: parsed.tldr || generateFallbackSummary(title, excerpt).tldr,
                metaDescription: parsed.metaDescription || generateFallbackSummary(title, excerpt).metaDescription,
                keywords: parsed.keywords || [],
            };
        } catch (parseError) {
            console.error('Failed to parse AI response:', parseError);
            return generateFallbackSummary(title, excerpt);
        }
    } catch (error) {
        console.error('Error generating AI summary:', error);
        return generateFallbackSummary(title, excerpt);
    }
}

function generateFallbackSummary(title: string, excerpt?: string) {
    // Generate basic fallback summary
    const tldr = excerpt
        ? excerpt.substring(0, 200) + (excerpt.length > 200 ? '...' : '')
        : `This article discusses ${title.toLowerCase()}. Read on to learn more about this important topic and gain valuable insights.`;

    const metaDescription = excerpt
        ? excerpt.substring(0, 155) + (excerpt.length > 155 ? '...' : '')
        : `Learn about ${title}. Discover key insights and expert analysis on this important financial topic.`;

    return {
        tldr,
        metaDescription: metaDescription.substring(0, 160),
        keywords: title.toLowerCase().split(' ').filter(w => w.length > 3).slice(0, 5),
    };
}

async function saveSummaryToStrapi(articleId: number, summary: any) {
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

    if (!STRAPI_API_TOKEN) {
        console.warn('STRAPI_API_TOKEN not set, cannot save summary to Strapi');
        return;
    }

    try {
        const response = await fetch(`${STRAPI_URL}/api/articles/${articleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
            },
            body: JSON.stringify({
                data: {
                    aiSummary: {
                        tldr: summary.tldr,
                        metaDescription: summary.metaDescription,
                        keywords: summary.keywords,
                        generatedAt: new Date().toISOString(),
                    },
                },
            }),
        });

        if (!response.ok) {
            console.error('Failed to save summary to Strapi:', response.status);
        } else {
            console.log('Summary saved to Strapi successfully');
        }
    } catch (error) {
        console.error('Error saving summary to Strapi:', error);
    }
}
