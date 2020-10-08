const Mutation = {
    async createUser(parent, args, {prisma}, info) {
        return prisma.mutation.createUser({data: args.data}, info)
    },
    async deleteUser(parent, args, {prisma}, info) {
        return prisma.mutation.deleteUser({
            where:  {id: args.id}
        }, info)
    },
    async updateUser(parent, args, {prisma}, info) {
        return prisma.mutation.updateUser({
            where: {id: args.id},
            data: args.data
        }, info)
    },

    async createPost(parent, args, ctx, info) {
        return ctx.prisma.mutation.createPost({
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect: {
                        id: args.data.author
                    }
                }
            }
        }, info)
    },
    async deletePost(parent, args, ctx, info) {
        return ctx.prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info)
    },
    async updatePost(parent, args, ctx, info) {
        return ctx.prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },

    async createComment(parent, args, ctx, info) {
        return ctx.prisma.mutation.createComment({
            data: {
                body: args.data.body,
                author: {
                    connect: {
                        id: args.data.author
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            }
        }, info)
    },
    async deleteComment(parent, args, ctx, info) {
        return ctx.prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info)
    },
    async updateComment(parent, args, ctx, info) {
        return ctx.prisma.mutation.updateComment({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    }
}

export {Mutation as default}