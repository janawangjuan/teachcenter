export default {
  namespaced:true,
  state:{
    addUserType:'', //create||edit
    addRoleType:'', //create||edit
    selectUser:'',
    selectRole:'',
    showUserBack:false,
  },
  mutations:{
    updateAddUserType(state,payload){
      state.addUserType = payload
    },
    updateShowUserBack(state,payload){
      state.showUserBack = payload
    },
    updateAddRoleType(state,payload){
      state.addRoleType = payload
    },
    updateSelectUser(state,payload){
      state.selectUser = payload
    },
    updateSelectRole(state,payload) {
      state.selectRole = payload
    }
  }
}
