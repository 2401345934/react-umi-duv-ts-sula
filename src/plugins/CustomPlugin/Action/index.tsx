import { registerActionPlugin, request } from 'bssula';

registerActionPlugin('bs-delete', async (ctx: any, config: any) => {
  // 此处用到的 async, 非必要情况可以不用
  // config 是自定义的配置项
  const {
    requestCfg: { url, method },
  } = config;
  // ctx 是实例对象
  const {
    table: { getSelectedRowKeys },
  } = ctx;
  const querys = getSelectedRowKeys().join(',');
  await request({
    url: url + querys,
    method,
    successMessage: '删除成功',
  });
});
