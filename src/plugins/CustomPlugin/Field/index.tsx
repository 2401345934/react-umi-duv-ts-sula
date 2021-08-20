/*
 * @Description:
 * @Author: rodchen
 * @Date: 2021-06-27 15:58:26
 * @LastEditTime: 2021-07-27 17:26:43
 * @LastEditors: Please set LastEditors
 */
import { registerFieldPlugin, request } from 'bssula';
import { Input, Tooltip } from 'antd';
import moment from 'moment';
import { isValidateValue } from '@/utils/utils';
import RemoteSearch from '@/components/RemoteSearch';
import RemoteSearchNeedShowOpt from '@/components/RemoteSearch/searchShowOpt';
import RemoteSearchTreeSelect from '@/components/RemoteSearch/treeSelect';
import RemoteDepartmentTreeSelect from '@/components/RemoteSearch/departmentTreeSelect';
import RemoteStationNeedShowOpt from '@/components/RemoteSearch/stationShowOpt';
import BsNumberRange from './BsNumberRange';
import BsTableField from './BsTableField';
import BsBuyInformation from './BsBuyInformation';
import BsUploadList from './BsUploadList';
import BsDragUpload from './BsDragUpload';
import DynamicFieldComp from './DynamicFieldComp';
import RemoteOnLoadTreeSelect from '@/components/RemoteSearch/onLoadTreeSelect';
import BsSearchSelect from './BsSearchSelect';
import TreeSelect from './TreeSelect';
import EditorDemo from './BraftEditor';

registerFieldPlugin('braft-editor')(EditorDemo, true, true);
registerFieldPlugin('bs-treeSelect')(TreeSelect, true, true);
registerFieldPlugin('bs-searchSelect')(BsSearchSelect, true, true);
/** field插件 */
registerFieldPlugin('bs-dynamic-field-comp')(DynamicFieldComp);
/* ***************************** 数字范围 ******************************** */
registerFieldPlugin('bs-numberRange')(BsNumberRange, true, true);

/* ***************************** 表单项 - 不可编辑表格 **************************** */
registerFieldPlugin('bs-TableField')(BsTableField, true, true);
/* ***************************** 表单项 - 上传 **************************** */
registerFieldPlugin('bs-uploadList')(BsUploadList, true, true);
registerFieldPlugin('bs-dragUpload')(BsDragUpload, true, true);
/* ***************************** 表单项 - 可编辑表格（未完成） ****************************** */
// registerFieldPlugin('bs-editTableField')(BsEditTableField, true, true);
registerFieldPlugin('bs-buy-information')(BsBuyInformation, true, true);

/* ***************************** 重复项校验 **************************** */
registerFieldPlugin('bs-testItemInput')(
  (ctx: any) => {
    const {
      onChange,
      requstCfg, // 请求内容
    } = ctx;

    /* 请求数据，获取数据源，然后比对当前值 */
    // 接口数据
    let data;
    request({
      ...requstCfg,
    }).then((res: any) => {
      data = res.items;
      console.log(data);
    });

    // 临时数据源
    const testArr = ['a', 'b', 'c', 'd'];

    const handleOnChange = (e: any) => {
      const hasName = testArr.some((item: any) => item === e.target.value);
      if (hasName) {
        return onChange('hasItem');
      }
      return onChange(e.target.value);
    };
    return (
      <div>
        <Input onChange={handleOnChange} />
      </div>
    );
  },
  true,
  true,
);

/* ***************************** form详情文字项 ******************************** */
registerFieldPlugin('bs-formText')(
  ({ ctx, text, id, formatDate, value, isEllemepis }: any) => {
    // 处理时间 需要先引入 moment ， 然后在页面的适用时， 在props下传入一个moment的时间格式(如: YYYY-MM-DD)
    if (formatDate) {
      if (!ctx.form.getFieldsValue(true)[id]) return '';
      return moment(ctx.form.getFieldsValue(true)[id]).format(formatDate);
    }

    let textVal = '';
    // 非空校验
    if (isValidateValue(ctx.form.getFieldValue(id))) {
      textVal = ctx.form.getFieldValue(id);
    } else if (isValidateValue(value)) {
      textVal = value;
    } else {
      textVal = text;
    }

    if (isEllemepis) {
      return (
        <Tooltip title={textVal}>
          <span
            style={{
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              // whiteSpace: 'wrap',
            }}
          >
            {textVal}
          </span>
        </Tooltip>
      );
    }

    return <span style={{ wordWrap: 'break-word' }}>{textVal}</span>;
  },
  true,
  true,
);

/* ***************************** 基本select ******************************** */
registerFieldPlugin('bs-remoteSearch')(RemoteSearch, true, true); // 注入 source 和 ctx

/* ***************************** 分组select ******************************** */
registerFieldPlugin('bs-remoteSearchNeedShowOpt')(RemoteSearchNeedShowOpt, true, true);

/* ***************************** 树选择 ******************************** */
registerFieldPlugin('bs-remoteSearchTreeSelect')(RemoteSearchTreeSelect, true, true);

/* ***************************** 分组树选择 ******************************** */
registerFieldPlugin('bs-remoteDepartmentTreeSelect')(RemoteDepartmentTreeSelect, true, true);

/* ***************************** 分组select ******************************** */
registerFieldPlugin('bs-remoteStationNeedShowOpt')(RemoteStationNeedShowOpt, true, true);

registerFieldPlugin('customremotesearchneedshowopt')(RemoteSearchNeedShowOpt, true, true); // 分组select

registerFieldPlugin('customremotesearchtreeselect')(RemoteSearchTreeSelect, true, true); // 树选择

registerFieldPlugin('customremotedepartmenttreeselect')(RemoteDepartmentTreeSelect, true, true); // 树选择

registerFieldPlugin('customremotestationneedshowopt')(RemoteStationNeedShowOpt, true, true); // 分组select

registerFieldPlugin('customremotesearchonload')(RemoteOnLoadTreeSelect, true, true); // 分组select 异步加载数据
