import React, * as react from 'react';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import styles from '@/components/StatusModal/index.less';

class TipsConfirmModal extends react.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      modalVisible,
      handleModalVisible,
      contentText,
      handleModalCallback,
      cancelText = '继续编辑',
      continueText = '是',
      modalTitle = '提示',
    } = this.props;

    return (
      <div key="modalCancel" className={styles.tipsModalStyle}>
        <Modal
          // getContainer={document.getElementsByClassName('div')[0]}
          getContainer={false}
          destroyOnClose
          maskClosable={false}
          visible={modalVisible}
          closable={false}
          // onCancel={() => handleModalVisible()}
          footer={null}
          bodyStyle={{ fontSize: 16, padding: 36 }}
        >
          <div>
            <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 16 }} />
            {modalTitle}
          </div>
          <div style={{ color: '#999999', margin: '14px 0px 10px 30px', fontSize: 14 }}>
            {contentText}
          </div>
          <div style={{ paddingLeft: '60%' }}>
            <Button
              type="default"
              key="cancel"
              onClick={() => handleModalVisible()}
              style={{ marginRight: 10 }}
            >
              {cancelText}
            </Button>
            <Button type="primary" key="leave" onClick={() => handleModalCallback()}>
              {continueText}
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default TipsConfirmModal;
