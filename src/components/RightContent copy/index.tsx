/*
 * @Description:
 * @Author: rodchen
 * @Date: 2021-05-06 16:30:43
 * @LastEditTime: 2021-08-13 20:37:40
 * @LastEditors: Please set LastEditors
 */
import { Space } from 'antd';
import React from 'react';
import { useModel } from 'umi';
import logoPng from '@/assets/ui/icon/logo.png';
import topLeftIcon from '@/assets/ui/icon/top_bg.png';
import topRightIcon from '@/assets/ui/icon/top_right.png';

import TopTop from './TopTip';
import Avatar from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC<{}> = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <>
      <TopTop />
      <img style={{ position: 'absolute' }} src={topLeftIcon} />
      <img style={{ position: 'absolute', right: 0 }} src={topRightIcon} />
      <div className="headr_logo">
        <img src={logoPng} /> <span>|</span> 公共部分工作台
        {/* <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            卖家工作台 <CaretDownOutlined />
            </a>
          </Dropdown> */}
      </div>
      <Space className={className}>
        <Avatar />
      </Space>
    </>
  );
};
export default GlobalHeaderRight;
