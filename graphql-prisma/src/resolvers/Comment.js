const Comment = {
    author(parent, args, ctx, info) {
        return ctx.db.demoUsers.find((user) => {
            return user.id === parent.author
        })
    },
    post(parent, args, ctx, info) {
        return ctx.db.demoPosts.find((post) => {
            return post.id === parent.post
        })
    }
}

export {Comment as default}