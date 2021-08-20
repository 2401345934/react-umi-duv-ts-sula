/*
 * @Description:
 * @Author: tomoe
 * @Date: 2021-02-03 13:53:09
 * @LastEditTime: 2021-07-22 21:06:06
 * @LastEditors: Please set LastEditors
 */

import moment from 'moment';

export const dictCodeCollection = Object.freeze({
  MessageTypeCode: 'MES000003',
  PersonTypeCode: 'BOP00003', /// 人员信息类别
  CurrenyCode: 'MDM00005', // 账号币种
  BankCategory: 'MDM00006', // 银行类别
  AdministrationLevelCode: 'MDM00009',
  TechnicalTitleCode: 'MDM00010',
  PostCode: 'MDM00011',
  EmploymentTypeCode: 'MDM00012',
  NationalVocationalNameCode: 'MDM00013',
  NationalVocationalLevelCode: 'MDM00014',
  NationalTechnicalLevelCode: 'MDM00015',
  TechnicalLevelCode: 'MDM00016',
  CompanyTypeCode: 'BOP00005', // 企业类别
  businessFormatCode: 'BOP00009',
  StarCode: 'BOP00010', // 星级
  HouseholdsCode: 'BOP00011', // 户别
  MaterialSourceCode: 'BOP00007', // 资料来源
  MeasuringUnitCode: 'DO0001', // 计量单位
  DepartmentCode: 'CENTERCODE', /// 所属中心/应用
  HandleTypeCode: 'OPERATOR', /// 操作类型
  StaffTypeCode: 'BOP00024', /// 人员信息类别
  CategoryCode: 'MDM00018', // 所属类别
  PhysicalWarehouseTypeCode: 'MDM00019', /// 仓库形式
  VolumeUnitCode: 'MDM00020', /// 容积单位
  AreaUnitCode: 'MDM00020', /// 面积单位
  CompanyCode: 'BOPCOMPANY', // 所属公司
  OwnershipCode: 'owner', // 所有权
  InboundTypeCode: 'INV00005', // 入库类型
  SubmitStatusCode: 'INV00004', // 提交状态
  // ReceivingStatus:'INV00006', // 收货状态
  // DeliveryStatus:'INV00007', // 发货状态
});

const businessTypeCollection = Object.freeze({
  MessageChannel: [
    {
      type: 0,
      value: '短信',
    },
    {
      type: 1,
      value: '邮件',
    },
  ], // 消息渠道
  MessageStatus: [
    {
      type: 0,
      value: '启用',
    },
    {
      type: 1,
      value: '禁用',
    },
  ], // 消息模板状态
  MessageSendStatus: [
    {
      type: '0',
      value: '待发送',
    },
    {
      type: '1',
      value: '全部发送成功',
    },
    {
      type: '2',
      value: '部分发送成功',
    },
    {
      type: '3',
      value: ' 发送失败',
    },
  ], // 消息发送状态
  MessageSendStatusInline: [
    {
      type: '0',
      value: '待发送',
    },
    {
      type: '1',
      value: '发送成功',
    },
    {
      type: '2',
      value: ' 发送失败',
    },
  ], // 批次内消息发送状态
  OrganViewStatus: [
    {
      type: 10,
      value: '启用',
    },
    {
      type: 20,
      value: '禁用',
    },
  ],
  EmployeeStatus: [
    {
      type: 10,
      value: '启用',
    },
    {
      type: 20,
      value: '禁用',
    },
  ], // 批次内消息发送状态
  dataSource: [
    {
      type: 10,
      value: 'MDM',
    },
    {
      type: 20,
      value: '平台自建',
    },
    {
      type: 30,
      value: '精益营销平台创建',
    },
  ], // 性别
  sex: [
    {
      type: 10,
      value: '男',
    },
    {
      type: 20,
      value: '女',
    },
  ], // 人员类别信息
  personType: [
    {
      type: '10',
      value: '体制内',
    },
    {
      type: '20',
      value: '非体制内',
    },
    {
      type: '30',
      value: '商业公司人员',
    },
    {
      type: '40',
      value: '外部人员',
    },
    {
      type: '50',
      value: '零售户店主',
    },
    {
      type: '60',
      value: '会员',
    },
  ], // 账号状态
  status: [
    {
      type: 10,
      value: '启用',
    },
    {
      type: 20,
      value: '禁用',
    },
  ], // 组织视图启用禁用状态
  OrganViewPropertyStatus: [
    {
      type: 10,
      value: '启用',
    },
    {
      type: 20,
      value: '禁用',
    },
  ], // 属性状态
  FrameType: [
    {
      type: 10,
      value: '列表取值',
    },
    {
      type: 20,
      value: '文本输入',
    },
    {
      type: 30,
      value: '时间',
    },
  ], // 取值类型
  IsSingleValue: [
    {
      type: 2,
      value: '单选',
    },
    {
      type: 1,
      value: '多选',
    },
  ], // 属性选项
  propertyStatus: [
    {
      type: 10,
      value: '启用',
    },
    {
      type: 20,
      value: '禁用',
    },
  ], // 属性状态
  // companyType: [
  //   {
  //     type: 10,
  //     value: '集团',
  //   },
  //   {
  //     type: 20,
  //     value: '子公司',
  //   },
  //   {
  //     type: 30,
  //     value: '供应商',
  //   },
  //   {
  //     type: 40,
  //     value: '零售户',
  //   },
  // ],
  // 企业类别
  BusinessEnable: [
    {
      type: true,
      value: '启用',
    },
    {
      type: false,
      value: '禁用',
    },
  ], // 企业状态
  isDefaultAccount: [
    {
      type: true,
      value: '是',
    },
    {
      type: false,
      value: '否',
    },
  ], // 是否默认账户
  WorkFlowStatus: [
    {
      type: 1,
      value: '执行中',
    },
    {
      type: 2,
      value: '已挂起',
    },
    {
      type: 3,
      value: '已取消',
    },
    {
      type: 4,
      value: '已完成',
    },
  ],
  /// 流程执行状态
  ExecuteStatus: [
    {
      type: 10,
      value: '待处理',
    },
    {
      type: 20,
      value: '已完成',
    },
    {
      type: 30,
      value: '已取消',
    },
  ],
  /// 资源类型状态
  ResourceType: [
    {
      type: 10,
      value: '应用',
    },
    {
      type: 20,
      value: '菜单',
    },
    {
      type: 30,
      value: '按钮',
    },
  ],
  // 数据字典管理--数据来源
  DictionaryDataSource: [
    {
      type: 10,
      value: '平台自建',
    },
    {
      type: 20,
      value: 'MDM',
    },
  ],
  // 数据字典管理--是否启用
  DictionaryIsEnable: [
    {
      type: true,
      value: '是',
    },
    {
      type: false,
      value: '否',
    },
  ],
  // 数据字典管理--字典启用状态
  DictionaryEnableStatus: [
    {
      type: true,
      value: '启用',
    },
    {
      type: false,
      value: '禁用',
    },
  ],
  // 数据字典管理--数据字典类型
  DataDictionaryTypes: [
    {
      type: false,
      value: '静态',
    },
    {
      type: true,
      value: '动态',
    },
  ],
  labelGroup: [
    {
      type: 1,
      value: '商品',
    },
    {
      type: 2,
      value: '数据字典',
    },
    {
      type: 3,
      value: '会员',
    },
    {
      type: 4,
      value: '客户',
    },
  ],
  ClientType: [
    {
      type: 10,
      value: 'PC端',
    },
    {
      type: 20,
      value: '移动端',
    },
  ],
  // 是否物流管理部门
  isLogistics: [
    {
      type: 1,
      value: '是',
    },
    {
      type: 2,
      value: '否',
    },
  ],
  // 启用状态
  physicalWarehouseStatus: [
    {
      type: 1,
      value: '启用',
    },
    {
      type: 2,
      value: '禁用',
    },
  ],
  // 是否货位管理
  isGoodsManagement: [
    {
      type: 1,
      value: '是',
    },
    {
      type: 2,
      value: '否',
    },
  ],
  StockType: [
    {
      type: 1,
      value: '可用库存',
    },
    {
      type: 2,
      value: '锁定库存',
    },
  ], // 库存类型
  // RecordType: [
  //   {
  //     type: 1,
  //     value: '通知单',
  //   },
  //   {
  //     type: 2,
  //     value: '结果单',
  //   },
  // ], // 单据类型
  // ChangeType: [
  //   {
  //     type: 1,
  //     value: '通知单',
  //   },
  //   {
  //     type: 2,
  //     value: '结果单',
  //   },
  // ],

  // ],
  VirtualWarehouseStatus: [
    {
      type: 1,
      value: '正常',
    },
    {
      type: 2,
      value: '失效',
    },
  ],
  ChannelWarehouseStatus: [
    {
      type: 1,
      value: '正常',
    },
    {
      type: 2,
      value: '失效',
    },
  ],
  ItemRuleStatus: [
    {
      type: 1,
      value: '所有商品',
    },
    {
      type: 2,
      value: '指定商品',
    },
  ],
  // 权限类型
  CodeType: [
    {
      type: 20,
      value: '菜单',
    },
    {
      type: 30,
      value: '按钮',
    },
  ],
});

export const VirtualWarehouseStatusMap = new Map([
  [1, '#108ee9'],
  [2, '#f50'],
]);

export const ChannelWarehouseStatusMap = new Map([
  [1, '#108ee9'],
  [2, '#f50'],
]);

export function handleBusinessTypeRender(key: string, type: number | string) {
  const data = businessTypeCollection[key];
  const ItemOne =
    data.find((item: any): boolean => {
      return item.type === type;
    }) || {};
  return ItemOne.value;
}

export function handleCommonTimeRender(text: any, format?: any) {
  const formatType = format || 'YYYY-MM-DD HH:mm:ss';
  return text && moment(text).format(formatType);
}

export function handleCommonTimeRenderHours(text: any, format?: any) {
  const formatType = format || 'YYYY-MM-DD';
  return text && moment(text).format(formatType);
}

export { businessTypeCollection };
