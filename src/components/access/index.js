/*
 * @Description:
 * @Author: rodchen
 * @Date: 2020-12-14 16:42:16
 * @LastEditTime: 2020-12-16 09:51:11
 * @LastEditors: rodchen
 */
/* eslint-disable import/no-unresolved */
import React from 'react';
import { history, getLocale } from 'umi';
import { ConfigProvider } from 'bssula';

import zhCN from '@/locales/zh-CN/bssula';
import enUS from '@/locales/en-US/bssula';

// 提供 权限 和 国际化 控制 （umi3权限和国际化采用hooks写法，class组件不能直接使用）
export default (Com) => {
  return (props) => {
    return (
      <ConfigProvider history={history} locale={getLocale() === 'zh-CN' ? zhCN : enUS}>
        <Com {...props} />
      </ConfigProvider>
    );
  };
};
