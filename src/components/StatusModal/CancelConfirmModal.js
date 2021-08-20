import React, * as react from 'react';
import { Modal, Button } from 'antd';

import styles from './index.less';

class CancelConfirmModal extends react.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { modalVisible, handleModalVisible, contentText, handleModalCallback } = this.props;

    return (
      <div key="modalCancel" className={styles.cancelModalStyle}>
        <Modal
          // getContainer={document.getElementsByClassName('div')[0]}
          getContainer={false}
          destroyOnClose
          maskClosable={false}
          title="提示"
          visible={modalVisible}
          closable={false}
          // onCancel={() => handleModalVisible()}
          footer={[
            <Button type="default" key="cancel" onClick={() => handleModalVisible()}>
              继续编辑
            </Button>,
            <Button type="primary" key="leave" onClick={() => handleModalCallback()}>
              是
            </Button>,
          ]}
          bodyStyle={{ textAlign: 'center', fontSize: 16, padding: 36 }}
        >
          {contentText}
        </Modal>
      </div>
    );
  }
}

export default CancelConfirmModal;
