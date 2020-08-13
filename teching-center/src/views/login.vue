<template>
  <div class="main-login">
    <div class="form-wrap">
      <form class="form-login" action="get" @submit.prevent="onSubmit()">
        <h4 class="title">教学中心系统登录</h4>
        <div class="form-block">
          <el-input
            placeholder="请输入账号"
            v-model="username">
            <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
          </el-input>
          <!--<label for="name" class="form-label">{{usernameText}}</label>
          <input type="text" class="form-input" id="name" :placeholder="placeholderText+usernameText" name="username" v-model="username">-->
        </div>
        <div class="form-block form-block1">
          <el-input
            placeholder="请输入密码"
            type="password"
            v-model="password">
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
          <!--<label for="password" class="form-label">{{passwordText}}</label>
          <input type="password" class="form-input" id="password" :placeholder="placeholderText+passwordText" name="password" v-model="password">-->
        </div>
        <div class="form-block">
          <button type="submit" id="login" class="form-button" :class="{disabled: isDisabled}" :disabled="isDisabled">{{loginBtnText}}</button>
        </div>
      </form>
    </div>
    <canvas id="canvas1" :style="{width:'100%',height: '130px'}"></canvas>
  </div>
</template>
<script>
  import Request from '../request'
  import { mapState,mapMutations,mapActions } from 'vuex';
  export default{
    name:'login',
    data(){
      return {
        username : '',
        password : '',
        isDisabled : false,
        loginBtnText : '',
        placeholderText : '请输入',
        usernameText : '用户名',
        passwordText : '密码',
        loginBtnDefault: '登录',
        loginBtnLoading: '正在登录...',
        loginBtnError: '登录失败',
        token:'',
        eduUserId:'',
        step:0,
        i:1,
      }
    },
    mounted (){
      this.loginBtnText = this.loginBtnDefault;
      this.getToken()
      //this.draw(1)
    },
    methods : {
      ...mapMutations([

      ]),
      ...mapActions([
        'teacherLogin','teacherLoginDev','getTechMenu'
      ]),
      getToken(){
        Request.ajax('token').then((res)=>{
          if(res && res.state){
            this.token = res.data.token
          }else{
            this.webApi.alert('系统异常，请稍后重试～')
          }
        })
      },
      beforeSubmit(){
        this.isDisabled = true;
        this.loginBtnText = this.loginBtnLoading;
      },
      onSuccess(){
        let query = this.$route.query;
        let link = '/tmIndex/classManage';
        if(query && query.fromPath){
          if(query.fromPath.indexOf('login') !== -1){  //加了双重校验，所以偶尔会出现跳转登录的时候连续跳两次，link出现重复的login，这里置空一个
            link = query.fromPath.replace('/login?link=','')  //
          }else{
            link = query.fromPath;
          }
        }
        this.$router.push(link);
      },
      onError(err){

        this.webApi.alert(err.msg||"Sorry~ 登录失败，");
        this.loginBtnText = this.loginBtnDefault;
        this.isDisabled = false;
        return;
        // this.loginBtnText = this.loginBtnDefault;
        // this.isDisabled = false;
        // this.addTips({
        //   type : 'danger',
        //   msg : this.loginBtnError,
        //   times : 2500
        // })
      },
      onSubmit(){
        this.beforeSubmit();
        if(true){
          this.teacherLoginDev({
            token : this.token,
            username: this.username,
            password: this.password,
          }).then(res => {
            if(res&&res.state == 'success'){
              /*if(res.data.type == ''){
                this.webApi.alert("学员账号无法进入教学中心哦");
                this.loginBtnText = this.loginBtnDefault;
                this.isDisabled = false;
                return;
              }*/

              /*this.UPDATEDATA({
                techLoginInfo : res.data
              });*/
              this.getTechMenu(this.token).then(res=>{
                this.onSuccess();
              })
              let techLoginInfo = res.data
              techLoginInfo.token = this.token
              this.cookie.set('techLoginInfo', techLoginInfo, { path: '' });
            }else{
              this.onError(res);
            }
          }).catch(err => {
            this.onError(err)
          })
        }else{
          this.teacherLogin({
            type : 'pcWeb',
            username: this.username,
            password: this.password
          }).then(res => {
            if(res.state == 'success'){
              /*if(res.data.type == ''){
                this.webApi.alert("学员账号无法进入教学中心哦");
                this.loginBtnText = this.loginBtnDefault;
                this.isDisabled = false;
                return;
              }*/

              /*this.UPDATEDATA({
                techLoginInfo : res.data
              });*/
              this.cookie.set('techLoginInfo', res.data, { path: '' });
              this.onSuccess();
            }else{
              this.onError(res);
            }
          }).catch(err => {
            this.onError(err)
          })
        }
      },
      draw(i) {
        /*var ctx = wx.createCanvasContext('firstCanvas'+i);
        var res = wx.getSystemInfoSync()*/
        this.i = i
        let str = 'canvas'+i
        console.log(str)
        var canvas1 = document.getElementById('canvas1')
        var ctx = canvas1.getContext('2d')
        var canvas = {
          width: 1200,
          height: 130
        };

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 0.17;
//角度增加一度
        this.step++;
        var angle = this.step * Math.PI / 180;
//矩形高度的变化量
        var deltaHeight = Math.sin(angle) * 20;
//矩形高度的变化量(右上顶点)
        var deltaHeightRight = Math.cos(angle) * 20;

        ctx.fillStyle = "green";
        ctx.globalAlpha = 0.18;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2 + deltaHeight-10);
//ctx.lineTo(canvas.width, canvas.height / 2 + deltaHeightRight);
//画曲线
        ctx.bezierCurveTo(canvas.width / 4, deltaHeight, canvas.width / 4 * 3, canvas.height + deltaHeight, canvas.width, canvas.height / 2 + deltaHeightRight);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "blue";
        ctx.globalAlpha = 0.17;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2 + deltaHeight );
//画曲线
        ctx.bezierCurveTo(canvas.width / 4, canvas.height / 2 + deltaHeight + 50, canvas.width / 4 * 3, canvas.height / 2 - deltaHeight - 50, canvas.width, canvas.height / 2 + deltaHeightRight - 20);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "red";
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2 + deltaHeight + 30);
//画曲线
        ctx.bezierCurveTo(canvas.width / 4, canvas.height / 2 + deltaHeight-5, canvas.width / 4 * 3, canvas.height + deltaHeight - 5, canvas.width, canvas.height / 2 + deltaHeightRight + 30);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();

        //ctx.drawImage();
        setTimeout(this.draw, 1000/60 , i);
      },
    }
  }
</script>
<style lang="stylus">
  .main-login {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1111;
    background: #fff url("../assets/img/login-big-bg.png") center 100% no-repeat;
    .form-block1{
      margin-top: 40px
    }
    .title{
      font-size 22px
      color #8490B7
      font-weight: 500;
      margin-top 70px;
    }
    .form-wrap{
      height 582px
      width 970px
      background url('../assets/img/loginBg.png') no-repeat left center;
      position absolute
      top 50%
      left 50%
      transform translate(-50%,-50%)
    }
  }

  .main-login .form-login {
    box-sizing: border-box;
    padding 0 73px;
    width: 500px;
    height: 482px;
    float: right
    margin-top 70px
    box-shadow:0px 0px 43px 3px rgba(108,129,222,0.24);
    background-color: #fff;
    border-radius: 8px;
  }

  .main-login .form-login .form-block {
    position: relative;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width 350px;
    height 55px;
    margin-top: 40px
    font-size: 14px;
    text-align center
    color: #89949C;
    .el-input--prefix{
      .el-input__inner {
        height 56px;
        line-height 56px;
        border-radius 28px
        padding-left 50px
        border 1px solid #C0BDC4
      }
      .el-input__prefix{
        left 18px
      }
    }
    .el-input__icon{
      font-size 20px
      position relative
      top 2px
    }
  }

  .main-login .form-login .form-block .form-label {
    position: absolute;
    top: 10px;
    bottom: 0;
    left: 10px;
    right: 0;
    width: 80px;
    height: 100%;
    line-height: 40px;
  }

  .main-login .form-login .form-block .form-input {
    outline: 0;
    width: 100%;
    height: 38px;
    padding: 10px;
    border: 1px solid #E9E9E9;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .main-login .form-login .form-block .form-button {
    width: 210px;
    height: 52px;
    color: #fff;
    border-radius: 26px;
    padding: 10px;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 8px;
    background:linear-gradient(90deg,rgba(111,231,248,1),rgba(128,151,252,1));
    outline: 0;
    cursor: pointer;
  }
  .main-login .form-login .form-block .form-button.disabled{
    letter-spacing: 0px;
  }
</style>
