/*
 * @Author: your name
 * @Date: 2021-07-13 10:51:39
 * @LastEditTime: 2021-07-21 17:43:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \workbench-sharing-front\src\pages\InventoryManagement\InventoryAdjustment\AudioSteps\index.tsx
 */
import React, { useState, useEffect } from 'react';
import { Card, Steps, Modal, Spin } from 'antd';
import { request } from 'bssula';
import { handleCommonTimeRender } from '@/common/businessType';

const { Step } = Steps;
export default (props: any) => {
  const { url, name, auditRejection, approvedStatus, createUserName, createTime } = props;
  const [audioData, setAudioData]: any = useState('');
  useEffect(() => {
    request({
      url,
      method: 'GET',
      converter: ({ response: { data } }: any) => {
        setAudioData(data || []);
      },
    });
  }, []);

  return (
    <Modal {...props}>
      <Spin spinning={!audioData}>
        <Card>
          {audioData &&
            audioData.length > 0 &&
            audioData.map((audioItem: any, index: number) => {
              if (audioItem.status === auditRejection) {
                return (
                  <Steps style={{ marginTop: 30 }} current={1} progressDot>
                    <Step
                      title={
                        index
                          ? audioData.find((d: any) => d.status === auditRejection)
                            ? `更新${name}`
                            : `创建${name}`
                          : `创建${name}`
                      }
                      description={
                        <>
                          <div>创建人 : {audioItem.frontRecordCreateUserName}</div>
                          <div>
                            创建时间:{' '}
                            {audioItem.frontRecordCreateTime &&
                              handleCommonTimeRender(audioItem.frontRecordCreateTime)}
                          </div>
                        </>
                      }
                    />
                    <Step
                      title="审批"
                      description={
                        <>
                          <div style={{ color: 'red' }}>驳回</div>
                          <div>创建人 : {audioItem.createUserName}</div>
                          <div>
                            创建时间:{' '}
                            {audioItem.createTime && handleCommonTimeRender(audioItem.createTime)}
                          </div>
                          <div>驳回原因: {audioItem.remark}</div>
                        </>
                      }
                    />
                    <Step title="完成" />
                  </Steps>
                );
              }
              return (
                <Steps style={{ marginTop: 30 }} current={2} progressDot>
                  <Step
                    title={
                      audioData.find((d: any) => d.status === auditRejection)
                        ? `更新${name}`
                        : `创建${name}`
                    }
                    description={
                      <>
                        <div>创建人 : {audioItem.frontRecordCreateUserName}</div>
                        <div>
                          创建时间:{' '}
                          {audioItem.frontRecordCreateTime &&
                            handleCommonTimeRender(audioItem.frontRecordCreateTime)}
                        </div>
                      </>
                    }
                  />
                  <Step
                    title="审批"
                    description={
                      <>
                        <div>创建人 : {audioItem.createUserName}</div>
                        <div>
                          创建时间:
                          {audioItem.createTime && handleCommonTimeRender(audioItem.createTime)}
                        </div>
                      </>
                    }
                  />
                  <Step
                    title="完成"
                    description={
                      <>
                        <div>创建人 : {audioItem.createUserName}</div>
                        <div>
                          创建时间:
                          {audioItem.createTime && handleCommonTimeRender(audioItem.createTime)}
                        </div>
                      </>
                    }
                  />
                </Steps>
              );
            })}
          {Array.isArray(audioData) && audioData.length === 0 && (
            <Steps style={{ marginTop: 30 }} current={0} progressDot>
              <Step
                title={`创建${name}`}
                description={
                  <>
                    <div>创建人 : {createUserName}</div>
                    <div>
                      创建时间:
                      {createTime && handleCommonTimeRender(createTime)}
                    </div>
                  </>
                }
              />
              <Step title="审批" />
              <Step title="完成" />
            </Steps>
          )}
        </Card>
      </Spin>
    </Modal>
  );
};
