/*
 * @Author: your name
 * @Date: 2021-08-20 21:12:58
 * @LastEditTime: 2021-09-15 18:04:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-umi-duv-ts-sula\config\routes.ts
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
    ],
  },
  {
    component: '../layouts/BaseLayout',
    path: '/',
    routes: [
      {
        path: '/welcome',
        name: 'welcome',
        icon: 'smile',
        component: './Welcome',
      },
      {
        path: '/admin',
        name: 'admin',
        icon: 'crown',
        access: 'canAdmin',
        component: './Admin',
        routes: [
          {
            path: '/admin/sub-page',
            name: 'sub-page',
            icon: 'smile',
            component: './Welcome',
          },
          {
            component: './404',
          },
        ],
      },
      {
        name: 'list.table-list',
        icon: 'table',
        path: '/list',
        component: './TableList',
      },
    ],
  },
  {
    component: './404',
  },
];
