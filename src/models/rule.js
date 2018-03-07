import { queryShopList, queryCategory,createCategory,queryProduct,submitShopInfo,submitProduct,queryOrderList,quertOrderDetail,updateCategory } from '../services/api';
import {message} from 'antd';
import {routerRedux} from 'dva/router';
export default {
  namespace: 'rule',
  state: {
    data: [],
    loading: true,
    product: []
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryShopList,payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 添加商铺
    *createShopInfo({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(submitShopInfo, payload);
      // 更新商铺信息成功之后重新异步调用获取商铺列表以更新信息;
      if(response.data.status === '200'){
        message.success(response.data.msg);
        yield put(routerRedux.goBack());
      }else{
        message.error('修改失败');
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 获取商品分类
    *fetchCategory({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryCategory,payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      return response;
    },
    // 添加分类
    *addCategory({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(createCategory,payload);
      if(response.data.status === '200'){
        message.success(response.data.msg);
      }else{
        message.error('修改失败');
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 获取商品
    *fetchProduct({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryProduct,payload);
      yield put({
        type: 'saveProduct',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 添加商品
    *createProduct({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(submitProduct, payload);
      // 更新商铺信息成功之后重新异步调用获取商铺列表以更新信息;
      if(response.data.status === '200'){
        message.success(response.data.msg);
        yield put(routerRedux.goBack());
      }else{
        message.error('修改失败');
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchOrderList({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryOrderList,payload);
      yield put({
        type: 'saveProduct',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 订单详情
    *fetchOrderDetail({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(quertOrderDetail,payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 更新分类
    *editCategoey({id,payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(updateCategory,id,payload);
      if(response.data.status === '200'){
        message.success('修改成功');
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    }
  },

  reducers: {
    save(state, action) {
      if(action.payload.data.status === '200'){
        return {
          ...state,
          data: action.payload.data.data,
        };
      }
    },
    saveProduct(state, action) {
      if(action.payload.data.status === '200'){
        return {
          ...state,
          product: action.payload.data.data,
        };
      }
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
