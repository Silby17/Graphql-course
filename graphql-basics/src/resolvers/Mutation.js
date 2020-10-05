import uuidv4 from 'uuid'

const Mutation = {
    createUser(parent, args, ctx, info) {
        const emailTaken = ctx.db.demoUsers.some((user) => args.data.email === user.email)
        if (emailTaken) {
            throw new Error(`Email: ${args.data.email} is already taken`)
        }
        const user = {
            id: uuidv4(),
            ...args.data
        }
        ctx.db.demoUsers.push(user)
        return user
    },
    deleteUser(parent, args, ctx, info) {
        const userIndex = ctx.db.demoUsers.findIndex((user) => user.id === args.id)
        if (userIndex === -1) {
            throw new Error('User does not exist in the DB')
        }
        const removedUsers = ctx.db.demoUsers.splice(userIndex, 1)

        ctx.db.demoPosts = ctx.db.demoPosts.filter((post) => {
            const match = post.author === args.id

            if (match) {
                ctx.db.demoComments = ctx.db.demoComments.filter((comment) => comment.post !== post.id)
            }
            return !match
        })
        ctx.db.demoComments = ctx.db.demoComments.filter((comment) => comment.author !== args.id)
        return removedUsers[0]
    },
    updateUser(parent, args, ctx, info) {
        const currentUser = ctx.db.demoUsers.find((user) => user.id === args.id)

        if (!currentUser) {
            throw new Error('No User was found')
        }

        if (typeof args.data.email === 'string') {
            const emailTaken = ctx.db.demoUsers.some((user) => user.email === args.data.email)
            if (emailTaken) {
                throw new Error('Sorry, email is already in use')
            }
            currentUser.email = args.data.email
        }
        if(typeof args.data.name === 'string') {
            currentUser.name = args.data.name
        }
        if(typeof args.data.age !== 'undefined') {
            currentUser.age = args.data.age
        }

        return currentUser
    },

    createPost(parent, args, ctx, info) {
        const userExists = ctx.db.demoUsers.some((user) => user.id === args.data.author)
        if (!userExists) {
            throw new Error(`User: ${args.data.author}, does not exist`)
        }

        const newPost = {
            id: uuidv4(),
            ...args.data
        }
        ctx.db.demoPosts.push(newPost)
        if (args.data.published) {
            ctx.pubSub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: newPost
                }
            })
        }
        return newPost
    },
    deletePost(parent, args, ctx, info) {
        const postIndex = ctx.db.demoPosts.findIndex((post) => post.id === args.id)

        if (postIndex === -1) {
            throw new Error('Post does not exist')
        }
        const [deletedPost] = ctx.db.demoPosts.splice(postIndex, 1)

        ctx.db.demoComments = ctx.db.demoComments.filter((comment) => comment.post !== args.id)
        if(deletedPost.published) {
            ctx.pubSub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: deletedPost
                }
            })
        }
        return deletedPost
    },
    updatePost(parent, args, ctx, info) {
        const currentPost = ctx.db.demoPosts.find((post) => post.id === args.id)
        const originalPost = {...currentPost}
        if (!currentPost) {
            throw new Error('No post with this ID')
        }
        if (typeof args.data.title === 'string') {
            currentPost.title = args.data.title
        }
        if (typeof args.data.body === 'string') {
            currentPost.body = args.data.body
        }
        if (typeof args.data.published === 'boolean') {
            currentPost.published = args.data.published
            if (originalPost.published && !args.data.published) {
                ctx.pubSub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: currentPost
                    }
                })
            }
            if(args.data.published && !originalPost.published) {
                ctx.pubSub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: currentPost
                    }
                })

            }
        } else if (originalPost.published) {
            ctx.pubSub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: currentPost
                }
            })
        }
        return currentPost
    },

    createComment(parent, args, ctx, info) {
        const postExist = ctx.db.demoPosts.some((post) => post.id === args.data.post)
        if (!postExist) {
            throw new Error('Post does not exist')
        }
        const userExists = ctx.db.demoUsers.some((user) => user.id === args.data.author)
        if (!userExists) {
            throw new Error(`User: ${args.data.author}, does not exist`)
        }

        const newComment = {
            id: uuidv4(),
            ...args.data
        }
        ctx.db.demoComments.push(newComment)

        ctx.pubSub.publish(`comment-${args.data.post}`, {
            comment: {
                mutation: 'CREATED',
                data: newComment
            }
        })
        return newComment
    },
    deleteComment(parent, args, ctx, info) {
        const commentIndex = ctx.db.demoComments.findIndex((comment) => comment.id === args.id)
        if (commentIndex === -1) {
            throw new Error('Comment does not exist')
        }
        const [removedComment] = ctx.db.demoComments.splice(commentIndex, 1)
        ctx.pubSub.publish(`comment-${removedComment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: removedComment
            }
        })
        return removedComment
    },
    updateComment(parent, args, ctx, info) {
        const currentComment = ctx.db.demoComments.find((c) => c.id === args.id)

        if(!currentComment) {
            throw new Error('No comment with that ID')
        }

        if (typeof args.data.body === 'string') {
            currentComment.body = args.data.body
        }
        ctx.pubSub.publish(`comment-${args.data.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: currentComment
            }
        })
        return currentComment
    }
}

export {Mutation as default}