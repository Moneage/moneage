/**
 * article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
    // Generate AI summary for an article
    async generateSummary(ctx) {
        const { id } = ctx.params;
        const { content: bodyContent, title: bodyTitle, save = true } = ctx.request.body;

        try {
            let title = bodyTitle;
            let content = bodyContent;
            let excerpt = '';

            // If content/title not provided, fetch from DB
            if (!content || !title) {
                const article = await strapi.entityService.findOne(
                    'api::article.article',
                    id,
                    { populate: '*' }
                );

                if (!article) {
                    return ctx.notFound('Article not found');
                }
                title = article.title;
                content = article.content;
                excerpt = article.excerpt;
            }

            // Generate AI summary using Gemini
            const summary = await generateAISummary(
                title,
                typeof content === 'string' ? content : JSON.stringify(content),
                excerpt
            );

            // Update article with generated summary ONLY if save is true
            if (save && id) {
                await strapi.entityService.update(
                    'api::article.article',
                    id,
                    {
                        data: {
                            aiTldr: summary.tldr,
                            aiMetaDescription: summary.metaDescription,
                            aiKeywords: summary.keywords.join(', '),
                        } as any,
                    }
                );
            }

            ctx.body = {
                success: true,
                data: {
                    aiTldr: summary.tldr,
                    aiMetaDescription: summary.metaDescription,
                    aiKeywords: summary.keywords.join(', '),
                },
            };
        } catch (error) {
            console.error('Error generating summary:', error);
            ctx.throw(500, 'Failed to generate summary');
        }
    },
}));

// AI Summary Generation Function
async function generateAISummary(title: string, content: string, excerpt?: string) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY not set, using fallback summary');
        return generateFallbackSummary(title, excerpt);
    }

    try {
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
        const aiResponse = (data as any).candidates[0].content.parts[0].text;

        try {
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
