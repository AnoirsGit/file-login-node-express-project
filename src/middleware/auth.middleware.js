const { verifySecretToken } = require('../helpers/jwtHelper');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]; // Assuming the token is sent in the 'Authorization' header as 'Bearer <token>'

        if (!token) return res.status(401).json({ message: 'Access denied. Token not provided.' });

        const decoded = verifySecretToken(token)
        if (decoded) next();
        else return res.status(403).json({ message: 'Access denied. Provided token is not correct.' });
        req.user = decoded

    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: "User is not signed" })
    }
} 