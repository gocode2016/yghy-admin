import dynamic from 'dva/dynamic';
import { createElement } from 'react';
/* **
*** 更改为自动加载models
*** 增加按需加载
**/ 
// wrapper of dynamic
const dy = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});
// let routerDataCache;

// const modelNotExisted = (app, model) => (
//   // eslint-disable-next-line
//   !app._models.some(({ namespace }) => {
//     return namespace === model.substring(model.lastIndexOf('/') + 1);
//   })
// );

// // wrapper of dynamic
// const dy = (app, models, component) => {
//   // () => require('module')
//   // transformed by babel-plugin-dynamic-import-node-sync
//   if (component.toString().indexOf('.then(') < 0) {
//     models.forEach((model) => {
//       if (modelNotExisted(app, model)) {
//         // eslint-disable-next-line
//         app.model(require(`../models/${model}`).default);
//       }
//     });
//     return (props) => {
//       if (!routerDataCache) {
//         routerDataCache = getNavData(app);
//       }
//       return createElement(component().default, {
//         ...props,
//         routerData: routerDataCache,
//       });
//     };
//   }
//   // () => import('module')
//   return dynamic({
//     app,
//     models: () => models.filter(
//       model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
//     ),
//     // add routerData prop
//     component: () => {
//       if (!routerDataCache) {
//         routerDataCache = getNavData(app);
//       }
//       return component().then((raw) => {
//         const Component = raw.default || raw;
//         return props => createElement(Component, {
//           ...props,
//           routerData: routerDataCache,
//         });
//       });
//     },
//   });
// };

// nav data
export const getNavData = app => [
  {
    component: dy(app, ['menus','login'], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: '首页',
        icon: 'home',
        path: 'welcome',
        component: dy(app, [],() => import('../routes/Welcome')),
      },
      {
        name: '商户管理',
        icon: 'profile',
        path: 'merchant',
        component: dy(app, ['rule'], ()=> import('../routes/Wxmall/shop/ShopList'))
      },
      {
        name: '添加商户',
        icon: 'profile',
        path: 'merchant/create',
        component: dy(app, ['rule'], ()=> import('../routes/Wxmall/shop/create'))
      },
      {
        name: '分类管理',
        icon: 'database',
        path: 'categroy',
        component: dy(app, ['rule'], ()=> import('../routes/Wxmall/categoryList/categoryList')),
      },
      {
        name: '商品管理',
        icon: 'profile',
        path: 'product',
        component: dy(app, ['rule'], ()=> import('../routes/Wxmall/shopProduct/index')),
      },
      {
        name: '添加商品',
        icon: 'profile',
        path: 'product/create',
        component: dy(app, ['rule'], ()=> import('../routes/Wxmall/shopProduct/create')),
      },
      {
        name: '订单管理',
        icon: 'profile',
        path: 'order',
        component: dy(app,['rule'],()=>import('../routes/Wxmall/order/OrderList'))
      },
    ],
  },
  {
    component: dy(app, [], ()=>import('../layouts/UserLayout')),
    path: '/',
    layout: 'UserLayout',
    children: [
      {
        name: '帐户',
        icon: 'user',
        path: 'user',
        children: [
          {
            name: '登录',
            path: 'login',
            component: dy(app, ['login'], ()=>import('../routes/User/Login')),
          },
          {
            name: '注册',
            path: 'register',
            component: dy(app, ['register'], ()=>import('../routes/User/Register')),
          },
          {
            name: '注册结果',
            path: 'register-result',
            component: dy(app, [], ()=>import('../routes/User/RegisterResult')),
          },
          {
            name: '403',
            path: '403',
            component: dy(app, [], ()=>import('../routes/Exception/403')),
          },
          {
            name: '404',
            path: '404',
            component: dy(app, [], ()=>import('../routes/Exception/404')),
          },
          {
            name: '500',
            path: '500',
            component: dy(app, [], ()=>import('../routes/Exception/500')),
          },
        ],
      },
    ],
  }
];
