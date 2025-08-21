const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const AccessTokenProvider = async (user) => {
  try {
    const token = jwt.sign(
        { sub: user._id.toString(), email: user.email, role: user.role},
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '1h' }
    );
     return token;

  } catch (error) {
    console.error('Error generating access token:', error);
    throw new Error('Token generation failed');
  } 
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
    console.error('Error verifying access token:', error);
    throw new Error('Token verification failed');
    }   
};

const Authenticate = (req, res, next) => {
    const token = req.cookies.accessToken ;
    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }
    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid access token' });
    }
};

module.exports = {AccessTokenProvider , verifyAccessToken , Authenticate};