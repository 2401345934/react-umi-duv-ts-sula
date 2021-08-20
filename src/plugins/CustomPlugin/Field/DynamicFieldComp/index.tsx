import React from 'react';
import { Field } from 'bssula';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';

const DynamicFieldComp = (props: any) => {
  const { list } = props;
  const [fields, { add, remove }] = list;
  return (
    <>
      {fields.map((field: any) => {
        const { name, key, fieldKey, ...rest } = field;
        return (
          <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            {props.fields.map((fieldConfig: any) => {
              return (
                <Field
                  {...rest}
                  key={key}
                  name={[name, fieldConfig.name]}
                  fieldKey={[fieldKey, fieldConfig.name]}
                  rules={fieldConfig.rules}
                  field={fieldConfig.field}
                />
              );
            })}
            <MinusCircleOutlined onClick={() => remove(field.name)} key="remove" />
          </Space>
        );
      })}
      <Button
        style={{ width: 300 }}
        type="dashed"
        onClick={() => add()}
        block
        icon={<PlusOutlined />}
      >
        添加
      </Button>
    </>
  );
};

export default DynamicFieldComp;
