/*
 * @Author: your name
 * @Date: 2021-03-31 14:23:54
 * @LastEditTime: 2021-08-18 14:29:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \yingzi-web-psc-buyerconsole\src\common\DictionaryEnum.ts
 */
/**
 * 公共部分
 */

class Enum extends Map {
  rows(key = 'value', value = 'text') {
    const map = this;
    return Array.from(map).map((item) => ({
      [key]: item[0],
      [value]: item[1],
      valueCode: item[0],
    }));
  }
}

// 账号
export const partner_list_status = new Enum([
  [10, '启用'],
  [20, '禁用'],
]);

// 合作方类型
export const partner_list_type = new Enum([
  [10, '供应商'],
  [20, '客户'],
]);

// 库存调整
export const inventory_adjustment_status = new Enum([
  [0, '草稿'],
  [1, '审核中'],
  [2, '执行中'],
  [3, '已完成'],
  [4, '被驳回'],
]);

// 订单order type
export const purchase_order_type = new Enum([
  [60, '采购单'],
  [61, '采购退货单'],
]);

export const sale_order_type = new Enum([
  [64, '销售单'],
  [65, '销售退货单'],
]);

// 订单order status
export const purchase_order_status = new Enum([
  [-1, '审核拒绝'],
  [0, '完成'],
  [1, '草稿'],
  [25, '待审核'],
  [29, '执行中'],
]);

// 活动列表
export const activity_list_status = new Enum([
  [0, '草稿'],
  [1, '待审核'],
  [2, '审核通过'],
  [3, '审核拒绝'],
  [4, '执行中'],
  [5, '中止'],
  [6, '已关闭(主动)'],
]);

// 活动审核状态
export const order_status_audit = new Enum([
  [1, '审核通过'],
  [5, '审核驳回'],
]);

// 库存变更记录
export const inventory_change_type = new Enum([
  // [10, '调拨单'],
  // [20, '盘点单'],
  [30, '调整单'],
  // [40, '移仓单'],
  [50, '采购入库单'],
  [60, '采购退货单'],
  [70, '销售出库单'],
  [80, '销售退货单'],
]);

// 库存变更记录
export const inventory_change_record_type = new Enum([
  [10, '入库通知单'],
  [20, '出库通知单'],
  [30, '入库结果单'],
  [40, '出库结果单'],
]);

// 商品spu状态
export const commdit_spu_status = new Enum([
  [0, '草稿'],
  [1, '审核中'],
  [2, '销售中'],
  [3, '已下架'],
  [5, '草稿'],
]);

// 商品spu状态  audit
export const role_type = new Enum([
  [10, '超级管理员'],
  [20, '系统'],
  [30, '自建'],
]);
