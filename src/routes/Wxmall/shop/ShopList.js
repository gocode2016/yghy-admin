import React, { PureComponent } from 'react';
// dva 连接组件
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Modal, Icon} from 'antd';
// 面包屑头
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import TableList from '../../../components/Table/index';
import styles from '../../Setting/TableList.less';

const FormItem = Form.Item;
@connect(state => ({
  rule: state.rule,
}))
@Form.create()
export default class ShopList extends PureComponent {
  constructor(props){
    super(props);
  }
  // 搜索
  handleSearch = (e)=>{
    e.preventDefault();
    const {dispatch,form} = this.props;
    form.validateFields((err, values)=>{
      if(!err){
        dispatch({
          type:'rule/fetch',
          payload:values
        });
      }
    });
  }
  // 重置表单
  handleFormReset = ()=>{
    const {form} = this.props;
    return form.resetFields();
  }
  // 添加商户
  handleAddShop = ()=>{
    this.props.history.push('/merchant/create')
  }
  // 渲染搜索表单
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="手机号码">
              {getFieldDecorator('mobile',{
                rules: [{
                  pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
                  message: '请输入正确的手机号码'
                }]
              })(
                <Input placeholder="手机号码" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="商户名称">
              {getFieldDecorator('realname')(
                <Input placeholder="请输入商户名称!" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Button type="primary" onClick={this.handleAddShop} style={{marginTop:10}}>添加商户</Button>
          </Col>
        </Row>
      </Form>
    );
  }
  renderForm() {
    return this.renderSimpleForm();
  }
  // 获取表格数据
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }
 
  render() {
    // 表格数据
    const {rule: { loading, data }} = this.props;
    // 表格列数据
    const columns = [{
      title: '账户',
      key:'account',
      dataIndex:'account',
    }, {
      title: '地址',
      key:'address',
      dataIndex:'address',
    }, {
      title: '余额',
      key:'balance',
      dataIndex:'balance',
    }, {
      title: '是否绑定手机号码',
      key:'bindedNum',
      dataIndex:'bindedNum',
      render: (e)=>e===0?<span>未绑定</span>:<span>已绑定</span> 
    }, {
      title: '手机号码',
      key:'mobile',
      dataIndex:'mobile',
    }, {
      title: '密码',
      key:'password',
      dataIndex:'password'
    },{
      title: '商户名称',
      key: 'realName',
      dataIndex: 'realName'
    }, {
      title: '操作',
      key:'operating',
      dataIndex:'operating',
      render: (key,record) => <div><Button type="primary"  size='small' onClick={() => this.handleTableEdit(record)} style={{marginBottom:'.2rem',marginRight:'.2rem'}}>禁用商户</Button></div>
    }]
    return (
      <PageHeaderLayout title="商户管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm} style={{marginBottom:'1.125rem'}}>
              {this.renderForm()}
            </div>
          {/* 表格信息 */}
            <TableList
              loading={loading}
              data={data}
              columns={columns}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
