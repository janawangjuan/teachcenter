import Request from '../../request'
export default {
  namespaced:true,
  state:{
    classDetailInfo:{},
    selectClassInfo:{},
    selectExam:{},
  },
  mutations:{
    updateClassDetailInfo(state,payload){
      state.classDetailInfo = payload.classDetailInfo
    },
    updateSelectClassInfo(state,payload){
      state.selectClassInfo = payload.selectClassInfo
    },
    updateSelectExam(state,payload){
      state.selectExam = payload.selectExam
    },
  },
  actions:{
    getClassDetailInfo({state,commit},payload){
      return new Promise((resolve,reject)=>{
        Request.ajax('queryCourseDetail',{
          token:payload.token,
          courseArrangeId:payload.courseArrangeId
        }).then((res)=>{
          commit('updateClassDetailInfo',{
            classDetailInfo:res.data
          })
          resolve (res)
        })
      })

    }
  }
}
