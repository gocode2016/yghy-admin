import React,{PureComponent} from 'react';
import {connect} from 'dva';
import {Row,Col,Card,Form,Input,Button, Select,InputNumber,Upload,Modal,Icon,message} from 'antd';
import {getToken} from '../../../services/api';
import Request from 'axios';
// import Qs from 'qs';
// 面包屑头
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
const { Option } = Select;
const FormItem = Form.Item;
@connect(state=>({
  rule: state.rule
}))
@Form.create()
export default class ProductCreate extends PureComponent{
  constructor(props){
    super(props);
  }
  state = {
    previewShopProductVisible: false,  //预览上传logo图片modal
    previewShopProduct: '', //预览上传logo文件
    shopProductList: [], //上传logo文件列表,
    token: '',
    shopThumProductList: [],
    previewShopThumProductVisible:false,
    previewShopThumProduct: ''
  }
  componentDidMount(){
    getToken()
      .then(({data})=>{
        if(data.status === '200'){
          this.setState({token:data.data});
        }
    });
  }
  // 提交修改商铺表单数据
  handleSubmit = (e)=>{
    e.preventDefault();
    const {form,dispatch,history} = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if(this.state.shopProductList.length > 0 && this.state.shopThumProductList.length > 0){
          dispatch({
            type: 'rule/createProduct',
            payload: Object.assign(values,{imgUrl:this.state.file,thumbnail:this.state.thum}) 
          });
        }else if(this.state.shopProductList.length > 0){
          dispatch({
            type: 'rule/createProduct',
            payload: Object.assign(values,{imgUrl:this.state.file}) 
          });
        }else if(this.state.shopThumProductList.length > 0){
          dispatch({
            type: 'rule/createProduct',
            payload: Object.assign(values,{thumbnail:this.state.thum})
          });
        }else{
          dispatch({
            type: 'rule/createProduct',
            payload: values
          });
        }
        form.resetFields();
      }
    });
  }
  // 重置表单
  handleFormReset = ()=>{
    const {form} = this.props;
    return form.resetFields();
  }
  // 上传商品图片预览
  handleProductPreview = (file) => {
    this.setState({
      previewShopProduct: file.url || file.thumbUrl,
      previewShopProductVisible: true,
    });
  }
  
  // 关闭预览logo上传图片modal
  handleProductCancel = () => this.setState({ previewShopProductVisible: false });

  // 商户logo 上传前处理方法
  handleShopProductBeforeUpload = (file)=>{
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isJPG) {
      message.error('上传图片只能是 JPG或者png图片');
    }
    if (!isLt1M) {
      message.error('上传图片大小不能超过 1MB! ');
    }
    return isJPG && isLt1M;
  }
  // 清空店铺logo
  handleProductRemove = (file)=>{
    this.setState({
      shopProductList: []
    });
  }
  // 覆盖默认请求方法  上传七牛云
  handleCustomRequest = (obj)=>{
    const {uid, name, type} = obj.file;
    let formData = new FormData();
    formData.append('file',obj.file);
    formData.append('token',obj.data.token);
    Request.post(obj.action,formData)
      .then(res=>{
        if(res.status === 200){      
          // http://p3550gxpt.bkt.clouddn.com/
          // let arr = [];
          const fileItem = {
            uid,
            name,
            type,
            url: 'http://p3550gxpt.bkt.clouddn.com/' + res.data.hash
          };
          this.setState({
            shopProductList: [fileItem],
            file:res.data.hash
          });
          message.success('上传成功');
        }
      }).catch(err=>{
        if([401,402,403].indexOf(err.response.status)>-1){
          message.error('上传失败.token错误');
        }
        if([400].indexOf(err.response.status)>-1){
          message.error('七牛云token不能为空');
        }
      });
  }
  /*******************************上传预览图片*********************************/ 
  // 上传商品图片预览
  handleThumProductPreview = (file) => {
    this.setState({
      previewShopThumProduct: file.url || file.thumbUrl,
      previewShopThumProductVisible: true,
    });
  }
  
  // 关闭预览logo上传图片modal
  handleProductThumCancel = () => this.setState({ previewShopThumProductVisible: false });

  // 商户logo 上传前处理方法
  handleShopProductThumBeforeUpload = (file)=>{
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isJPG) {
      message.error('上传图片只能是 JPG或者png图片');
    }
    if (!isLt1M) {
      message.error('上传图片大小不能超过 1MB! ');
    }
    return isJPG && isLt1M;
  }
  // 清空店铺logo
  handleThumProductRemove = (file)=>{
    this.setState({
      shopThumProductList: []
    });
  }
  // 覆盖默认请求方法  上传七牛云
  handleThumCustomRequest = (obj)=>{
    const {uid, name, type} = obj.file;
    let formData = new FormData();
    formData.append('file',obj.file);
    formData.append('token',obj.data.token);
    Request.post(obj.action,formData)
      .then(res=>{
        if(res.status === 200){      
          // http://p3550gxpt.bkt.clouddn.com/
          // let arr = [];
          const fileItem = {
            uid,
            name,
            type,
            url: 'http://p3550gxpt.bkt.clouddn.com/' + res.data.hash
          };
          this.setState({
            shopThumProductList: [fileItem],
            thum:res.data.hash
          });
          message.success('上传成功');
        }
      }).catch(err=>{
        if([401,402,403].indexOf(err.response.status)>-1){
          message.error('上传失败.token错误');
        }
        if([400].indexOf(err.response.status)>-1){
          message.error('七牛云token不能为空');
        }
      });
  }
  render(){
    const {form:{getFieldDecorator},location:{search}} = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    let obj = new URLSearchParams(search);
    // let obj = Qs.parse(search);
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
          <Form onSubmit={this.handleSubmit}  className="ant-advanced-search-form">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem
                  
                  label="不正常叶"
                  hasFeedback
                >
                  {getFieldDecorator('abnormalLeaf', {
                    rules: [{
                      required: true, message: '请输入不正常叶',
                    },{
                      pattern: /\d/ig,
                      message: '只能输入数字'
                    }],
                  })(
                    <InputNumber style={{ width: '100%' }} placeholder="请输入不正常叶" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem
                  
                  label="高度差"
                  hasFeedback
                >
                  {getFieldDecorator('altitudeDifference', {
                    rules: [{
                      required: true, message: '请输入高度差',
                    },{
                      pattern: /\d/ig,
                      message: '只能输入数字'
                    }],
                  })(
                    <InputNumber style={{ width: '100%' }} placeholder="请输入高度差叶" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem
                  
                  label="箱号"
                  hasFeedback
                >
                  {getFieldDecorator('boxNo', {
                    rules: [{
                      required: true, message: '请输入箱号!',
                    }],
                  })(
                    <Input placeholder="请输入箱号!" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem
                  
                  label="装箱数"
                  hasFeedback
                >
                  {getFieldDecorator('boxQuantity', {
                    rules: [{
                      required: true, message: '请输入装箱数',
                    },{
                      pattern: /\d/ig,
                      message: '只能输入数字'
                    }],
                  })(
                    <InputNumber style={{ width: '100%' }} placeholder="请输入装箱数" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem
                  
                  label="枝条数"
                  hasFeedback
                >
                  {getFieldDecorator('branchesNumber', {
                    rules: [{
                      required: true, message: '请输入枝条数',
                    },{
                      pattern: /\d/ig,
                      message: '只能输入数字'
                    }],
                  })(
                    <InputNumber style={{ width: '100%' }} placeholder="请输入枝条数" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem
                  
                  label="插牌"
                  hasFeedback
                >
                  {getFieldDecorator('card', {
                    rules: [{
                      required: true, message: '请输入插牌!',
                    }],
                  })(
                    <Input placeholder="请输入插牌!" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem
                  
                  label="类型"
                  hasFeedback
                >
                  {getFieldDecorator('categorySubId', {
                    rules: [{
                      required: true, message: '请选择类型!',
                    }],
                  })(
                    <Select placeholder="请选择分类" style={{ width: '100%' }}>
                      <Option value={obj.get('id')} key="1">{obj.get('name')}</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem
                  
                  label="冠幅 "
                  hasFeedback
                >
                  {getFieldDecorator('crownDiameter', {
                    rules: [{
                      required: true, message: '请输入冠幅 ',
                    },{
                      pattern: /\d/ig,
                      message: '只能输入数字'
                    }],
                  })(
                    <InputNumber style={{ width: '100%' }} placeholder="请输入冠幅 " />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem
                  
                  label="花色"
                  hasFeedback
                >
                  {getFieldDecorator('flowerColor', {
                    rules: [{
                      required: true, message: '请输入花色!',
                    }],
                  })(
                    <Input placeholder="请输入花色!" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem
                  
                  label="花径"
                  hasFeedback
                >
                  {getFieldDecorator('flowerDiamete', {
                    rules: [{
                      required: true, message: '请输入花径!',
                    }],
                  })(
                    <Input placeholder="请输入花径!" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem
                  
                  label="花数 "
                  hasFeedback
                >
                  {getFieldDecorator('flowerNumber', {
                    rules: [{
                      required: true, message: '请输入花数 !',
                    },{
                      pattern: /\d/ig,
                      message: '只能输入数字'
                    }],
                  })(
                    <InputNumber style={{ width: '100%' }} placeholder="请输入花数 " />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem 
                  label="高度"
                  hasFeedback
                >
                  {getFieldDecorator('height', {
                    rules: [{
                      required: true, message: '请输入高度!',
                    }],
                  })(
                    <Input placeholder="请输入高度!" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem
                  
                  label="叶子数  "
                  hasFeedback
                >
                  {getFieldDecorator('leafNumber', {
                    rules: [{
                      required: true, message: '请输入叶子数 !',
                    },{
                      pattern: /\d/ig,
                      message: '只能输入数字'
                    }],
                  })(
                    <InputNumber style={{ width: '100%' }} placeholder="请输入叶子数" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem 
                  label="等级名称"
                  hasFeedback
                >
                  {getFieldDecorator('level', {
                    rules: [{
                      required: true, message: '请输入等级名称!',
                    },{max:1,message:'最多只能输入一个字符'},{
                      pattern: /[a-zA-Z]/ig,
                      message: '只能输入英文字母'
                    }],
                  })(
                    <Input placeholder="请输入等级名称!" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem 
                  label="产品名称"
                  hasFeedback
                >
                  {getFieldDecorator('name', {
                    rules: [{
                      required: true, message: '请输入产品名称!',
                    }],
                  })(
                    <Input placeholder="请输入产品名称!" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem 
                  label="净重 "
                  hasFeedback
                >
                  {getFieldDecorator('netWeight', {
                    rules: [{
                      required: true, message: '请输入净重 !',
                    }],
                  })(
                    <Input placeholder="请输入净重 !" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem
                  
                  label="产品编码 "
                  hasFeedback
                >
                  {getFieldDecorator('number', {
                    rules: [{
                      required: true, message: '请输入产品编码  !',
                    },{
                      pattern: /\d/ig,
                      message: '只能输入数字'
                    }],
                  })(
                    <InputNumber style={{ width: '100%' }} placeholder="请输入产品编码 " />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem 
                  label="套袋"
                  hasFeedback
                >
                  {getFieldDecorator('packages', {
                    rules: [{
                      required: true, message: '请输入套袋 !',
                    }],
                  })(
                    <Input placeholder="请输入套袋 !" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem 
                  label="株树 "
                  hasFeedback
                >
                  {getFieldDecorator('plantNumber', {
                    rules: [{
                      required: true, message: '请输入株树  !',
                    }],
                  })(
                    <Input placeholder="请输入株树  !" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem
                  
                  label="价格"
                  hasFeedback
                >
                  {getFieldDecorator('price', {
                    rules: [{
                      required: true, message: '请输入价格 !',
                    },{
                      pattern: /\d/ig,
                      message: '只能输入数字'
                    }],
                  })(
                    <InputNumber style={{ width: '100%' }} placeholder="请输入价格 " />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem 
                  label="备注 "
                  hasFeedback
                >
                  {getFieldDecorator('remark', {
                    rules: [{
                      required: true, message: '请输入备注  !',
                    }],
                  })(
                    <Input placeholder="请输入备注  !" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem 
                  label="规格"
                  hasFeedback
                >
                  {getFieldDecorator('spec', {
                    rules: [{
                      required: true, message: '请输入规格!',
                    }],
                  })(
                    <Input placeholder="请输入规格!" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem 
                  label="杆径 "
                  hasFeedback
                >
                  {getFieldDecorator('stemDiameter', {
                    rules: [{
                      required: true, message: '请输入杆径 !',
                    }],
                  })(
                    <Input placeholder="请输入杆径 !" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem
                  
                  label="库存"
                  hasFeedback
                >
                  {getFieldDecorator('stock', {
                    rules: [{
                      required: true, message: '请输入库存 !',
                    },{
                      pattern: /\d/ig,
                      message: '只能输入数字'
                    }],
                  })(
                    <InputNumber style={{ width: '100%' }} placeholder="请输入库存 " />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem 
                  label="单位"
                  hasFeedback
                >
                  {getFieldDecorator('unit', {
                    rules: [{
                      required: true, message: '请输入单位 !',
                    },{
                      max:1,message:'最多只能输入一个中文或者因为字母'
                    }]
                  })(
                    <Input placeholder="请输入单位 !" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem
                  label="商品图片"
                >
                    <Upload
                    action="https://upload-z2.qiniup.com"
                    listType="picture-card"
                    fileList={this.state.shopProductList}
                    accept="image/png, image/jpeg"
                    data={{token:this.state.token}}
                    onRemove={this.handleProductRemove}
                    onPreview={this.handleProductPreview}
                    beforeUpload={this.handleShopProductBeforeUpload}
                    customRequest={this.handleCustomRequest}
                  >
                    {this.state.shopProductList.length >= 1 ? null : uploadButton}
                  </Upload>
                <Modal visible={this.state.previewShopProductVisible} footer={null} onCancel={this.handleProductCancel}>
                  <img alt="商品图片" style={{ width: '100%' }} src={this.state.previewShopProduct} />
                </Modal>
              </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem
                  label="略缩图"
                >
                    <Upload
                    action="https://upload-z2.qiniup.com"
                    listType="picture-card"
                    fileList={this.state.shopThumProductList}
                    accept="image/png, image/jpeg"
                    data={{token:this.state.token}}
                    onRemove={this.handleThumProductRemove}
                    onPreview={this.handleThumProductPreview}
                    beforeUpload={this.handleShopProductThumBeforeUpload}
                    customRequest={this.handleThumCustomRequest}
                  >
                    {this.state.shopThumProductList.length >= 1 ? null : uploadButton}
                  </Upload>
                <Modal visible={this.state.previewShopThumProductVisible} footer={null} onCancel={this.handleProductThumCancel}>
                  <img alt="商品图片" style={{ width: '100%' }} src={this.state.previewShopThumProduct} />
                </Modal>
              </FormItem>
              </Col>
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