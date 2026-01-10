export default {
    async afterCreate(event) {
        const { result } = event;
        try {
            await strapi.plugins['email'].services.email.send({
                to: result.email,
                from: process.env.DEFAULT_FROM_EMAIL || 'no-reply@moneage.com',
                replyTo: process.env.DEFAULT_FROM_EMAIL || 'no-reply@moneage.com',
                subject: 'Welcome to Moneage Newsletter',
                text: 'Thank you for subscribing to our newsletter! You will now receive the latest financial insights directly in your inbox.',
                html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #002b5c;">Welcome to Moneage!</h2>
            <p>Thank you for subscribing to our newsletter.</p>
            <p>You will now receive the latest <strong>financial insights</strong>, market trends, and personal finance tips directly in your inbox.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #666;">
              If you didn't sign up for this, you can ignore this email.
            </p>
          </div>
        `,
            });
        } catch (err) {
            console.error('Failed to send welcome email:', err);
        }
    },
};
