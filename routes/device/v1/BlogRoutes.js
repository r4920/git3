/**
 * BlogRoutes.js
 * @description :: CRUD API routes for Blog
 */

const express = require('express');
const router = express.Router();
const BlogController = require('../../../controller/device/v1/BlogController');
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');
router.route('/device/api/v1/blog/create').post(auth(...[ 'createByUserInDevicePlatform' ]),checkRolePermission,BlogController.addBlog);
router.route('/device/api/v1/blog/list').post(auth(...[ 'getAllByUserInDevicePlatform' ]),checkRolePermission,BlogController.findAllBlog);
router.route('/device/api/v1/blog/count').post(auth(...[ 'getCountByUserInDevicePlatform' ]),checkRolePermission,BlogController.getBlogCount);
router.route('/device/api/v1/blog/softDeleteMany').put(auth(...[ 'softDeleteManyByUserInDevicePlatform' ]),checkRolePermission,BlogController.softDeleteManyBlog);
router.route('/device/api/v1/blog/addBulk').post(auth(...[ 'addBulkByUserInDevicePlatform' ]),checkRolePermission,BlogController.bulkInsertBlog);
router.route('/device/api/v1/blog/updateBulk').put(auth(...[ 'updateBulkByUserInDevicePlatform' ]),checkRolePermission,BlogController.bulkUpdateBlog);
router.route('/device/api/v1/blog/deleteMany').post(auth(...[ 'deleteManyByUserInDevicePlatform' ]),checkRolePermission,BlogController.deleteManyBlog);
router.route('/device/api/v1/blog/softDelete/:id').put(auth(...[ 'softDeleteByUserInDevicePlatform' ]),checkRolePermission,BlogController.softDeleteBlog);
router.route('/device/api/v1/blog/partial-update/:id').put(auth(...[ 'partialUpdateByUserInDevicePlatform' ]),checkRolePermission,BlogController.partialUpdateBlog);
router.route('/device/api/v1/blog/update/:id').put(auth(...[ 'updateByUserInDevicePlatform' ]),checkRolePermission,BlogController.updateBlog);    
router.route('/device/api/v1/blog/:id').get(auth(...[ 'getByUserInDevicePlatform' ]),checkRolePermission,BlogController.getBlog);
router.route('/device/api/v1/blog/delete/:id').delete(auth(...[ 'deleteByUserInDevicePlatform' ]),checkRolePermission,BlogController.deleteBlog);

module.exports = router;
