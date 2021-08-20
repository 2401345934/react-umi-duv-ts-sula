/*
 * @Author: your name
 * @Date: 2021-07-13 09:25:29
 * @LastEditTime: 2021-07-13 09:42:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \workbench-sharing-front\src\pages\InventoryManagement\InventoryAdjustment\ResultSubmit\index.tsx
 */

import React from 'react';
import { Result, Button, Card } from 'antd';
import { history } from 'umi';

export default ({
  statusTitle,
  subTitle,
  backRoutes,
  viewRoutes,
}: {
  statusTitle: any;
  subTitle: any;
  backRoutes: string;
  viewRoutes: string;
}) => {
  return (
    <Card>
      <Result
        status="success"
        title={statusTitle || '提交成功'}
        subTitle={[subTitle && subTitle()]}
        extra={[
          <Button type="primary" onClick={() => history.push(backRoutes || '')}>
            返回列表
          </Button>,
          <Button onClick={() => history.push(viewRoutes || '')}>查看单据</Button>,
        ]}
      />
      ,
    </Card>
  );
};
