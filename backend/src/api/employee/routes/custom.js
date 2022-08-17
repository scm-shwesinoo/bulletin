module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/employees',
            handler: 'employee.find',
            config: {
                auth: false,
            }
        },
        {
            method: 'GET',
            path: '/employee/:id',
            handler: 'employee.findOne',
            config: {
                auth: false,
            }
        },
        {
            method: 'POST',
            path: '/employees',
            handler: 'employee.create',
            config: {
                auth: false,
            }
        },
        {
            method: 'PUT',
            path: '/employee/:id',
            handler: 'employee.update',
            config: {
                auth: false
            }
        },
        {
            method: 'DELETE',
            path: '/employee/:id',
            handler: 'employee.delete',
            config: {
                auth: false,
            }
        },
        {
            method: "POST",
            path: "/password",
            handler: "employee.password",
        },
        // {
        //     method: "POST",
        //     path: "/password",
        //     handler: "employee.index",
        // },
    ]
}