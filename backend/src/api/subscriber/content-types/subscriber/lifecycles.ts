import crypto from 'crypto';

export default {
  async afterCreate(event) {
    const { result, params } = event;

    // Generate secure tokens
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const unsubscribeToken = crypto.randomBytes(32).toString('hex');

    // Update subscriber with tokens
    await strapi.db.query('api::subscriber.subscriber').update({
      where: { id: result.id },
      data: {
        confirmationToken,
        unsubscribeToken,
        isConfirmed: false,
        isActive: false, // Inactive until confirmed
        metadata: {
          ipAddress: params?.data?.ipAddress || null,
          userAgent: params?.data?.userAgent || null,
          subscribedAt: new Date().toISOString()
        }
      }
    });

    // Send confirmation email
    const frontendUrl = process.env.FRONTEND_URL || 'https://moneage.com';
    const confirmationUrl = `${frontendUrl}/confirm/${confirmationToken}`;

    try {
      await strapi.plugins['email'].services.email.send({
        to: result.email,
        from: process.env.DEFAULT_FROM_EMAIL || 'newsletter@moneage.com',
        replyTo: process.env.DEFAULT_FROM_EMAIL || 'newsletter@moneage.com',
        subject: 'Confirm your Moneage newsletter subscription',
        html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #002b5c 0%, #004080 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="color: white; margin: 0;">Welcome to Moneage!</h1>
                        </div>
                        
                        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #002b5c;">Confirm Your Subscription</h2>
                            
                            <p>Thank you for subscribing to Moneage newsletter! To complete your subscription and start receiving financial insights, please confirm your email address.</p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${confirmationUrl}" style="background: #002b5c; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                                    Confirm Email Address
                                </a>
                            </div>
                            
                            <p style="font-size: 14px; color: #666;">
                                Or copy and paste this link into your browser:<br>
                                <a href="${confirmationUrl}" style="color: #002b5c; word-break: break-all;">${confirmationUrl}</a>
                            </p>
                            
                            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                            
                            <p style="font-size: 12px; color: #999;">
                                If you didn't sign up for this newsletter, you can safely ignore this email.
                            </p>
                        </div>
                        
                        <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
                            <p>© 2026 Moneage. All rights reserved.</p>
                            <p>
                                <a href="${frontendUrl}/privacy" style="color: #666; text-decoration: none;">Privacy Policy</a> | 
                                <a href="${frontendUrl}/terms" style="color: #666; text-decoration: none;">Terms of Service</a>
                            </p>
                        </div>
                    </body>
                    </html>
                `,
        text: `
Welcome to Moneage!

Confirm Your Subscription

Thank you for subscribing to Moneage newsletter! To complete your subscription and start receiving financial insights, please confirm your email address.

Click here to confirm: ${confirmationUrl}

If you didn't sign up for this newsletter, you can safely ignore this email.

© 2026 Moneage. All rights reserved.
                `
      });
    } catch (err) {
      console.error('Failed to send confirmation email:', err);
      // Don't throw error - allow subscriber creation to succeed even if email fails
    }
  },
};
