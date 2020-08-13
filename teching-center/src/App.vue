<template>
  <!--<layout>
    <router-view></router-view>
  </layout>-->
  <div class="app">
    <router-view v-if="showLayout"></router-view>
    <iEnv v-if="this.isEnv"></iEnv>
  </div>
</template>

<script>
  import { mapState,mapMutations,mapActions } from 'vuex'
  import Request from '@/request'
  import layout from '@/views/layout'
  import iEnv from '@/components/i-env'
export default {
  name: 'App',
  components:{
    layout,
    iEnv
  },
  data(){
    return{
      showLayout:true
    }
  },
  computed : {
    ...mapState({
      isEnv: state => state.global.isEnv
    })
  },
  created(){
    let token = (this.webApi.getUrlKey('token')||(this.cookie.get('techLoginInfo'))?(this.webApi.getUrlKey('token')||JSON.parse(this.cookie.get('techLoginInfo')).token):'')
    if(token){
      this.showLayout = false
      let techLoginInfo = null
      Request.ajax('member',{
        token:token
      }).then(res=>{
        if(res && res.state == 'success'){
          techLoginInfo = res.data
          techLoginInfo.token = token
          techLoginInfo.memberId = res.data.id
          this.cookie.set('techLoginInfo',techLoginInfo)
          this.updataLoginInfo({
            techLoginInfo:techLoginInfo
          })
          this.getTechMenu(token).then(res => {
            console.log(res)
            setTimeout(()=>{
              this.showLayout = true
            },100)
            this.$nextTick(() => {

            })
          })

        }else if(res.msg == 'nologin'){
        }else{
          this.webApi.alert(res.msg)
        }

      })
    }
    window.addEventListener("beforeunload",()=>{   //在页面刷新前将vuex里的信息保存到sessionStorage里
      sessionStorage.setItem("store",JSON.stringify(this.$store.state))
    })
    if (sessionStorage.getItem("store") ) {   //页面加载前读取sessionStorage里的状态信息
      this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
    }
    if(!(window.location.href.match('teching.zbg'))){
    //if(true){
    //if(process.env.NODE_ENV == 'development'){
      let envType = this.cookie.getJSON('envType') || 0;
      this.UPDATEDATA({
        isEnv: false,
        envType: envType
      });
      document.onkeyup = (event) => {
        // '正式':0, '测试':1, '开发':2, '模拟':3
        var event = event || window.event;
        if (event.keyCode == 27) {
          this.UPDATEDATA({
            isEnv: !this.isEnv
          });
        }
      };
    }
  },
  methods: {
    ...mapMutations(['UPDATEDATA','updataLoginInfo']),
    ...mapActions(['getTechMenu'])
  }
}
</script>

<style lang="stylus">
  @import "~@/assets/css/reset.styl"
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
  .dialog-open
    position fixed
  .app{
    width 100%
    height 100%
    min-width: 768px;
  }
</style>
