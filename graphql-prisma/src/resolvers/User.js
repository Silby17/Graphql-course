const User = {
    posts(parent, args, ctx, info) {
        return ctx.db.demoPosts.filter((post) => {
            return post.author === parent.id
        })
    },
    comments(parent, args, ctx, info) {
        return ctx.db.demoComments.filter((comment) => {
            return comment.author === parent.id
        })
    }
}

export {User as default}