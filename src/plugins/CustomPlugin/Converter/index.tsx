/*
 * @Author: your name
 * @Date: 2021-07-05 09:32:51
 * @LastEditTime: 2021-08-16 14:15:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \operation-platform-front\src\plugins\CustomPlugin\Converter\index.tsx
 */
// @ts-ignore
import sula from 'bssula/es/core';
import { message } from 'antd';

// 分页
sula.converterType('bs-tableConvertType', (ctx: any) => {
  const { data, response } = ctx;
  // 处理错误
  if (!response || !response.status || (response.status !== '0' && response.code !== '000000')) {
    message.error(response.message || response.msg || response.success);
    return false;
  }

  const list =
    (data.list
      ? data.list.length &&
        data.list.map((item: any, index: number) => {
          return {
            ...item,
            keyIndex: `${index + 1}`,
          };
        })
      : data.items.length &&
        data.items.map((item: any, index: number) => {
          return {
            ...item,
            keyIndex: `${index + 1}`,
          };
        })) || [];

  return {
    list,
    total: data.total || data.totalCount,
  };
});

// 不分页
sula.converterType('tableConvertNoPage', (ctx: any) => {
  return ctx?.data || [];
});
