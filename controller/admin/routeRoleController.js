/**
 * routeRoleController.js
 * @description :: exports action methods for routeRole.
 */

const { Op } = require('sequelize');
const RouteRole = require('../../model/routeRole');
const routeRoleSchemaKey = require('../../utils/validation/routeRoleValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const models = require('../../model');

/**
 * @description : create record of RouteRole in SQL table.
 * @param {obj} req : request including body for creating record.
 * @param {obj} res : response of created record.
 * @return {obj} : created RouteRole. {status, message, data}
 */ 
const addRouteRole = async (req, res) => {
  try {
    let validateRequest = validation.validateParamsWithJoi(
      req.body,
      routeRoleSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete req.body['addedBy'];
    delete req.body['updatedBy'];
    const data = ({
      ...req.body,
      addedBy:req.user.id
    });
    let result = await dbService.createOne(RouteRole,data);
    return  res.ok({ data :result });
  } catch (error) {
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : create multiple records of RouteRole in SQL table.
 * @param {obj} req : request including body for creating records.
 * @param {obj} res : response of created records.
 * @return {obj} : created RouteRoles. {status, message, data}
 */
const bulkInsertRouteRole = async (req, res)=>{
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
      let result = await dbService.createMany(RouteRole,data);
      return  res.ok({ data :result });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.failureResponse({ data:error.message }); 
  }
};

/**
 * @description : find all records of RouteRole from table based on query and options.
 * @param {obj} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {obj} res : response contains data found from table.
 * @return {obj} : found RouteRole(s). {status, message, data}
 */
const findAllRouteRole = async (req, res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      routeRoleSchemaKey.findFilterKeys,
      RouteRole.tableAttributes
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
      result = await dbService.count(RouteRole, query);
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
      result = await dbService.findMany( RouteRole,query,options);
            
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
 * @description : returns total number of records of RouteRole.
 * @param {obj} req : request including where object to apply filters in request body 
 * @param {obj} res : response that returns total number of records.
 * @return {obj} : number of records. {status, message, data}
 */
const getRouteRoleCount = async (req, res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      routeRoleSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message: `${validateRequest.message}` });
    }
    if (req.body.where){
      where = req.body.where;
    }
    let result = await dbService.count(RouteRole,where);
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
 * @description : update multiple records of RouteRole with data by id.
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated RouteRoles.
 * @return {obj} : updated RouteRoles. {status, message, data}
 */
const bulkUpdateRouteRole = async (req, res)=>{
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
            
      let result = await dbService.updateMany(RouteRole,filter,data);
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
 * @description : deactivate multiple records of RouteRole from table by ids;
 * @param {obj} req : request including array of ids in request body.
 * @param {obj} res : response contains updated records of RouteRole.
 * @return {obj} : number of deactivated documents of RouteRole. {status, message, data}
 */
const softDeleteManyRouteRole = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      const options = {};
      let result = await dbService.softDeleteMany(RouteRole,query,updateBody, options);
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
 * @description : delete records of RouteRole in table by using ids.
 * @param {obj} req : request including array of ids in request body.
 * @param {obj} res : response contains no of records deleted.
 * @return {obj} : no of records deleted. {status, message, data}
 */
const deleteManyRouteRole = async (req, res) => {
  try {
    let ids = req.body.ids; 
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      let result = await dbService.deleteMany(RouteRole,query);
      return res.ok({ data :result });
    }
    return res.badRequest(); 
  }
  catch (error){
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : deactivate record of RouteRole from table by id;
 * @param {obj} req : request including id in request params.
 * @param {obj} res : response contains updated record of RouteRole.
 * @return {obj} : deactivated RouteRole. {status, message, data}
 */
const softDeleteRouteRole = async (req, res) => {
  try {
    let query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    const options = {};
    let result = await dbService.softDeleteMany(RouteRole, query,updateBody, options);
    if (!result){
      return res.recordNotFound();
    }
    return  res.ok({ data :result });
  } catch (error){
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : partially update record of RouteRole with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated RouteRole.
 * @return {obj} : updated RouteRole. {status, message, data}
 */
const partialUpdateRouteRole = async (req, res) => {
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
      routeRoleSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let result = await dbService.updateMany(RouteRole, query, data);
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
 * @description : update record of RouteRole with data by id.
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated RouteRole.
 * @return {obj} : updated RouteRole. {status, message, data}
 */
const updateRouteRole = async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.addedBy;
    delete data.updatedBy;
    data.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      data,
      routeRoleSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    let query = { id:req.params.id };
    let result = await dbService.updateMany(RouteRole,query,data);
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
 * @description : find record of RouteRole from table by id;
 * @param {obj} req : request including id in request params.
 * @param {obj} res : response contains record retrieved from table.
 * @return {obj} : found RouteRole. {status, message, data}
 */
const getRouteRole = async (req, res) => {
  try {
    let query = {};
    const options = {};
    let id = req.params.id;
    let result = await dbService.findByPk(RouteRole,id,options);
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
 * @description : delete record of RouteRole from table.
 * @param {obj} req : request including id as request param.
 * @param {obj} res : response contains deleted record.
 * @return {obj} : deleted RouteRole. {status, message, data}
 */
const deleteRouteRole = async (req, res) => {
  try {
    const result = await dbService.deleteByPk(RouteRole, req.params.id);
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
  addRouteRole,
  bulkInsertRouteRole,
  findAllRouteRole,
  getRouteRoleCount,
  bulkUpdateRouteRole,
  softDeleteManyRouteRole,
  deleteManyRouteRole,
  softDeleteRouteRole,
  partialUpdateRouteRole,
  updateRouteRole,
  getRouteRole,
  deleteRouteRole,
};
