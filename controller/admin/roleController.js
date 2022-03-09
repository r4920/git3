/**
 * roleController.js
 * @description :: exports action methods for role.
 */

const { Op } = require('sequelize');
const Role = require('../../model/role');
const roleSchemaKey = require('../../utils/validation/roleValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const models = require('../../model');
const deleteDependentService = require('../../utils/deleteDependent');

/**
 * @description : create record of Role in SQL table.
 * @param {obj} req : request including body for creating record.
 * @param {obj} res : response of created record.
 * @return {obj} : created Role. {status, message, data}
 */ 
const addRole = async (req, res) => {
  try {
    let validateRequest = validation.validateParamsWithJoi(
      req.body,
      roleSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete req.body['addedBy'];
    delete req.body['updatedBy'];
    const data = ({
      ...req.body,
      addedBy:req.user.id
    });
    let result = await dbService.createOne(Role,data);
    return  res.ok({ data :result });
  } catch (error) {
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : create multiple records of Role in SQL table.
 * @param {obj} req : request including body for creating records.
 * @param {obj} res : response of created records.
 * @return {obj} : created Roles. {status, message, data}
 */
const bulkInsertRole = async (req, res)=>{
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
      let result = await dbService.createMany(Role,data);
      return  res.ok({ data :result });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.failureResponse({ data:error.message }); 
  }
};

/**
 * @description : find all records of Role from table based on query and options.
 * @param {obj} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {obj} res : response contains data found from table.
 * @return {obj} : found Role(s). {status, message, data}
 */
const findAllRole = async (req, res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      roleSchemaKey.findFilterKeys,
      Role.tableAttributes
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
      result = await dbService.count(Role, query);
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
      result = await dbService.findMany( Role,query,options);
            
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
 * @description : returns total number of records of Role.
 * @param {obj} req : request including where object to apply filters in request body 
 * @param {obj} res : response that returns total number of records.
 * @return {obj} : number of records. {status, message, data}
 */
const getRoleCount = async (req, res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      roleSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message: `${validateRequest.message}` });
    }
    if (req.body.where){
      where = req.body.where;
    }
    let result = await dbService.count(Role,where);
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
 * @description : update multiple records of Role with data by id.
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Roles.
 * @return {obj} : updated Roles. {status, message, data}
 */
const bulkUpdateRole = async (req, res)=>{
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
            
      let result = await dbService.updateMany(Role,filter,data);
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
 * @description : deactivate multiple records of Role from table by ids;
 * @param {obj} req : request including array of ids in request body.
 * @param {obj} res : response contains updated records of Role.
 * @return {obj} : number of deactivated documents of Role. {status, message, data}
 */
const softDeleteManyRole = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id
      };
      let result = await deleteDependentService.softDeleteRole(query, updateBody);
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
 * @description : delete records of Role in table by using ids.
 * @param {obj} req : request including array of ids in request body.
 * @param {obj} res : response contains no of records deleted.
 * @return {obj} : no of records deleted. {status, message, data}
 */
const deleteManyRole = async (req, res) => {
  try {
    let data = req.body;
    if (data && data.ids){
      const query = { id:{ [Op.in]:data.ids } };
      let result;
      if (data.isWarning){
        result = await deleteDependentService.countRole(query);
      }
      else {
        result = await deleteDependentService.deleteRole(query);
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
 * @description : deactivate record of Role from table by id;
 * @param {obj} req : request including id in request params.
 * @param {obj} res : response contains updated record of Role.
 * @return {obj} : deactivated Role. {status, message, data}
 */
const softDeleteRole = async (req, res) => {
  try {
    let id = req.params.id;
    let query = { id:id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
        
    let result = await deleteDependentService.softDeleteRole(query, updateBody);
    if (!result){
      return res.recordNotFound();
    }
    return  res.ok({ data :result });
  } catch (error){
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : partially update record of Role with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Role.
 * @return {obj} : updated Role. {status, message, data}
 */
const partialUpdateRole = async (req, res) => {
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
      roleSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let result = await dbService.updateMany(Role, query, data);
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
 * @description : update record of Role with data by id.
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Role.
 * @return {obj} : updated Role. {status, message, data}
 */
const updateRole = async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.addedBy;
    delete data.updatedBy;
    data.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      data,
      roleSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    let query = { id:req.params.id };
    let result = await dbService.updateMany(Role,query,data);
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
 * @description : find record of Role from table by id;
 * @param {obj} req : request including id in request params.
 * @param {obj} res : response contains record retrieved from table.
 * @return {obj} : found Role. {status, message, data}
 */
const getRole = async (req, res) => {
  try {
    let query = {};
    const options = {};
    let id = req.params.id;
    let result = await dbService.findByPk(Role,id,options);
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
 * @description : delete record of Role from table.
 * @param {obj} req : request including id as request param.
 * @param {obj} res : response contains deleted record.
 * @return {obj} : deleted Role. {status, message, data}
 */
const deleteRole = async (req, res) => {
  try {
    let id = req.params.id;
        
    let query = { id:id };
    if (req.body.isWarning) {
      let result = await deleteDependentService.countRole(query);
      if (result){
        return res.ok({ data :result });
      }
      return res.recordNotFound();
    } else {
      let query = { id:id };
      let result = await deleteDependentService.deleteRole(query);
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

module.exports = {
  addRole,
  bulkInsertRole,
  findAllRole,
  getRoleCount,
  bulkUpdateRole,
  softDeleteManyRole,
  deleteManyRole,
  softDeleteRole,
  partialUpdateRole,
  updateRole,
  getRole,
  deleteRole,
};
