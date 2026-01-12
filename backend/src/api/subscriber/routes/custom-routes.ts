export default {
    routes: [
        {
            method: 'POST',
            path: '/subscribers/confirm/:token',
            handler: 'subscriber.confirm',
            config: {
                auth: false,
                policies: [],
            }
        },
        {
            method: 'POST',
            path: '/subscribers/unsubscribe/:token',
            handler: 'subscriber.unsubscribe',
            config: {
                auth: false,
                policies: [],
            }
        },
        {
            method: 'PUT',
            path: '/subscribers/:token/preferences',
            handler: 'subscriber.updatePreferences',
            config: {
                auth: false,
                policies: [],
            }
        },
        {
            method: 'POST',
            path: '/subscribers/resubscribe',
            handler: 'subscriber.resubscribe',
            config: {
                auth: false,
                policies: [],
            }
        }
    ]
};
