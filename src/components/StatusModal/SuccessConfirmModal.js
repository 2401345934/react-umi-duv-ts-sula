import React, * as react from 'react';
import { Modal, Button } from 'antd';

class SuccessConfirmModal extends react.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { modalVisible, contentText, SuccessModalCtx, handleModalCallback } = this.props;

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        title="提示"
        visible={modalVisible}
        closable={false}
        footer={[
          <Button type="primary" key="success" onClick={() => handleModalCallback(SuccessModalCtx)}>
            我知道了
          </Button>,
        ]}
      >
        {contentText}
      </Modal>
    );
  }
}

export default SuccessConfirmModal;
