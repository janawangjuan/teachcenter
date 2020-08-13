import Vue from 'vue'
import Vuex from 'vuex'
import global from './modules/global'
import classManage from './modules/classManage'
import systemManage from './modules/systemManage'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    global,
    classManage,
    systemManage
  }
})
