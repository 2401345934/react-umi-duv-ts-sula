/* eslint-disable no-nested-ternary */
/*
 * @Description:
 * @Author: rodchen
 * @Date: 2021-01-20 23:23:08
 * @LastEditTime: 2021-07-20 19:56:55
 * @LastEditors: Please set LastEditors
 */
import React from 'react';
import { Select } from 'antd';
import { request } from 'bssula';
import { omit, debounce } from 'lodash';

export default class BsSearchSelect extends React.Component<any> {
  initSource = false;
  constructor(props: any) {
    super(props);
    this.state = {
      source: props.source || [],
      saveSearchVal: '',
    };
  }

  componentDidMount() {
    const {
      requestConfig: { initValuesEcho },
    } = this.props;
    if (!initValuesEcho) {
      this.handleSearch('');
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const {
      requestConfig: { initValuesEcho },
      value,
    } = nextProps;
    if (initValuesEcho && !this.initSource && value?.length) {
      this.handleSearch('', value.join(','));
      this.initSource = true;
    }
    if (nextProps.source) {
      this.setState({
        source: nextProps.source,
      });
    }
  }

  hasVal = (value: any) => {
    if (value == null || value === undefined || String(value).trim() === '') {
      return false;
    }
    return true;
  };

  innerChange = (value: any) => {
    this.setState({
      saveSearchVal: '',
    });
    const { onChange } = this.props as any;
    onChange(value);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleBlur = (e: any) => {
    const { needInputSelect, ctx } = this.props;
    const { saveSearchVal } = this.state;
    if (!!saveSearchVal && needInputSelect && ctx.form.getFieldValue('supplierType') === 1) {
      this.innerChange(saveSearchVal);
      this.setState({
        saveSearchVal: '',
      });
    }
  };

  handleSearch = (value: any, initValue?: any) => {
    const { requestConfig, ctx } = this.props as any;
    if (value) {
      this.setState({
        saveSearchVal: value,
      });
    }
    if (!requestConfig) return;
    const fixedParam = {};
    if (requestConfig.fixedparameter && requestConfig.fieldValToParam) {
      requestConfig.fixedparameter.forEach((item: any, index: any) => {
        const fixedParamVal = ctx.form.getFieldValue(requestConfig.fieldValToParam[index]);
        if (fixedParamVal) {
          fixedParam[item] = fixedParamVal;
        }
      });
    }
    request({
      url: requestConfig.url,
      method: 'get',
      convertParams: ({ params }: any) => {
        let reqParams = {};
        if (requestConfig.filter) {
          reqParams = {
            [requestConfig.filter]: value,
          };
        } else if (initValue && initValue.length) {
          reqParams = {
            [requestConfig.initValuesEcho]: initValue,
          };
        }
        return {
          pageSize: 5000,
          ...params,
          ...fixedParam,
          ...reqParams,
        };
      },
    }).then((res: any) => {
      const keys = res.list ? 'list' : 'items';
      const source = res
        ? res[keys]
          ? res[keys].map((item: any) => {
              return {
                text: item[requestConfig.mappingTextField],
                value: item[requestConfig.mappingValueField],
              };
            })
          : Array.isArray(res) &&
            res?.map((item: Record<string, any>) => {
              return {
                text: item[requestConfig.mappingTextField],
                value: item[requestConfig.mappingValueField],
              };
            })
        : [];
      this.setState({
        source: Array.isArray(source) ? source : [],
      });
    });
  };

  handleSelect = () => {
    const { requestConfig, ctx } = this.props as any;
    this.setState({
      saveSearchVal: '',
    });
    if (!requestConfig) return;
    const fixedParam = {};
    if (requestConfig.fixedparameter && requestConfig.fieldValToParam) {
      requestConfig.fixedparameter.forEach((item: any, index: any) => {
        const fixedParamVal = ctx.form.getFieldValue(requestConfig.fieldValToParam[index]);
        if (fixedParamVal) {
          fixedParam[item] = fixedParamVal;
        }
      });
    }
    request({
      url: requestConfig.url,
      method: 'get',
      convertParams: ({ params }: any) => {
        let reqParams = {};
        if (requestConfig.filter) {
          reqParams = {
            [requestConfig.filter]: '',
          };
        }
        return {
          pageSize: 5000,
          ...params,
          ...fixedParam,
          ...reqParams,
        };
      },
    }).then((res: any) => {
      const keys = res.list ? 'list' : 'items';
      const source = res
        ? res[keys]
          ? res[keys].map((item: any) => {
              return {
                text: item[requestConfig.mappingTextField],
                value: item[requestConfig.mappingValueField],
              };
            })
          : Array.isArray(res) &&
            res?.map((item: Record<string, any>) => {
              return {
                text: item[requestConfig.mappingTextField],
                value: item[requestConfig.mappingValueField],
              };
            })
        : [];
      this.setState({
        source: Array.isArray(source) ? source : [],
      });
    });
  };

  render() {
    const {
      value,
      placeholder,
      ctx,
      requestConfig = {},
      disabled,
      selectMuch,
      ...restProps
    } = this.props;

    const { source } = this.state;
    const { Option } = Select;
    return (
      <Select
        labelInValue={this.props.inlabelInValue}
        showSearch
        value={value}
        allowClear
        disabled={!!(ctx.mode === 'view' || disabled)}
        placeholder={placeholder || '请选择'}
        onChange={this.innerChange}
        onSearch={requestConfig.filter ? debounce(this.handleSearch, 500) : () => {}}
        onFocus={requestConfig.filter ? this.handleSelect : () => {}}
        onBlur={this.handleBlur}
        mode={selectMuch ? 'multiple' : undefined}
        // showArrow={true}
        filterOption={(input, option) => {
          if (requestConfig) {
            return true;
          }
          return option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        }}
        {...restProps}
      >
        {source.map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.text}
            </Option>
          );
        })}
      </Select>
    );
  }
}
