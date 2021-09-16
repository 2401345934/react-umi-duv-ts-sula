/*
 * @Author: your name
 * @Date: 2021-09-15 22:33:46
 * @LastEditTime: 2021-09-16 14:50:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-umi-duv-ts-sula\src\pages\Welcome.tsx
 */
import SearchTable from '@/components/SearchTable';
import { TableDropdown } from '@ant-design/pro-table';
import { Button, Menu, Space, Tag } from 'antd';
import { useRef } from 'react';

export default () => {
  const actionRef = useRef<any>();

  const config = {
    toolBarRender: () => [<Button>11</Button>],
    headerTitle: '我是表格上面的问题',
    actionRef: actionRef,
    columns: [
      {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
      },
      {
        title: '标题',
        dataIndex: 'title',
        copyable: true,
        ellipsis: true,
        tip: '标题过长会自动收缩',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
        },
      },
      {
        title: '状态',
        dataIndex: 'state',
        filters: true,
        onFilter: true,
        valueType: 'select',
        valueEnum: {
          all: { text: '全部', status: 'Default' },
          open: {
            text: '未解决',
            status: 'Error',
          },
          closed: {
            text: '已解决',
            status: 'Success',
            disabled: true,
          },
          processing: {
            text: '解决中',
            status: 'Processing',
          },
        },
      },
      {
        title: '标签',
        dataIndex: 'labels',
        valueType: 'text',
        formItemProps: () => ({
          name: 'qp-labels-like',
        }),
      },
      {
        title: '创建时间',
        key: 'showTime',
        dataIndex: 'created_at',
        valueType: 'dateTime',
        sorter: true,
        hideInSearch: true,
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        valueType: 'dateRange',
        hideInTable: true,
        search: {
          transform: (value: any[]) => {
            return {
              startTime: value[0],
              endTime: value[1],
            };
          },
        },
      },
      {
        title: '操作',
        valueType: 'option',
        render: (
          text: any,
          record: { id: any; url: string | undefined },
          _: any,
          action: { startEditable: (arg0: any) => void; reload: () => void },
        ) => [
          <a
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            编辑
          </a>,
          <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
            查看
          </a>,
          <TableDropdown
            key="actionGroup"
            onSelect={() => action?.reload()}
            menus={[
              { key: 'copy', name: '复制' },
              { key: 'delete', name: '删除' },
            ]}
          />,
        ],
      },
    ],
  };

  return <SearchTable {...config}></SearchTable>;
};
