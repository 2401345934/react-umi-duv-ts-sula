/*
 * @Author: your name
 * @Date: 2021-07-05 21:20:02
 * @LastEditTime: 2021-07-05 21:20:04
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \workbench-sharing-front\src\components\RemoteSearch\onLoadTreeSelect.tsx
 */
import { request } from 'bssula';
import { TreeSelect } from 'antd';
import { useEffect, useState } from 'react';

const OnLoadTreeSelect = (props: any) => {
  const [treeData, setTreeData] = useState([]);
  const { ctx, value, onChange, placeholder, name, remoteSource } = props;

  const { urlRoot, url, resKeyValue = ['id', 'name'] } = remoteSource;

  const getChildrenNode = async (list: any, pId: string) => {
    let resultList = list;
    // 没有值根据当前父节点获取下面子节点并挂在树节点中，添加到对应父节点的children中
    const childrenList = await request({ url: `${url}/${pId}` }).then((res: any) => {
      return res[0]?.children;
    });
    if (childrenList && childrenList.length) {
      resultList = list.map((i: any) => {
        if (i.id === pId) {
          // eslint-disable-next-line no-param-reassign,@typescript-eslint/no-use-before-define
          i.children = childrenList.map((j: any) => mapSearchTree(j));
        }
        return i;
      });
    }
    return resultList;
  };

  const onLoadData = (treeNode: any) =>
    new Promise((resolve: any) => {
      const Pid = treeNode?.props?.id;
      setTimeout(async () => {
        const newTreeData = await getChildrenNode(treeData, Pid);
        setTreeData(newTreeData);
        resolve();
      }, 300);
    });

  const mapSearchTree = (treeDataItem: any) => {
    return {
      title: treeDataItem[resKeyValue[1]],
      value: `${treeDataItem[resKeyValue[0]]}___${treeDataItem.parentId}`, //  因为子类目有重复ID，关联多个父类目
      id: treeDataItem[resKeyValue[0]],
      pId: treeDataItem.parentId,
      isLeaf: false,
    };
  };

  const handleChange = (data: any) => {
    onChange(data);

    ctx.form.setFieldValue(name, data);
  };

  useEffect(() => {
    // 调用获取树数据的服务
    request({
      url: urlRoot,
    }).then((res: any) => {
      const data = res || [];
      const coverData =
        (data &&
          data.length &&
          data.map((ites: any) => {
            const Item = mapSearchTree(ites);
            return Item;
          })) ||
        [];
      setTreeData(coverData);
    });
  }, []);

  return (
    <TreeSelect
      showSearch={false}
      style={{ width: '100%' }}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeData={treeData}
      placeholder={placeholder}
      allowClear
      showArrow={true}
      // @ts-ignore
      filterOption={false}
      notFoundContent={null}
      treeDefaultExpandAll
      onChange={handleChange}
      loadData={onLoadData}
    />
  );
};

export default OnLoadTreeSelect;
