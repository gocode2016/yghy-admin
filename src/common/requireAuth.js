import React, { Component } from 'react';
import { Redirect } from 'dva/router';
import { notification, Spin } from 'antd';
import { connect } from 'dva';
import Cookies from '../vendor/js.cookie.js';
// 根据后台权限数据匹配前台url;控制后台访问权限,
export default ChildComponent => {
  class RequireAuth extends Component {
    render() {
      // 测试代码
      // return <ChildComponent {...this.props} />;
      let token = Cookies.get('token');
      const props = this.props;
      if(token){
        let pathname = props.location.pathname;
        if(pathname === '/'){
          return <Redirect to="/welcome" />;
        }else{
          return <ChildComponent {...this.props} />;
        } 
      }else{
        // notification.error({
        //   message: '没有访问权限!!!!',
        //   description: '对不起你没有登入!!!!,请先登入!!!!',
        // });
        Cookies.remove('token');
        return <Redirect to="/user/login" />;
      }
    }
  }
  return connect(state=>({
    isLogged: state.login.isLogged
  }))(RequireAuth);
};