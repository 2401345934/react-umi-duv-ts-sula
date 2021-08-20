// @ts-ignore
import React from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined, LoadingOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import { request } from 'umi';
import { handleBaseUrlPre, handleError } from '@/utils/utils';

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList: [],
      fileListIds: [],
      // 获取整个upload对象
      fileDatas: [],
      // 上传是否需要url
      fileListUrls: [],
      initFlag: false,
      loading: false,
    };
  }

  componentWillReceiveProps(nextProps: any) {
    const { onChange, value, initChangeAll } = nextProps;
    if (value && !this.state.initFlag && Array.isArray(value)) {
      if (initChangeAll) {
        onChange(value);
      } else {
        const urls = value.map((d: any) => d?.url || d);
        onChange(urls);
      }
      this.setState({
        fileList: value.map((d: any) => {
          if (typeof d === 'object') {
            return {
              ...d,
              url: d.url,
              name: d.name,
            };
          } else if (typeof d === 'string') {
            return {
              url: d,
            };
          }
        }),
        initFlag: true,
      });
    }
  }

  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      // eslint-disable-next-line no-param-reassign
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = (info: any) => {
    const { onChange, isAll }: any = this.props;
    const { fileList, fileListUrls, fileDatas }: any = this.state;
    this.setState({
      loading: true,
      initFlag: true,
    });
    if (info && info?.fileList?.length && info.fileList.length > fileList.length) {
      const formdata = new FormData();
      formdata.append('file ', info.file);
      request(`${handleBaseUrlPre('purchasing')}/upload`, {
        method: 'POST',
        data: formdata,
      })
        .then((res: any) => {
          if (handleError(res)) {
            const { data } = res;
            if (onChange) {
              // 接口上传不需要Url
              // eslint-disable-next-line no-lonely-if
              if (isAll) {
                fileDatas.push(data);
                onChange(fileDatas);
              } else {
                fileListUrls.push(data.url);
                onChange(fileListUrls);
              }
            }
            this.setState({
              fileList: info.fileList,
              initFlag: true,
              fileListUrls,
              fileDatas,
            });
          }
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    } else {
      this.setState({ loading: false });
    }
  };

  handleRemove = (file: any) => {
    const { onChange, isAll }: any = this.props;
    const { fileDatas }: any = this.state;
    this.setState((state: any) => {
      const index = state.fileList.indexOf(file);
      const newFileList = state.fileList.slice();
      newFileList.splice(index, 1);
      const newFileListIds = state.fileListIds.slice();
      newFileListIds.splice(index, 1);
      if (onChange) {
        if (isAll) {
          fileDatas.splice(index, 1);
          onChange(fileDatas);
        } else {
          onChange(newFileList.map((d: any) => d.url));
        }
      }
      return { fileList: newFileList, fileListIds: newFileListIds };
    });
  };

  render() {
    // @ts-ignore
    const { previewVisible, previewImage, fileList, previewTitle, loading } = this.state;
    const {
      maxLength,
      uploadTitle,
      ctx = {},
      suffixRule = ['.png', '.jpg'],
      size = 3,
      title,
      disabled,
      align = 'left',
      video,
    }: any = this.props;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : video ? <VideoCameraAddOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>{uploadTitle || '上传图片'}</div>
      </div>
    );
    return (
      <div style={{ textAlign: align }}>
        {title || ''}
        <Upload
          action={`${handleBaseUrlPre('purchasing')}/upload`}
          listType="picture-card"
          // @ts-ignore
          fileList={fileList}
          onPreview={this.handlePreview}
          accept=""
          style={{ position: 'relative' }}
          disabled={ctx.mode === 'view' || disabled}
          onRemove={this.handleRemove}
          onChange={this.handleChange}
          // @ts-ignore
          beforeUpload={(file: any) => {
            // 文件校验
            const extName = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            if (file.size > size * 1024 * 1024) {
              message.error(`上传文件不能超过${size}M!`);
              return Upload.LIST_IGNORE;
            }
            if (suffixRule.length > 0 && !suffixRule.includes(extName)) {
              message.error(`请上传${suffixRule.toString()}等格式的文件!`);
              return Upload.LIST_IGNORE;
            }
            return false;
          }}
        >
          {fileList.length >= (maxLength || 8) || ctx.mode === 'view' || disabled
            ? null
            : uploadButton}

          {/* <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              textAlign: 'center',
              background: 'red',
            }}
          >
            111
          </div> */}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          destroyOnClose
          onCancel={this.handleCancel}
        >
          {video ? (
            <video src={previewImage} style={{ width: '100%' }} controls>
              <p>
                你的浏览器不支持 HTML5 视频。可点击
                <a href={previewImage}>此链接</a>
                观看
              </p>
            </video>
          ) : (
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          )}
        </Modal>
      </div>
    );
  }
}
