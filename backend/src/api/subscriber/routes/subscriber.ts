export default {
    routes: [
        {
            method: 'GET',
            path: '/subscribers',
            handler: 'subscriber.find',
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'GET',
            path: '/subscribers/:id',
            handler: 'subscriber.findOne',
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/subscribers',
            handler: 'subscriber.create',
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'PUT',
            path: '/subscribers/:id',
            handler: 'subscriber.update',
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'DELETE',
            path: '/subscribers/:id',
            handler: 'subscriber.delete',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
