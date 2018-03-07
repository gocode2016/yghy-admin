import { stringify } from 'qs';
import {baseApi} from '../config/api';
import {http} from '../utils/ajax';
/**
 *   封装所有请求服务;
 * 基于async await 异步
 */ 
// 登入请求
export async function fakeAccountLogin(params) {
  // return request(`${baseApi}/admin/login`, {
  //   method: 'POST',
  //   body: params
  // });
  return http.post('/admin/signIn',params);
}
// 获取后台菜单数据
export async function getMenus() {
  return http.get('/admin/menu/list');
}
// 获取用户权限
export async function queryPermission(){
  return http.get('/admin/api/menu/roleList'); 
}
/**微信管理api**/
export async function queryShopList(payload){
  if(payload){
    if(payload.mobile && payload.realname){
      return http.get('/admin/merchant/list'+'?mobile='+payload.mobile+'&realName='+payload.realname);
    }else if(payload.mobile && !payload.realname){
      return http.get('/admin/merchant/list'+'?mobile='+payload.mobile);
    }else if(!payload.mobile && payload.realname){
      return http.get('/admin/merchant/list'+'?realName='+payload.realname);
    }else{
      return http.get('/admin/merchant/list');
    } 
  }else{
    return http.get('/admin/merchant/list');
  }
} 

//获取商品信息列表
export async function queryCategory(payload){
  if(payload){
    return http.get('/admin/product/categorys'+'?parentId='+payload);
  }else{
    return http.get('/admin/product/categorys');
  }
}
// 添加 分类
export async function createCategory(payload){
  return http.post('/admin/product/categorys/add',payload);
}
// 添加商户
export async function submitShopInfo(payload){
  return http.post('/admin/merchant/add',payload);
}
// 获取商品
export async function queryProduct(payload){
  if(payload){
    if(payload.id && payload.level){
      return http.get('/admin/product/productList'+'?categoryId='+payload.id+'&level='+payload.level);
    }else if(payload.productName && !payload.id && !payload.level){
      return http.get('/admin/product/productList'+'?productName='+payload.productName);
    }else{
      return http.get('/admin/product/productList');
    }
  }else{
    return http.get('/admin/product/productList');
  }
}
// 添加商品
export async function submitProduct(payload){
  return http.post('/admin/product/add',payload);
}
// 订单列表
export async function queryOrderList(payload){
  return http.get('/admin/order/list');
}
// 订单详情
export async function quertOrderDetail(id){
  return http.get('/admin/order/detail?orderId='+id);
}
// 重服务端获取七牛云token
export async function getToken(){
  return http.post('/admin/getUploadToken');
}
// 更新分类
export async function updateCategory(id,payload){
  return http.post(`/admin/product/categorys/${id}/modify`,payload);
}