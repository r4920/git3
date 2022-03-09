/**
 * auth.js
 * @description :: express routes of authentication APIs
 */
  
const express =  require('express');
const routes  =  express.Router();
const authController =  require('../../controller/admin/authController');
const auth = require('../../middleware/auth');
routes.route('/register').post(authController.register);
routes.post('/login',authController.login);
routes.route('/forgot-password').post(authController.forgotPassword);
routes.route('/validate-otp').post(authController.validateResetPasswordOtp);
routes.route('/reset-password').put(authController.resetPassword);
routes.route('/logout').post(auth(...[ 'logoutByUserInAdminPlatform', 'logoutByAdminInAdminPlatform' ]), authController.logout);
module.exports = routes;
