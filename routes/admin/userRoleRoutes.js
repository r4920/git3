/**
 * userRoleRoutes.js
 * @description :: CRUD API routes for userRole
 */

const express = require('express');
const router = express.Router();
const userRoleController = require('../../controller/admin/userRoleController');
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');
router.route('/admin/userrole/create').post(auth(...[ 'createByAdminInAdminPlatform' ]),checkRolePermission,userRoleController.addUserRole);
router.route('/admin/userrole/addBulk').post(auth(...[ 'addBulkByAdminInAdminPlatform' ]),checkRolePermission,userRoleController.bulkInsertUserRole);
router.route('/admin/userrole/list').post(auth(...[ 'getAllByAdminInAdminPlatform' ]),checkRolePermission,userRoleController.findAllUserRole);
router.route('/admin/userrole/count').post(auth(...[ 'getCountByAdminInAdminPlatform' ]),checkRolePermission,userRoleController.getUserRoleCount);
router.route('/admin/userrole/updateBulk').put(auth(...[ 'updateBulkByAdminInAdminPlatform' ]),checkRolePermission,userRoleController.bulkUpdateUserRole);
router.route('/admin/userrole/softDeleteMany').put(auth(...[ 'softDeleteManyByAdminInAdminPlatform' ]),checkRolePermission,userRoleController.softDeleteManyUserRole);
router.route('/admin/userrole/deleteMany').post(auth(...[ 'deleteManyByAdminInAdminPlatform' ]),checkRolePermission,userRoleController.deleteManyUserRole);
router.route('/admin/userrole/softDelete/:id').put(auth(...[ 'softDeleteByAdminInAdminPlatform' ]),checkRolePermission,userRoleController.softDeleteUserRole);
router.route('/admin/userrole/partial-update/:id').put(auth(...[ 'partialUpdateByAdminInAdminPlatform' ]),checkRolePermission,userRoleController.partialUpdateUserRole);
router.route('/admin/userrole/update/:id').put(auth(...[ 'updateByAdminInAdminPlatform' ]),checkRolePermission,userRoleController.updateUserRole);    
router.route('/admin/userrole/:id').get(auth(...[ 'getByAdminInAdminPlatform' ]),checkRolePermission,userRoleController.getUserRole);
router.route('/admin/userrole/delete/:id').delete(auth(...[ 'deleteByAdminInAdminPlatform' ]),checkRolePermission,userRoleController.deleteUserRole);

module.exports = router;
