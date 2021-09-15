/*
 * @Description:
 * @Author: rodchen
 * @Date: 2021-06-27 15:58:26
 * @LastEditTime: 2021-09-15 17:22:09
 * @LastEditors: Please set LastEditors
 */
import React from 'react';
import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string | React.ReactNode;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#0095DA',
  layout: 'side',
  contentWidth: 'Fluid',
  // 一级是菜单放到最上面
  splitMenus: false,
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: '',
  pwa: false,
  logo: false,
  menu: {
    locale: true,
  },
  iconfontUrl: '',
};

export default Settings;
