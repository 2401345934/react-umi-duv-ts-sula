/* eslint-disable @typescript-eslint/no-unused-expressions */
// @ts-nocheck
import type {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import ProLayout, { RouteContext } from '@ant-design/pro-layout';
import React, { useState } from 'react';
import { Tabs, Popover } from 'antd';
import { Route } from 'react-router-dom';
import { Link, useIntl, history, useModel } from 'umi';
import pathToRegexp from 'path-to-regexp';
import RightContent from '@/components/RightContent';
import logo from '../assets/baseImg.png';
import {
  matchPath,
  memoizeOneFormatter,
  getBreadcrumbNameMap,
  ergodicMenuRoutes,
} from '@/utils/matchPath';
import moment from 'moment';
import defaultSettings from '../../config/defaultSettings';

const { TabPane } = Tabs;

export const RouterContext = React.createContext({});

export type BasicLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
} & ProLayoutProps;

export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: Record<string, MenuDataItem>;
};

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map((item) => {
    return {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
  });

let UN_LISTTEN;
let routerArray = [];
const lastTwoRouterArray = [1, 2];

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    routerArray = this.updateTree(props.route.routes);
    const homeRouter: any = routerArray.filter((itemroute) => itemroute.key === '/')[0];
    const breadcrumbNameMap: any = getBreadcrumbNameMap(
      memoizeOneFormatter(props.route.routes, ''),
    );
    const hideMenuArray: any = ergodicMenuRoutes(props.route.routes);
    this.state = {
      listenRouterState: [{ ...homeRouter, key: '/welcome', tab: '欢迎', closable: false }],
      listenRouterKey: ['/welcome'],
      activeKey: '/welcome',
      customerMatchs: [],
      breadcrumbNameMap,
      hideMenuArray,
      maxHeight: '860',
    };
  }

  componentDidMount() {
    const {
      history,
      breadcrumbNameMap,
      location,
      route: { routes, authority },
    }: any = this.props;

    UN_LISTTEN = history.listen((route) => {
      const { listenRouterState, listenRouterKey, customerMatchs, hideMenuArray } = this.state;
      let newListenRouterState = [...listenRouterState];
      let newListenRouterKey = [...listenRouterKey];

      let replaceRouter = routerArray.filter((itemRoute) =>
        pathToRegexp(itemRoute.key || '').test(route.pathname),
      )[0];

      let currentKey = '';

      if (replaceRouter && replaceRouter.isOnlyOnePage) {
        // 处理中英文和特殊字符
        currentKey = decodeURIComponent(route.pathname);
      } else {
        currentKey = decodeURIComponent(route.pathname + this.parseQueryString(route.search));
      }

      if (!listenRouterKey.includes(currentKey)) {
        if (!replaceRouter) {
          replaceRouter = routerArray.filter((itemroute) => itemroute.key === '/404')?.[0];
          // if (replaceRouter) {
          this.setState({
            listenRouterState: [
              ...listenRouterState,
              { ...replaceRouter, key: currentKey, tab: '404' },
            ],
            activeKey: currentKey,
            listenRouterKey: [...listenRouterKey, currentKey],
          });
          // return;
          // }
          // history.push('/');
        } else {
          const match = matchPath(route.pathname, { path: replaceRouter.key });
          newListenRouterState = [
            ...newListenRouterState,
            {
              ...replaceRouter,
              query: route.query,
              match,
              key: currentKey,
              tab: `${this.getPageTitle(route.pathname)}`,
            },
          ];
          newListenRouterKey = [...listenRouterKey, currentKey];
          // this.setState({
          //   listenRouterState: [
          //     ...listenRouterState,
          //     {
          //       ...replaceRouter,
          //       query: route.query,
          //       match: match,
          //       key: currentKey,
          //       tab:
          //         this.getPageTitle(route.pathname) + ''
          //         // this.getDetailPagePrimaryId(route, match),
          //     },
          //   ],
          //   activeKey: currentKey,
          //   listenRouterKey: [...listenRouterKey, currentKey],
          // });
        }
      }

      // 处理hideMenu页面自动关闭
      lastTwoRouterArray.push(route.pathname);
      lastTwoRouterArray.shift();
      if (!localStorage.getItem('isTabChange') && !localStorage.getItem('isMenuClick')) {
        if (lastTwoRouterArray[0] && typeof lastTwoRouterArray[0] === 'string') {
          const needRemoveKeyArray = hideMenuArray.filter((itemRoute) =>
            pathToRegexp(itemRoute.path || '').test(lastTwoRouterArray[0]),
          );
          // lastTwoRouterArray[0] != lastTwoRouterArray[1] 该判断条件用于判断是否是tab删除操作，如果是tab页删除操作，删除的是不是最后一个打开的tab页，执行history.push会导致错误的将最后打开的那个tab页也删除掉
          if (needRemoveKeyArray.length && lastTwoRouterArray[0] != lastTwoRouterArray[1]) {
            if (
              (!(lastTwoRouterArray[0].indexOf('/order/mainOrder/supplement') >= 0) ||
                !pathToRegexp('/order/mainOrder/:parmode/separateOrder/:id').test(
                  lastTwoRouterArray[1],
                )) &&
              (!pathToRegexp('/order/mainOrder/:parmode/separateOrder/:id').test(
                lastTwoRouterArray[0],
              ) ||
                !(lastTwoRouterArray[1].indexOf('order/mainOrder/separateOrder/') >= 0))
            ) {
              // let newListenRouterState = [
              //   ...listenRouterState
              // ];
              // let newListenRouterKey = [...listenRouterKey];

              newListenRouterState = newListenRouterState.filter(
                (item) => item.key !== lastTwoRouterArray[0],
              );
              newListenRouterKey = newListenRouterKey.filter(
                (item) => item !== lastTwoRouterArray[0],
              );

              // this.setState({
              //   listenRouterState: newListenRouterState,
              //   listenRouterKey: newListenRouterKey
              // });
            }
          }
        }
        // refs?.tableRef?.current?.refreshTable();
      } else {
        setTimeout(() => {
          // 处理页面刷新两面
          localStorage.removeItem('isTabChange');
          localStorage.removeItem('isMenuClick');
        }, 0);
      }

      this.setState({
        // 路由监听函数最后执行setState，避免处理hideMenu类型页面自动关闭的逻辑块内获取不到最新state的listenRouterState和listenRouterKey
        activeKey: currentKey,
        listenRouterState: newListenRouterState,
        listenRouterKey: newListenRouterKey,
      });
    });
    // 获取当前浏览器窗口高度，并进行计算求出内容区高度
    const height = document.querySelector('html').offsetHeight;
    this.setState({
      maxHeight: height - 119,
    });

    history.push(location.pathname);
  }

  componentWillUnmount() {
    // eslint-disable-next-line no-unused-expressions
    UN_LISTTEN && UN_LISTTEN();
  }

  parseQueryString = (queryString) => {
    if (!queryString) {
      return '';
    }

    if (queryString.indexOf('?') < 0) {
      return `?${queryString}`;
    }

    return queryString;
  };

  updateTree = (Tree) => {
    const treeData = Tree;
    const treeList = [];
    // 递归获取树列表
    const getTreeList = (data) => {
      data.forEach((node) => {
        if (node.routes && node.routes.length > 0) {
          getTreeList(node.routes);
        } else {
          treeList.push({
            tab: node.locale,
            key: node.path,
            locale: node.locale,
            closable: true,
            content: node.component,
            name: node.name,
            isOnlyOnePage: node.isOnlyOnePage,
          });
        }
      });
    };
    getTreeList(treeData);
    return treeList;
  };
  /** *
   * 数据字典数据源获取
   */
  getDictionarySource = (dicCode: string, needConvertInterger = false) => {
    const { dictionaryData } = this.props;

    let dicData = {};

    if (!dictionaryData) {
      const storageDic =
        localStorage.getItem('dicData') && localStorage.getItem('dicData') !== 'undefined'
          ? JSON.parse(localStorage.getItem('dicData') || '{}')
          : {};
      dicData = storageDic[dicCode];
    } else {
      dicData = dictionaryData[dicCode];
    }
    if (!dicData || !dicData.length) {
      return [];
    }

    try {
      if (needConvertInterger) {
        dicData = dicData.map((item: { text: string; value: string }) => ({
          ...item,
          value: parseFloat(item.value),
        }));
      }
    } catch (e) {}

    return dicData;
  };
  /** *
   * 数据字典 code 转 文字
   */
  getDictionaryTextByValue = (dicCode: string, value: string) => {
    const { dictionaryData } = this.props;

    let dicData = [];
    if (!dictionaryData) {
      const storageDic =
        localStorage.getItem('dicData') && localStorage.getItem('dicData') !== 'undefined'
          ? JSON.parse(localStorage.getItem('dicData') || '{}')
          : {};
      dicData = storageDic[dicCode];
    } else {
      dicData = dictionaryData[dicCode];
    }

    if (!dicData || !dicData.length) {
      return '';
    }

    if (value === undefined || value === 'undefined') return '';

    const dicItemArray = dicData?.filter(
      (item: { value: string }) => item.value === (value !== null ? value.toString() : value),
    );

    if (dicItemArray !== 'undefined' && dicItemArray && !dicItemArray.length) {
      // throw new Error(`当前${dicCode}字典值合没有${value}的数据`)
      return value;
    }
    return (dicItemArray && Array.isArray(dicItemArray) && dicItemArray[0].text) || value;
  };
  /** *
   * 处理时间的方法
   * timeStr是传入的时间；format目标格式化；notNeedConvertTimeZone代表是否要进行8小时转化(false则会加8小时)
   */
  timeFormat = (timeStr, format, notNeedConvertTimeZone) => {
    if (!timeStr) return '';

    if (notNeedConvertTimeZone) {
      return moment(timeStr).format(format);
    }

    return moment(timeStr).add(8, 'hours').format(format);
  };

  onChange = (key) => {
    this.setState({
      activeKey: key,
    });
    localStorage.setItem('isTabChange', '1');
    history.push(key);
  };

  getPageTitle = (pathname) => {
    const { formatMessage } = this.props;
    const { breadcrumbNameMap } = this.state;
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);

    if (!currRouterData) {
      return [];
    }
    const pageName = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });

    return `${pageName}`;
  };

  matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find((key) => pathToRegexp(key).test(pathname));
    return breadcrumbNameMap[pathKey];
  };

  onEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: string) => {
    this.tabActions[action](targetKey);
  };

  tabActions: any = {
    remove: (targetKey: string) => {
      const { listenRouterState, activeKey, customerMatchs, listenRouterKey } = this.state;

      let lastIndex: number = 0;
      let newActiveKey: string | undefined = activeKey;
      let newListenRouterState = [];
      let newListenRouterKey = [];

      if (targetKey === activeKey) {
        listenRouterState.forEach((pane, i) => {
          if (pane.key === targetKey) {
            lastIndex = i - 1;
          }
        });

        newListenRouterState = listenRouterState.filter((item) => item.key !== targetKey);
        newListenRouterKey = listenRouterKey.filter((item) => item !== targetKey);

        if (lastIndex < 0) {
          lastIndex = 0;
        }

        newActiveKey = newListenRouterState[lastIndex].key;
      } else {
        newListenRouterState = listenRouterState.filter((item) => item.key !== targetKey);
        newListenRouterKey = listenRouterKey.filter((item) => item !== targetKey);
      }

      this.setState(
        {
          activeKey: newActiveKey,
          listenRouterState: newListenRouterState,
          listenRouterKey: newListenRouterKey,
        },
        () => {
          history.push(newActiveKey);
        },
      );
    },
  };

  updateState = (newListenRouterState, newListenRouterKey) => {
    this.setState({
      listenRouterState: newListenRouterState,
      listenRouterKey: newListenRouterKey,
    });
  };

  render() {
    const { listenRouterState, activeKey, customerMatchs, listenRouterKey } = this.state;

    const TabTitle: React.FC<{}> = ({ item, index, updateState }) => {
      const [visible, setVisible] = useState(false);
      let newListenRouterState = [];
      let newListenRouterKey = [];

      const onContextMenu = (e) => {
        e.preventDefault();
        setVisible(true);
      };

      const onClick = (e, type) => {
        if (type === 1) {
          // 关闭其他
          newListenRouterState = listenRouterState.filter(
            (inneritem, innerIndex) => innerIndex === index,
          );
          newListenRouterKey = listenRouterKey.filter(
            (inneritem, innerIndex) => innerIndex === index,
          );
        }

        if (type === 2) {
          // 关闭右侧
          newListenRouterState = listenRouterState.filter(
            (inneritem, innerIndex) => innerIndex <= index,
          );
          newListenRouterKey = listenRouterKey.filter(
            (inneritem, innerIndex) => innerIndex <= index,
          );
        }
        if (type === 3) {
          // 关闭
          newListenRouterState = [{ key: '/welcome', tab: '欢迎', closable: false }];
          newListenRouterKey = ['/welcome'];
          history.push('/welcome');
        } else {
          history.push(item.key);
        }

        updateState(newListenRouterState, newListenRouterKey);
        e.preventDefault();
        e.stopPropagation();
      };

      return (
        <div onContextMenu={onContextMenu.bind(this)}>
          {listenRouterState.length > 1 ? (
            <Popover
              width={150}
              placement="top"
              overlayClassName="popover-tab"
              content={
                <div>
                  <div
                    className="popover-div"
                    onClick={(e) => {
                      onClick(e, 1);
                    }}
                  >
                    关闭其他
                  </div>
                  <div
                    className="popover-div"
                    onClick={(e) => {
                      onClick(e, 2);
                    }}
                  >
                    关闭右侧
                  </div>
                  <div
                    className="popover-div"
                    onClick={(e) => {
                      onClick(e, 3);
                    }}
                  >
                    关闭全部
                  </div>
                </div>
              }
              trigger="click"
              visible={visible}
              onVisibleChange={(visible) => {
                setVisible(visible);
              }}
            >
              {item.tab}
            </Popover>
          ) : (
            item.tab
          )}
        </div>
      );
    };

    return (
      <ProLayout
        logo={logo}
        onMenuHeaderClick={() => history.push('/')}
        menuItemRender={(menuItemProps, defaultDom) => {
          return (
            <Link
              onClick={() => {
                localStorage.setItem('isMenuClick', 'true');
              }}
              to={menuItemProps.path}
            >
              {defaultDom}
            </Link>
          );
        }}
        // 面包
        // breadcrumbRender={(routers = []) => [
        //   {
        //     path: '/',
        //     breadcrumbName: '',
        //   },
        //   ...routers,
        // ]}
        menuDataRender={menuDataRender}
        // menuProps={{
        //   onClick: () => {
        //     localStorage.setItem('isMenuClick', 'true')
        //   }
        // }}
        onPageChange={() => {
          // const { location } = history;
          // 如果没有登录，重定向到 login
          // if (REACT_APP_ENV === 'dev') {
          //   if (!getCookie('userInfo') && location.pathname !== '/user/login') {
          //     history.push('/user/login');
          //     message.warning('当前登录信息已过期或者没有登录 请重新登录');
          //   }
          // }
          // else {
          //   if (!getCookie('tenantId') && location.pathname !== '/user/login') {
          //     history.push('/');
          //     message.warning('当前登录信息已过期或者没有登录 请重新登录');
          //   }
          // }
        }}
        rightContentRender={() => <RightContent />}
        {...this.props}
        {...defaultSettings}
      >
        <Tabs
          activeKey={activeKey}
          onChange={this.onChange}
          // tabBarExtraContent={operations}
          type="editable-card"
          tabBarStyle={{
            background: '#fff',
            padding: '8px',
            height: '38px',
            color: '#2C2F2E70',
            marginBottom: '10px',
          }}
          tabPosition="top"
          tabBarGutter={8}
          className="paylout_tabList"
          onEdit={this.onEdit}
          hideAdd
        >
          {listenRouterState.map((item, index) => (
            <TabPane
              tab={<TabTitle item={item} index={index} updateState={this.updateState} />}
              key={item.key}
              closable={!!index || listenRouterState.length > 1}
              style={{
                // height: `${this.state.maxHeight}px`,
                height: `calc(100vh - 100px)`,
                overflowY: 'auto',
                width: '100%',
                // margin: '0 1%',
                overflowX: 'hidden',
              }}
            >
              <RouteContext.Consumer>
                {(values: any) => {
                  // login 登陆处理
                  return (
                    <Route
                      key={values.currentMenu.key}
                      path={values.currentMenu.path}
                      render={(props) =>
                        // pass the sub-routes down to keep nesting
                        values.currentMenu.component && (
                          <values.currentMenu.component
                            {...props}
                            timeFormat={this.timeFormat}
                            getDictionarySource={this.getDictionarySource}
                            collapsed={values.collapsed}
                            getDictionaryTextByValue={this.getDictionaryTextByValue}
                          />
                        )
                      }
                      exact
                    />
                  );
                }}
              </RouteContext.Consumer>
            </TabPane>
          ))}
        </Tabs>
      </ProLayout>
    );
  }
}

export default (props) => {
  const { initialState } = useModel('@@initialState');

  const { currentUser = 'none', dictionaryData }: any = initialState;
  const intl = useIntl();
  const { formatMessage } = intl;

  return <BasicLayout {...props} dictionaryData={dictionaryData} formatMessage={formatMessage} />;
};
