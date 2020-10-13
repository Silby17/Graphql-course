import bcrypt from 'bcryptjs'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashPassword'

/**
 * Note, in some places I destructured the context but in the Comment mutations
 * I am using the context (ctx) object as is
 */
const Mutation = {
    async createUser(parent, args, {prisma}, info) {
        const password = await hashPassword(args.data.password)
        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
        })
        return {
            user,
            token: await generateToken(user.id)
        }
    },
    async deleteUser(parent, args, {prisma, request}, info) {
        const userId = getUserId(request)

        return prisma.mutation.deleteUser({
            where: {id: userId}
        }, info)
    },
    async updateUser(parent, args, {prisma, request}, info) {
        const userId = getUserId(request)

        if (typeof args.data.password === 'string') {
            args.data.password = await hashPassword(args.data.password)
        }
        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: args.data
        }, info)
    },
    async loginUser(parent, args, {prisma}, info) {
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        })
        if(!user) {
            throw new Error('Unable to login. Email not found')
        }
        const passMatch = await bcrypt.compare(args.data.password, user.password)

        if(!passMatch) {
            throw new Error('Not Authorized. Password is wrong')
        }
        return {
            user,
            token: await generateToken(user.id)
        }
    },

    async createPost(parent, args, {prisma, request}, info) {
        const userId = getUserId(request)

        return prisma.mutation.createPost({
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect: {
                        id: userId
                    }
                }
            }
        }, info)
    },
    async deletePost(parent, args, ctx, info) {
        const userId = getUserId(ctx.request)
        const postExists = await ctx.prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })
        if (!postExists) {
            throw new Error('This post is not your post')
        }
        return ctx.prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info)
    },
    async updatePost(parent, args, {prisma, request}, info) {
        const userId = getUserId(request)
        const postExists = await prisma.exists.Post({
                id: args.id,
                author: {
                    id: userId
                }
        })
        const isPublished = await prisma.exists.Post({
            id: args.id,
            published: true
        })
        if (!postExists) {
            throw new Error('Not your post to edit')
        }
        if (isPublished && args.data.published === false) {
            await prisma.mutation.deleteManyComments({
                where: {post: {id: args.id}}
            })
        }
        return prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },

    async createComment(parent, args, ctx, info) {
        const userId = getUserId(ctx.request)
        const postExists = await ctx.prisma.exists.Post({
            id: args.data.post,
            published: true
        })
        if (!postExists) {
            throw new Error('Unable to find the post')
        }
        if (!userId) {
            throw new Error('Not Authorized')
        }
        return ctx.prisma.mutation.createComment({
            data: {
                body: args.data.body,
                author: {
                    connect: {
                        id: userId
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
        const userId = getUserId(ctx.request)
        const commentExists = await ctx.prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!commentExists) {
            throw new Error('Not Authorized')
        }
        return ctx.prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info)
    },
    async updateComment(parent, args, ctx, info) {
        const userId = getUserId(ctx.request)

        const commentExists = await ctx.prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })
        if (!commentExists) {
            throw new Error('Comment not yours')
        }

        return ctx.prisma.mutation.updateComment({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    }
}

export {Mutation as default}