<template lang="html">

  <footer class="tmp-foot">
    <i class="iconfont icon-pic" v-show="isOpenUpload" @click.stop="handleOpenUpload">
      <span class="msg-num" v-show="pictureList.length != 0">{{ pictureList.length }}</span>
    </i>
    <div class="select-btn" @click.stop="handleCutStatus" ref="isPublicDiv" v-show="isOpenUpload && isPublicStyle"><span>{{ isPublicText }}</span><i></i></div>
    <section class="pic-upload" v-show="!isOpenUpload">
      <div class="list" v-for="item, index in pictureList">
        <img :src="item.src">
        <a href="javascript:;" class="iconfont icon-guanbi" @click.stop="removeThisPic" :data-index="index"></a>
      </div>
      <div class="iconfont add" @click.stop="handleUploadBtn" v-show="pictureList.length < 5"><span>&#xe656;</span></div>
    </section>

    <input type="file" multiple="multiple" accept="image/*" @change="changeLoadPicture" ref="iptFile" class="ipt-file">


  </footer>

</template>

<script>

import { mapState, mapMutations, mapActions } from 'vuex'
import Request from '@/request'

export default {

  props: {
    picList: {
      type: Array,
      default: []
    },
    isStartUpload: {
      type: Boolean,
      default: false
    },
    isPublicStyle: {
      type: Boolean,
      default: false
    },
    isPublicNum: {
      type: String,
      default: '1'
    }
  },

  data() {
    return {
      pictureList: [], // 图片列表
      isOpenUpload: true,
      isPublicText: '公开',
      isPublic: 1,
    }
  },

  watch: {

    isStartUpload(flag) {
      flag && this.startUploadPic();
    },

    isPublicNum(num) {

      this.isPublic = num;
      this.isNotePublic();

    }

  },

  created() {
    this.pictureList = this.picList;
  },
  computed : {
    ...mapState({
      host: state => state.global.host,
      //techLoginInfo : state => state.global.techLoginInfo,
      exchangeDetail : state => state.exchange.exchangeDetail,
    }),
    techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))}
  },
  methods: {

    isNotePublic() {
      if(this.isPublic == '1') {
        this.isPublicText = '公开';
				this.$refs.isPublicDiv.classList.remove('select-btn-active');
      }else{
        this.isPublicText = '私人';
        this.$refs.isPublicDiv.classList.add('select-btn-active');
      }
    },

    // 是否公开
		handleCutStatus(ev) {

			let oDiv = this.webApi.recursiveParentNode(ev.target, 'div');

      this.isPublic = oDiv.classList.contains('select-btn-active') ? '1' : '0';

      this.isNotePublic();

		},

    // 打开上传
    handleOpenUpload() {
      this.isOpenUpload = false;
      this.$emit("showInput",true);
    },

    // 删除当前照片
    removeThisPic(ev) {
      this.pictureList = this.pictureList.filter((item, index) => index != ev.target.dataset.index);
    },

    // 关闭当前组件
    handleCloseUpload() {
      this.isOpenUpload = true;
      this.$emit("showInput",false);
    },

    // 清空图片列表
    handleEmptyList() {
      this.pictureList = [];
    },

    // input控件发生变化
    changeLoadPicture(ev) {

      let file = this.$refs.iptFile.files;
			let i = 0, len = file.length;
			let allLen = this.pictureList.length || 0;

      if(file.length+allLen > 5) {
        this.webApi.alert('抱歉，图片最多只可上传5张！')
        return;
      }

			for ( i=0; i<len; i++ ) {

				let fileData = file[i];
				let reader = new FileReader();

        try{
          reader.readAsDataURL(fileData);
        }catch(e) {
          if(__DEV__) console.log(e);
        }

				reader.onload = (evt) =>{

					this.pictureList.push({
						src: evt.target.result,
            isFile: true,
						file: fileData
					});

	      }

			}

    },

    // 委托触发INPUT控件
		handleUploadBtn() {

			if(this.pictureList.length >= 5) {
				this.webApi.alert('最多可上传5张图片');
				return false;
			}

      this.$refs.iptFile.click();

		},

    // 开始上传
    startUploadPic() {

      let i = 0, _this = this;
      let params = {
        isPublic: this.isPublic,
        state: 'success',
        imgPath: []
      };


      if(!this.picList || this.picList.length == 0) {
        this.$emit('load-upload', params);
        return;
      }


      function sendUpload(data) {
        _this.callUpload(_this.pictureList[i], callback);
      }

      function callback(path) {

        params.imgPath.push(path)

        i++;

        if(i < _this.pictureList.length) {
          sendUpload(_this.pictureList[i]);
        }else{
          params.imgPath.map(item =>{
            if(!item || typeof item != 'string') params.state = 'error';
          });
          params.imgPath = params.imgPath.join(',');
          _this.$emit('load-upload', params);
        }


      }

      sendUpload(this.pictureList[i]);

    },

   callUpload(data, cd) {

      let _data = {};

      if (!data.isFile) {
        cd(data.src.replace(this.host.img, ''))
        return;
      }

      // 压缩
      this.webApi.pictureCompress(data.file, (newFile, name) =>{
console.log(newFile,name)
        let _formData  = new FormData();

        _formData.append('token', this.techLoginInfo.token);
        _formData.append('file', newFile, name);

        // this.webApi.loadingData(`图片上传中...`);

        // 上传
        console.log(_formData)
        Request.ajax('fileUpload',_formData).then(res => {

          res && res.state == 'success' ?  cd(res.data[0].storeFileUrl) : cd(null) ;

        })


      });

    },

  }

}

</script>
<style  lang="stylus" scoped>

@import '../assets/css/module.styl'


.tmp-foot{
  opacity: 0;
  display none
  position: absolute;
  left: 0; right: 0; bottom: -50px;
  z-index: 100;
  > section{
    background-color: #fff; padding: 10px;
  }
  .icon-pic{
    fc(20px, #cfb9be);
    display: inline-block; transform: translate3d(0,-.33rem,0);
    margin-left: .3rem; margin-bottom: -.3rem;
    cursor: pointer;
  }
  .list{
    position: relative;
    size(100px, 100px);
    a{
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      size(25px, 25px);
      fc(.2rem, #fff);
      border-bottom-left-radius: .06rem;
      background-color: rgba(0,0,0, .7);
      z-index: 2;
      right: 0; top: 0;
    }
    img{
      size(100%, 100%);
    }
  }
  .add{
    size(100px, 100px);
    fc(60px, #E0E0E0);
    position: relative;
    border: 1px dashed #B2B2B2;
    display: inline-block;
    overflow: hidden;
    cursor: pointer;
    span{
      display: block;
      transform: translate3d(18px, 15px, 0);
    }
  }

  .pic-upload{
    width: 100%; font-size: 0;
    display: flex;
    flex-flow: row wrap;
    border: 1px solid #ccc;
    .list{
      display: inline-block;
      margin-right: .22rem; margin-bottom: .22rem;
      cursor: pointer;
      &:nth-of-type(3n){
        margin-right: 0;
      }
    }
  }

  .msg-num{
    size(10px, 10px);
    fc(12px, #fff);
    display: flex;
      justify-content: center;
      align-items: center;
    position: absolute;
    padding: 5px;
    overflow: hidden;
    border-radius: 100%;
    transform: scale(.8) translate3d(20px, -40px, 0);
    background-color: #ff6b2a;
  }

  .ipt-file{
    position: absolute;
    left: 1rem; top: 5rem;
    size(0, 0);
    overflow: hidden;
    left: -99rem; top: -99rem;
  }


  .select-btn{
    position: absolute;
    size(1.05rem, .4rem);
    right: .3rem; bottom: .17rem;
    background-color: #e0e0e0;
    border-radius: .2rem;
    padding: 0 .1rem;
    span{
      fc(.24rem, #fff);
      height: inherit;
      display: flex;
      align-items: center;
      justify-content: start-end;
      transform: scale(.8);
      transition: .5s;
    }
    i{
      display: block;
      position: absolute;
      size(.32rem, .32rem);
      background-color: #fff;
      transition: .5s;
      top: .04rem; right: 0;
      border-radius: 100%;
      transform: translate3d(-.05rem,0,0);
    }
    &.select-btn-active{
      background-color: $themeColor;
      span{
        justify-content: flex-end;
      }
      i{
        transform: translate3d(-.68rem,0,0);
      }
    }
  }

}

</style>
