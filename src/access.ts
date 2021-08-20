/*
 * @Author: your name
 * @Date: 2021-08-19 22:37:41
 * @LastEditTime: 2021-08-19 22:49:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \xiaominghui\react-umi-duv-ts-sula\src\access.ts
 */
export default function access(initialState: { userMenuAuth?: API.AuthMenuData[] }) {
  // const { userMenuAuth } = initialState || {};
  console.log(initialState, 'authauthauthauthauth');
  return {
    canAdmin: (route: API.Route) => route,
    // canAdmin: (route: API.Route) => canAdmin(route, userMenuAuth),
  };
}

// function canAdmin(route: API.Route, userMenuAuth?: API.AuthMenuData[]) {
//   return !!userMenuAuth?.filter((item: API.Route) => item.code === route.code).length;
// }
