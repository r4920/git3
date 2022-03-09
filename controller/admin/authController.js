/**
 * authController.js
 * @description :: exports authentication methods
 */
const authService =  require('../../services/auth');
const model = require('../../model/index');
const dbService = require('../../utils/dbService');
const dayjs = require('dayjs');
const userSchemaKey = require('../../utils/validation/userValidation');
const validation = require('../../utils/validateRequest');
const { Op } = require('sequelize');
const authConstant = require('../../constants/authConstant');
const { uniqueValidation } = require('../../utils/common');
const {
  sendPasswordBySMS, sendPasswordByEmail 
} = require('../../services/auth');
    
/**
 * @description : user registration 
 * @param {obj} req : request for register
 * @param {obj} res : response for register
 * @return {obj} : response for register {status, message, data}
 */
const register = async (req, res) => {
  try {
    let validateRequest = validation.validateParamsWithJoi(
      req.body,
      userSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    let isEmptyPassword = false;
    if (!req.body.password){
      isEmptyPassword = true;
      req.body.password = Math.random().toString(36).slice(2);
    }
    let unique = await uniqueValidation(model.user,req.body);   
    if (!unique){ 
      return res.inValidParam({ message :'User Registration Failed, Duplicate Data found.' });
    }   
    const result = await dbService.createOne(model.user,{
      ...req.body,
      userType: authConstant.USER_TYPES.Admin
    });
    if (isEmptyPassword && req.body.email){
      await sendPasswordByEmail({
        email: req.body.email,
        password: req.body.password
      });
    }
    if (isEmptyPassword && req.body.mobileNo){
      await sendPasswordBySMS({
        mobileNo: req.body.mobileNo,
        password: req.body.password
      });
    }
    return  res.ok({ data :result });
  } catch (error) {
    return res.failureResponse({ data:error.message }); 
  }  
};

/**
 * @description : send email or sms to user with OTP on forgot password
 * @param {obj} req : request for forgotPassword
 * @param {obj} res : response for forgotPassword
 * @return {obj} : response for forgotPassword {status, message, data}
 */
const forgotPassword = async (req, res) => {
  const params = req.body;
  try {
    if (!params.email) {
      return res.insufficientParameters();
    }
    let where = { email: params.email };
    params.email = params.email.toString().toLowerCase();
    let isUser = await dbService.findOne(model.user,where);
    if (isUser) {
      let {
        resultOfEmail,resultOfSMS
      } = await authService.sendResetPasswordNotification(isUser);
      if (resultOfEmail && resultOfSMS){
        return res.requestValidated({ message :'otp successfully send.' });
      } else if (resultOfEmail && !resultOfSMS) {
        return res.requestValidated({ message :'otp successfully send to your email.' });
      } else if (!resultOfEmail && resultOfSMS) { 
        return res.requestValidated({ message : 'otp successfully send to your mobile number.' });
      } else {
        return res.failureResponse({ message :'otp can not be sent due to some issue try again later' });
      }
    } else {
      return res.recordNotFound();
    }
  } catch (error) {
    return res.failureResponse({ data:error.message }); 
  }
};

/**
 * @description : validate OTP
 * @param {obj} req : request for validateResetPasswordOtp
 * @param {obj} res : response for validateResetPasswordOtp
 * @return {obj} : response for validateResetPasswordOtp  {status, message, data}
 */ 
const validateResetPasswordOtp = async (req, res) => {
  const params = req.body;
  try {
    if (!params || !params.otp) {
      return res.insufficientParameters();
    }
    let isUser = await dbService.findOne(model.userAuthSettings, { resetPasswordCode: params.otp });
    if (!isUser || !isUser.resetPasswordCode) {
      return res.invalidRequest({ message :'Invalid OTP' });
    }
    // link expire
    if (dayjs(new Date()).isAfter(dayjs(isUser.expiredTimeOfResetPasswordCode))) {
      return res.invalidRequest({ message :'Your reset password link is expired or invalid' });
    }
    return res.requestValidated({ message : 'Otp verified' });
  } catch (error) {
    return res.failureResponse({ data:error.message }); 
  }
};

/**
 * @description : reset password with code and new password
 * @param {obj} req : request for resetPassword
 * @param {obj} res : response for resetPassword
 * @return {obj} : response for resetPassword {status, message, data}
 */ 
const resetPassword = async (req, res) => {
  const params = req.body;
  try {
    if (!params.code || !params.newPassword) {
      return res.insufficientParameters();
    }
    let userAuth = await dbService.findOne(model.userAuthSettings, { resetPasswordCode: params.code });
    if (userAuth && userAuth.expiredTimeOfResetPasswordCode) {
      if (dayjs(new Date()).isAfter(dayjs(userAuth.expiredTimeOfResetPasswordCode))) {// link expire
        return res.invalidRequest({ message :'Your reset password link is expired or invalid' });
      }
    } else {
      // invalid code
      return res.invalidRequest({ message :'Invalid Code' });
    }
    let response = await authService.resetPassword(userAuth.userId, params.newPassword);
    if (response && !response.flag){
      return res.requestValidated({ message  :response.data });
    }
    return res.invalidRequest({ message :response.data });
  } catch (error) {
    return res.failureResponse({ data:error.message }); 
  }
};

/**
 * @description : login with username and password
 * @param {obj} req : request for login 
 * @param {obj} res : response for login
 * @return {obj} : response for login {status, message, data}
 */
const login = async (req,res)=>{
  try {
    let {
      username,password
    } = req.body;
    let url = req.originalUrl;
    if (username && password){
      let roleAccess = false;
      if (req.body.includeRoleAccess){
        roleAccess = req.body.includeRoleAccess;
      }
      let result = await authService.loginUser(username, password, url, roleAccess);
      if (!result.flag){
        return res.loginSuccess({ data :result.data });
      }
      return res.loginFailed({ message:result.data });
    } else {
      return res.insufficientParameters();
    }
  } catch (error) {
    return res.failureResponse({ data:error.message }); 
  }
};

/**
 * @description : logout user
 * @param {obj} req : request for logout
 * @param {obj} res : response for logout
 * @return {obj} : response for logout {status, message, data}
 */
const logout = async (req, res) => {
  try {
    if (req.user) {
      let userTokens = await dbService.findOne(model.userToken, {
        token: (req.headers.authorization).replace('Bearer ', ''),
        userId:req.user.id 
      });
      userTokens.isTokenExpired = true;
      let id = userTokens.id;
      delete userTokens.id;
      await dbService.updateByPk(model.userToken,id, userTokens.toJSON());
      return res.requestValidated({ message :'Logged Out Successfully' });
    }
    return res.badRequest();
  } catch (error) {
    return res.failureResponse({ data:error.message }); 
  }
};

/**
 * @description : adding PlayerIDs to send push notification
 * @param {obj} req : request for addPlayerId
 * @param {obj} res : response for addPlayerId
 * @return {obj} : response for addPlayerId {status, message, data}
 */
const addPlayerId = async (req, res) => {
  try {
    let params = req.body;
    if (params && params.userId && params.playerId){
      let found = await dbService.findOne(model.pushNotification,{ userId:params.userId });
      if (found){
        await dbService.updateByPk(model.pushNotification,found.id,{ playerId:params.playerId });
      } else {
        let data = { ...req.body };
        await dbService.createOne(model.pushNotification,data);
      }
      return res.successResponse();
    }
    return res.badRequest();
  } catch (error){
    return res.failureResponse({ data:error.message }); 
  }
};

/**
 * @description : removing PlayerIDs to send push notification
 * @param {obj} req : request for removePlayerId
 * @param {obj} res : response for removePlayerId
 * @return {obj} : response for removePlayerId {status, message, data}
 */
const removePlayerId = async (req, res) => {
  try {
    let params = req.body;
    if (params && params.deviceId){
      let found = await dbService.findOne(model.pushNotification,{ deviceId:params.deviceId });
      if (found){
        await dbService.deleteByPk(model.pushNotification,found.id);
      }
      return res.successResponse();
    }
    return res.badRequest();
  } catch (error){
    return res.failureResponse({ data:error.message }); 
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  validateResetPasswordOtp,
  resetPassword,
  logout,
};
