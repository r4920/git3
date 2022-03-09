/**
 * routeRoleRoutes.js
 * @description :: CRUD API routes for routeRole
 */

const express = require('express');
const router = express.Router();
const routeRoleController = require('../../controller/admin/routeRoleController');
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');
router.route('/admin/routerole/create').post(auth(...[ 'createByAdminInAdminPlatform' ]),checkRolePermission,routeRoleController.addRouteRole);
router.route('/admin/routerole/addBulk').post(auth(...[ 'addBulkByAdminInAdminPlatform' ]),checkRolePermission,routeRoleController.bulkInsertRouteRole);
router.route('/admin/routerole/list').post(auth(...[ 'getAllByAdminInAdminPlatform' ]),checkRolePermission,routeRoleController.findAllRouteRole);
router.route('/admin/routerole/count').post(auth(...[ 'getCountByAdminInAdminPlatform' ]),checkRolePermission,routeRoleController.getRouteRoleCount);
router.route('/admin/routerole/updateBulk').put(auth(...[ 'updateBulkByAdminInAdminPlatform' ]),checkRolePermission,routeRoleController.bulkUpdateRouteRole);
router.route('/admin/routerole/softDeleteMany').put(auth(...[ 'softDeleteManyByAdminInAdminPlatform' ]),checkRolePermission,routeRoleController.softDeleteManyRouteRole);
router.route('/admin/routerole/deleteMany').post(auth(...[ 'deleteManyByAdminInAdminPlatform' ]),checkRolePermission,routeRoleController.deleteManyRouteRole);
router.route('/admin/routerole/softDelete/:id').put(auth(...[ 'softDeleteByAdminInAdminPlatform' ]),checkRolePermission,routeRoleController.softDeleteRouteRole);
router.route('/admin/routerole/partial-update/:id').put(auth(...[ 'partialUpdateByAdminInAdminPlatform' ]),checkRolePermission,routeRoleController.partialUpdateRouteRole);
router.route('/admin/routerole/update/:id').put(auth(...[ 'updateByAdminInAdminPlatform' ]),checkRolePermission,routeRoleController.updateRouteRole);    
router.route('/admin/routerole/:id').get(auth(...[ 'getByAdminInAdminPlatform' ]),checkRolePermission,routeRoleController.getRouteRole);
router.route('/admin/routerole/delete/:id').delete(auth(...[ 'deleteByAdminInAdminPlatform' ]),checkRolePermission,routeRoleController.deleteRouteRole);

module.exports = router;
