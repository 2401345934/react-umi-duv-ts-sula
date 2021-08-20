/*
 * @Author: your name
 * @Date: 2021-07-21 10:49:19
 * @LastEditTime: 2021-08-18 20:04:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \operation-platform-front\src\utils\tableUtils.tsx
 */

import React, { useState } from 'react';
import { Tooltip, Badge } from 'antd';
import { request } from 'bssula';
import { handleBaseUrlPre } from './utils';
import { handleCommonTimeRender } from '@/common/businessType';

export const handleTextOverflow = (text: any) => {
  return (
    <Tooltip title={text}>
      <span
        style={{
          width: '130px',
          display: 'inline-block',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>
    </Tooltip>
  );
};

export const handleStatusBadge = (text: any, color: any) => {
  return (
    <Badge
      style={{
        width: '150px',
        display: 'inline-block',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
      text={text}
      color={color}
    ></Badge>
  );
};

export const HandleTotalCount = (totalParams: any) => {
  const { total = {}, totalLeft, totalRight } = totalParams;
  return (
    <div className="total_warp">
      <div className="total_warp_left">
        {totalLeft.map((d: any) => (
          <div>
            <span className="total_warp_num">{total[d.value] || 0}</span>
            <span className="total_warp_title">{d.key}</span>
          </div>
        ))}
      </div>
      <div className="total_warp_right">
        {totalRight.map((d: any) => (
          <div>
            <span className="total_warp_num">{total[d.value] || 0}</span>
            <span className="total_warp_title">{d.key}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const handleTooltip = (text: any, timeTrue?: boolean) => {
  return (
    <Tooltip title={timeTrue ? handleCommonTimeRender(text) : text}>
      {timeTrue ? handleCommonTimeRender(text) : text}
    </Tooltip>
  );
};
