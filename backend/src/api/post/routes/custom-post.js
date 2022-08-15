module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/posts/excel',
            handler: 'post.createMany',
            config: {
                auth: false,
            }
        }
    ]
}