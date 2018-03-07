import React, { PureComponent } from 'react';
// dva 连接组件
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, Modal, Icon,Tree,message} from 'antd';
// 面包屑头
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import TableList from '../../../components/Table/index';
import styles from '../../Setting/TableList.less';
const FormItem = Form.Item;
const { Option } = Select;
const TreeNode = Tree.TreeNode;
@connect(state => ({
  rule: state.rule,
}))
@Form.create()
export default class categoryList extends PureComponent {
  constructor(props){
    super(props);
    // 出事状态
    this.state = {
      tableData: [], //table 数据
      modalVisible: false, //显示标记modal
      treeData: [], //树形菜单数据
      pid: '', //分类父id
      modalEditVisible: false, //显示编辑modal
      initData:{} //初始编辑数据
    };
  }
  // 添加分类
 handleAddCategory = (e) => {
    e.preventDefault();
    const { form,dispatch } = this.props;
    form.validateFields((err, values)=>{
      if(!err){
        dispatch({
          type:'rule/addCategory',
          payload:values
        });
        this.handleModalVisible();
      }
    });
  }
  // 重置搜索
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  }
   // 显示modal
  handleModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  }
  handleModalEditVisible = () => {
    this.setState({
      modalEditVisible: !this.state.modalEditVisible,
    });
  }
   // 显示modal
  handleEditInit = (recode) => {
    this.setState({
      initData: recode
    });
    this.handleModalEditVisible()
  }
  // 渲染搜索表单
  renderSimpleForm() {
    return (
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button style={{ marginLeft: 8 }} type="primary" onClick={this.handleModalVisible}>添加类型</Button>
            </span>
          </Col>
        </Row>
    );
  }

  // 做你妈卖逼.垃圾项目
  renderForm() {
    return this.renderSimpleForm();
  }
  // 获取表格数据
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetchCategory',
    }).then(({data})=>{
      if(data.status === '200'){
        sessionStorage.setItem('sel',JSON.stringify(data.data));
        this.setState({
          treeData: [...data.data],
        });
      }
    });
  }
  // 渲染分类树形节点
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.key} dataRef={item} />;
    });
  }
  onSelTree = (onKey,info)=>{
    if(onKey.length >0){
      if(info.node.props.dataRef.children && info.node.props.dataRef.children.length >0){
        this.setState({
          tableData: info.node.props.dataRef.children
        });
      }else{
        this.setState({
          tableData: [info.node.props.dataRef]
        });
      }
    }else{
      message.info('取消选择');
    }
  }
  // 点击展开异步加载分类
  handleOnLoadData = (treeNode)=>{
    // 使用异步加载判断是否存在子节点。如果存在子节点就返回
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      // console.log(treeNode.props.dataRef.id)
      if(treeNode.props.dataRef.id){
        this.props.dispatch({
          type: 'rule/fetchCategory',
          payload: treeNode.props.dataRef.id
        }).then(({data})=>{
          if(data.status === '200'){
            treeNode.props.dataRef.children = data.data;
            this.setState({
              pid: treeNode.props.dataRef.id,
              treeData: [...this.state.treeData],
            });
            resolve();
          }
        });
      }
    });
  }
  // 提交编辑分类
  handleEditCategory = (e)=>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    form.validateFields((err, values)=>{
      if(!err){
        dispatch({
          type:'rule/editCategoey',
          id: this.state.initData.id,
          payload:values
        });
        this.handleModalEditVisible();
      }
    });
  }
  render() {
    // 表格数据
    const {rule: { loading, data},form:{getFieldDecorator}} = this.props;
    const {tableData} = this.state;
    // 表格列数据
    const columns = [{
      title: '分类id',
      key:'id',
      dataIndex:'id'
    }, {
      title: '分类名称',
      key:'name',
      dataIndex:'name',
    },{
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      render: (e,recode,index)=><Button type="primary"  onClick={()=>this.handleEditInit(recode)}>编辑</Button>
    }];
    return (
      <PageHeaderLayout title="商品分类">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
          {/* 表格信息 */}
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Tree
                   showLine
                   loadData={this.handleOnLoadData}
                   onSelect={this.onSelTree}
                >
                  {this.renderTreeNodes(this.state.treeData)}
                </Tree>
              </Col>
              <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                <TableList
                  loading={loading}
                  data={tableData}
                  columns={columns}
                />
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Modal
                  title="添加类型"
                  visible={this.state.modalVisible}
                  onOk={this.handleModalVisible}
                  okText="确认"
                  onCancel={this.handleModalVisible}
                  footer={null}
                >
                  <Form onSubmit={this.handleAddCategory} layout="vertical">
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                      <Col md={24} sm={24}>
                        <FormItem label="类型名称">
                          {getFieldDecorator('name', {
                             rules: [{
                              required: true, message: '请输入类型名称',
                            }]
                          })(
                            <Input style={{ width: '100%' }} />
                          )}
                        </FormItem>
                      </Col>
                      <Col md={24} sm={24}>
                        <FormItem label="分类">
                          {getFieldDecorator('parentId')(
                            <Select placeholder="请选择分类" style={{ width: '100%' }}>
                              <Option value={null}>顶级分类</Option>
                              {JSON.parse(sessionStorage.getItem('sel')) !== null && JSON.parse(sessionStorage.getItem('sel')).length>0 && JSON.parse(sessionStorage.getItem('sel')).map((item)=>{
                                return <Option value={item.id} key={item.id}>{item.name}</Option>
                              })}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <div style={{ overflow: 'hidden' }}>
                      <span style={{ float: 'right', marginBottom: 24 }}>
                        <Button type="primary" htmlType="submit">添加</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                      </span>
                    </div>
                  </Form>
                </Modal>
                <Modal
                  title="编辑类型"
                  visible={this.state.modalEditVisible}
                  onOk={this.handleModalEditVisible}
                  okText="确认"
                  onCancel={this.handleModalEditVisible}
                  footer={null}
                >
                  <Form onSubmit={this.handleEditCategory} layout="vertical">
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                      <Col md={24} sm={24}>
                        <FormItem label="类型名称">
                          {getFieldDecorator('name', {
                            initialValue:this.state.initData.name,
                             rules: [{
                              required: true, message: '请输入类型名称',
                            }]
                          })(
                            <Input style={{ width: '100%' }} />
                          )}
                        </FormItem>
                      </Col>
                      <Col md={24} sm={24}>
                        <FormItem label="分类">
                          {getFieldDecorator('parentId',{
                            initialValue:this.state.pid,
                          })(
                            <Select placeholder="请选择分类" style={{ width: '100%' }}>
                              <Option value={null}>顶级分类</Option>
                              {JSON.parse(sessionStorage.getItem('sel')) !== null && JSON.parse(sessionStorage.getItem('sel')).length>0 && JSON.parse(sessionStorage.getItem('sel')).map((item)=>{
                                return <Option value={item.id} key={item.id}>{item.name}</Option>
                              })}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <div style={{ overflow: 'hidden' }}>
                      <span style={{ float: 'right', marginBottom: 24 }}>
                        <Button type="primary" htmlType="submit">编辑</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                      </span>
                    </div>
                  </Form>
                </Modal>
              </Col>
            </Row>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
