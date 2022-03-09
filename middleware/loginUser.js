/**
 * loginUser.js
 * @description :: middleware that verifies user's JWT token
 */

const jwt = require('jsonwebtoken');
const deviceSecret = require('../constants/authConstant').JWT.DEVICE_SECRET;
const adminSecret = require('../constants/authConstant').JWT.ADMIN_SECRET;

/**
 * @description : middleware for authenticate user with JWT token
 * @param {obj} req : request of route.
 * @param {obj} res : response of route.
 * @param {callback} next : executes the next middleware succeeding the current middleware.
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    let url = req.originalUrl;
    let secret = '';
    if (url.includes('device')){
      secret = deviceSecret;
    }
    else if (url.includes('admin')){
      secret = adminSecret;
    }
    jwt.verify(token,secret, (err, user) => {
      if (err) {
        return res.unAuthorizedRequest();
      }
      req.user = user;
      next();
    });
  } else {
    return res.unAuthorizedRequest();
  }
};
module.exports = authenticateJWT;