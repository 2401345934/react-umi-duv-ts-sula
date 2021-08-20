import { request } from 'umi';
import { stringify } from 'qs';

// 查询组织视图树
export async function getOrganizationTree(params: object) {
  if (params) {
    return request(`/bop/api/orgViewNode/getOrgTree?${stringify(params)}`);
  }
  return request(`/bop/api/orgViewNode/getOrgTree`);
}

// 流程中心-审核通过
export async function procTaskApprove(params: object) {
  return request(`/bop/api/procTask/approve`, {
    method: 'POST',
    data: params,
  });
}

// 流程中心-拒绝
export async function procTaskReject(params: object) {
  return request(`/bop/api/procTask/reject`, {
    method: 'POST',
    data: params,
  });
}

// home
export async function getHome(params: any) {
  return request(`/bop/api/home/${params}`);
}
