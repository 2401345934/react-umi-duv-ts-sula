/*
 * @Author: your name
 * @Date: 2021-09-16 14:40:18
 * @LastEditTime: 2021-09-16 14:50:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-umi-duv-ts-sula\src\components\SearchTable\index.tsx
 */
import ProTable from '@ant-design/pro-table';
import request from 'umi-request';

export default (props: any) => {
  return (
    <ProTable<any>
      {...props}
      request={async (params = {}) => {
        return request<{
          data: any[];
        }>(props.url || 'https://proapi.azurewebsites.net/github/issues', {
          params,
        });
      }}
      rowKey={props.rowKey || 'id'}
      search={{
        labelWidth: 'auto',
      }}
      // form={
      //   {
      // ignoreRules: false,
      // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
      // syncToUrl: (values, type) => {
      //   if (type === 'get') {
      //     return {
      //       ...values,
      //       created_at: [values.startTime, values.endTime],
      //     };
      //   }
      //   return values;
      // },
      // }
      // }
      pagination={{
        ...props?.pagination,
        pageSize: 10,
      }}
      dateFormatter={props.dateFormatter || 'string'}
    />
  );
};
