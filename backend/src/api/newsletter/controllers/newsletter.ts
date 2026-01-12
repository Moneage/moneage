import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::newsletter.newsletter' as any, ({ strapi }) => ({
    /**
     * Send newsletter to all confirmed subscribers
     */
    async send(ctx) {
        const { id } = ctx.params;

        try {
            const newsletter = await (strapi.entityService.findOne as any)('api::newsletter.newsletter', id);

            if (!newsletter) {
                return ctx.notFound('Newsletter not found');
            }

            if (newsletter.status === 'sent') {
                return ctx.badRequest('Newsletter has already been sent');
            }

            // Update status to sending
            await (strapi.entityService.update as any)('api::newsletter.newsletter', id, {
                data: { status: 'sending' }
            });

            // Get all confirmed, active subscribers
            const subscribers = await strapi.db.query('api::subscriber.subscriber').findMany({
                where: {
                    isActive: true,
                    isConfirmed: true
                }
            });

            if (subscribers.length === 0) {
                await (strapi.entityService.update as any)('api::newsletter.newsletter', id, {
                    data: { status: 'draft' }
                });
                return ctx.badRequest('No active, confirmed subscribers found');
            }

            const frontendUrl = process.env.FRONTEND_URL || 'https://moneage.com';

            // Send emails in batches to avoid rate limits
            const batchSize = 50;
            let sentCount = 0;
            const errors = [];

            for (let i = 0; i < subscribers.length; i += batchSize) {
                const batch = subscribers.slice(i, i + batchSize);

                await Promise.all(batch.map(async (subscriber) => {
                    try {
                        const unsubscribeUrl = `${frontendUrl}/unsubscribe/${subscriber.unsubscribeToken}`;
                        const preferencesUrl = `${frontendUrl}/preferences/${subscriber.unsubscribeToken}`;

                        // Build email content with footer
                        const emailHtml = `
              ${newsletter.htmlContent || newsletter.content}
              
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="font-size: 12px; color: #666; text-align: center;">
                  You're receiving this email because you subscribed to Moneage newsletter.
                </p>
                <p style="font-size: 12px; color: #666; text-align: center; margin: 15px 0;">
                  <a href="${preferencesUrl}" style="color: #002b5c; text-decoration: none;">Manage Preferences</a> | 
                  <a href="${unsubscribeUrl}" style="color: #002b5c; text-decoration: none;">Unsubscribe</a>
                </p>
                <p style="font-size: 12px; color: #999; text-align: center;">
                  © 2026 Moneage. All rights reserved.
                </p>
              </div>
            `;

                        await strapi.plugins['email'].services.email.send({
                            to: subscriber.email,
                            from: process.env.DEFAULT_FROM_EMAIL || 'newsletter@moneage.com',
                            subject: newsletter.subject,
                            html: emailHtml,
                            text: newsletter.content
                        });

                        sentCount++;
                    } catch (error) {
                        console.error(`Failed to send to ${subscriber.email}:`, error);
                        errors.push({ email: subscriber.email, error: error.message });
                    }
                }));

                // Rate limiting: wait 1 second between batches
                if (i + batchSize < subscribers.length) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // Update newsletter status
            await (strapi.entityService.update as any)('api::newsletter.newsletter', id, {
                data: {
                    status: 'sent',
                    sentAt: new Date(),
                    sentCount
                }
            });

            return ctx.send({
                success: true,
                message: 'Newsletter sent successfully',
                sentCount,
                totalSubscribers: subscribers.length,
                failedCount: errors.length,
                errors: errors.length > 0 ? errors : undefined
            });
        } catch (error) {
            console.error('Newsletter send error:', error);

            // Reset status on error
            try {
                await (strapi.entityService.update as any)('api::newsletter.newsletter', id, {
                    data: { status: 'draft' }
                });
            } catch (updateError) {
                console.error('Failed to reset newsletter status:', updateError);
            }

            return ctx.internalServerError('An error occurred while sending newsletter');
        }
    },

    /**
     * Send test email
     */
    async sendTest(ctx) {
        const { id } = ctx.params;
        const { testEmail } = ctx.request.body;

        if (!testEmail) {
            return ctx.badRequest('Test email address is required');
        }

        try {
            const newsletter = await (strapi.entityService.findOne as any)('api::newsletter.newsletter', id);

            if (!newsletter) {
                return ctx.notFound('Newsletter not found');
            }

            await strapi.plugins['email'].services.email.send({
                to: testEmail,
                from: process.env.DEFAULT_FROM_EMAIL || 'newsletter@moneage.com',
                subject: `[TEST] ${newsletter.subject}`,
                html: newsletter.htmlContent || newsletter.content,
                text: newsletter.content
            });

            return ctx.send({
                success: true,
                message: `Test email sent to ${testEmail}`
            });
        } catch (error) {
            console.error('Test email error:', error);
            return ctx.internalServerError('Failed to send test email');
        }
    },

    /**
     * Get newsletter analytics
     */
    async getAnalytics(ctx) {
        const { id } = ctx.params;

        try {
            const newsletter = await (strapi.entityService.findOne as any)('api::newsletter.newsletter', id);

            if (!newsletter) {
                return ctx.notFound('Newsletter not found');
            }

            const openRate = newsletter.sentCount > 0
                ? ((newsletter.openCount || 0) / newsletter.sentCount * 100).toFixed(2)
                : 0;

            const clickRate = newsletter.sentCount > 0
                ? ((newsletter.clickCount || 0) / newsletter.sentCount * 100).toFixed(2)
                : 0;

            return ctx.send({
                id: newsletter.id,
                subject: newsletter.subject,
                status: newsletter.status,
                sentAt: newsletter.sentAt,
                sentCount: newsletter.sentCount || 0,
                openCount: newsletter.openCount || 0,
                clickCount: newsletter.clickCount || 0,
                openRate: `${openRate}%`,
                clickRate: `${clickRate}%`
            });
        } catch (error) {
            console.error('Analytics error:', error);
            return ctx.internalServerError('Failed to fetch analytics');
        }
    }
}));
