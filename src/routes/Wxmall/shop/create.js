import React,{PureComponent} from 'react';
import {connect} from 'dva';
import {Row,Col,Card,Form,Input,Button} from 'antd';
// 面包屑头
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
const FormItem = Form.Item;
@connect(state=>({
  rule: state.rule
}))
@Form.create()
export default class ShopCreate extends PureComponent{
  constructor(props){
    super(props);
  }
  // 提交修改商铺表单数据
  handleSubmit = (e)=>{
    e.preventDefault();
    const {form,dispatch,history} = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'rule/createShopInfo',
          payload: values
        });
        form.resetFields();
      }
    });
  }
  // 重置表单
  handleFormReset = ()=>{
    const {form} = this.props;
    return form.resetFields();
  }
  render(){
    const {form:{getFieldDecorator}} = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 8,
          offset: 16,
        },
      },
    };
    return(
      <PageHeaderLayout title="添加商户">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} layout="vertical">
              <FormItem
                {...formItemLayout}
                label="商户名称"
                hasFeedback
              >
                {getFieldDecorator('realname', {
                  rules: [{
                    required: true, message: '请输入商户名称!',
                  }],
                })(
                  <Input placeholder="请输入商户名称!" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="手机号码"
                hasFeedback
              >
                {getFieldDecorator('mobile', {
                  rules: [{
                    required: true, message: '请输入手机号码!',
                  },{
                    pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
                    message: '请输入正确的手机号码'
                  }],
                })(
                  <Input placeholder="请输入手机号码!" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="地址"
                hasFeedback
              >
                {getFieldDecorator('address')(
                  <Input placeholder="请输入地址!" />
                )}
              </FormItem>
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">确定</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>  
                  </FormItem>
                </Col>
              </Row>
            </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}