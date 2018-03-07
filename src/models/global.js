// import { queryNotices } from '../services/api';
import Cookies from '../vendor/js.cookie.js';
import { httpToken } from '../utils/ajax';
export default {
  namespace: 'global',

  state: {
    
  },

  effects: {
    *setToken({payload},{call,put}){
      yield Cookies.set('token',payload);
      yield call(httpToken,payload);
    },
  },

  reducers: {
  
  },

  subscriptions: {
    // setup({ history }) {
    //   // Subscribe history(url) change, trigger `load` action if pathname is `/`
    //   return history.listen(({ pathname, search }) => {
    //     if (typeof window.ga !== 'undefined') {
    //       window.ga('send', 'pageview', pathname + search);
    //     }
    //   });
    // },
    setup({ history,dispatch }) {
      if(Cookies.get('token')){
        dispatch({
          type: 'setToken',
          payload: Cookies.get('token')
        });
      }
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
