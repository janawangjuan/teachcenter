<template>
  <div id="app" class="app">
    <el-container class="layout-el-container">
      <el-header class="layout-el-header"><iHeader></iHeader></el-header>
      <el-container class="layout-el-container">
        <el-aside width="auto" class="tmIndex-el-aside">
          <iNav></iNav>
        </el-aside>
        <el-main class="layout-el-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import iNav from "@/components/iNav"
  import iHeader from "@/components/i-header"
  import axios from 'axios';
  import {mapState} from 'vuex'
  export default {
    name: "layout",
    mounted(){
      console.log(this.userMenu)
      this.$router.replace(this.userMenu[0].url?this.userMenu[0].url:this.userMenu[0].childList[0].url)
    },
    data(){
      return{
        fileList:[]
      }
    },
    methods:{
      selectImg(e){
        console.log(this.$refs.imgInput)
        e.preventDefault();
        var files = e.target.files;
        console.log(files)
        let imgFile = files[0];//取到上传的图片
        console.log(imgFile)
        let formData=new FormData();//通过formdata上传
        formData.append('file',imgFile);
        formData.append('token', this.techLoginInfo.token);
        axios.post('http://apidemo.zbgedu.com/api/base/file/upload',formData,{  //http://apidemo.zbgedu.com/api/base/file/upload  http://47.96.2.242:8096/api/base/file/upload
          method: 'post',
          headers: {'Content-Type': 'multipart/form-data'}
        }).then(function (res) {
          console.log(res.data);//
        }).catch(function(error){
          console.log(error);
        })
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
    },
    computed:{
      ...mapState({
        isEnv:state=>state.global.isEnv,
        userMenu:state => state.global.userMenu
        //techLoginInfo:state=>state.global.techLoginInfo
      }),
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))}
    },
    components:{
      iNav,
      iHeader,
    }
  }
</script>

<style lang="stylus">
  @import "~@/assets/css/reset.styl"
  #app
    width 100%
    height 100%
    min-width 768px
  .layout-el-container
    height 100%
    overflow hidden
    .tmIndex-el-aside
      background #3C4B8E
    .layout-el-header
      border-bottom 1px solid #eee
    .layout-el-main
      padding 0
      border-left: 1px solid #ddd;
      overflow hidden
</style>
