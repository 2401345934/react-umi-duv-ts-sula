/* eslint-disable consistent-return */
/*
 * @Author: your name
 * @Date: 2021-07-05 09:32:51
 * @LastEditTime: 2021-07-15 22:04:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \operation-platform-front\src\plugins\request.js
 */
import { request } from 'bssula';
import { handleRequestHeader } from '@/utils/requestUtils';
import { notification } from 'antd';
import { history } from '@@/core/history';

request.use({
  // 执行顺序在发出请求前
  // 是所有请求发出前的钩子中最后执行的。
  bizRequestAdapter(requestConfig) {
    const handleOptions = handleRequestHeader(requestConfig);
    return handleOptions;
  },
  // 网络错误/404/服务器错误等信息提示转换
  errorMessageAdapter: (error) => {
    const errorMessage = error?.response?.data?.message;
    const errorStatus = error?.request?.status;
    // Object.keys(error).forEach((ites) => {
    //   console.log(ites, error[ites])
    // })
    return {
      message: errorMessage,
      code: 200,
      success: errorStatus,
    };
  },
  // errorMessageAdapter: 转换后的数据会传入 bizErrorMessageAdapter
  // 用户级错误信息转换
  bizErrorMessageAdapter(response) {
    const { msg, code, message, status } = response;
    if (response && response.success === 401) {
      notification.open({
        message: '提示：登陆已失效',
        description: '系统将在6秒之后退出登陆,您也可以手动点右上角关闭提示并退出。',
        duration: 6,
        onClose: async () => {
          localStorage.removeItem('userInfo');
          localStorage.removeItem('buttonAuth');
          // if (window.location.pathname !== '/user/login') {
          //   history.replace({
          //     pathname: '/user/login',
          //   });
          // }
        },
      });
    }
    if (status !== '0' && code !== '000000') {
      return msg || message;
    }
  },
  bizSuccessMessageAdapter(response, successMessage) {
    const { success, code, message, status } = response;
    // 禁止显示
    if (successMessage === false) {
      return null;
    }

    if (success !== false) {
      // 默认使用后端返回
      if (successMessage === true) {
        return message;
        // @ts-ignore
      }
      if (status === '0' || code === '000000') {
        return successMessage;
      }
    }

    return null;
  },
});
