import React from 'react';
import { Upload, Modal, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { request } from 'umi';
import { handleError } from '@/utils/utils';
const { Dragger } = Upload;
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
      fileListUrls: props.needUrl ? [] : false,
      initFlag: false,
      loading: false,
    };
  }

  // if (nextProps.value && JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
  //   this.formRef.current.setDataSource(nextProps.value);
  // }

  componentWillReceiveProps(nextProps: any) {
    console.log(nextProps, 'nextProps');
    const { value, multiBand, onChange }: any = this.props;
    // debugger;
    if (nextProps.value !== value) {
      this.setState((state: any) => {
        return {
          fileList: (Array.isArray(nextProps.value)
            ? nextProps.value
            : JSON.parse(nextProps.value)
          ).map((item: any) => {
            return { ...item, name: item.originalName };
          }),
          fileDatas: Array.isArray(nextProps.value) ? nextProps.value : JSON.parse(nextProps.value),
        };
      });
      // if (multiBand) {
      //   if (
      //     nextProps.value &&
      //     JSON.stringify(nextProps.value) !== JSON.stringify(value) &&
      //     Array.isArray(nextProps.value)
      //   ) {
      //     onChange(nextProps.value);
      //     this.setState({
      //       fileList: nextProps.value,
      //       fileListIds: nextProps.value,
      //       initFlag: true,
      //     });
      //   }
      // } else {
      //   if (nextProps.getFile) {
      //     if (nextProps.value && nextProps.value.length !== 0) {
      //       const fileIds = nextProps.value.map((d: any) => {
      //         return d.fileId;
      //       });
      //       const newFileList = [];
      //       for (let indexList = 0; indexList < nextProps.value.length; indexList++) {
      //         newFileList.push({
      //           ...nextProps.value[indexList],
      //         //  url: nextProps.value[indexList].downLoadUrl,
      //           name: nextProps.value[indexList].name,
      //         });
      //       }
      //       this.setState({
      //         fileDatas: nextProps.value,
      //         fileList: newFileList,
      //         // fileList: nextProps.value.map((d: any, index: any) => ({
      //         //   ...d,
      //         //   url: d.downLoadUrl,
      //         //   name: d.name || `name${index}`,
      //         // })),
      //         fileListIds: fileIds,
      //       });
      //       // console.log(nextProps.value, newFileList, fileIds);
      //
      //       return;
      //     }
      //   }
      //   // @ts-ignore
      //   if (nextProps.value && !this.state.initFlag && Array.isArray(nextProps.value)) {
      //     const ids = nextProps.value.map((d: any) => {
      //       if (typeof d === 'object') {
      //         return d.fileId;
      //       }
      //       return d;
      //     });
      //
      //     onChange(ids.length === 1 ? ids.join(',') : ids);
      //     this.setState({
      //       fileList: nextProps.value.map((d: any) => ({
      //         ...d,
      //         //url: d.downLoadUrl,
      //         // name: d.fileName,
      //       })),
      //       fileListIds: ids,
      //       initFlag: true,
      //     });
      //   }
      // }
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
      // previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = (info: any) => {
    const { onChange, url, maxLength, needUrl, getFile }: any = this.props;
    const { fileListIds, fileList, fileListUrls }: any = this.state;
    const { fileDatas }: any = this.state;
    this.setState({
      loading: true,
    });
    if (info && info?.fileList?.length && info.fileList.length > fileList.length) {
      const formdata = new FormData();
      formdata.append('file ', info.file);
      request(url || '/api/oss/upload/uploadFile', {
        method: 'POST',
        data: formdata,
      })
        .then((res: any) => {
          if (handleError(res)) {
            const { data } = res;
            console.log(info.fileList, 'info.fileList');

            if (onChange) {
              if (getFile) {
                // fileDatas = [...fileList];
                fileDatas.push({ name: info.file.name, ...data });
                onChange(fileDatas);
                this.setState({ fileDatas });
              } else if (needUrl) {
                // 接口上传需要Url
                //fileListUrls.push(data.downLoadUrl);
                onChange(fileListUrls.join(','));
                this.setState({ fileListUrls });
              } else {
                // 接口上传不需要Url
                // eslint-disable-next-line no-lonely-if
                // if (maxLength === 1) {
                //   onChange(data.fileId);
                // } else {
                //   onChange([data.fileId, ...fileListIds]);
                // }

                if (maxLength === 1) {
                  onChange(data);
                } else {
                  onChange([data, ...fileDatas]);
                }
              }
            }
            this.setState({
              fileList: info.fileList,
              fileListIds: [data.fileId, ...fileListIds],
              fileDatas: [data, ...fileDatas],
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
    const { onChange, getFile }: any = this.props;
    const { fileDatas }: any = this.state;
    this.setState((state: any) => {
      const index = state.fileList.indexOf(file);
      const newFileList = state.fileList.slice();
      newFileList.splice(index, 1);
      const newFileListIds = state.fileListIds.slice();
      newFileListIds.splice(index, 1);
      // if (onChange) {
      //   /*if (getFile) {
      //     fileDatas.splice(index, 1);
      //     onChange(fileDatas);
      //   } else {
      //     onChange(newFileListIds);
      //   }*/
      //   fileDatas.splice(index, 1);
      //   //onChange(fileDatas);
      // }
      fileDatas.splice(index, 1);
      onChange(fileDatas);
      return { fileList: newFileList, fileListIds: newFileListIds, fileDatas };
    });
  };

  render() {
    // @ts-ignore
    const { previewVisible, previewImage, fileList, previewTitle, loading } = this.state;
    const {
      url,
      maxLength,
      uploadTitle,
      ctx = {},
      suffixRule = ['.png', '.jpg'],
      size = 3,
      title,
      disabled,
      align = 'left',
    }: any = this.props;
    // ctx.mode === 'view' &&
    //   value &&
    //   (fileList =
    //     value && typeof value === 'string'
    //       ? value.split(',').map((item: any, index: any) => {
    //           return {
    //             uid: index,
    //             url: item,
    //             name: `img${index + 1}`,
    //           };
    //         })
    //       : value);
    const uploadButton = (
      <div>
        {/*{loading ? <LoadingOutlined /> : <PlusOutlined />}*/}
        {/*<div style={{ marginTop: 8 }}>{uploadTitle || '上传图片'}</div>*/}
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
        <p className="ant-upload-hint">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</p>
      </div>
    );
    return (
      <div style={{ textAlign: align }}>
        {title || ''}
        <Dragger
          action={url || '/api/oss/upload/uploadFile'}
          // listType="picture-card"
          // @ts-ignore
          fileList={fileList}
          onPreview={this.handlePreview}
          accept=""
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
        </Dragger>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
