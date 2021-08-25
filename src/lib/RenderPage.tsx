/*
 * @Author: your name
 * @Date: 2021-07-29 09:43:37
 * @LastEditTime: 2021-08-26 01:16:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \purchase-platform-front\src\lib\RenderPage.tsx
 */
import React from 'react';
import { RouteContext } from '@ant-design/pro-layout';
import { useLocation } from 'umi';
import { Route } from 'react-router-dom';
import Login from '../pages/user/Login';

const RenderPageFunction = () => {
  const Home: React.FC<{}> = () => {
    const { pathname } = useLocation();
    return (
      <>
        <RouteContext.Consumer>
          {(values: any) => {
            // login 登陆处理
            const isLogin = pathname === '/user/login';

            const RenderComponent = values.currentMenu.component
              ? values?.currentMenu?.component
              : () => <div></div>;

            return !isLogin ? (
              <Route
                key={values.currentMenu.key}
                path={values.currentMenu.path}
                render={(props) => <RenderComponent {...props} collapsed={values.collapsed} />}
                exact
              />
            ) : (
              <Login />
            );
          }}
        </RouteContext.Consumer>
      </>
    );
  };

  return Home;
};

export default RenderPageFunction;
