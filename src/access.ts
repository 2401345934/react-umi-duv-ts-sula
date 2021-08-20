/*
 * @Description:
 * @Author: rodchen
 * @Date: 2021-06-27 15:58:26
 * @LastEditTime: 2021-08-20 21:19:49
 * @LastEditors: Please set LastEditors
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
