/**
 * projectRouteController.js
 * @description :: exports action methods for projectRoute.
 */

const { Op } = require('sequelize');
const ProjectRoute = require('../../model/projectRoute');
const projectRouteSchemaKey = require('../../utils/validation/projectRouteValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const models = require('../../model');
const deleteDependentService = require('../../utils/deleteDependent');

/**
 * @description : create record of ProjectRoute in SQL table.
 * @param {obj} req : request including body for creating record.
 * @param {obj} res : response of created record.
 * @return {obj} : created ProjectRoute. {status, message, data}
 */ 
const addProjectRoute = async (req, res) => {
  try {
    let validateRequest = validation.validateParamsWithJoi(
      req.body,
      projectRouteSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete req.body['addedBy'];
    delete req.body['updatedBy'];
    const data = ({
      ...req.body,
      addedBy:req.user.id
    });
    let result = await dbService.createOne(ProjectRoute,data);
    return  res.ok({ data :result });
  } catch (error) {
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : create multiple records of ProjectRoute in SQL table.
 * @param {obj} req : request including body for creating records.
 * @param {obj} res : response of created records.
 * @return {obj} : created ProjectRoutes. {status, message, data}
 */
const bulkInsertProjectRoute = async (req, res)=>{
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
      let result = await dbService.createMany(ProjectRoute,data);
      return  res.ok({ data :result });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.failureResponse({ data:error.message }); 
  }
};

/**
 * @description : find all records of ProjectRoute from table based on query and options.
 * @param {obj} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {obj} res : response contains data found from table.
 * @return {obj} : found ProjectRoute(s). {status, message, data}
 */
const findAllProjectRoute = async (req, res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      projectRouteSchemaKey.findFilterKeys,
      ProjectRoute.tableAttributes
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
      result = await dbService.count(ProjectRoute, query);
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
      result = await dbService.findMany( ProjectRoute,query,options);
            
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
 * @description : returns total number of records of ProjectRoute.
 * @param {obj} req : request including where object to apply filters in request body 
 * @param {obj} res : response that returns total number of records.
 * @return {obj} : number of records. {status, message, data}
 */
const getProjectRouteCount = async (req, res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      projectRouteSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message: `${validateRequest.message}` });
    }
    if (req.body.where){
      where = req.body.where;
    }
    let result = await dbService.count(ProjectRoute,where);
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
 * @description : update multiple records of ProjectRoute with data by id.
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated ProjectRoutes.
 * @return {obj} : updated ProjectRoutes. {status, message, data}
 */
const bulkUpdateProjectRoute = async (req, res)=>{
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
            
      let result = await dbService.updateMany(ProjectRoute,filter,data);
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
 * @description : deactivate multiple records of ProjectRoute from table by ids;
 * @param {obj} req : request including array of ids in request body.
 * @param {obj} res : response contains updated records of ProjectRoute.
 * @return {obj} : number of deactivated documents of ProjectRoute. {status, message, data}
 */
const softDeleteManyProjectRoute = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id
      };
      let result = await deleteDependentService.softDeleteProjectRoute(query, updateBody);
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
 * @description : delete records of ProjectRoute in table by using ids.
 * @param {obj} req : request including array of ids in request body.
 * @param {obj} res : response contains no of records deleted.
 * @return {obj} : no of records deleted. {status, message, data}
 */
const deleteManyProjectRoute = async (req, res) => {
  try {
    let data = req.body;
    if (data && data.ids){
      const query = { id:{ [Op.in]:data.ids } };
      let result;
      if (data.isWarning){
        result = await deleteDependentService.countProjectRoute(query);
      }
      else {
        result = await deleteDependentService.deleteProjectRoute(query);
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
 * @description : deactivate record of ProjectRoute from table by id;
 * @param {obj} req : request including id in request params.
 * @param {obj} res : response contains updated record of ProjectRoute.
 * @return {obj} : deactivated ProjectRoute. {status, message, data}
 */
const softDeleteProjectRoute = async (req, res) => {
  try {
    let id = req.params.id;
    let query = { id:id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
        
    let result = await deleteDependentService.softDeleteProjectRoute(query, updateBody);
    if (!result){
      return res.recordNotFound();
    }
    return  res.ok({ data :result });
  } catch (error){
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : partially update record of ProjectRoute with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated ProjectRoute.
 * @return {obj} : updated ProjectRoute. {status, message, data}
 */
const partialUpdateProjectRoute = async (req, res) => {
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
      projectRouteSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let result = await dbService.updateMany(ProjectRoute, query, data);
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
 * @description : update record of ProjectRoute with data by id.
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated ProjectRoute.
 * @return {obj} : updated ProjectRoute. {status, message, data}
 */
const updateProjectRoute = async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.addedBy;
    delete data.updatedBy;
    data.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      data,
      projectRouteSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    let query = { id:req.params.id };
    let result = await dbService.updateMany(ProjectRoute,query,data);
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
 * @description : find record of ProjectRoute from table by id;
 * @param {obj} req : request including id in request params.
 * @param {obj} res : response contains record retrieved from table.
 * @return {obj} : found ProjectRoute. {status, message, data}
 */
const getProjectRoute = async (req, res) => {
  try {
    let query = {};
    const options = {};
    let id = req.params.id;
    let result = await dbService.findByPk(ProjectRoute,id,options);
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
 * @description : delete record of ProjectRoute from table.
 * @param {obj} req : request including id as request param.
 * @param {obj} res : response contains deleted record.
 * @return {obj} : deleted ProjectRoute. {status, message, data}
 */
const deleteProjectRoute = async (req, res) => {
  try {
    let id = req.params.id;
        
    let query = { id:id };
    if (req.body.isWarning) {
      let result = await deleteDependentService.countProjectRoute(query);
      if (result){
        return res.ok({ data :result });
      }
      return res.recordNotFound();
    } else {
      let query = { id:id };
      let result = await deleteDependentService.deleteProjectRoute(query);
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
  addProjectRoute,
  bulkInsertProjectRoute,
  findAllProjectRoute,
  getProjectRouteCount,
  bulkUpdateProjectRoute,
  softDeleteManyProjectRoute,
  deleteManyProjectRoute,
  softDeleteProjectRoute,
  partialUpdateProjectRoute,
  updateProjectRoute,
  getProjectRoute,
  deleteProjectRoute,
};
