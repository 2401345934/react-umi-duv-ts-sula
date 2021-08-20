/*
 * @Description:
 * @Author: rodchen
 * @Date: 2021-06-27 15:58:26
 * @LastEditTime: 2021-07-01 16:36:25
 * @LastEditors: rodchen
 */
import { registerRenderPlugin } from 'bssula';

/** render插件 */

// 注册方式一
/* ***************************** 选中提示及清除 ************************************************* */
registerRenderPlugin('bs-selectButton')(({ ctx }: any) => {
  // debugger
  const selectedRows = ctx.table.getSelectedRows() || [];
  return (
    <div className="bssula-table-row-selects">
      <span>已选 {selectedRows.length} 项,&nbsp;</span>
      <span onClick={() => ctx.table.clearRowSelection()} className="customAdomStyle">
        清除
      </span>
    </div>
  );
}, true);

// 注册方式二
/* ***************************** 上传文件按钮 ************************************** */
