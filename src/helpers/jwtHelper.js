const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET_KEY = process.env.REFRESH_JWT_SECRET || 'your-refresh-secret-key';

const createAccessToken = (payload) => jwt.sign(payload, SECRET_KEY, { expiresIn: '10m' });
const createRefreshToken = (payload) => jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: '10d' });

const verifySecretToken = (secretToken) => {
    try {
        const decoded = jwt.verify(secretToken, SECRET_KEY);
        return decoded;
    } catch (err) {
        return null;
    }
}

const verifyRefreshToken = (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
        const newAccessToken = createAccessToken({ id: decoded.id });
        return newAccessToken;
    } catch (err) {
        return null;
    }
}

module.exports = { createAccessToken, createRefreshToken, verifySecretToken, verifyRefreshToken }