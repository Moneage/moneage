export default ({ env }) => ({
    upload: {
        config: {
            provider: 'cloudinary',
            providerOptions: {
                cloud_name: env('CLOUDINARY_NAME'),
                api_key: env('CLOUDINARY_KEY'),
                api_secret: env('CLOUDINARY_SECRET'),
            },
            actionOptions: {
                upload: {},
                uploadStream: {},
                delete: {},
            },
        },
    },
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                host: 'smtp.resend.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'resend',
                    pass: env('RESEND_API_KEY'),
                },
            },
            settings: {
                defaultFrom: env('DEFAULT_FROM_EMAIL'),
                defaultReplyTo: env('DEFAULT_FROM_EMAIL'),
            },
        },
    },
    ckeditor: {
        enabled: true,
        resolve: './node_modules/@ckeditor/strapi-plugin-ckeditor'
    },
});
