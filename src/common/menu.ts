// @ts-nocheck
/*
 * @Description:
 * @Author: rodchen
 * @Date: 2020-12-15 21:01:09
 * @LastEditTime: 2021-08-20 21:21:17
 * @LastEditors: Please set LastEditors
 */
export const EnumTableTypeMenu = Object.freeze({
  ADD_ROWS_ACTION: 1,
  ADD_ROWS: 2,
  ROWS_ACTION: 3,
  NO_ROWS_ACTION: 4,
  ANT_DESIGN_TITLE: 5,
});

 class Enum extends Map {
  rows (key = 'value', value = 'text') {
    const map = this;
    return Array.from(map).map((item) => ({
      [key]: item[0],
      [value]: item[1],
      valueCode: item[0],
    }));
  }
}

// 常用状态
export const status = new Enum([
  [10, '启用'],
  [20, '禁用'],
]);

