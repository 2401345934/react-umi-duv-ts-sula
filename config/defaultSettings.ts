/*
 * @Description:
 * @Author: rodchen
 * @Date: 2021-06-27 15:58:26
 * @LastEditTime: 2021-08-26 02:20:51
 * @LastEditors: Please set LastEditors
 */
import React from 'react';
import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string | React.ReactNode;
} = {
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#0095DA',
  layout: 'mix',
  contentWidth: 'Fluid',
  splitMenus: false,
  fixedHeader: false,
  fixSiderbar: false,
  colorWeak: false,
  title: '',
  pwa: false,
  logo: false,
  iconfontUrl: '',
};

export default Settings;
