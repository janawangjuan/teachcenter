// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './store'
import global from './global'
import ElementUI from 'element-ui';
import Viewer from 'v-viewer'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/element-variables.scss';
import 'viewerjs/dist/viewer.css'

import webApi from './global/api';

import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

Vue.use(Vuex)
Vue.use(ElementUI);
Vue.use(Viewer)
Vue.use(global)

Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
}

Vue.config.productionTip = false
Vue.prototype.$api  = Vue.prototype.webApi = webApi;
Vue.prototype.ModalHelper = (function (bodyCls) {
  var scrollTop
  return {
    afterOpen: function () {
      scrollTop = document.scrollingElement.scrollTop
      document.body.classList.add(bodyCls)
      document.body.style.top = -scrollTop + 'px'
    },
    beforeClose: function () {
      document.body.classList.remove(bodyCls)
      // scrollTop lost after set position:fixed, restore it back.
      document.scrollingElement.scrollTop = scrollTop
    }
  }
}('dialog-open'))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
