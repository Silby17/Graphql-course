import {Prisma} from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
})
// prisma.query.users(null, '{id name posts {id title}}').then((data) => {
//     console.log(JSON.stringify(data, undefined, 4))
// })
//
// prisma.query.comments(null, '{id body author {id name}}').then((data) => {
//     console.log(JSON.stringify(data, undefined, 4))
// })

// prisma.exists.Comment({
//     id: 'ckfwl9xuv00ob0792w6w3e3dq',
//     author: {
//         id: "ckfwl84i000mm0792hyxsevhx"
//     }
// }).then((exists) => {
//     console.log(exists)
// })


const createPostForUser = async (authorId, data) => {
    const userExists = await prisma.exists.User({
        id: authorId
    })

    if (!userExists) {
        throw new Error(`User ${authorId} does not exist`)
    }
    const post = await prisma.mutation.createPost({
        data: {
            ...data,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    }, '{id author {id name posts {id title}}}')
    return post.author
}

const updatePostForUser = async (postId, data) => {
    const postExists = await prisma.exists.Post({
        id: postId
    })
    if (!postExists) {
        throw new Error(`Post with ID: ${postId} is not found`)
    }
    const post = await prisma.mutation.updatePost({
        where: {
            id: postId
        },
        data
    }, '{author {id name email posts {id title published}} }')
    return post.author
}

// updatePostForUser("ckfwl2n8b00k60792t5pvfnmi", {
//     title: "CHANGED POST TITLE"
// }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 4))
// }).catch((err) => {
//     console.error(err.message)
// })

// createPostForUser("ckfz2toqf02tb07926lmzy2r9", {
//     title: "New post from separate function",
//     body: "Hello everyone",
//     published: true
//
// }).then((user) => console.log(JSON.stringify(user, undefined,4 ))).catch((err) => {
//     console.error(err.message)
// })