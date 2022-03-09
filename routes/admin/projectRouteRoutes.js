/**
 * projectRouteRoutes.js
 * @description :: CRUD API routes for projectRoute
 */

const express = require('express');
const router = express.Router();
const projectRouteController = require('../../controller/admin/projectRouteController');
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');
router.route('/admin/projectroute/create').post(auth(...[ 'createByAdminInAdminPlatform' ]),checkRolePermission,projectRouteController.addProjectRoute);
router.route('/admin/projectroute/addBulk').post(auth(...[ 'addBulkByAdminInAdminPlatform' ]),checkRolePermission,projectRouteController.bulkInsertProjectRoute);
router.route('/admin/projectroute/list').post(auth(...[ 'getAllByAdminInAdminPlatform' ]),checkRolePermission,projectRouteController.findAllProjectRoute);
router.route('/admin/projectroute/count').post(auth(...[ 'getCountByAdminInAdminPlatform' ]),checkRolePermission,projectRouteController.getProjectRouteCount);
router.route('/admin/projectroute/updateBulk').put(auth(...[ 'updateBulkByAdminInAdminPlatform' ]),checkRolePermission,projectRouteController.bulkUpdateProjectRoute);
router.route('/admin/projectroute/softDeleteMany').put(auth(...[ 'softDeleteManyByAdminInAdminPlatform' ]),checkRolePermission,projectRouteController.softDeleteManyProjectRoute);
router.route('/admin/projectroute/deleteMany').post(auth(...[ 'deleteManyByAdminInAdminPlatform' ]),checkRolePermission,projectRouteController.deleteManyProjectRoute);
router.route('/admin/projectroute/softDelete/:id').put(auth(...[ 'softDeleteByAdminInAdminPlatform' ]),checkRolePermission,projectRouteController.softDeleteProjectRoute);
router.route('/admin/projectroute/partial-update/:id').put(auth(...[ 'partialUpdateByAdminInAdminPlatform' ]),checkRolePermission,projectRouteController.partialUpdateProjectRoute);
router.route('/admin/projectroute/update/:id').put(auth(...[ 'updateByAdminInAdminPlatform' ]),checkRolePermission,projectRouteController.updateProjectRoute);    
router.route('/admin/projectroute/:id').get(auth(...[ 'getByAdminInAdminPlatform' ]),checkRolePermission,projectRouteController.getProjectRoute);
router.route('/admin/projectroute/delete/:id').delete(auth(...[ 'deleteByAdminInAdminPlatform' ]),checkRolePermission,projectRouteController.deleteProjectRoute);

module.exports = router;
