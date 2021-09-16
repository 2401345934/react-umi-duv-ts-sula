/*
 * @Author: your name
 * @Date: 2021-08-20 21:12:58
 * @LastEditTime: 2021-09-16 14:37:51
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
    path: '/',
    component: '../layouts/BaseLayout',
    routes: [
      {
        path: '/welcome',
        name: 'welcome',
        icon: 'smile',
        component: './Welcome',
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
