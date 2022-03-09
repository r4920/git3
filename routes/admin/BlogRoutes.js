/**
 * BlogRoutes.js
 * @description :: CRUD API routes for Blog
 */

const express = require('express');
const router = express.Router();
const BlogController = require('../../controller/admin/BlogController');
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');
router.route('/admin/blog/create').post(auth(...[ 'createByAdminInAdminPlatform' ]),checkRolePermission,BlogController.addBlog);
router.route('/admin/blog/list').post(auth(...[ 'getAllByAdminInAdminPlatform' ]),checkRolePermission,BlogController.findAllBlog);
router.route('/admin/blog/count').post(auth(...[ 'getCountByAdminInAdminPlatform' ]),checkRolePermission,BlogController.getBlogCount);
router.route('/admin/blog/softDeleteMany').put(auth(...[ 'softDeleteManyByAdminInAdminPlatform' ]),checkRolePermission,BlogController.softDeleteManyBlog);
router.route('/admin/blog/addBulk').post(auth(...[ 'addBulkByAdminInAdminPlatform' ]),checkRolePermission,BlogController.bulkInsertBlog);
router.route('/admin/blog/updateBulk').put(auth(...[ 'updateBulkByAdminInAdminPlatform' ]),checkRolePermission,BlogController.bulkUpdateBlog);
router.route('/admin/blog/deleteMany').post(auth(...[ 'deleteManyByAdminInAdminPlatform' ]),checkRolePermission,BlogController.deleteManyBlog);
router.route('/admin/blog/softDelete/:id').put(auth(...[ 'softDeleteByAdminInAdminPlatform' ]),checkRolePermission,BlogController.softDeleteBlog);
router.route('/admin/blog/partial-update/:id').put(auth(...[ 'partialUpdateByAdminInAdminPlatform' ]),checkRolePermission,BlogController.partialUpdateBlog);
router.route('/admin/blog/update/:id').put(auth(...[ 'updateByAdminInAdminPlatform' ]),checkRolePermission,BlogController.updateBlog);    
router.route('/admin/blog/:id').get(auth(...[ 'getByAdminInAdminPlatform' ]),checkRolePermission,BlogController.getBlog);
router.route('/admin/blog/delete/:id').delete(auth(...[ 'deleteByAdminInAdminPlatform' ]),checkRolePermission,BlogController.deleteBlog);

module.exports = router;
