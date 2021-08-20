/*
 * @Description:
 * @Author: rodchen
 * @Date: 2021-06-27 15:58:26
 * @LastEditTime: 2021-08-15 17:06:08
 * @LastEditors: Please set LastEditors
 */
import { queryUserMenuAuth } from '@/services/user';
import { history } from '@@/core/history';

/**
 * 处理请求头
 * @param options 原请求信息
 *
 */
export function handleRequestHeader(options?: any) {
  const resposne = JSON.parse(localStorage.getItem('userInfo') || '{}');
  // tenantId后端已处理 不需要前端传
  const sessionId = localStorage.getItem('sessionId');

  const handleOptions = {
    ...options,
    headers: {
      ...options?.headers,
      // appId: 1,
      'sso-sessionid': resposne?.sessionId || sessionId || '',
      'x-account-id': resposne?.id || -1,
      'x-employee-id': resposne?.employeeResVo?.id || 2,
      'x-app-id': 10010,
    },
  };
  return handleOptions;
}

// 获取权限信息
export const fetchUserMenuAuth = async () => {
  // try {
  //   const resposne = JSON.parse(localStorage.getItem('userInfo') || '{}');
  //   const orgViewNodeId = resposne?.orgViewNodeResVo?.id;
  //   let menuAuthParams = {};
  //   if (orgViewNodeId) {
  //     menuAuthParams = {
  //       'qp-orgViewNodeId-in': orgViewNodeId,
  //     };
  //   }
  //   const muenAuth = await queryUserMenuAuth(menuAuthParams);
  //   // @ts-ignore
  //   const handleAuthData = muenAuth?.data || [];
  //   // 菜单权限
  //   const handleMuenAuth =
  //     (handleAuthData &&
  //       handleAuthData.length &&
  //       handleAuthData.filter((i: any) => i.type === 20)) ||
  //     [];
  //   // 存储按钮权限   type 10应用  20菜单 30按钮
  //   const handleButtonAuth =
  //     (handleAuthData &&
  //       handleAuthData.length &&
  //       handleAuthData.filter((i: any) => i.type === 30)) ||
  //     [];
  //   localStorage.setItem('buttonAuth', JSON.stringify(handleButtonAuth));
  //   return handleMuenAuth;
  // } catch (error) {
  //   history.push('/user/login');
  // }
  return [];
};
