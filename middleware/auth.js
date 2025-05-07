// Project: nodejs-express-mongodb-jwt

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_to_strong';

module.exports = (req, res, next) => {
const auth = req.headers.authorization || '';
const token = auth.replace(/^Bearer\s+/, '');
if (!token) return res.status(401).json({ message: 'Missing token' });

try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    next();
} catch {
    return res.status(401).json({ message: 'Invalid token' });
}
};
