let demoUsers = [
    {
        id: '1',
        name: 'Yossi Silberhaft',
        age: 29,
        email: 'yossi@gmail.com'
    },
    {
        id: '2',
        name: 'John Smith',
        email: 'john@gmail.com'
    },
    {
        id: '3',
        name: 'Yossi Silb',
        age: 29,
        email: 'yosdddd@gmail.com'
    },
    {
        id: '4',
        name: 'Andrew',
        email: 'andrew@gmail.com'
    }
]

let demoPosts = [
    {
        id: '11',
        title: 'My Second Blog post',
        body: 'Welcome to my blog',
        published: true,
        author: '1'
    },
    {
        id: '22',
        title: 'My Third Blog post',
        body: 'Welcome to my blog',
        published: true,
        author: '4'
    }
]

let demoComments = [
    {
        id: 'a',
        body: "Nice post dude",
        post: '11',
        author: '3'
    },
    {
        id: 'b',
        body: "Meh, It was ok",
        post: '11',
        author: '2'
    }
]

const db = {
    demoUsers,
    demoPosts,
    demoComments
}

export {db as default}