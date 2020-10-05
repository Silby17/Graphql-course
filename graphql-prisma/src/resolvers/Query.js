const Query = {
    users(parent, args, ctx, info) {
        if (!args.query) {
            return ctx.db.demoUsers
        }
        return ctx.db.demoUsers.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
    },
    posts(parent, args, ctx, info) {
        if (!args.query) {
            return ctx.db.demoPosts
        }
        return ctx.db.demoPosts.filter((post) => {
            const titleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
            const bodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())

            return titleMatch || bodyMatch
        })
    },
    comments(parent, args, ctx, info) {
        if (!args.query) {
            return ctx.db.demoComments
        }
    },
    me() {
        return {
            id: 'abc-123',
            name: 'Yossi Silberhaft',
            age: 29,
            email: 'yossi@gmail.com'
        }
    },
    post() {
        return {
            id: '1234',
            title: 'My First Blog post',
            body: 'Welcome to my blog',
            published: false
        }
    }
}

export {Query as default}