/*
 * @Author: your name
 * @Date: 2021-04-08 11:02:59
 * @LastEditTime: 2021-07-28 21:07:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \yingzi-web-psc-sellerconsole\src\sula\customerPlugin\fields\BraftEditor\index.tsx
 */
// @ts-ignore
import React from 'react';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import { message } from 'antd';
import { handleBaseUrlPre } from '@/utils/utils';

export default class EditorDemo extends React.Component {
  state: any = {
    // 创建一个空的editorState作为初始值
    editorState: BraftEditor.createEditorState(null),
  };
  componentWillReceiveProps(nextProps: any) {
    // 默认值
    if (nextProps.value != this.props.value) {
      // this.setState({ editorState: BraftEditor.createEditorState(nextProps.value) });
      this.setState({ editorState: nextProps.value });
    }
  }
  // async componentDidMount() {
  //   // 假设此处从服务端获取html格式的编辑器内容
  //   const htmlContent = await fetchEditorContent();
  //   // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
  //   this.setState({
  //     editorState: BraftEditor.createEditorState(htmlContent),
  //   });
  // }

  // submitContent = async () => {
  //   // 在编辑器获得焦点时按下ctrl+s会执行此方法
  //   // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
  //   const htmlContent = this.state.editorState.toHTML();
  //   alert('暂存成功');
  //   // const result = await saveEditorContent(htmlContent);
  // };

  handleEditorChange = (editorState: any) => {
    this.setState({ editorState });
    // this.props.onChange(editorState.toRAW());
    // console.log(JSON.stringify(editorState.toHTML()));
    // console.log(JSON.parse(JSON.stringify(editorState.toHTML())));

    this.props.onChange(editorState.toHTML());
  };

  myUploadFn = (param: any) => {
    let serverURL = `${handleBaseUrlPre('purchasing')}/upload`;
    // @ts-ignore
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    const errorFn = (response: any) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: 'unable to upload.',
      });
    };
    const successFn = (response: any) => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      const baseUrl = JSON.parse(xhr.responseText);
      if (baseUrl?.status === '0' && baseUrl.data.url) {
        param.success({
          // url: xhr.responseText,
          url: baseUrl.data.url,
          // meta: {
          //   id: 'xxx',
          //   title: 'xxx',
          //   alt: 'xxx',
          //   loop: false, // 指定音视频是否循环播放
          //   autoPlay: false, // 指定音视频是否自动播放
          //   controls: true, // 指定音视频是否显示控制栏
          //   poster: 'http://xxx/xx.png', // 指定视频播放器的封面
          // },
        });
      } else {
        errorFn(response);
        message.error('图片上传失败');
      }
    };

    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress((event.loaded / event.total) * 100);
    };

    xhr.upload.addEventListener('progress', progressFn, false);
    xhr.addEventListener('load', successFn, false);
    xhr.addEventListener('error', errorFn, false);
    xhr.addEventListener('abort', errorFn, false);

    fd.append('file', param.file);
    // const resposne = JSON.parse(getCookie('userInfo') || '{}');
    xhr.open('POST', serverURL, true);
    // xhr.setRequestHeader('tenantId', getCookie('tenantId'));
    // xhr.setRequestHeader('ticket', resposne?.ticket || '');
    xhr.withCredentials = true;

    xhr.send(fd);
  };
  render() {
    const { editorState } = this.state;
    return (
      <div
        className="my-component"
        style={{ width: '100%', border: '1px solid #C0C0C0', borderRadius: '10px' }}
      >
        <BraftEditor
          readOnly={this.props?.ctx?.mode === 'view'}
          media={{
            uploadFn: this.myUploadFn,
            externals: {
              image: false,
              video: false,
              audio: false,
              embed: false,
            },
            accepts: {
              image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg',
              video: false,
              audio: false,
            },
            // validateFn: (file) => {
            //   if (!(file.size < 1024 * 1024 * 5)) {
            //     message.error('图片大小超过5M');
            //   }
            //   return file.size < 1024 * 1024 * 5;
            // },
          }}
          value={editorState}
          onChange={this.handleEditorChange}
          // onSave={this.submitContent}
        />
      </div>
    );
  }
}
