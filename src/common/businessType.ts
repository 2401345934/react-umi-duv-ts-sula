/*
 * @Description:
 * @Author: tomoe
 * @Date: 2021-02-03 13:53:09
 * @LastEditTime: 2021-08-19 22:56:02
 * @LastEditors: Please set LastEditors
 */

import moment from 'moment';

export function handleCommonTimeRender(text: any, format?: any) {
  const formatType = format || 'YYYY-MM-DD HH:mm:ss';
  return text && moment(text).format(formatType);
}
