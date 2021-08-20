/*
 * @Author: your name
 * @Date: 2021-06-02 11:37:45
 * @LastEditTime: 2021-06-02 11:40:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \yingzi-web-psc-buyerconsole\src\components\SulaButtonStyle\index.tsx
 */

export default (props: any) => {
  return (
    <div className="sula-form">
      <div className="sula-form-action-bottom">
        <div className="ant-space ant-space-horizontal ant-space-align-center">
          {props.children}
        </div>
      </div>
    </div>
  );
};
