/**
 * authConstant.js
 * @description :: constants used in authentication
 */

const JWT = {
  DEVICE_SECRET:'myjwtdevicesecret',
  ADMIN_SECRET:'myjwtadminsecret',
  EXPIRES_IN: 10000
};

const USER_TYPES = {
  User:1,
  Admin:2,
};

const PLATFORM = {
  DEVICE:1,
  ADMIN:2,
};

let LOGIN_ACCESS = {
  [USER_TYPES.User]:[PLATFORM.DEVICE],        
  [USER_TYPES.Admin]:[PLATFORM.ADMIN],        
};

const ROLE_RIGHTS = {
    
  [USER_TYPES.User] : [
    'getAllByUserInDevicePlatform',
    'getByUserInDevicePlatform',
    'getCountByUserInDevicePlatform',
    'createByUserInDevicePlatform',
    'addBulkByUserInDevicePlatform',
    'updateByUserInDevicePlatform',
    'updateBulkByUserInDevicePlatform',
    'partialUpdateByUserInDevicePlatform',
    'deleteByUserInDevicePlatform',
    'softDeleteByUserInDevicePlatform',
    'upsertByUserInDevicePlatform',
    'fileUploadByUserInDevicePlatform',
    'logoutByUserInDevicePlatform',
    'softDeleteManyByUserInDevicePlatform',
    'deleteManyByUserInDevicePlatform',
    'changePasswordByUserInDevicePlatform',
    'updateProfileByUserInDevicePlatform',
    'getLoggedInUserInfoByUserInDevicePlatform'
  ],
    
  [USER_TYPES.Admin] : [
    'getAllByAdminInAdminPlatform',
    'getByAdminInAdminPlatform',
    'getCountByAdminInAdminPlatform',
    'createByAdminInAdminPlatform',
    'addBulkByAdminInAdminPlatform',
    'updateByAdminInAdminPlatform',
    'updateBulkByAdminInAdminPlatform',
    'partialUpdateByAdminInAdminPlatform',
    'deleteByAdminInAdminPlatform',
    'softDeleteByAdminInAdminPlatform',
    'upsertByAdminInAdminPlatform',
    'fileUploadByAdminInAdminPlatform',
    'logoutByAdminInAdminPlatform',
    'softDeleteManyByAdminInAdminPlatform',
    'deleteManyByAdminInAdminPlatform',
    'changePasswordByAdminInAdminPlatform',
    'updateProfileByAdminInAdminPlatform',
    'getLoggedInUserInfoByAdminInAdminPlatform'
  ],
    
};
const MAX_LOGIN_RETRY_LIMIT = 3;
const LOGIN_REACTIVE_TIME = 20;   

const FORGOT_PASSWORD_WITH = {
  LINK: {
    email: true,
    sms: false
  },
  EXPIRETIME: 20
};

module.exports = {
  JWT,
  USER_TYPES,
  ROLE_RIGHTS,
  PLATFORM,
  MAX_LOGIN_RETRY_LIMIT,
  LOGIN_REACTIVE_TIME,
  FORGOT_PASSWORD_WITH,
  LOGIN_ACCESS,
    
};