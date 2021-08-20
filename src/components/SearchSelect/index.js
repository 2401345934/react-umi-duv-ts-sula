/*
 * @Date: 2020-07-09 08:33:34
 * @LastEditTime: 2021-07-14 09:54:37
 */
import React, * as react from 'react';
import { Checkbox, Divider, Select, Tooltip } from 'antd';
import { request } from 'umi';
import { stringify } from 'qs';

const { Option } = Select;

class Index extends react.PureComponent {
  state = {
    data: [],
    value: undefined,
    defaultPageSize: 3000,
    initValue: false,
    searchValue: '',
    checkedValue: false,
    searchData: {},
  };

  timer;

  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) onRef(this);
    this.getList();
  }

  componentWillReceiveProps(nextProps) {
    const { checkedValue } = this.state;
    // 清空取消全选状态
    if (!nextProps.value && checkedValue) {
      this.setState({
        checkedValue: false,
      });
    }
  }

  getList = async (value = '') => {
    this.state.initValue = true;
    const {
      pageSize, // 查询条数限制
      disabledSearch = false,
      url,
      // data,
      searchCondition,
    } = this.props;
    const { defaultPageSize, searchData } = this.state;
    if (disabledSearch) return;
    const size = pageSize || defaultPageSize;
    const payload = {
      currentPage: 1,
      pageSize: size,
      [searchCondition]: value,
    };
    this.setState({ data: [] });
    const resData = await request(`${url}${stringify(payload)}`);
    if (resData && resData.status === '0' && resData?.data?.length) {
      const { data } = resData;
      this.setState({ data, searchValue: value, searchData: payload });
    }
  };

  handleSearch = (value) => {
    this.setState({ checkedValue: false });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.getList(value);
    }, 800);
  };

  handleChange = (value) => {
    const { form, onChange, selectAll, mode } = this.props;
    if (form) {
      // 表单里使用
      const { id } = this.props;
      const { setFieldsValue } = form;
      setFieldsValue({ [id]: value });
    } else this.setState({ value });

    if (!value || !value.length) this.getList('');

    const { data } = this.state;
    if (selectAll && mode && mode === 'multiple') {
      const flag = data.every((item) => value.includes(item.valueCode));
      this.setState({ checkedValue: flag });
    }

    if (onChange) {
      onChange(value, data);
    }
  };

  handleFocus = () => {
    this.getList();
    // const { searchValue } = this.state;
    // this.getList(searchValue);
  };

  setStateData = ({ optionData }) => {
    if (optionData) this.setState({ data: optionData });
  };

  // 全选/全不选
  handleCheckedChange = (e, props) => {
    const { onChange } = this.props;
    const { options, value } = props;
    value.length = 0;
    if (e.target.checked) {
      options.map((item) => props.value.push(item.props.value));
      this.setState({ checkedValue: true }, () => onChange(props.value));
    } else {
      this.setState({ checkedValue: false }, () => onChange(props.value));
    }
  };

  disabledCheckbox = (props) =>
    props.options && props.options.length && props.options[0].key === 'NOT_FOUND';

  render() {
    const {
      placeholder,
      style,
      text = 'name',
      keys = 'code',
      disabled,
      showArrow,
      mode = '',
      loading,
      labelInValue = false,
      selectAll,
      ...otherProps
    } = this.props;
    const { data = [], value, checkedValue } = this.state;
    const dropdownRender = (menu, props) => (
      <div>
        <div
          style={{ padding: '5px 0 5px 12px', cursor: 'pointer' }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <Checkbox
            onChange={(e) => this.handleCheckedChange(e, props)}
            checked={checkedValue}
            disabled={props.options.length === 0 || !data.length || this.disabledCheckbox(props)}
          >
            选择全部
          </Checkbox>
        </div>
        <Divider style={{ margin: '2px 0' }} />
        {menu}
      </div>
    );
    if (selectAll && mode && mode === 'multiple') {
      otherProps.dropdownRender = dropdownRender;
    }

    return (
      <Select
        showSearch
        allowClear
        value={value || this.props.value}
        placeholder={placeholder}
        style={style}
        defaultActiveFirstOption={false}
        showArrow={!!showArrow}
        filterOption={false}
        onSearch={this.handleSearch}
        onFocus={this.handleFocus}
        notFoundContent={null}
        disabled={disabled}
        mode={mode}
        labelInValue={labelInValue}
        {...otherProps}
        onChange={this.handleChange}
      >
        {data.map((d) => (
          <Option key={d[keys]} value={d[keys]}>
            {/* {d.value} */}
            {(!labelInValue && <Tooltip title={d[text]}>{d[text]}</Tooltip>) || d[text]}
          </Option>
        ))}
      </Select>
    );
  }
}

export default Index;
