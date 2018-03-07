import { routerRedux } from 'dva/router';
import { fakeAccountLogin, fakeMobileLogin, queryPermission } from '../services/api';
import { httpToken } from '../utils/ajax';
import Cookies from '../vendor/js.cookie.js';
import {isEmpty} from 'lodash';
export default {
  namespace: 'login',

  state: {
    token: null,
    isLogged: false,
    submitting: false
  },

  effects: {
    *accountSubmit({ payload }, { call, put,selected }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(fakeAccountLogin, payload);
      let token = yield (isEmpty(response.data.data.ticket)?null:response.data.data.ticket);
      yield Cookies.set('userInfo',response.data.data.userInfo);
      yield put({
        type: 'setToken',
        payload: token
      });
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
    *logout(_, { put }) {
      yield Cookies.remove('token');
      yield put({type:'clearLogin'});
      yield put(routerRedux.push('/user/login'));
    },
    *setToken({payload},{call,put}){
      yield put({
        type: 'changeLoginStatus',
        payload: payload
      });
      yield Cookies.set('token',payload);
      yield call(httpToken,payload);
      // yield put({
      //   type: 'fetchPermission'
      // });
    },
  },

  reducers: {
    clearLogin(state,action){
      return{
        ...state,
        token: null
      };
    },
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        token: payload,
        isLogged: (isEmpty(payload)?false:true)
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};
