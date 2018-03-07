import React, { PureComponent } from 'react';
// dva 连接组件
import { connect } from 'dva';
import { Row, Col, Card, Form, Input,  Button, Modal, Icon,Tree,message} from 'antd';
// 面包屑头
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import TableList from '../../../components/Table/index';
import styles from '../../Setting/TableList.less';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
@connect(state => ({
  rule: state.rule,
}))
@Form.create()
export default class Product extends PureComponent {
  constructor(props){
    super(props);
    // 出事状态
    this.state = {
      treeData: [],
      isShow: false,
      categoryId: null,
      categoryName: ''
    };
  }
  // 重置搜索
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  }
  // 添加商品
  handleAddShop = ()=>{
    this.props.history.push({pathname:'/product/create',search:'?id='+this.state.categoryId+'&name='+this.state.categoryName});
  }
  // 商品搜索
  handleSearch = (e)=>{
    e.preventDefault();
    const {dispatch,form} = this.props;
    form.validateFields((err, values)=>{
      if(!err){
        dispatch({
          type: 'rule/fetchProduct',
          payload: values
        });
      }
    });
  }
  // 渲染搜索表单
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="商品名称">
              {getFieldDecorator('productName')(
                <Input placeholder="请输入商品名称!" />
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
        {this.state.isShow && <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Button type="primary" onClick={this.handleAddShop} style={{marginTop:10}}>添加商品</Button>
          </Col>
        </Row>}
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
      type: 'rule/fetchCategory',
    }).then(({data})=>{
      if(data.status === '200'){
        this.setState({
          treeData: [...data.data],
        });
      }
    });
    dispatch({
      type: 'rule/fetchProduct'
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
      this.props.dispatch({
        type: 'rule/fetchProduct',
        payload: Object.assign({},{id:info.node.props.dataRef.id,level:info.node.props.dataRef.level})
      });
      if(info.node.props.dataRef.level !== 1 && info.node.props.dataRef.level){
        this.setState({
          categoryId: info.node.props.dataRef.id,
          categoryName: info.node.props.dataRef.name,
          isShow: true
        });
      }else{
        this.setState({
          categoryId: null,
          isShow: false
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
              treeData: [...this.state.treeData],
            });
            resolve();
          }
        });
      }
    });
  }
  render() {
    // 表格数据
    const {rule: { loading, product},form:{getFieldDecorator}} = this.props;
    // 表格列数据
    const columns = [{
      title: '商品名称',
      key:'name',
      dataIndex:'name'
    }, {
      title: '商品编号',
      key:'number',
      dataIndex:'number',
    }, {
      title: '商品价格',
      key:'price',
      dataIndex:'price',
    }, {
      title: '商品库存',
      key:'stock',
      dataIndex:'stock',
    }, {
      title: '商品图片',
      key:'thumbnail',
      dataIndex:'thumbnail',
      render: (e)=><img style={{width:'50px',height:'50px',border:'1px solid #ddd',padding:'3px',borderRadius:'50%'}} src={e} />
    },{
      title: '商品单位',
      key:'unit',
      dataIndex:'unit',
    }];
    return (
      <PageHeaderLayout title="商品管理">
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
                  data={product}
                  columns={columns}
                />
              </Col>
            </Row>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
