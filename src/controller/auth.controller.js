const bcrypt = require('bcrypt');
const db = require('../database');
const { createAnyValidator } = require('../helpers/validators')
const { createAccessToken, createRefreshToken, verifyRefreshToken } = require('../helpers/jwtHelper')

const emailValidators = [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, /^[0-9]{10}$/]
const verifyEmailOrPhone = createAnyValidator(emailValidators);

const signup = async (req, res) => {
    try {
        const { id, password } = req.body;

        if (id.length === 0 || password.length === 0) return res.status(400).json({ error: 'credentions must be filled' });
        if (!verifyEmailOrPhone(id)) return res.status(400).json({ error: 'Invalid ID format' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO users (id, password) VALUES (?, ?)';
        const values = [id, hashedPassword];
        await db.executeQuery(query, values);

        const access_token = createAccessToken({ id })
        const refresh_token = createRefreshToken({ id })

        res.status(200).json({ message: 'Signup successful', access_token, refresh_token });
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

const signin = async (req, res) => {
    try {
        const { id, password } = req.body;

        if (id.length === 0 || password.length === 0) return res.status(400).json({ error: 'credentions must be filled' });
        if (!verifyEmailOrPhone(id)) return res.status(400).json({ error: 'Invalid ID format' });

        const query = 'SELECT id, password FROM users WHERE id = ?';
        const result = await db.executeQuery(query, [id]);

        if (result.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const user = result[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const access_token = createAccessToken({ id })
        const refresh_token = createRefreshToken({ id })

        res.status(200).json({ message: 'Signin successful', access_token, refresh_token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

const refreshToken = async (req, res) => {
    try {
        const { refresh_token } = req.body;
        const accessToken = verifyRefreshToken(refresh_token);

        if (accessToken) res.status(200).json({ message: 'successfully access code was refreshed', accessToken });
        else return res.status(401).json({ error: 'Invalid refresh token' });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

const info = async (req, res) => {
    try {
        return res.status(200).json({ userId: req.user.id })
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { signup, signin, refreshToken, info }