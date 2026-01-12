import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::subscriber.subscriber' as any, ({ strapi }) => ({
    /**
     * Confirm email subscription
     */
    async confirm(ctx) {
        const { token } = ctx.params;

        if (!token) {
            return ctx.badRequest('Confirmation token is required');
        }

        try {
            const subscriber = await strapi.db.query('api::subscriber.subscriber').findOne({
                where: { confirmationToken: token }
            });

            if (!subscriber) {
                return ctx.badRequest('Invalid or expired confirmation token');
            }

            if (subscriber.isConfirmed) {
                return ctx.send({
                    success: true,
                    message: 'Email already confirmed',
                    alreadyConfirmed: true
                });
            }

            // Update subscriber
            await strapi.db.query('api::subscriber.subscriber').update({
                where: { id: subscriber.id },
                data: {
                    isConfirmed: true,
                    confirmedAt: new Date(),
                    isActive: true
                }
            });

            // Send welcome email
            try {
                await strapi.plugins['email'].services.email.send({
                    to: subscriber.email,
                    from: process.env.DEFAULT_FROM_EMAIL || 'newsletter@moneage.com',
                    subject: 'Welcome to Moneage Newsletter!',
                    html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #002b5c;">Welcome to Moneage!</h2>
              <p>Your email has been confirmed successfully.</p>
              <p>You will now receive the latest <strong>financial insights</strong>, market trends, and personal finance tips directly in your inbox.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #666;">
                <a href="${process.env.FRONTEND_URL || 'https://moneage.com'}/unsubscribe/${subscriber.unsubscribeToken}">Unsubscribe</a> | 
                <a href="${process.env.FRONTEND_URL || 'https://moneage.com'}/preferences/${subscriber.unsubscribeToken}">Manage Preferences</a>
              </p>
            </div>
          `
                });
            } catch (emailError) {
                console.error('Failed to send welcome email:', emailError);
                // Don't fail the confirmation if email fails
            }

            return ctx.send({
                success: true,
                message: 'Email confirmed successfully! Welcome to Moneage.'
            });
        } catch (error) {
            console.error('Confirmation error:', error);
            return ctx.internalServerError('An error occurred during confirmation');
        }
    },

    /**
     * Unsubscribe from newsletter
     */
    async unsubscribe(ctx) {
        const { token } = ctx.params;

        if (!token) {
            return ctx.badRequest('Unsubscribe token is required');
        }

        try {
            const subscriber = await strapi.db.query('api::subscriber.subscriber').findOne({
                where: { unsubscribeToken: token }
            });

            if (!subscriber) {
                return ctx.badRequest('Invalid unsubscribe token');
            }

            if (!subscriber.isActive) {
                return ctx.send({
                    success: true,
                    message: 'You are already unsubscribed',
                    alreadyUnsubscribed: true
                });
            }

            // Update subscriber
            await strapi.db.query('api::subscriber.subscriber').update({
                where: { id: subscriber.id },
                data: {
                    isActive: false,
                    unsubscribedAt: new Date()
                }
            });

            return ctx.send({
                success: true,
                message: 'Successfully unsubscribed from newsletter'
            });
        } catch (error) {
            console.error('Unsubscribe error:', error);
            return ctx.internalServerError('An error occurred during unsubscribe');
        }
    },

    /**
     * Update subscriber preferences
     */
    async updatePreferences(ctx) {
        const { token } = ctx.params;
        const { preferences } = ctx.request.body;

        if (!token) {
            return ctx.badRequest('Token is required');
        }

        if (!preferences || typeof preferences !== 'object') {
            return ctx.badRequest('Valid preferences object is required');
        }

        try {
            const subscriber = await strapi.db.query('api::subscriber.subscriber').findOne({
                where: { unsubscribeToken: token }
            });

            if (!subscriber) {
                return ctx.badRequest('Invalid token');
            }

            // Merge with existing preferences
            const updatedPreferences = {
                ...(subscriber.preferences || {}),
                ...preferences
            };

            await strapi.db.query('api::subscriber.subscriber').update({
                where: { id: subscriber.id },
                data: { preferences: updatedPreferences }
            });

            return ctx.send({
                success: true,
                message: 'Preferences updated successfully',
                preferences: updatedPreferences
            });
        } catch (error) {
            console.error('Update preferences error:', error);
            return ctx.internalServerError('An error occurred while updating preferences');
        }
    },

    /**
     * Resubscribe to newsletter
     */
    async resubscribe(ctx) {
        const { email } = ctx.request.body;

        if (!email) {
            return ctx.badRequest('Email is required');
        }

        try {
            const subscriber = await strapi.db.query('api::subscriber.subscriber').findOne({
                where: { email }
            });

            if (!subscriber) {
                return ctx.badRequest('Email not found. Please subscribe first.');
            }

            if (subscriber.isActive) {
                return ctx.send({
                    success: true,
                    message: 'You are already subscribed',
                    alreadySubscribed: true
                });
            }

            // Reactivate subscription
            await strapi.db.query('api::subscriber.subscriber').update({
                where: { id: subscriber.id },
                data: {
                    isActive: true,
                    unsubscribedAt: null
                }
            });

            return ctx.send({
                success: true,
                message: 'Successfully resubscribed to newsletter'
            });
        } catch (error) {
            console.error('Resubscribe error:', error);
            return ctx.internalServerError('An error occurred during resubscribe');
        }
    }
}));
