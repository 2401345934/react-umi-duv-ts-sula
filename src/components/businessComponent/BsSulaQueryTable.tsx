import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'umi';
import { QueryTable } from 'bssula';
import { EnumTableTypeMenu } from '@/common/menu';
import access from '@/components/access';
import { PageContainer } from '@ant-design/pro-layout';

export default access((props: any) => {
  const refs = useRef(null);
  const [pagePath, setPagePath] = useState('');
  const { pathname } = useLocation();

  // @ts-nocheck
  const [value] = useState(props);

  const { type, isPage = true } = props;

  let classname = null;
  switch (type || 1) {
    case EnumTableTypeMenu.ADD_ROWS_ACTION:
    case EnumTableTypeMenu.ADD_ROWS:
      classname = 'sula-table';
      break;
    case EnumTableTypeMenu.ROWS_ACTION:
      classname = 'sula-table-no-add';
      break;
    case EnumTableTypeMenu.NO_ROWS_ACTION:
      classname = 'sula-table-no-select';
      break;
    default:
      classname = 'sula-table';
      break;
  }

  // 处理按钮权限
  useEffect(() => {
    setPagePath(pathname); // 做处理，记录当前页面渲染的初始pathname，用于进行判断当前列表页面数据是否需要重新渲染
    if (props.notPermissionButtonNow) return;

    const resourceCodeArray = {};
    if (props.actionsRender && props.actionsRender.length) {
      props.actionsRender.forEach((item: any) => {
        if (item.code) {
          if (resourceCodeArray[item.code]) {
            resourceCodeArray[item.code + 1] = item;
          } else {
            resourceCodeArray[item.code] = item;
          }
        }
      });
    }

    if (props.columns && props.columns.length) {
      props.columns.forEach((item: any) => {
        if (item.isPermissionColumn && item.render && item.render.length) {
          item.render.forEach((inneritem: any) => {
            if (inneritem.code) {
              if (resourceCodeArray[inneritem.code]) {
                resourceCodeArray[inneritem.code + 1] = inneritem;
              } else {
                resourceCodeArray[inneritem.code] = inneritem;
              }
            }
          });
        }
      });
    }

    const authButton = localStorage.getItem('buttonAuth')
      ? JSON.parse(localStorage.getItem('buttonAuth') as string)
      : [];
    Object.keys(resourceCodeArray).forEach((item: any) => {
      if (!authButton.filter((itemInner: any) => item.indexOf(itemInner.code) >= 0).length) {
        resourceCodeArray[item].visible = false;
      }
    });
  }, []);
  const setTableProps = () => {
    let tableProps = {};
    if (value && value.tableProps) {
      tableProps = value.tableProps;
    } else {
      tableProps = {
        size: value.size || 'middle',
        initialPaging: {
          pagination: {
            showTotal: (total: any) => `共 ${total} 条`,
            showQuickJumper: true,
            hideOnSinglePage: value.hideOnSinglePage || false,
          },
        },
        initialSelectedRowKeys: value.initialSelectedRowKeys || [],
        expandable: value.expandable,
        scroll: { x: props.overScrollX || '1920' },
        bordered: value.bordered || false,
      };
    }

    // @ts-ignore
    if (tableProps.initialPaging.pagination) {
      // @ts-ignore
      tableProps.initialPaging.pagination.showSizeChanger = true;
    }
    return tableProps;
  };

  const config = {
    visibleFieldsCount: 3,
    itemLayout: {
      span: 6, // 栅格占位格数
    },
    rowSelection: false, // 默认无多选
    ...value,
    tableProps: setTableProps(),
    ref: props.forwardedRef || refs,
  };

  useEffect(() => {
    if (!localStorage.getItem('isTabChange')) {
      if (pagePath === pathname) {
        // @ts-ignore
        config.ref?.current?.tableRef?.current?.refreshTable();
      }
    } else {
      setTimeout(() => {
        // 处理页面刷新两面
        localStorage.removeItem('isTabChange');
      }, 0);
    }
  }, [pathname]);

  if (props.needPageHeader === false) {
    return (
      <div className={classname}>
        <QueryTable {...config} />
      </div>
    );
  }

  return (
    <div className={classname}>
      {isPage ? (
        <PageContainer>
          <QueryTable {...config} />
        </PageContainer>
      ) : (
        <QueryTable {...config} />
      )}
    </div>
  );
});
