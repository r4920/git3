/**
 * BlogController.js
 * @description :: exports action methods for Blog.
 */

const { Op } = require('sequelize');
const Blog = require('../../../model/Blog');
const BlogSchemaKey = require('../../../utils/validation/BlogValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const models = require('../../../model');

/**
 * @description : create record of Blog in SQL table.
 * @param {obj} req : request including body for creating record.
 * @param {obj} res : response of created record.
 * @return {obj} : created Blog. {status, message, data}
 */ 
const addBlog = async (req, res) => {
  try {
    let validateRequest = validation.validateParamsWithJoi(
      req.body,
      BlogSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete req.body['addedBy'];
    delete req.body['updatedBy'];
    const data = ({
      ...req.body,
      addedBy:req.user.id
    });
    let result = await dbService.createOne(Blog,data);
    return  res.ok({ data :result });
  } catch (error) {
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : find all records of Blog from table based on query and options.
 * @param {obj} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {obj} res : response contains data found from table.
 * @return {obj} : found Blog(s). {status, message, data}
 */
const findAllBlog = async (req, res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      BlogSchemaKey.findFilterKeys,
      Blog.tableAttributes
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
      result = await dbService.count(Blog, query);
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
      result = await dbService.findMany( Blog,query,options);
            
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
 * @description : returns total number of records of Blog.
 * @param {obj} req : request including where object to apply filters in request body 
 * @param {obj} res : response that returns total number of records.
 * @return {obj} : number of records. {status, message, data}
 */
const getBlogCount = async (req, res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      BlogSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message: `${validateRequest.message}` });
    }
    if (req.body.where){
      where = req.body.where;
    }
    let result = await dbService.count(Blog,where);
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
 * @description : deactivate multiple records of Blog from table by ids;
 * @param {obj} req : request including array of ids in request body.
 * @param {obj} res : response contains updated records of Blog.
 * @return {obj} : number of deactivated documents of Blog. {status, message, data}
 */
const softDeleteManyBlog = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      const options = {};
      let result = await dbService.softDeleteMany(Blog,query,updateBody, options);
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
 * @description : create multiple records of Blog in SQL table.
 * @param {obj} req : request including body for creating records.
 * @param {obj} res : response of created records.
 * @return {obj} : created Blogs. {status, message, data}
 */
const bulkInsertBlog = async (req, res)=>{
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
      let result = await dbService.createMany(Blog,data);
      return  res.ok({ data :result });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.failureResponse({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of Blog with data by id.
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Blogs.
 * @return {obj} : updated Blogs. {status, message, data}
 */
const bulkUpdateBlog = async (req, res)=>{
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
            
      let result = await dbService.updateMany(Blog,filter,data);
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
 * @description : delete records of Blog in table by using ids.
 * @param {obj} req : request including array of ids in request body.
 * @param {obj} res : response contains no of records deleted.
 * @return {obj} : no of records deleted. {status, message, data}
 */
const deleteManyBlog = async (req, res) => {
  try {
    let ids = req.body.ids; 
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      let result = await dbService.deleteMany(Blog,query);
      return res.ok({ data :result });
    }
    return res.badRequest(); 
  }
  catch (error){
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : deactivate record of Blog from table by id;
 * @param {obj} req : request including id in request params.
 * @param {obj} res : response contains updated record of Blog.
 * @return {obj} : deactivated Blog. {status, message, data}
 */
const softDeleteBlog = async (req, res) => {
  try {
    let query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    const options = {};
    let result = await dbService.softDeleteMany(Blog, query,updateBody, options);
    if (!result){
      return res.recordNotFound();
    }
    return  res.ok({ data :result });
  } catch (error){
    return res.failureResponse({ data:error.message });  
  }
};

/**
 * @description : partially update record of Blog with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Blog.
 * @return {obj} : updated Blog. {status, message, data}
 */
const partialUpdateBlog = async (req, res) => {
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
      BlogSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let result = await dbService.updateMany(Blog, query, data);
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
 * @description : update record of Blog with data by id.
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Blog.
 * @return {obj} : updated Blog. {status, message, data}
 */
const updateBlog = async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.addedBy;
    delete data.updatedBy;
    data.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      data,
      BlogSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    let query = { id:req.params.id };
    let result = await dbService.updateMany(Blog,query,data);
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
 * @description : find record of Blog from table by id;
 * @param {obj} req : request including id in request params.
 * @param {obj} res : response contains record retrieved from table.
 * @return {obj} : found Blog. {status, message, data}
 */
const getBlog = async (req, res) => {
  try {
    let query = {};
    const options = {};
    let id = req.params.id;
    let result = await dbService.findByPk(Blog,id,options);
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
 * @description : delete record of Blog from table.
 * @param {obj} req : request including id as request param.
 * @param {obj} res : response contains deleted record.
 * @return {obj} : deleted Blog. {status, message, data}
 */
const deleteBlog = async (req, res) => {
  try {
    const result = await dbService.deleteByPk(Blog, req.params.id);
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
  addBlog,
  findAllBlog,
  getBlogCount,
  softDeleteManyBlog,
  bulkInsertBlog,
  bulkUpdateBlog,
  deleteManyBlog,
  softDeleteBlog,
  partialUpdateBlog,
  updateBlog,
  getBlog,
  deleteBlog,
};
