/**
 * userController.js
 * @description :: exports action methods for user.
 */

const { Op } = require('sequelize');
const User = require('../../../model/user');
const userSchemaKey = require('../../../utils/validation/userValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const auth = require('../../../services/auth');
const models = require('../../../model');
const deleteDependentService = require('../../../utils/deleteDependent');

/**
 * @description : create record of User in SQL table.
 * @param {obj} req : request including body for creating record.
 * @param {obj} res : response of created record.
 * @return {obj} : created User. {status, message, data}
 */ 
const addUser = async (req, res) => {
  try {
    let validateRequest = validation.validateParamsWithJoi(
      req.body,
      userSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete req.body['addedBy'];
    delete req.body['updatedBy'];
    const data = ({
      ...req.body,
      addedBy:req.user.id
    });
    let result = await dbService.createOne(User,data);
    return  res.ok({ data :result });
  } catch (error) {
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : find all records of User from table based on query and options.
 * @param {obj} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {obj} res : response contains data found from table.
 * @return {obj} : found User(s). {status, message, data}
 */
const findAllUser = async (req, res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      userSchemaKey.findFilterKeys,
      User.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message: `${validateRequest.message}` });
    }
    let result;
    if (req.body.query !== undefined) {
      query = { ...req.body.query };
    }
    query = dbService.queryBuilderParser(query);
    if (req.user){
      query = {
        ...query,
        id: { [Op.ne]: req.user.id } 
      };
      if (req.body && req.body.query && req.body.query.id) {
        Object.assign(query.id, { [Op.in]: [req.body.query.id] });
      }
    } else {
      return res.badRequest();
    }
    if (req.body && req.body.isCountOnly){
      result = await dbService.count(User, query);
      if (result) {
        result = { totalRecords: result };
        return res.ok({ data :result });
      } 
      return res.recordNotFound();
    }
    else {
      if (req.body && req.body.options !== undefined) {
        options = { ...req.body.options };
      }
      if (options && options.select && options.select.length){
        options.attributes = options.select;
      }
      if (options && options.include && options.include.length){
        let include = [];
        options.include.forEach(i => {
          i.model = models[i.model];
          if (i.query) {
            i.where = dbService.queryBuilderParser(i.query);
          }
          include.push(i);
        });
        options.include = include;
      }
      if (options && options.sort){
        options.order = dbService.sortParser(options.sort);
        delete options.sort;
      }
      result = await dbService.findMany( User,query,options);
            
      if (!result){
        return res.recordNotFound();
      }
      return res.ok({ data:result });   
    }
  }
  catch (error){
    return res.failureResponse({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of User.
 * @param {obj} req : request including where object to apply filters in request body 
 * @param {obj} res : response that returns total number of records.
 * @return {obj} : number of records. {status, message, data}
 */
const getUserCount = async (req, res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      userSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message: `${validateRequest.message}` });
    }
    if (req.body.where){
      where = req.body.where;
    }
    let result = await dbService.count(User,where);
    if (result){
      result = { totalRecords:result };
      return res.ok({ data :result });
    }
    return res.recordNotFound();
  }
  catch (error){
    return res.failureResponse({ data:error.message }); 
  }
};

/**
 * @description : deactivate multiple records of User from table by ids;
 * @param {obj} req : request including array of ids in request body.
 * @param {obj} res : response contains updated records of User.
 * @return {obj} : number of deactivated documents of User. {status, message, data}
 */
const softDeleteManyUser = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      let query = {};
      if (req.user){
        query = {
          'id': {
            [Op.in]: ids,
            [Op.ne]: req.user.id
          }
        };
      } else {
        return res.badRequest();
      }
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id
      };
      let result = await deleteDependentService.softDeleteUser(query, updateBody);
      if (!result) {
        return res.recordNotFound();
      }
      return  res.ok({ data :result });
    }
    return res.badRequest();
  } catch (error){
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : create multiple records of User in SQL table.
 * @param {obj} req : request including body for creating records.
 * @param {obj} res : response of created records.
 * @return {obj} : created Users. {status, message, data}
 */
const bulkInsertUser = async (req, res)=>{
  try {
    let data;   
    if (req.body.data !== undefined && req.body.data.length){
      data = req.body.data;
      data = data.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item = {
          ...{ addedBy : req.user.id },
          ...item
        };
        return item;
      });        
      let result = await dbService.createMany(User,data);
      return  res.ok({ data :result });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.failureResponse({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of User with data by id.
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Users.
 * @return {obj} : updated Users. {status, message, data}
 */
const bulkUpdateUser = async (req, res)=>{
  try {
    let filter = {};
    let data;
    if (req.body.filter !== undefined){
      filter = req.body.filter;
    }
    if (req.body.data !== undefined){
      data = { 
        ...req.body.data,
        updatedBy:req.user.id
      };
            
      let result = await dbService.updateMany(User,filter,data);
      if (!result){
        return res.recordNotFound();
      }

      return  res.ok({ data :result });
    }
    else {
      return res.failureResponse();
    }
  }
  catch (error){
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : delete records of User in table by using ids.
 * @param {obj} req : request including array of ids in request body.
 * @param {obj} res : response contains no of records deleted.
 * @return {obj} : no of records deleted. {status, message, data}
 */
const deleteManyUser = async (req, res) => {
  try {
    let data = req.body;
    if (data && data.ids){
      let query = {};
      if (req.user){
        query = {
          'id': {
            [Op.in]: data.ids,
            [Op.ne]: req.user.id
          }
        };
      } else {
        return res.badRequest();
      }
      let result;
      if (data.isWarning){
        result = await deleteDependentService.countUser(query);
      }
      else {
        result = await deleteDependentService.deleteUser(query);
      }
      return res.ok({ data :result });
    }
    return res.badRequest(); 
  }
  catch (error){
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : deactivate record of User from table by id;
 * @param {obj} req : request including id in request params.
 * @param {obj} res : response contains updated record of User.
 * @return {obj} : deactivated User. {status, message, data}
 */
const softDeleteUser = async (req, res) => {
  try {
    let id = req.params.id;
    let query = {};
    if (req.user){
      query = {
        'id': {
          [Op.eq]: id,
          [Op.ne]: req.user.id
        }
      };
    } else {
      return res.badRequest();
    }
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
        
    let result = await deleteDependentService.softDeleteUser(query, updateBody);
    if (!result){
      return res.recordNotFound();
    }
    return  res.ok({ data :result });
  } catch (error){
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : partially update record of User with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated User.
 * @return {obj} : updated User. {status, message, data}
 */
const partialUpdateUser = async (req, res) => {
  try {
    const data = {
      ...req.body,
      id: req.params.id
    };
    delete data.addedBy;
    delete data.updatedBy;
    data.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      data,
      userSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    let query = {};
    if (req.user){
      query = {
        'id': {
          [Op.eq]: req.params.id,
          [Op.ne]: req.user.id
        }
      };
    } else {
      return res.badRequest();
    } 
    let result = await dbService.updateMany(User, query, data);
    if (!result) {
      return res.recordNotFound();
    }
        
    return res.ok({ data :result });
        
  }
  catch (error){
    return res.failureResponse();
  }
};

/**
 * @description : update record of User with data by id.
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated User.
 * @return {obj} : updated User. {status, message, data}
 */
const updateUser = async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.addedBy;
    delete data.updatedBy;
    data.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      data,
      userSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    let query = {};
    if (req.user){
      query = {
        'id': {
          [Op.eq]: req.params.id,
          [Op.ne]: req.user.id
        }
      };
    } else {
      return res.badRequest();
    }
    let result = await dbService.updateMany(User,query,data);
    if (!result){
      return res.recordNotFound();
    }

    return  res.ok({ data :result });
  }
  catch (error){
    return res.failureResponse({ data:error.message }); 
  }
};

/**
 * @description : find record of User from table by id;
 * @param {obj} req : request including id in request params.
 * @param {obj} res : response contains record retrieved from table.
 * @return {obj} : found User. {status, message, data}
 */
const getUser = async (req, res) => {
  try {
    let query = {};
    const options = {};
    let id = req.params.id;
    let result = await dbService.findByPk(User,id,options);
    if (result){
      return  res.ok({ data :result });
            
    }
    return res.recordNotFound();
  }
  catch (error){
    return res.failureResponse();
  }
};

/**
 * @description : delete record of User from table.
 * @param {obj} req : request including id as request param.
 * @param {obj} res : response contains deleted record.
 * @return {obj} : deleted User. {status, message, data}
 */
const deleteUser = async (req, res) => {
  try {
    let id = req.params.id;
        
    let query = {};
    if (req.user){
      query = {
        'id': {
          [Op.eq]: id,
          [Op.ne]: req.user.id
        }
      };
    } 
    else {
      return res.badRequest();
    } 
    if (req.body.isWarning) {
      let result = await deleteDependentService.countUser(query);
      if (result){
        return res.ok({ data :result });
      }
      return res.recordNotFound();
    } else {
      let query = {};
      if (req.user){
        query = {
          'id': {
            [Op.eq]: id,
            [Op.ne]: req.user.id
          }
        };
      } 
      else {
        return res.badRequest();
      } 
      let result = await deleteDependentService.deleteUser(query);
      if (!result){
        return res.failureResponse({ data:error.message }); 
      }
      return  res.ok({ data :result });    
    }
  }
  catch (error){
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : change password
 * @param {obj} req : request including user credentials.
 * @param {obj} res : response contains updated user record.
 * @return {obj} : updated user record {status, message, data}
 */
const changePassword = async (req, res) => {
  try {
    let params = req.body;
    if (!params.newPassword || !req.user.id || !params.oldPassword) {
      return res.inValidParam();
    }
    let result = await auth.changePassword({
      ...params,
      userId:req.user.id
    });
    if (result.flag){
      return res.invalidRequest({ message :result.data });
    }
    return res.requestValidated({ message :result.data });
  } catch (error) {
    return res.failureResponse({ data:error.message }); 
  }
};
/**
 * @description : update user profile.
 * @param {obj} req : request including user profile details to update in request body.
 * @param {obj} res : updated user record.
 * @return {obj} : updated user record. {status, message, data}
 */
const updateProfile = async (req, res) => {
  try {
    const data = {
      ...req.body,
      id:req.user.id
    };
    let validateRequest = validation.validateParamsWithJoi(
      data,
      userSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    if (data.password) delete data.password;
    if (data.createdAt) delete data.createdAt;
    if (data.updatedAt) delete data.updatedAt;
    if (data.id) delete data.id;
    let result = await dbService.updateByPk(User, req.user.id ,data);
    if (!result){
      return res.recordNotFound();
    }            
    return  res.ok({ data :result });
  }
  catch (error){
    return res.failureResponse({ data:error.message }); 
  }
};

/**
 * @description : get information of logged-in User.
 * @param {obj} req : authentication token is required
 * @param {obj} res : Logged-in user information
 * @return {obj} : Logged-in user information {status, message, data}
 */
const getLoggedInUserInfo = async (req, res) => {
  try {
    if (!req.user && !req.user.id) {
      return res.unAuthorizedRequest();
    }
    const query = {
      id: req.user.id,
      isDeleted: false
    };
    query.isActive = true;
    let result = await dbService.findOne(User,query);
    if (!result) {
      return res.recordNotFound();
    }
    return res.ok({ data: result });
  } catch (error){
    return res.failureResponse({ data: error.message });
  }
};

module.exports = {
  addUser,
  findAllUser,
  getUserCount,
  softDeleteManyUser,
  bulkInsertUser,
  bulkUpdateUser,
  deleteManyUser,
  softDeleteUser,
  partialUpdateUser,
  updateUser,
  getUser,
  deleteUser,
  changePassword,
  updateProfile,
  getLoggedInUserInfo,
};
