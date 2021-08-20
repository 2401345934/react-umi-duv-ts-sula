/* eslint-disable @typescript-eslint/no-shadow */
/*
 * @Author: your name
 * @Date: 2021-04-01 10:03:46
 * @LastEditTime: 2021-07-13 15:09:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \yingzi-web-psc-sellerconsole\src\sula\customerPlugin\fields\TreeSelect\index.tsx
 */

import { useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
// @ts-ignore
import { request } from 'bssula';

export default (props: any) => {
  const { code, mode } = props;
  const [treeData, setTreeData] = useState([]);
  const [value, setValue] = useState(undefined);
  const [initFlag, setInitFlag] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const onChange = (value: any) => {
    setValue(value);

    props.onChange(value);
  };
  const { placeholder, ismultiple, inurl, disabled } = props;
  useEffect(() => {
    request({
      url: inurl,
      method: 'GET',
    })
      .then((res: any) => {
        const newTreeData: any = [...res];
        const changeData = (res: any) => {
          for (let index = 0; index < res.length; index++) {
            res[index].title = res[index].name;
            // if (getCode) {
            //   res[index].value = code ? res[index][code] : res[index].categoryCode;
            // } else {
            //   res[index].value = code ? res[index][code] : res[index].id;
            // }
            res[index].value = code ? res[index][code] : res[index].id;
            res[index].disabled = res[index].children;
            if (res[index].children) {
              changeData(res[index].children);
            }
          }
        };
        changeData(newTreeData);
        setTreeData(newTreeData);
        console.log(newTreeData);
      })
      .catch((res: any) => {
        console.log('error', res);
      });
  }, []);

  useEffect(() => {
    if (initFlag && props.value) {
      setValue(props.value);
      setInitFlag(false);
    }
  }, [props.value]);

  return (
    <>
      <TreeSelect
        listHeight={512}
        showSearch
        style={{ width: '100%' }}
        value={value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder={placeholder}
        allowClear
        multiple={ismultiple}
        // treeDefaultExpandAll
        disabled={mode === 'view' || disabled}
        onChange={onChange}
        treeData={treeData}
      ></TreeSelect>
      {/* <Select style={{ width: '50%' }} /> */}
    </>
  );
};
