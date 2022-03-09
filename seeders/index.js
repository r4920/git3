/**
 * seeder.js
 * @description :: functions that seeds mock data to run the application
 */
const _ = require('lodash');
const model = require('../model');
const dbService = require('../utils/dbService');
const authConstant = require('../constants/authConstant');
const { replaceAll } = require('../utils/common');
const { Op } = require('sequelize');

/* seeds default users */
async function seedUser () {
  try {
    let user = await dbService.findOne(model.user,{
      'username':'Ahmad_Gaylord',
      'isDeleted':false,
      'isActive':true
    });
    if (!user || !user.isPasswordMatch('hF4ZsVZbyWxK_YD') ) {
      let user = {
        'password':'hF4ZsVZbyWxK_YD',
        'username':'Ahmad_Gaylord',
        'userType':authConstant.USER_TYPES.User
      };
      await dbService.createOne(model.user,user);
    }
    let admin = await dbService.findOne(model.user,{
      'username':'Elmira_McLaughlin',
      'isDeleted':false,
      'isActive':true
    });
    if (!admin || !admin.isPasswordMatch('puDhfF9_GdxW8lI') ) {
      let admin = {
        'password':'puDhfF9_GdxW8lI',
        'username':'Elmira_McLaughlin',
        'userType':authConstant.USER_TYPES.Admin
      };
      await dbService.createOne(model.user,admin);
    }
    console.info('User model seeded 🍺');
  } catch (error){
    console.log('User seeder failed.');
  }
}
/* seeds roles */
async function seedRole () {
  try {
    const roles = [ 'User', 'Admin', 'System_User' ];
    for (let i = 0; i < roles.length; i++) {
      let result = await dbService.findOne(model.role,{
        name: roles[i],
        code: roles[i].toUpperCase() 
      });
      if (!result) {
        await dbService.createOne( model.role,{
          name: roles[i],
          code: roles[i].toUpperCase(),
          weight: 1
        });
      }
    };
    console.info('Role model seeded 🍺');
  } catch (error){
    console.log('Role seeder failed.');
  }
}

/* seeds routes of project */
async function seedProjectRoutes (routes) {
  try {
    if (routes && routes.length) {
      for (let i = 0; i < routes.length; i++) {
        const routeMethods = routes[i].methods;
        for (let j = 0; j < routeMethods.length; j++) {
          const routeObj = {
            uri: routes[i].path.toLowerCase(),
            method: routeMethods[j],
            route_name: `${replaceAll((routes[i].path).toLowerCase().substring(1), '/', '_')}`
          };
          if (routeObj.route_name){
            let result = await dbService.findOne(model.projectRoute,routeObj);
            if (!result) {
              await dbService.createOne(model.projectRoute,routeObj);
            }
          }
        }
      }
      console.info('ProjectRoute model seeded 🍺');
    }
  } catch (error){
    console.log('ProjectRoute seeder failed.');
  }
}

/* seeds role for routes */
async function seedRouteRole () {
  try {
    const routeRoles = [ 
      {
        route: '/admin/user/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/user/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/user/create',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/user/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/user/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/user/addbulk',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/user/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/user/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/user/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/user/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/admin/user/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/user/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/user/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/user/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/user/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/user/update/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/user/update/:id',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/user/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/user/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/user/updatebulk',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/updatebulk',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/user/updatebulk',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/softdelete/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/softdelete/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/user/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/user/softdeletemany',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/softdeletemany',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/user/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/user/delete/:id',
        role: 'User',
        method: 'DELETE' 
      },
      {
        route: '/admin/user/delete/:id',
        role: 'Admin',
        method: 'DELETE' 
      },
      {
        route: '/admin/user/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/user/deletemany',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/user/deletemany',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/user/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/blog/create',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/blog/addbulk',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/blog/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/blog/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/blog/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/blog/update/:id',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/blog/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/blog/updatebulk',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/blog/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/blog/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/blog/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/blog/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/userauthsettings/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/userauthsettings/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/userauthsettings/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/userauthsettings/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/admin/userauthsettings/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/userauthsettings/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userauthsettings/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userauthsettings/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userauthsettings/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userauthsettings/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userauthsettings/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/userauthsettings/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertoken/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertoken/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertoken/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/usertoken/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/usertoken/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertoken/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertoken/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertoken/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertoken/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertoken/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertoken/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/usertoken/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/role/create',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/role/addbulk',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/role/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/role/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/role/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/role/update/:id',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/role/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/role/updatebulk',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/role/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/role/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/role/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/role/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/admin/projectroute/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/projectroute/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/routerole/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/routerole/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/routerole/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/routerole/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/routerole/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/routerole/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/routerole/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/userrole/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/userrole/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/userrole/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/userrole/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/userrole/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/userrole/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/userrole/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/user/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/user/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/user/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/user/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/user/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/user/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/user/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/user/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/user/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/user/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/user/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/user/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/user/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/user/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/user/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/user/update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/updatebulk',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/delete/:id',
        role: 'User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/user/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/user/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/user/deletemany',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/user/deletemany',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/user/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/blog/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/blog/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/blog/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/blog/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/blog/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/blog/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/blog/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/blog/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/blog/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/blog/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/blog/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/blog/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userauthsettings/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userauthsettings/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userauthsettings/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userauthsettings/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/userauthsettings/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userauthsettings/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userauthsettings/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userauthsettings/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userauthsettings/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userauthsettings/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userauthsettings/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/userauthsettings/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertoken/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertoken/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertoken/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertoken/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/usertoken/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertoken/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertoken/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertoken/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertoken/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertoken/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertoken/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/usertoken/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/role/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/role/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/role/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/role/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/role/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/role/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/role/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/role/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/role/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/role/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/role/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/role/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/projectroute/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/projectroute/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/projectroute/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/projectroute/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/projectroute/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/projectroute/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/projectroute/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/projectroute/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/projectroute/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/projectroute/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/projectroute/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/projectroute/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/routerole/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/routerole/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/routerole/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/routerole/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/routerole/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/routerole/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/routerole/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/routerole/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/routerole/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/routerole/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/routerole/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/routerole/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userrole/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userrole/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userrole/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userrole/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/device/api/v1/userrole/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userrole/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userrole/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userrole/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userrole/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userrole/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userrole/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/userrole/deletemany',
        role: 'System_User',
        method: 'POST'
      },

    ];
    if (routeRoles && routeRoles.length) {
      for (let i = 0; i < routeRoles.length; i++) {
        let route = await dbService.findOne(model.projectRoute,{
          uri: routeRoles[i].route.toLowerCase(),
          method: routeRoles[i].method,
          isActive: true,
          isDeleted: false 
        }, { attributes: ['id'] });
        let role = await dbService.findOne(model.role,{
          code: (routeRoles[i].role).toUpperCase(),
          isActive: true,
          isDeleted: false 
        }, { attributes: ['id'] });
        if (route && route.id && role && role.id) {
          let routeRoleObj = await dbService.findOne(model.routeRole,{
            roleId: role.id,
            routeId: route.id
          });
          if (!routeRoleObj) {
            await dbService.createOne(model.routeRole,{
              roleId: role.id,
              routeId: route.id
            });
          }
        }
      };
      console.info('RouteRole model seeded 🍺');
    }
  } catch (error){
    console.log('RouteRole seeder failed.');
  }
}

/* seeds roles for users */
async function seedUserRole (){
  try {
    let user = await dbService.findOne(model.user,{
      'username':'Ahmad_Gaylord',
      'isDeleted':false,
      'isActive':true
    });
    let userRole = await dbService.findOne(model.role,{
      code: 'SYSTEM_USER',
      isActive: true,
      isDeleted: false
    }, { attributes: ['id'] });
    if (user && user.isPasswordMatch('hF4ZsVZbyWxK_YD') && userRole){
      let count = await dbService.count(model.userRole, {
        userId: user.id,
        roleId: userRole.id
      });
      if (count == 0) {
        await dbService.createOne(model.userRole, {
          userId: user.id,
          roleId: userRole.id
        });
        console.info('user seeded 🍺');
      }
    }
    let admin = await dbService.findOne(model.user,{
      'username':'Elmira_McLaughlin',
      'isDeleted':false,
      'isActive':true
    });
    let adminRole = await dbService.findOne(model.role,{
      code: 'SYSTEM_USER',
      isActive: true,
      isDeleted: false
    }, { attributes: ['id'] });
    if (admin && admin.isPasswordMatch('puDhfF9_GdxW8lI') && adminRole){
      let count = await dbService.count(model.userRole, {
        userId: admin.id,
        roleId: adminRole.id
      });
      if (count == 0) {
        await dbService.createOne(model.userRole, {
          userId: admin.id,
          roleId: adminRole.id
        });
        console.info('admin seeded 🍺');
      }
    }
  } catch (error){
    console.log('UserRole seeder failed.');
  }
}

/* calls of functions to seed mock data into multiple collections */
async function seedData (allRegisterRoutes){
  await seedUser();
  await seedRole();
  await seedProjectRoutes(allRegisterRoutes);
  await seedRouteRole();
  await seedUserRole();
};
module.exports = seedData;