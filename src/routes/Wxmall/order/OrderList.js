import React, { PureComponent } from 'react';
// dva 连接组件
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, DatePicker, Modal, message,Icon,Tabs} from 'antd';
import moment from 'moment';
// 面包屑头
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import TableList from '../../../components/Table/index';
import styles from '../../Setting/TableList.less';
const FormItem = Form.Item;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
@connect(state => ({
  rule: state.rule,
}))
@Form.create()
export default class OrderList extends PureComponent {
  constructor(props){
    super(props);
    // 出事状态
    this.state = {
      modalVisible: false, //显示标记modal
      expandForm: false, //展开高级搜索,
    };
  }
  // 显示modal
  handleModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  }
  // 搜索事件
  handleSearch = (e) => {
    e.preventDefault();
    const {dispatch,form} = this.props;
    form.validateFields((err,value)=>{
      const {date} = value;
      if(!err){
        dispatch({
          type: 'rule/fetchOrderList',
          payload: Object.assign(value,{startDate:date[0].format('YYYY-MM-DD'),endDate:date[1].format('YYYY-MM-DD')})
        });
      }else{
        message.error('搜索失败请检查输入是否合法');
      }
    });
  }
  // 展开高级搜索
  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }
  // 重置搜索
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  }
  // 渲染搜索表单
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单日期">
              {getFieldDecorator('date',{
                initialValue:[moment(new Date(), dateFormat), moment(new Date(), dateFormat)],
                rules: [{
                  required: true, message: '请选择查询时间',
                }]
              })(
                <RangePicker style={{ width: '100%' }} format={dateFormat}/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="商家名称">
              {getFieldDecorator('shopName')(
                <Input placeholder="请输入商家名称" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单日期">
              {getFieldDecorator('date',{
                initialValue:[moment(new Date(), dateFormat), moment(new Date(), dateFormat)],
                rules: [{
                  required: true, message: '请选择查询时间',
                }]
              })(
                <RangePicker style={{ width: '100%' }} format={dateFormat}/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="商家名称">
              {getFieldDecorator('shopName')(
                <Input placeholder="请输入商家名称" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">未付款</Option>
                  <Option value="1">核销</Option>
                  <Option value="2">已完成</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="联系电话">
              {getFieldDecorator('cellphone', {
                rules: [{
                  pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/,
                  message: '请输入正确的联系电话'
                }],
              })(
                <Input style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
  // 获取表格数据
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetchOrderList'
    });
  }
  // 订单详情
  handleDetails = (e,record,index)=>{
    const {dispatch,rule:{loading}}  = this.props;
    dispatch({
      type: 'rule/fetchOrderDetail',
      payload: record.id
    });
    if(!loading){
      this.handleModalVisible();
    }
  }
  render() {
    // 表格数据
    const {rule: { loading, product,data },form:{getFieldDecorator}} = this.props;
    // 表格列数据
    const columns = [{
      title: '订单ID',
      key:'id',
      dataIndex:'id'
    },{
      title: '订单号',
      key:'orderNo',
      dataIndex:'orderNo'
    },{
      title: '总价',
      key:'totalPrice',
      dataIndex:'totalPrice'
    },{
      title: '总数',
      key:'totalQuantity',
      dataIndex:'totalQuantity'
    },{
      title: '坏支数',
      key:'trackingNum',
      dataIndex:'trackingNum'
    },{
      title:'收货人',
      key: 'consigneeName',
      dataIndex: 'consigneeName'
    },{
      title:'收货人电话',
      key: 'contact',
      dataIndex: 'contact'
    },{
      title:'收货人地址',
      key: 'address',
      dataIndex: 'address'
    },{
      title:'快递费',
      key: 'expressFee',
      dataIndex: 'expressFee'
    },{
      title:'备注',
      key: 'remark',
      dataIndex: 'remark'
    },{
      title:'订单状态',
      key: 'status',
      dataIndex: 'status'
    },{
      title: '订单创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      render: (ket,record,index)=> moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')
    },{
      title: '操作',
      key:'operating',
      dataIndex:'operating',
      render: (key,record,index) =>  <Button type="primary" icon="profile" size='small'  onClick={()=>this.handleDetails(key,record,index)}>查看订单详情</Button>
    }];
    // 订单数据1
    const columns1 = [{
      title: '商品id',
      key:'productId',
      dataIndex:'productId'
    },{
      title: '商品名称',
      key:'productName',
      dataIndex:'productName'
    },{
      title: '商品价格',
      key:'price',
      dataIndex:'price'
    },{
      title: '商品数量',
      key:'quantity',
      dataIndex:'quantity'
    },{
      title: '商品总价',
      key:'totalPrice',
      dataIndex:'totalPrice'
    }];
    // 状态
    const {modalVisible} = this.state;
    // 表单布局
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
          offset: 17,
        },
      },
    };
    return (
      <PageHeaderLayout title="订单列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>
              {this.renderForm()}
            </div> */}
          {/* 表格信息 */}
            <TableList
              loading={loading}
              data={product}
              columns={columns}
            />
            <Modal
              title="订单详情"
              visible={this.state.modalVisible}
              onOk={this.handleModalVisible}
              okText="确认"
              onCancel={this.handleModalVisible}
              width={1000}
            >
              <TableList
                loading={loading}
                data={data}
                columns={columns1}
              />
            </Modal>
          </div>
        </Card>
       
      </PageHeaderLayout>
    );
  }
}
