// @ts-ignore
/*
 * @Description: 全局model，useAuth的全局model文件
 * @Author: rodchen
 * @Date: 2020-12-07 09:57:35
 * @LastEditTime: 2021-09-15 22:34:09
 * @LastEditors: Please set LastEditors
 */

import { useState, useCallback } from 'react';

export default () => {
  const [userInfo, setUserInfo]: any = useState({
    age: '18',
  });
  const updateUserInfo: any = useCallback((params: any, callBack: any) => {
    let tmpInfo: any = {};
    setUserInfo((c: any) => {
      tmpInfo = {
        ...c,
        ...params,
      };
      return {
        ...c,
        ...params,
      };
    });
    if (callBack) {
      callBack(tmpInfo);
    }
  }, []);
  return { userInfo, updateUserInfo };
};
