export default {
    routes: [
        {
            method: 'POST',
            path: '/newsletters/:id/send',
            handler: 'newsletter.send',
            config: {
                policies: ['admin::isAuthenticatedAdmin']
            }
        },
        {
            method: 'POST',
            path: '/newsletters/:id/test',
            handler: 'newsletter.sendTest',
            config: {
                policies: ['admin::isAuthenticatedAdmin']
            }
        },
        {
            method: 'GET',
            path: '/newsletters/:id/analytics',
            handler: 'newsletter.getAnalytics',
            config: {
                policies: ['admin::isAuthenticatedAdmin']
            }
        }
    ]
};
