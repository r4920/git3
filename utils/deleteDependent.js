/**
 * deleteDependent.js
 * @description :: exports deleteDependent service for project.
 */

let Blog = require('../model/Blog');
let User = require('../model/user');
let UserAuthSettings = require('../model/userAuthSettings');
let UserToken = require('../model/userToken');
let Role = require('../model/role');
let ProjectRoute = require('../model/projectRoute');
let RouteRole = require('../model/routeRole');
let UserRole = require('../model/userRole');
let dbService = require('.//dbService');
const { Op } = require('sequelize');

const deleteBlog = async (filter) =>{
  try {
    return await Blog.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUser = async (filter) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (user && user.length){
      user = user.map((obj) => obj.id);
      const BlogFilter4443 = { 'updatedBy': { [Op.in]: user } };
      const Blog3065 = await deleteBlog(BlogFilter4443);
      const BlogFilter5938 = { 'addedBy': { [Op.in]: user } };
      const Blog4909 = await deleteBlog(BlogFilter5938);
      const userFilter7289 = { 'addedBy': { [Op.in]: user } };
      const user9875 = await deleteUser(userFilter7289);
      const userFilter0735 = { 'updatedBy': { [Op.in]: user } };
      const user2008 = await deleteUser(userFilter0735);
      const userAuthSettingsFilter7516 = { 'userId': { [Op.in]: user } };
      const userAuthSettings0538 = await deleteUserAuthSettings(userAuthSettingsFilter7516);
      const userAuthSettingsFilter2281 = { 'addedBy': { [Op.in]: user } };
      const userAuthSettings4724 = await deleteUserAuthSettings(userAuthSettingsFilter2281);
      const userAuthSettingsFilter1238 = { 'updatedBy': { [Op.in]: user } };
      const userAuthSettings5712 = await deleteUserAuthSettings(userAuthSettingsFilter1238);
      const userTokenFilter3711 = { 'userId': { [Op.in]: user } };
      const userToken8668 = await deleteUserToken(userTokenFilter3711);
      const userTokenFilter9774 = { 'addedBy': { [Op.in]: user } };
      const userToken6926 = await deleteUserToken(userTokenFilter9774);
      const userTokenFilter5469 = { 'updatedBy': { [Op.in]: user } };
      const userToken7123 = await deleteUserToken(userTokenFilter5469);
      const userRoleFilter4428 = { 'userId': { [Op.in]: user } };
      const userRole8342 = await deleteUserRole(userRoleFilter4428);
      return await User.destroy({ where :filter });
    } else {
      return 'No user found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserAuthSettings = async (filter) =>{
  try {
    return await UserAuthSettings.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserToken = async (filter) =>{
  try {
    return await UserToken.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRole = async (filter) =>{
  try {
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (role && role.length){
      role = role.map((obj) => obj.id);
      const routeRoleFilter2177 = { 'roleId': { [Op.in]: role } };
      const routeRole5133 = await deleteRouteRole(routeRoleFilter2177);
      const userRoleFilter6824 = { 'roleId': { [Op.in]: role } };
      const userRole4539 = await deleteUserRole(userRoleFilter6824);
      return await Role.destroy({ where :filter });
    } else {
      return 'No role found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteProjectRoute = async (filter) =>{
  try {
    let projectroute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);
      const routeRoleFilter2311 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole0117 = await deleteRouteRole(routeRoleFilter2311);
      return await ProjectRoute.destroy({ where :filter });
    } else {
      return 'No projectRoute found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRouteRole = async (filter) =>{
  try {
    return await RouteRole.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserRole = async (filter) =>{
  try {
    return await UserRole.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const countBlog = async (filter) =>{
  try {
    const BlogCnt =  await Blog.count(filter);
    return { Blog : BlogCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUser = async (filter) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (user && user.length){
      user = user.map((obj) => obj.id);

      const BlogFilter = { [Op.or]: [{                    updatedBy : { [Op.in] : user } },{                    addedBy : { [Op.in] : user } }] };
      const BlogCnt =  await dbService.count(Blog,BlogFilter);

      const userFilter = { [Op.or]: [{                    addedBy : { [Op.in] : user } },{                    updatedBy : { [Op.in] : user } }] };
      const userCnt =  await dbService.count(User,userFilter);

      const userAuthSettingsFilter = { [Op.or]: [{                    userId : { [Op.in] : user } },{                    addedBy : { [Op.in] : user } },{                    updatedBy : { [Op.in] : user } }] };
      const userAuthSettingsCnt =  await dbService.count(UserAuthSettings,userAuthSettingsFilter);

      const userTokenFilter = { [Op.or]: [{                    userId : { [Op.in] : user } },{                    addedBy : { [Op.in] : user } },{                    updatedBy : { [Op.in] : user } }] };
      const userTokenCnt =  await dbService.count(UserToken,userTokenFilter);

      const userRoleFilter = { [Op.or]: [{                    userId : { [Op.in] : user } }] };
      const userRoleCnt =  await dbService.count(UserRole,userRoleFilter);

      let response = {
        Blog : BlogCnt,
        user : userCnt,
        userAuthSettings : userAuthSettingsCnt,
        userToken : userTokenCnt,
        userRole : userRoleCnt,
      };
      return response; 
    } else {
      return {  user : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserAuthSettings = async (filter) =>{
  try {
    const userAuthSettingsCnt =  await UserAuthSettings.count(filter);
    return { userAuthSettings : userAuthSettingsCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserToken = async (filter) =>{
  try {
    const userTokenCnt =  await UserToken.count(filter);
    return { userToken : userTokenCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countRole = async (filter) =>{
  try {
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (role && role.length){
      role = role.map((obj) => obj.id);

      const routeRoleFilter = { [Op.or]: [{                    roleId : { [Op.in] : role } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      const userRoleFilter = { [Op.or]: [{                    roleId : { [Op.in] : role } }] };
      const userRoleCnt =  await dbService.count(UserRole,userRoleFilter);

      let response = {
        routeRole : routeRoleCnt,
        userRole : userRoleCnt,
      };
      return response; 
    } else {
      return {  role : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countProjectRoute = async (filter) =>{
  try {
    let projectroute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);

      const routeRoleFilter = { [Op.or]: [{                    routeId : { [Op.in] : projectroute } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      let response = { routeRole : routeRoleCnt, };
      return response; 
    } else {
      return {  projectroute : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countRouteRole = async (filter) =>{
  try {
    const routeRoleCnt =  await RouteRole.count(filter);
    return { routeRole : routeRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserRole = async (filter) =>{
  try {
    const userRoleCnt =  await UserRole.count(filter);
    return { userRole : userRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteBlog = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Blog.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUser = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (user && user.length){
      user = user.map((obj) => obj.id);
      const BlogFilter9289 = { 'updatedBy': { [Op.in]: user } };
      const Blog1781 = await softDeleteBlog(BlogFilter9289,updateBody);
      const BlogFilter2974 = { 'addedBy': { [Op.in]: user } };
      const Blog7307 = await softDeleteBlog(BlogFilter2974,updateBody);
      const userFilter3508 = { 'addedBy': { [Op.in]: user } };
      const user7791 = await softDeleteUser(userFilter3508,updateBody);
      const userFilter7685 = { 'updatedBy': { [Op.in]: user } };
      const user7897 = await softDeleteUser(userFilter7685,updateBody);
      const userAuthSettingsFilter0678 = { 'userId': { [Op.in]: user } };
      const userAuthSettings0343 = await softDeleteUserAuthSettings(userAuthSettingsFilter0678,updateBody);
      const userAuthSettingsFilter1652 = { 'addedBy': { [Op.in]: user } };
      const userAuthSettings0866 = await softDeleteUserAuthSettings(userAuthSettingsFilter1652,updateBody);
      const userAuthSettingsFilter5458 = { 'updatedBy': { [Op.in]: user } };
      const userAuthSettings5659 = await softDeleteUserAuthSettings(userAuthSettingsFilter5458,updateBody);
      const userTokenFilter6171 = { 'userId': { [Op.in]: user } };
      const userToken2699 = await softDeleteUserToken(userTokenFilter6171,updateBody);
      const userTokenFilter0221 = { 'addedBy': { [Op.in]: user } };
      const userToken5928 = await softDeleteUserToken(userTokenFilter0221,updateBody);
      const userTokenFilter5139 = { 'updatedBy': { [Op.in]: user } };
      const userToken1361 = await softDeleteUserToken(userTokenFilter5139,updateBody);
      const userRoleFilter4880 = { 'userId': { [Op.in]: user } };
      const userRole1015 = await softDeleteUserRole(userRoleFilter4880,updateBody);
      return await User.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No user found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserAuthSettings = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await UserAuthSettings.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserToken = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await UserToken.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRole = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (role && role.length){
      role = role.map((obj) => obj.id);
      const routeRoleFilter3393 = { 'roleId': { [Op.in]: role } };
      const routeRole0815 = await softDeleteRouteRole(routeRoleFilter3393,updateBody);
      const userRoleFilter6308 = { 'roleId': { [Op.in]: role } };
      const userRole9040 = await softDeleteUserRole(userRoleFilter6308,updateBody);
      return await Role.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No role found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteProjectRoute = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let projectroute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);
      const routeRoleFilter2669 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole6892 = await softDeleteRouteRole(routeRoleFilter2669,updateBody);
      return await ProjectRoute.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No projectRoute found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRouteRole = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await RouteRole.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserRole = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await UserRole.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

module.exports = {
  deleteBlog,
  deleteUser,
  deleteUserAuthSettings,
  deleteUserToken,
  deleteRole,
  deleteProjectRoute,
  deleteRouteRole,
  deleteUserRole,
  countBlog,
  countUser,
  countUserAuthSettings,
  countUserToken,
  countRole,
  countProjectRoute,
  countRouteRole,
  countUserRole,
  softDeleteBlog,
  softDeleteUser,
  softDeleteUserAuthSettings,
  softDeleteUserToken,
  softDeleteRole,
  softDeleteProjectRoute,
  softDeleteRouteRole,
  softDeleteUserRole,
};
