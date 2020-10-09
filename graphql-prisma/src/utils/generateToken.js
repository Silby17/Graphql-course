import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
    return jwt.sign({id: userId}, 'thisisasecret', {
        expiresIn: '2d'
    })
}

export {generateToken as default}