// @ts-nocheck

import React, { useCallback, useState } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Avatar, Menu, message, Spin } from 'antd';
import { history, useModel } from 'umi';
import { outLogin } from '@/services/login';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface GlobalHeaderRightProps {
  menu?: boolean;
}

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async (callback: any) => {
  const resposne = await JSON.parse(localStorage.getItem('userInfo') || '{}');
  const sessionId = resposne?.sessionId || '';
  await outLogin({ sessionId: sessionId });
  const { query, pathname } = history.location;
  // @ts-ignore
  const { redirect } = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    setTimeout(() => {
      callback();
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname,
        }),
      });
    }, 300);
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [number, setNumber] = useState(1);

  const callback = () => {
    setInitialState({ ...initialState, currentUser: undefined });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('buttonAuth');
  };

  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        loginOut(callback);
        return;
      }

      history.push(`/account/${key}`);
    },
    [],
  );

  const handleManyAccountLogin = useCallback(() => {
    // setNumber(2);
    // message.error('有新的账号登陆，系统已为您退出');
    // const resposne = JSON.parse(localStorage.getItem('userInfo') || '{}');
    // const sessionId = resposne?.sessionId || '';
    // outLogin({ sessionId: sessionId });
  }, []);

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.personName) {
    return loading;
  }

  if (
    currentUser &&
    currentUser.personName &&
    localStorage.getItem('currentName') !== currentUser.personName &&
    number === 1
  ) {
    // console.log(currentUser.name,localStorage.getItem('lastUserName'), localStorage.getItem('currentName'))
    handleManyAccountLogin();
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && <Menu.Divider />}

      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <span>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
          <span className={`${styles.name} anticon`}>{currentUser.personName}</span>
        </span>
      </HeaderDropdown>
    </span>
  );
};

export default AvatarDropdown;
