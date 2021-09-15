import { message } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import qs from 'qs';
import { request } from 'bssula';

const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

// 非空校验
const isValidateValue = (value: any) => {
  if (value == null || value === undefined || String(value).trim() === '') {
    return false;
  }
  return true;
};

// 处理下拉框多选传参
const handleConvertSelectMulParams = (params: object, selectMulArray: any): object => {
  let InputParams = {};
  selectMulArray.forEach((ites: string) => {
    if (params && params[ites]) {
      InputParams = {
        ...InputParams,
        [`${ites}`]: params[ites].join(','),
      };
    }
  });
  return InputParams;
};

// 处理时间传参
const handleConvertTimeParams = (params: object, timeArray: any[], formatArray?: any[]): object => {
  let TimeParams = {};
  timeArray.forEach((ites: string) => {
    if (params && params[ites]) {
      const formatArrayStart =
        (formatArray && formatArray.length && formatArray[0]) || 'YYYY-MM-DD 00:00:00';
      const formatArrayEnd =
        (formatArray && formatArray.length && formatArray[1]) || 'YYYY-MM-DD 23:59:59';
      TimeParams = {
        ...TimeParams,
        [`qp-${ites}-ge`]: moment(params[ites][0]).format(formatArrayStart),
        [`qp-${ites}-le`]: moment(params[ites][1]).format(formatArrayEnd),
      };
    }
  });
  return TimeParams;
};

// 处理input传参
const handleConvertInputParams = (params: object, inputArray: any[]): object => {
  let InputParams = {};
  inputArray.forEach((ites: string) => {
    if (params && params[ites]) {
      InputParams = {
        ...InputParams,
        [`${ites}`]: params[ites].trim(),
      };
    }
  });
  return InputParams;
};

export const handleConvertParams = (
  params: object,
  inputArray?: any,
  timeArray?: any[],
  selectMulArray?: any,
): object => {
  let ParamsResult = { ...params };

  // 处理空格
  let InputParams = {};
  if (inputArray) {
    InputParams = handleConvertInputParams(ParamsResult, inputArray);
    ParamsResult = {
      ...ParamsResult,
      ...InputParams,
    };

    Object.keys(ParamsResult).forEach((i: any) => {
      if (ParamsResult[i] === '') {
        ParamsResult = _.omit(ParamsResult, [i]); // 去除空字符串 等
      }
    });
  }

  // 处理时间
  let TimeParams = {};
  if (timeArray) {
    TimeParams = handleConvertTimeParams(ParamsResult, timeArray);
    ParamsResult = {
      ..._.omit(ParamsResult, timeArray),
      ...TimeParams,
    };
  }

  // 处理多选
  let SelectMulParams = {};
  if (selectMulArray) {
    SelectMulParams = handleConvertSelectMulParams(ParamsResult, selectMulArray);
    ParamsResult = {
      ...ParamsResult,
      ...SelectMulParams,
    };
  }

  return ParamsResult;
};

// 格式化table响应数据
export const handleConvertResponse = (items: any, total: number): object => {
  const result = {
    list:
      (items.length &&
        items.map((item: any, index: number) => {
          return {
            ...item,
            keyIndex: `${index + 1}`,
          };
        })) ||
      [],
    total,
  };
  return result;
};

//  处理下拉框值 格式化
export const handleCoverSelectData = (
  params: any[],
  key: string = 'value',
  value: string = 'id',
): any => {
  return (
    (params.length &&
      params.map((ites: object) => ({
        text: ites[key],
        value: ites[value],
      }))) ||
    []
  );
};

// 处理由form和上传组件构成的结构中  需要上传的url
export function handleOssUrl(fileList: any[]) {
  let result = {};

  if (fileList && fileList.length) {
    if (handleError(fileList[0].response)) {
      result = {
        imgUrl: fileList[0].response.data.url,
      };
    }
  }

  return result;
}

/// 处理品牌库图片
export function handleLogoUrl(fileList: any[]) {
  let result = {};

  if (fileList && fileList.length) {
    if (handleError(fileList[0].response)) {
      result = {
        logoUrl: fileList[0].response.data.url,
      };
    }
  }

  return result;
}

/**
 * 处理错误请求
 * @param {*} response         返回结果
 * @param {*} needBackError    是否需要将错误回传到页面单独处理
 */
export function handleError(response: object, needBackError?: boolean) {
  // @ts-ignore
  if (!response || (response.status !== '0' && response.code !== '000000')) {
    if (response && !needBackError) {
      // @ts-ignore
      message.error(response.msg);
    }
    return false;
  }

  return true;
}

//  类型格式化
export const handleCoverCurrentType = (type: string): any => {
  let result = '';
  switch (type) {
    case 'add':
      result = '新建';
      break;
    case 'create':
      result = '新增';
      break;
    case 'edit':
      result = '编辑';
      break;
    case 'view':
      result = '查看';
      break;
    default:
      result = '编辑';
      break;
  }

  return result;
};

// mode类型判断
export const handleModeType = (path: any) => {
  if (path.includes('edit')) {
    return 'edit';
  }
  if (path.includes('view')) {
    return 'view';
  }
  return 'create';
};

// format树结构
function mapTree(treeDataItem: any) {
  const haveChildren = Array.isArray(treeDataItem.children) && treeDataItem.children.length > 0;
  return {
    // 分别将我们查询出来的值做出改变他的key
    title: treeDataItem.title,
    key: `${treeDataItem.id}___${treeDataItem.parentId}`,
    parentId: treeDataItem.parentId,
    data: { ...treeDataItem },
    isLeaf: !haveChildren,
    selectable: treeDataItem.parentId !== '-1',
    // 判断它是否存在子集，若果存在就进行再次进行遍历操作，知道不存在子集便对其他的元素进行操作
    children: haveChildren ? treeDataItem.children.map((i: any) => mapTree(i)) : [],
  };
}

// 声明随机字符串
export const randomString = (len?: any) => {
  // eslint-disable-next-line no-param-reassign
  len = len || 32;
  const $chars =
    'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz'; /* ***默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1*** */
  const maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};

export { mapTree, isValidateValue };

// 处理判断 按钮权限
// buttonCodeArray  需要判断的按钮 传数组类型
export const handleJudgeAuthButton = (buttonCodeArray: any[]) => {
  // 处理单按钮 和 多个按钮
  let result = buttonCodeArray.length > 1 ? buttonCodeArray.map(() => true) : true;
  const authButton = localStorage.getItem('buttonAuth')
    ? JSON.parse(localStorage.getItem('buttonAuth') as string)
    : [];
  buttonCodeArray.forEach((item: any, index: number) => {
    if (!authButton.filter((itemInner: any) => item.indexOf(itemInner.code) >= 0).length) {
      if (buttonCodeArray.length > 1) {
        result[index] = false;
      } else {
        result = false;
      }
    }
  });
  return result;
};

export default function download(fileName: string, url: string) {
  const a = document.createElement('a'); /// 创建a标签
  const e = document.createEvent('MouseEvents'); /// 创建鼠标事件对象
  e.initEvent('click', false, false); /// 初始化事件对象
  a.href = url;
  a.download = fileName; /// 设置下载文件名
  a.setAttribute('style', 'display: none');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// 获取后端地址前缀
export function handleBaseUrlPre(baseName: string) {
  let result;
  switch (baseName) {
    case 'dcop':
      result = '/dcopis/api';
      break;
    case 'bop':
      result = '/bop/api/';
      break;
    case 'purchasing':
      result = '/purchasing/api';
      break;
    default:
      break;
  }
  return result;
}

/**
 * rules 校验规则 - 必填
 */
export const requiredRules = { required: true };

export const queryParams = (params: object) => {
  // 数组对象处理
  // eslint-disable-next-line no-restricted-syntax
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const element = params[key];
      if (element && key.indexOf('*number*') >= 0) {
        const dataParams = key.split('*number*');
        dataParams.forEach((value, index) => {
          params[value] = element[index];
        });
        delete params[key];
      } else if (element && key.indexOf('*address*') >= 0) {
        const dataParams = key.split('*address*');
        dataParams.forEach((value, index) => {
          params[value] = element.PCDCode[index];
        });
        delete params[key];
      } else if (element && key.indexOf('*costType*') >= 0) {
        const dataParams = key.split('*costType*');
        params[dataParams[0]] = element[1];
        delete params[key];
      } else if (element && key.indexOf('*fullDate*') >= 0) {
        // 此处种入参，为数组和不为数组，进去区别处理
        const fullDateIsArray = Array.isArray(element);
        const dataParams = key.split('*fullDate*');
        dataParams.forEach((value, index) => {
          if (index == 0) {
            params[value] = (fullDateIsArray ? moment(element[index]) : moment(element))
              .millisecond(0)
              .second(0)
              .minute(0)
              .hour(0)
              .format('YYYY-MM-DD HH:mm:ss');
          } else {
            params[value] = (fullDateIsArray ? moment(element[index]) : moment(element))
              .millisecond(59)
              .second(59)
              .minute(59)
              .hour(23)
              .format('YYYY-MM-DD HH:mm:ss');
          }
        });
        delete params[key];
      } else if (element && key.indexOf('*ArrayPop') >= 0) {
        if (key !== 'qp-relativeGroupId-eq*ArrayPop') {
          const dataParams = key.split('*ArrayPop');
          params[dataParams[0]] = element.pop();
        }
        delete params[key];
      } else if (element && key.indexOf('*') >= 0) {
        const dataParams = key.split('*');
        dataParams.forEach((value, index) => {
          if (index == 0) {
            params[value] = element[index].format('YYYY-MM-DD 00:00:00');
          } else {
            params[value] = element[index].format('YYYY-MM-DD 23:59:59');
          }
        });
        delete params[key];
      } else if (Array.isArray(element)) {
        if (key !== 'classCodes') {
          params[key] = element.join(',');
        }
      }
    }
  }

  return qs.stringify(params);
};

/**
 * rules 校验规则 - 输入长度
 * @param maxLength 最大长度
 * @param minLength 可选项,最小长度
 * @returns 返回输入长度规则
 */
export const rulesLength = (maxLength: number, minLength?: number) => {
  return {
    max: maxLength,
    min: minLength || undefined,
  };
};

export function validatorLength(value: any, num: number) {
  const count = value ? value.toString().replace(/[^\x00-\xff]/g, '01') : '';
  if (count.length > num) {
    return Promise.reject(new Error(`该字段长度过长!`));
  }
  return Promise.resolve();
}

export function treeKeys(tree: any, keys: any) {
  const keysList: any = [];
  const loopFunction = (item: any) => {
    keysList.push(item[keys]);
    if (Array.isArray(item.children) && item.children.length) {
      item.children.forEach((child: any) => loopFunction(child));
    }
  };
  if (tree && Array.isArray(tree) && tree.length > 0) {
    loopFunction(tree[0]);
  }
  return keysList || [];
}

export function uuid() {
  const s = [];
  const hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  const uuid = s.join('');
  return uuid;
}

export const handleExport = (params: any, url: any, methods?: any) => {
  // 数组对象处理,对带有特殊标记的name进行处理
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const element = params[key];
      if (element && key.indexOf('*number*') >= 0) {
        const dataParams = key.split('*number*');
        dataParams.forEach((value, index) => {
          params[value] = element[index];
        });
        delete params[key];
      } else if (element && key.indexOf('*address*') >= 0) {
        const dataParams = key.split('*address*');
        dataParams.forEach((value, index) => {
          params[value] = element.PCDCode[index];
        });
        delete params[key];
      } else if (element && key.indexOf('*costType*') >= 0) {
        const dataParams = key.split('*costType*');
        // eslint-disable-next-line prefer-destructuring
        params[dataParams[0]] = element[1];
        delete params[key];
      } else if (element && key.indexOf('*fullDate*') >= 0) {
        const dataParams = key.split('*fullDate*');
        dataParams.forEach((value, index) => {
          if (index === 0) {
            params[value] = moment(element[index])
              .millisecond(0)
              .second(0)
              .minute(0)
              .hour(0)
              .format('YYYY-MM-DD HH:mm:ss');
          } else {
            params[value] = moment(element[index])
              .millisecond(59)
              .second(59)
              .minute(59)
              .hour(23)
              .format('YYYY-MM-DD HH:mm:ss');
          }
        });
        delete params[key];
      } else if (element && key.indexOf('*commonDate*') >= 0) {
        const dataParams = key.split('*commonDate*');
        dataParams.forEach((value, index) => {
          if (index === 0) {
            params[value] = moment(element[index])
              .millisecond(0)
              .second(0)
              .minute(0)
              .hour(0)
              .format('YYYY-MM-DD');
          } else {
            params[value] = moment(element[index])
              .millisecond(59)
              .second(59)
              .minute(59)
              .hour(23)
              .format('YYYY-MM-DD');
          }
        });
        delete params[key];
      } else if (element && key.indexOf('*') >= 0) {
        const dataParams = key.split('*');
        dataParams.forEach((value, index) => {
          params[value] = element[index].format('YYYY-MM-DD HH:mm:ss');
        });
        delete params[key];
      } else if (Array.isArray(element)) {
        params[key] = element.join(',');
      }
    }
  }

  const urls = methods
    ? `${handleBaseUrlPre('purchasing')}/${url}`
    : `${handleBaseUrlPre('purchasing')}/${url}?${qs.stringify(params)}`;
  request({
    url: urls,
    method: methods || 'GET',
    params: methods ? params : {},
    converter: ({ data }: any) => {
      const save_link = document.createElement('a');
      save_link.href = data;
      save_link.click();
    },
  });
};

export const totalHandleParams = (params: any = {}) => {
  // 数组对象处理,对带有特殊标记的name进行处理
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const element = params[key];
      if (element && key.indexOf('*number*') >= 0) {
        const dataParams = key.split('*number*');
        dataParams.forEach((value, index) => {
          params[value] = element[index];
        });
        delete params[key];
      } else if (element && key.indexOf('*address*') >= 0) {
        const dataParams = key.split('*address*');
        dataParams.forEach((value, index) => {
          params[value] = element.PCDCode[index];
        });
        delete params[key];
      } else if (element && key.indexOf('*costType*') >= 0) {
        const dataParams = key.split('*costType*');
        // eslint-disable-next-line prefer-destructuring
        params[dataParams[0]] = element[1];
        delete params[key];
      } else if (element && key.indexOf('*fullDate*') >= 0) {
        const dataParams = key.split('*fullDate*');
        dataParams.forEach((value, index) => {
          if (index === 0) {
            params[value] = moment(element[index])
              .millisecond(0)
              .second(0)
              .minute(0)
              .hour(0)
              .format('YYYY-MM-DD HH:mm:ss');
          } else {
            params[value] = moment(element[index])
              .millisecond(59)
              .second(59)
              .minute(59)
              .hour(23)
              .format('YYYY-MM-DD HH:mm:ss');
          }
        });
        delete params[key];
      } else if (element && key.indexOf('*dateType*') >= 0) {
        const dataParams = key.split('*dateType*');
        dataParams.forEach((value, index) => {
          if (index === 0) {
            params[value] = moment(element[index]).format('YYYY-MM-DD');
          } else {
            params[value] = moment(element[index]).format('YYYY-MM-DD');
          }
        });
        delete params[key];
      } else if (Array.isArray(element)) {
        params[key] = element.join(',');
      }
    }
  }

  return qs.stringify(params);
};

export const coverTableFunc = (ctx: any) => {
  const { data, response } = ctx;
  // 处理错误
  const list =
    (data?.items?.length &&
      data.items.map((item: any, index: number) => {
        return {
          ...item,
          keyIndex: `${index + 1}`,
        };
      })) ||
    [];

  return {
    list,
    total: data?.total || data?.totalCount || 0,
  };
};

export const getLocalStoreageCustomerCode = () => {
  return localStorage.getItem('customerCode');
};

/* 获取url后面的参数 */
export function getQueryString(name: any) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const r = globalThis?.location?.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}

export function navgirTo() {
  const resposne = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const sessionId = resposne?.sessionId || '';
  // @ts-ignore
  if (REACT_APP_ENV === 'test') {
    window.open(
      `http://pd.cad3d1eff5c2440cb944a0a8b3c180734.cn-shenzhen.alicontainer.com/?sessionId=${sessionId}`,
    );
  } else {
    window.open(`http://139.196.74.48:8407/?sessionId=${sessionId}`);
  }
}

export const windowOpen = (href: string) => {
  const response = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const sessionId = response?.sessionId || '';
  window.open(`${href}?sessionId=${sessionId}`);
};
