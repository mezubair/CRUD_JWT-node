const jwt = require('jsonwebtoken');
const Revoked=require("../models/revokedTokens");



const JWT_SECRET_KEY = 'mynameiszubair';

async function  authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  const isRevoked=await Revoked.findOne({revTokens:token})

  if (isRevoked) {
    return res.status(403).json({message:"invalid or expired token ! Please log-in again "}); 
  }
  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); 
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken};
