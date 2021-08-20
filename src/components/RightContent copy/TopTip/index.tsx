/*
 * @Description:
 * @Author: rodchen
 * @Date: 2021-08-09 16:21:33
 * @LastEditTime: 2021-08-17 20:45:57
 * @LastEditors: Please set LastEditors
 */
import headerTopIcon from '@/assets/ui/icon/header_top_home.png';
import { windowOpen } from '@/utils/utils';

export default () => {
  return (
    <div className="top_tip">
      <div className="top_text">
        <span>
          <img src={headerTopIcon} /> 日化智云首页 | 24小时服务热线：400-090-5188
        </span>
        <span>
          <span
            onClick={() => {
              windowOpen(purchase_portal_front_url);
            }}
          >
            集采平台
          </span>{' '}
          {'  '}|{' '}
          <span
            onClick={() => {
              windowOpen(oem_odm_portal_front_url);
            }}
          >
            OEM/ODM
          </span>{' '}
          ｜{' '}
          <span
            onClick={() => {
              windowOpen(study_club_portal_front_url);
            }}
          >
            研习社
          </span>
          ｜ 常见问题 ｜ 关于我们
        </span>
      </div>
    </div>
  );
};
