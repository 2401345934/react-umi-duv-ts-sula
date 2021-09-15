import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import { notification } from 'antd';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
// import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { handleRequestHeader } from './utils/requestUtils';
// import MenuRenderFunction from './lib/MenuRenderCom';
import RenderPageFunction from './lib/RenderPage';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

// 多页签模式需要注释掉layout
// ProLayout 支持的api https://procomponents.ant.design/components/layout
// export const layout: RunTimeLayoutConfig = ({ initialState }) => {
//   return {
//     rightContentRender: () => <RightContent />,
//     disableContentMargin: false,
//     waterMarkProps: {
//       content: initialState?.currentUser?.name,
//     },
//     // footerRender: () => <Footer />,
//     // menuHeaderRender: () => {},
//     // 开启有赞的菜单模式 但是需要改样式
//     // menuRender: (props: any) => {
//     //   const { location } = history;
//     //   if (location.pathname === '/user/login') {
//     //     return undefined;
//     //   }
//     //   if (!initialState?.currentUser) {
//     //     return undefined;
//     //   }

//     //   return <MenuRenderFunction {...props} />;
//     // },
//     childrenRender: RenderPageFunction(),
//     onPageChange: () => {
//       const { location } = history;
//       // 如果没有登录，重定向到 login
//       if (!initialState?.currentUser && location.pathname !== loginPath) {
//         history.push(loginPath);
//       }
//     },
//     // 自定义 403 页面
//     // unAccessible: <div>unAccessible</div>,
//     ...initialState?.settings,
//   };
// };

// 请求拦截
const requestInterceptors = [
  (url: string, options: any) => {
    const handleOptions = handleRequestHeader(options);
    return {
      url,
      options: handleOptions,
    };
  },
];

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    if (response.status === 401) {
      notification.open({
        message: '提示：登陆已失效',
        description: '系统将在6秒之后退出登陆,您也可以手动点右上角关闭提示并退出。',
        duration: 6,
        onClose: async () => {
          localStorage.removeItem('userInfo');
          localStorage.removeItem('buttonAuth');
          if (window.location.pathname !== '/user/login') {
            history.replace({
              pathname: '/user/login',
            });
          }
        },
      });
    } else {
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      });
    }
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

export const request: RequestConfig = {
  errorHandler,
  requestInterceptors,
};
