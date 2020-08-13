import Vue from 'vue'
import axios from 'axios';
import config from './config';
import api from './api';
import router from '../router'


axios.defaults.timeout = 0;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';


// axios.interceptors.request.use(function (config) {

//   return config;

//   }, function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
//   });
axios.interceptors.response.use((res) => {
  if (res && res.data.state == 'success') {
    return Promise.resolve(res.data);
  } else {
    return Promise.reject(res.data);
  }
}, (error) => {
  return Promise.reject(error);
});
const noLocalStorage = ['gettoken', 'login', 'updateStatus'];
const request = {

  // 调用接口
  ajax: (servername, data) => {
    var that = request;
    var payload = {
      server: servername,
      data: data
    }
    var requeseData = request.getAjaxData(payload); // 接口数据
    return request.request({
      servername: servername,
      requeseData: requeseData,
      done: function(data) {
        request.requestComplete(servername, data);
        return request.requestSuccess(servername, data);
      },
      fail: function(data) {
        request.requestComplete(servername, data);
        return request.requestFail(servername, data);
      }
    })
  },
  // 获取调用接口数据
  getAjaxData: function(payload) {
    var apiData = api[payload.server]; // 接口数据
    return {
      url: payload.url ? payload.url : this.getRequestUrl(apiData), // 接口请求地址
      type: payload.type ? payload.type : this.getRequestType(apiData.type), // 接口请求类型
      data: payload.data ? payload.data : this.getRequestData(apiData.data) // 接口请求数据
    };
  },
  // 获取接口请求地址
  getRequestUrl: function(apiData) {
    var requestUrl = '';
    var urlHost = '';
    var urlHostAction = '';
    var urlHostApi = '';
    var urlPath = '';
    var nowTime = "?verTT=" + new Date().getTime();
    var isMock = false;
    var envType = parseInt(Vue.cookie.get('envType')); // 代码运行环境{'正式':0, '测试':1, '开发':2, '模拟':3}
    switch (envType) {
      case 1:
        if (apiData.isMock) {
          isMock = true;
        } else if(apiData.hostNameDemo){
          urlHostAction = api.host.actionDemo;
          urlHostApi = apiData.hostNameDemo;
        }else{
          urlHostAction = api.host.actionDemo;
          urlHostApi = api.host.apiDemo;
        }
        break;
      case 2:
        if (apiData.isMock) {
          isMock = true;
        } else {
          urlHostAction = api.host.actionDev;
          urlHostApi = api.host.apiDev;
        }
        break;
      case 3:
        isMock = true;
        break;
      default:
        urlHostAction = api.host.action;
        urlHostApi = api.host.api;
        break;
    }
    if (isMock) {
      requestUrl = apiData.mock;
    } else {
      if(envType!=1 && envType!=2 && envType!=3){
        urlHost = apiData.host ? apiData.host : apiData.apiType == 'node' ? urlHostAction : urlHostApi;
      }else{
        urlHost = apiData.hostNameDemo ? apiData.hostNameDemo : apiData.apiType == 'node' ? urlHostAction : urlHostApi;
      }
      urlPath = apiData.path ? apiData.path : api.notFindUrl;
      requestUrl = urlHost + urlPath + nowTime;
    }
    return requestUrl;
  },
  // 获取接口请求类型
  getRequestType: function(type) {
    return type ? type : "GET";
  },
  // 获取接口请求数据
  getRequestData: function(data) {
    return data ? data : {};
  },
  // 调用接口
  request: (payload) => {
    let servername = payload.servername;
    let args = payload.requeseData;

    let localData = localStorage.getItem('elearning/' + servername);
    if (localData) {
      return Vue.localForage.getItem(servername);
    } else {

      if (args.type === 'POST' || args.type === 'post') {
        return axios.post(args.url, args.data, config).then(res => payload.done(res)).catch(err => payload.fail(err))
      } else if (args.type === 'GET') {
        return axios.get(args.url, {
          params: args.data
        }, config).then(res => payload.done(res)).catch(err => payload.fail(err))
      }
    }
  },
  // 接口调用成功的回调函数
  requestSuccess: function(servername, res) {
    let addLocalStorage = true;
    noLocalStorage.forEach(list => {
      if (list == servername) {
        addLocalStorage = false;
      }
    })
    if (addLocalStorage && (servername.indexOf('bbsdetail') == -1) && (servername.indexOf('bbslist') == -1)) {
      // Vue.localForage.setItem(servername,res).then(value => {})
    }

    return res
  },
  // 接口调用失败的回调函数
  requestFail: function(servername, err) {
    if ((err.state == "nologin" && err.code == "333") || err.msg == "nologin") {
      Vue.cookie.remove('techLoginInfo');
      if(router.currentRoute.name !== 'login'){
        console.log(router.currentRoute)
        window.location.href = window.location.origin + '/#/login'+'?fromPath='+router.currentRoute.path;
        //console.log(router.currentRoute.fullPath)
        //outer.push({name:'login'})
      }
      //router.push({name:'login',query:router.currentRoute.fullPath})
      //console.log(Vue)
      // router.replace({
      //   path:'/#/login',
      //   //query:{redirect:router.currentRoute.fullPath}
      // })
    }
    return err;
  },
  // 接口调用结束的回调函数（调用成功、失败都会执行）
  requestComplete: function(payload, data) {
    if (payload.complete) {
      payload.complete(data)
    }
  },
  // 获取静态文件
  ajaxStatic: function(payload) {
    var thatServer = api[payload.server];
    $.ajax({
      url: thatServer.staticData,
      type: 'get',
      success: function(data) {
        payload.done(data)
      },
      error: function(data) {
        payload.fail(data)
      },
    })
  },
}

export default {
  ajax: request.ajax
}
