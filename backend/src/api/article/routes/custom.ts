export default {
    routes: [
        {
            method: 'POST',
            path: '/articles/:id/generate-summary',
            handler: 'article.generateSummary',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
