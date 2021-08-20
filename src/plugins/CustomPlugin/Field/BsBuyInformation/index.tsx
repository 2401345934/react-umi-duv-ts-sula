/*
 * @Author: your name
 * @Date: 2021-07-05 15:35:56
 * @LastEditTime: 2021-07-17 19:19:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \workbench-sharing-front\src\plugins\CustomPlugin\Field\BsBuyInformation\index.tsx
 */
// @ts-nocheck

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Form, Input, Row, Col, Descriptions, DatePicker } from 'antd';
import { handleCommonTimeRender } from '@/common/businessType';
import moment from 'moment';

const BsInformation = forwardRef((props: any, ref: any) => {
  const [init, setInit]: any = useState(true);
  const [form] = Form.useForm();
  const [information, setInformation]: any = useState(props.value || []);
  const [isAddObj, setAddObj]: any = useState({});
  useEffect(() => {
    if (props.value && init) {
      setInformation([...(props.value || []), {}]);
      setInit(false);
    } else {
      setInformation([{}]);
    }
  }, [props.value]);

  useEffect(() => {
    if (props.onRef) {
      props.onRef({
        ...form,
        setInformation,
        information,
      });
    }
  }, [form]);

  return (
    <Form layout="inline" form={form} name="informationWrap11">
      <Form.List name="information">
        {() => (
          <>
            {information &&
              information.map((rowItem: any, rowIndex: any) => (
                <>
                  {/* 只有最有一个可以编辑输入
                   */}
                  {rowIndex + 1 !== information.length && (
                    <Descriptions column={2} key={rowIndex}>
                      <Descriptions.Item label="回访日期">
                        {rowItem.feedbackTime && handleCommonTimeRender(rowItem.feedbackTime)}
                      </Descriptions.Item>
                      <Descriptions.Item label="回访信息">
                        {rowItem.feedbackRemark}
                      </Descriptions.Item>
                    </Descriptions>
                  )}
                  {rowIndex + 1 === information.length && (
                    <Row key={rowIndex} style={{ width: '100%' }}>
                      <Col span={12}>
                        <Form.Item
                          label="回访日期"
                          name={[rowIndex, 'feedbackTime']}
                          rules={[
                            {
                              required: true,
                              message: '回访日期',
                            },
                          ]}
                        >
                          <DatePicker
                            disabledDate={(currentDate: any) =>
                              currentDate.valueOf() < moment().subtract(1, 'days')
                            }
                            onChange={(e: any) => {
                              information[rowIndex].feedbackTime = e;
                              setInformation([...information]);
                              // props?.onChange([...information]);
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={[rowIndex, 'feedbackRemark']}
                          label="回访信息"
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: '请输入回访信息',
                            },
                          ]}
                        >
                          <Input.TextArea
                            onBlur={(e: any) => {
                              const { target } = e;
                              information[rowIndex].feedbackRemark = target.value;
                              setInformation([...information]);
                              // props?.onChange([...information]);
                            }}
                            placeholder="请输入回访信息"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                </>
              ))}
          </>
        )}
      </Form.List>
    </Form>
  );
});

export default BsInformation;
