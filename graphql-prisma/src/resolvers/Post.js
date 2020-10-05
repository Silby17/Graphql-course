const Post = {
    author(parent, args, ctx, info) {
        return ctx.db.demoUsers.find((user) => {
            return user.id === parent.author
        })
    },
    comments(parent, args, ctx, info) {
        return ctx.db.demoComments.filter((comment) => {
            return comment.post === parent.id
        })
    }
}

export {Post as default}