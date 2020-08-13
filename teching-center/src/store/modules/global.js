import Request from '@/request'
import {
  UPDATEDATA
} from '../mutation-type'
export default {
  state:{
    techLoginInfo: {},
    host: {
      //img: process.env.NODE_ENV == 'production' ? 'http://eximg.zbgedu.com' : 'http://cdnimg.caicui.com',
      img: process.env.NODE_ENV == 'production' ? 'http://eximg.zbgedu.com' : 'http://eximg.zbgedu.com',
      isDemo:true,   //有些链接是demo环境的，上线后需要吧isDemo改为false
    },

    isEnv:false,
    envType:0,
    userMenu:'',
  },
  mutations:{
    [UPDATEDATA](state, payload) {
      for (var i in payload) {
        state[i] = payload[i];
      }
    },
    updataLoginInfo(state,payload){
      state.techLoginInfo = payload.techLoginInfo
    },
    updateEnvType(state,payload){
      state.envType = payload.envType
    },
    updateUserMenu(state, payload){
      state.userMenu = payload.userMenu
    }
  },
  actions:{
    teacherLogin({state,commit},payload){
      return Request.ajax('node-login',{
        'username': payload.username,
        'password': payload.password,
        'type': payload.type
      }).then(res=>{
        commit('updataLoginInfo', {
          'techLoginInfo' : res.data
        })
        this.getTechMenu({state,commit},payload)
        return res
      })
    },
    getTechMenu({state,commit},payload){
      return Request.ajax('getTechMenu',{
        'token': payload
      }).then(res=>{
        if(res && res.state == 'success'){
          let data = res.data
          commit('updateUserMenu', {
            'userMenu' : data
          })
          return res
        }else{
          this._vm.webApi.alert(res.msg||'系统异常，请稍后重试～')
        }
      })
    },
    teacherLoginDev({state,commit},payload){
      /*return Request.ajax('login',{
        'account': payload.username,
        'password': payload.password,
        'token': payload.token
      }).then(res=>{
        let techLoginInfo = res.data
        Request.ajax('member',{
          token:payload.token
        }).then(res=>{
          techLoginInfo.eduUserId = res.data.eduUserId
          commit('updataLoginInfo', {
            'techLoginInfo' : techLoginInfo
          })

        })
        return res
      })
      return new Promise((resolve,reject)=>{
        Request.ajax('login',{
          'account': payload.username,
          'password': payload.password,
          'token': payload.token
        }).then(res=>{
          resolve(res)
        })
      }).then(res=>{
        let techLoginInfo = res.data
        return new Promise((resolve,reject)=>{
          Request.ajax('member',{
            token:payload.token
          }).then(res=>{
            techLoginInfo.eduUserId = res.data.eduUserId
            commit('updataLoginInfo', {
              'techLoginInfo' : techLoginInfo
            })
            resolve(res)
          })
        }).then((res)=>{
          return res
        })
      })*/
      return new Promise((resolve,reject)=>{
        Request.ajax('login',{
          'account': payload.username,
          'password': payload.password,
          'token': payload.token
        }).then(res=>{
          if(res && res.state == 'success'){
            let techLoginInfo = res.data
            Request.ajax('member',{
              token:payload.token
            }).then(res=>{
              techLoginInfo.eduUserId = res.data.eduUserId
              commit('updataLoginInfo', {
                'techLoginInfo' : techLoginInfo
              })
              resolve(res)
            })
          }else{
            //this._vm.webApi.alert(res.msg||'系统异常，请稍后重试～')
            resolve(res)
          }
        })
      })
    }
  }
}
