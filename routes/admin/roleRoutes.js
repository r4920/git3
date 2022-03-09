/**
 * roleRoutes.js
 * @description :: CRUD API routes for role
 */

const express = require('express');
const router = express.Router();
const roleController = require('../../controller/admin/roleController');
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');
router.route('/admin/role/create').post(auth(...[ 'createByAdminInAdminPlatform' ]),checkRolePermission,roleController.addRole);
router.route('/admin/role/addBulk').post(auth(...[ 'addBulkByAdminInAdminPlatform' ]),checkRolePermission,roleController.bulkInsertRole);
router.route('/admin/role/list').post(auth(...[ 'getAllByAdminInAdminPlatform' ]),checkRolePermission,roleController.findAllRole);
router.route('/admin/role/count').post(auth(...[ 'getCountByAdminInAdminPlatform' ]),checkRolePermission,roleController.getRoleCount);
router.route('/admin/role/updateBulk').put(auth(...[ 'updateBulkByAdminInAdminPlatform' ]),checkRolePermission,roleController.bulkUpdateRole);
router.route('/admin/role/softDeleteMany').put(auth(...[ 'softDeleteManyByAdminInAdminPlatform' ]),checkRolePermission,roleController.softDeleteManyRole);
router.route('/admin/role/deleteMany').post(auth(...[ 'deleteManyByAdminInAdminPlatform' ]),checkRolePermission,roleController.deleteManyRole);
router.route('/admin/role/softDelete/:id').put(auth(...[ 'softDeleteByAdminInAdminPlatform' ]),checkRolePermission,roleController.softDeleteRole);
router.route('/admin/role/partial-update/:id').put(auth(...[ 'partialUpdateByAdminInAdminPlatform' ]),checkRolePermission,roleController.partialUpdateRole);
router.route('/admin/role/update/:id').put(auth(...[ 'updateByAdminInAdminPlatform' ]),checkRolePermission,roleController.updateRole);    
router.route('/admin/role/:id').get(auth(...[ 'getByAdminInAdminPlatform' ]),checkRolePermission,roleController.getRole);
router.route('/admin/role/delete/:id').delete(auth(...[ 'deleteByAdminInAdminPlatform' ]),checkRolePermission,roleController.deleteRole);

module.exports = router;
