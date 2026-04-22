import jwtPkg from 'jsonwebtoken';
import User from '../models/User.js';
const { verify } = jwtPkg;

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
  }
};

const employerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'employer') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied. Employers only.' });
};

const jobseekerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'jobseeker') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied. Job seekers only.' });
};

export default { protect, employerOnly, jobseekerOnly };
