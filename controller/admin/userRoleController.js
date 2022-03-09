/**
 * userRoleController.js
 * @description :: exports action methods for userRole.
 */

const { Op } = require('sequelize');
const UserRole = require('../../model/userRole');
const userRoleSchemaKey = require('../../utils/validation/userRoleValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const models = require('../../model');

/**
 * @description : create record of UserRole in SQL table.
 * @param {obj} req : request including body for creating record.
 * @param {obj} res : response of created record.
 * @return {obj} : created UserRole. {status, message, data}
 */ 
const addUserRole = async (req, res) => {
  try {
    let validateRequest = validation.validateParamsWithJoi(
      req.body,
      userRoleSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete req.body['addedBy'];
    delete req.body['updatedBy'];
    const data = ({
      ...req.body,
      addedBy:req.user.id
    });
    let result = await dbService.createOne(UserRole,data);
    return  res.ok({ data :result });
  } catch (error) {
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : create multiple records of UserRole in SQL table.
 * @param {obj} req : request including body for creating records.
 * @param {obj} res : response of created records.
 * @return {obj} : created UserRoles. {status, message, data}
 */
const bulkInsertUserRole = async (req, res)=>{
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
      let result = await dbService.createMany(UserRole,data);
      return  res.ok({ data :result });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.failureResponse({ data:error.message }); 
  }
};

/**
 * @description : find all records of UserRole from table based on query and options.
 * @param {obj} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {obj} res : response contains data found from table.
 * @return {obj} : found UserRole(s). {status, message, data}
 */
const findAllUserRole = async (req, res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      userRoleSchemaKey.findFilterKeys,
      UserRole.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message: `${validateRequest.message}` });
    }
    let result;
    if (req.body.query !== undefined) {
      query = { ...req.body.query };
    }
    query = dbService.queryBuilderParser(query);
    if (req.body && req.body.isCountOnly){
      result = await dbService.count(UserRole, query);
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
      result = await dbService.findMany( UserRole,query,options);
            
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
 * @description : returns total number of records of UserRole.
 * @param {obj} req : request including where object to apply filters in request body 
 * @param {obj} res : response that returns total number of records.
 * @return {obj} : number of records. {status, message, data}
 */
const getUserRoleCount = async (req, res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      userRoleSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message: `${validateRequest.message}` });
    }
    if (req.body.where){
      where = req.body.where;
    }
    let result = await dbService.count(UserRole,where);
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
 * @description : update multiple records of UserRole with data by id.
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated UserRoles.
 * @return {obj} : updated UserRoles. {status, message, data}
 */
const bulkUpdateUserRole = async (req, res)=>{
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
            
      let result = await dbService.updateMany(UserRole,filter,data);
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
 * @description : deactivate multiple records of UserRole from table by ids;
 * @param {obj} req : request including array of ids in request body.
 * @param {obj} res : response contains updated records of UserRole.
 * @return {obj} : number of deactivated documents of UserRole. {status, message, data}
 */
const softDeleteManyUserRole = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      const options = {};
      let result = await dbService.softDeleteMany(UserRole,query,updateBody, options);
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
 * @description : delete records of UserRole in table by using ids.
 * @param {obj} req : request including array of ids in request body.
 * @param {obj} res : response contains no of records deleted.
 * @return {obj} : no of records deleted. {status, message, data}
 */
const deleteManyUserRole = async (req, res) => {
  try {
    let ids = req.body.ids; 
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      let result = await dbService.deleteMany(UserRole,query);
      return res.ok({ data :result });
    }
    return res.badRequest(); 
  }
  catch (error){
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : deactivate record of UserRole from table by id;
 * @param {obj} req : request including id in request params.
 * @param {obj} res : response contains updated record of UserRole.
 * @return {obj} : deactivated UserRole. {status, message, data}
 */
const softDeleteUserRole = async (req, res) => {
  try {
    let query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    const options = {};
    let result = await dbService.softDeleteMany(UserRole, query,updateBody, options);
    if (!result){
      return res.recordNotFound();
    }
    return  res.ok({ data :result });
  } catch (error){
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : partially update record of UserRole with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated UserRole.
 * @return {obj} : updated UserRole. {status, message, data}
 */
const partialUpdateUserRole = async (req, res) => {
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
      userRoleSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let result = await dbService.updateMany(UserRole, query, data);
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
 * @description : update record of UserRole with data by id.
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated UserRole.
 * @return {obj} : updated UserRole. {status, message, data}
 */
const updateUserRole = async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.addedBy;
    delete data.updatedBy;
    data.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      data,
      userRoleSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    let query = { id:req.params.id };
    let result = await dbService.updateMany(UserRole,query,data);
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
 * @description : find record of UserRole from table by id;
 * @param {obj} req : request including id in request params.
 * @param {obj} res : response contains record retrieved from table.
 * @return {obj} : found UserRole. {status, message, data}
 */
const getUserRole = async (req, res) => {
  try {
    let query = {};
    const options = {};
    let id = req.params.id;
    let result = await dbService.findByPk(UserRole,id,options);
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
 * @description : delete record of UserRole from table.
 * @param {obj} req : request including id as request param.
 * @param {obj} res : response contains deleted record.
 * @return {obj} : deleted UserRole. {status, message, data}
 */
const deleteUserRole = async (req, res) => {
  try {
    const result = await dbService.deleteByPk(UserRole, req.params.id);
    if (result){
      return  res.ok({ data :result });
    }
    return res.recordNotFound();
  }
  catch (error){
    return res.failureResponse({ data:error.message }); 
  }
};

module.exports = {
  addUserRole,
  bulkInsertUserRole,
  findAllUserRole,
  getUserRoleCount,
  bulkUpdateUserRole,
  softDeleteManyUserRole,
  deleteManyUserRole,
  softDeleteUserRole,
  partialUpdateUserRole,
  updateUserRole,
  getUserRole,
  deleteUserRole,
};
