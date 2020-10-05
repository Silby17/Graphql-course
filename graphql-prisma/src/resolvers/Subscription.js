const Subscription = {
    comment: {
        subscribe(parent, args, ctx, info) {
            const post = ctx.db.demoPosts.find((post) => post.id === args.postId && post.published)

            if (!post) {
                throw new Error('Post not found')
            }
            return ctx.pubSub.asyncIterator(`comment-${args.postId}`)
        }
    },
    post: {
        subscribe(parent, args, ctx, info) {
            return ctx.pubSub.asyncIterator('post')
        }
    },
}

export {Subscription as default}