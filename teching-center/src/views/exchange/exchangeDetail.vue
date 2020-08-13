<template>
  	<div class="ac-right-content">
      <div v-if="!exchangeDetail" class="no-data">暂无数据</div>
      <div v-else class="has-data">
        <div class="ac-right-main" v-if="!webApi.isEmpty(exchangeDetail)">
          <iScroll :id="'exchangeDetail'" :is-refresh="scrollRefresh"  :toTop="false">
            <div class="ac-box">
              <div class="popup-wrap" v-if="!canClick">
                <div class="hasDeleted-icon" v-if="exchangeDetail.isdelete==1"></div>
              </div>
            <div class="top-header">
              <div class="top-header-li">

                <div class="iconWrap">
                  <div class="chulizhong" v-if="exchangeDetail.isProcessing == '1'">

                  </div>
                  <template v-else>
                    <div class="hasResolve usual-style" v-if="exchangeDetail.solve=='1'">
                      <i>✓</i>已解决
                    </div>
                    <div class="noAnswer usual-style" v-else-if="exchangeDetail.solve=='0'">
                      <i>?</i>未回复
                    </div>
                    <div class="noResolve usual-style" v-else-if="exchangeDetail.solve=='2'">
                      <i>!</i>已回复
                    </div>
                    <div class="question-closely usual-style" v-else-if="exchangeDetail.solve=='3'">
                      <i>⇧</i>学员追问
                    </div>
                  </template>
                </div>
                <span class="text-span" :title="exchangeDetail.chapterName">源自：
                          <!--<template v-if="exchangeDetail.taskType=='chapter'">{{exchangeDetail.courseName}} + {{exchangeDetail.chapterName}}</template>
                          <template v-if="exchangeDetail.taskType=='video'">{{exchangeDetail.courseName}} + {{exchangeDetail.chapterName}}</template>
                          <template v-if="exchangeDetail.taskType=='exam'">{{exchangeDetail.courseName}} + {{exchangeDetail.chapterName}}</template>-->
                          <span :title="exchangeDetail.courseName+' + '+exchangeDetail.chapterName" v-if="exchangeDetail.taskType=='chapter'">{{exchangeDetail.courseName}} + {{exchangeDetail.chapterName}}</span>
                          <span :title="exchangeDetail.courseName+' + '+exchangeDetail.chapterName" v-if="exchangeDetail.taskType=='video'">{{exchangeDetail.courseName}} + {{exchangeDetail.chapterName}}</span>
                          <span :title="exchangeDetail.courseName" v-if="exchangeDetail.taskType=='course'||exchangeDetail.taskType==''">{{exchangeDetail.courseName}}</span>
                          <template v-if="exchangeDetail.taskType=='exam'">
                            <span :title="exchangeDetail.sourcePath" v-if="exchangeDetail.sourcePath">{{exchangeDetail.sourcePath}}</span>
                            <span :title="exchangeDetail.courseName+' + '+exchangeDetail.chapterName +''+ (exchangeDetail.taskCurrent?(' + 第'+exchangeDetail.taskCurrent+'题'):'')" v-else>{{exchangeDetail.courseName}} + {{exchangeDetail.chapterName}}{{exchangeDetail.taskCurrent?' + 第'+exchangeDetail.taskCurrent+'题':''}}</span>
                          </template>
                </span>
              </div>
              <!--<div class="top-header-right" v-if="exchangeDetail.knowledgeExist=='0'&&!successAddKnowledge">
                  <button class="add-button" @click="addBbs(exchangeDetail.id)"><i class="el-icon-circle-plus-outline"></i>添加知识库</button>
              </div>-->
            </div>
          <div class="ac-question">
          <div @click="handleFocusState">
            <div class="ac-right-top">
            <div class="ac-top-left">
              <img class="ac-desc-avatar" :src="host.img+exchangeDetail.headImg">
              <span class="ac-desc-user-name">{{ exchangeDetail.nikeName }}</span>
            </div>
            <div class="ac-top-right">
              <span class="yujing-icon-wrap" v-if="(currentTime-exchangeDetail.updateTime)>43200&&(exchangeDetail.solve=='0'||exchangeDetail.solve=='3')"><i class="yujing-icon"></i></span>
              <span class="ac-desc-time">{{ webApi.formatDate(exchangeDetail.updateTime,'Y')}}-{{webApi.formatDate(exchangeDetail.updateTime,'M')}}-{{webApi.formatDate(exchangeDetail.updateTime,'D')}}&nbsp;&nbsp;&nbsp;{{webApi.formatDate(exchangeDetail.updateTime,'h')}}:{{webApi.formatDate(exchangeDetail.updateTime,'m') }}</span>
            </div>
          </div>
          <!--<p class="ac-question-video">
            <span class="ac-list-info-block" v-if="exchangeDetail.taskprogress != '-1' && exchangeDetail.taskType != ' ' && exchangeDetail.taskType == 'video' && exchangeDetail.courseId && exchangeDetail.courseId != ' ' && exchangeDetail.chapterId && exchangeDetail.chapterId != ' ' && exchangeDetail.taskId && exchangeDetail.taskId != ' '?webApi.formatType(exchangeDetail.taskType,exchangeDetail.taskprogress):''">
              <a class="ac-list-info-span ac-list-info-video" href="javascript:;" @click="checkVideoSource(exchangeDetail)">
                <i class="icon icon-ac-time"></i>
                <span class="ac-desc-video-time">{{exchangeDetail.taskprogress != '-1' && exchangeDetail.taskType != ' ' && exchangeDetail.taskType == 'video' && exchangeDetail.courseId && exchangeDetail.courseId != ' ' && exchangeDetail.chapterId && exchangeDetail.chapterId != ' ' && exchangeDetail.taskId && exchangeDetail.taskId != ' '?webApi.formatType(exchangeDetail.taskType,exchangeDetail.taskprogress):''}}</span>
              </a>
            </span>
            <span class="ac-question-chapter" v-if="false">{{exchangeDetail.courseName}}/{{exchangeDetail.subjectName}}/{{exchangeDetail.chapterName}}</span>
          </p>-->
          <!--<div class="ac-question-exam" v-if="exchangeDetail.taskType == 'exam'"><div class="exam-wrap"><i class="icon-wrap"></i><span class="text-wrap">题目</span></div> </div>-->
          <p class="ac-question-title">标题：{{ exchangeDetail.title }}</p>
            <!--<p class="ac-question-title" v-if="exchangeDetail.bbstype==0"><span class="ac-list-type-1">#讨论#</span>{{ exchangeDetail.title }}</p>-->
          <div class="ac-question-content">
            <pre>内容：<span v-html="exchangeDetail.contentHtml.replace(/<img.*?>/g,'')"></span></pre>
          </div>
          <div class="discussQA-imgPath" v-if="exchangeDetail.imgPath">
            <!--<img v-for="(imgPath,index) in setImgPath(exchangeDetail.imgPath)" :src="getImgPath(imgPath)" @click="openPreviewPic(index,setImgPath(exchangeDetail.imgPath))">-->
            <viewer :images="setImgPath(exchangeDetail.imgPath)">
              <img v-for="(item,index) in setImgPath(exchangeDetail.imgPath)" :src="getImgPath(item)" :key="index">
            </viewer>
          </div>
          <!--<div class="ac-question-handle">
            <p><i class="iconfont icon-dianzan"></i>{{exchangeDetail.praiseCount}}</p>
            <p><i class="iconfont icon-shanchu"></i>删除</p>
          </div>-->
          </div>
          <div class="atonce-btn-wrap" v-if="!showReply">
            <button class="atonce-btn" @click="toAnswer">我来回答</button>
          </div>
          <div class="ac-question-reply" v-if="showReply">
            <!--<textarea placeholder="输入内容" width="100%" ref="replyText" style="resize:none"></textarea>-->
            <editor ref="editor" :catchData="catchData" :content="replyContent"></editor>
            <div class="question-reply-btn">
              <input type="file" multiple="multiple" accept="image/*" ref="iptFile" class="ipt-file" hidden>
              <uploadPicture ref="uploadPicRef" :isStartUpload="isStartUpload" @load-upload="loadUpload" :picList="picList" @showInput="showInput"></uploadPicture>
              <a href="javascript:;" class="show-uploadImg-a" @click="showUploadBtn()">
                <i class="iconfont icon-pic"></i>
              </a>
              <a class="replay-a" href="javascript:;" @click="sub">回复</a>
            </div>
          </div>
            <el-upload
              ref="upload"
              action="http://api.zbgedu.com/api/base/file/upload"
              list-type="picture-card"
              v-if="showUploadImg"
              :headers="uploadHeadersData"
              :auto-upload="true"
              :file-list="fileList"
              :limit="5"
              :on-exceed="handleExceed"
              :data="uploadImgData"
              :on-change="onUploadChange"
              :http-request="uploadImgFunc"
              accept="image/*"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
        </div>
          <div class="get-grade-wrap" v-if="getGradeTeacherInfo||gradeTeacherArr">
            <div class="get-grade" v-if="gradeTeacherArr">
              <slider ref="slider" :options="scrollOptions">
                <!-- 直接使用slideritem slot -->
                <slideritem v-for="(item,index) in gradeTeacherArr" :key="index">
                  <img class="get-grade-avatar" :src="host.img+item.headImg">
                  <span class="ac-answer-user-name">{{ item.nikeName?item.nikeName:item.realName }}</span>
                  <span class="ac-answer-icon" v-if="item.userlevel == '4'||item.userlevel == '5'||item.userlevel == '6'">中博名师</span>
                  <div class="ac-answer-info">
                    <p class="ac-answer-info-top">
                      <span class="get-grade-text">恭喜{{item.nikeName?item.nikeName:item.realName}}解决了该问题并获得{{item.grade}}颗星
                        <el-rate
                          v-model="item.grade-0"
                          disabled
                          text-color="#fc3a6f"
                          score-template="{value}">
                        </el-rate>
                      </span>
                    </p>
                  </div>
                </slideritem>
              </slider>
            </div>
            <div class="get-grade" v-if="getGradeTeacherInfo">
              <img class="get-grade-avatar" :src="host.img+getGradeTeacherInfo.headImg">
              <span class="ac-answer-user-name">{{ getGradeTeacherInfo.nikeName?getGradeTeacherInfo.nikeName:getGradeTeacherInfo.realName }}</span>
              <span class="ac-answer-icon" v-if="getGradeTeacherInfo.userlevel == '4'||getGradeTeacherInfo.userlevel == '5'||getGradeTeacherInfo.userlevel == '6'">中博名师</span>
              <div class="ac-answer-info">
                <p class="ac-answer-info-top">
                  <span class="get-grade-text">恭喜{{getGradeTeacherInfo.showtext}}解决了该问题并获得{{getGradeTeacherInfo.grade}}颗星
                    <el-rate
                      v-model="getGradeTeacherInfo.grade"
                      disabled
                      text-color="#fc3a6f"
                      score-template="{value}">
                    </el-rate>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div class="ac-answer" @click="handleFocusState">
            <div class="ac-answer-tit">全部回复({{ exchangeDetail.replyCount }})</div>
            <audio id="audioId"></audio>
            <ul class="ac-answer-ul" v-if="replyList.length>0">
              <li class="ac-answer-li" v-for="(list,index) in replyList">
                <img class="ac-answer-avatar" :src="host.img+list.headImg">
                <div class="ac-answer-info">
                  <p class="ac-answer-info-top">
                    <span class="ac-answer-user-name">{{ list.nikeName?list.nikeName:list.realName }}</span>
                    <span class="ac-answer-icon" v-if="list.userlevel == '4'||list.userlevel == '5'||list.userlevel == '6'">中博名师</span>
                    <span class="ac-answer-time">{{ webApi.formatDate(list.updateTime,'Y')}}-{{webApi.formatDate(list.updateTime,'M')}}-{{webApi.formatDate(list.updateTime,'D')}}&nbsp;&nbsp;{{webApi.formatDate(list.updateTime,'h')}}:{{webApi.formatDate(list.updateTime,'m') }}:{{webApi.formatDate(list.updateTime,'s') }}</span>
                  </p>
                  <div class="ac-answer-info-desc" v-if="list.replayForm == '1'">
                     <p v-if="!list.showEdit" style="white-space:normal" v-html="webApi.unescapeHTML(list.contentHtml.replace(/<img.*?>/g,''))"></p>
                    <div class="edit-content-wrap" v-if="list.showEdit">
                      <!--<el-input type="textarea" v-model="editContent"></el-input>-->
                      <editor ref="editor1" :catchData="catchEditData" :content="editContent"></editor>
                      <div class="el-upload-wrap">
                        <el-upload
                          ref="upload"
                          action="http://api.zbgedu.com/api/base/file/upload"
                          list-type="picture-card"
                          :headers="uploadHeadersData"
                          :auto-upload="true"
                          :file-list="fileList"
                          :data="uploadImgData"
                          :limit="5"
                          :on-change="onUploadChange"
                          :http-request="uploadImgFunc"
                          accept="image/*"
                          :on-preview="handlePictureCardPreview"
                          :on-remove="handleRemove">
                          <i class="el-icon-plus"></i>
                        </el-upload>
                      </div>
                      <div class="btn-wrap">
                        <button class="edit-btn-usual edit-btn-cancel" @click="cancelEdit(list,index)">放弃修改</button>
                        <button class="edit-btn-usual edit-btn-confirm" :disabled="isCommitting" @click="confirmEdit(list,index)">{{isCommitting?'正在提交...':'确认修改'}}</button>
                      </div>
                    </div>
                    <div class="ac-answer-pic" v-if="list.imgPath && getreolyImg(list.contentHtml).length<1 && !list.showEdit">
                      <!--<img :src="getImgPath(imgPath)" v-for="(imgPath, index) in setImgPath(list.imgPath)" @click="openPreviewPic(index,setImgPath(list.imgPath))">-->
                      <viewer :images="setImgPath(list.imgPath)">
                        <img v-for="src in setImgPath(list.imgPath)" :src="getImgPath(src)" :key="src">
                      </viewer>
                      <!--<img :src="getImgPath(list.imgPath)" @click="openPreviewPic(0,setImgPath(list.imgPath))">-->
                    </div>
                    <div class="ac-answer-pic" v-if="list.contentHtml && getreolyImg(list.contentHtml).length>0 && !list.showEdit">
                      <!--<img :src="getImgPath(imgPath)" v-for="(imgPath, index) in getreolyImg(list.contentHtml)" @click="openPreviewPic(index,getreolyImg(list.contentHtml))">-->
                      <viewer :images="getreolyImg(list.contentHtml)">
                        <img v-for="src in getreolyImg(list.contentHtml)" :src="getImgPath(src)" :key="src">
                      </viewer>
                    </div>
                  </div>
                  <div class="an-answer-info-voice" v-if="list.replayForm == '2'">
                    <!--<audio src="../assets/1968.wav" controls autoplay loop></audio>-->
                    <a href="javascript:;" class="audio-icon" @click="playAudio(list,index)"><i class="icon-audio" :class="[list.playStatus?'playing':'']"></i></a><span class="time-audio">{{list.soundlen}}秒</span>
                  </div>
                  <div class="ac-answer-delete" v-if="exchangeDetail.solve!='1'&&list.memberId == (techLoginInfo.memberId?techLoginInfo.memberId:techLoginInfo.eduUserId)&&!list.showEdit&&index>lastStudentIndex">
                    <!--<span class="ac-answer-delete-span" @click="deleteComment(list)"><i class="iconfont icon-shanchu"></i>删除</span>-->
                    <span class="ac-answer-delete-span ac-answer-delete-edit" @click="editComment(list,index)"><i class="icon-edit-wrap"></i>编辑</span>
                  </div>
                </div>
              </li>
            </ul>
            <div v-else class="has-no-data">
              <div class="img-wrap"></div>
              <p class="text-p">暂无回复内容</p>
            </div>
          </div>
          </div>

          </iScroll>
          <photoSwipe v-if="showPic" :list="list" :currentIndex="currentIndex" @closePic="closePic"></photoSwipe>
        </div>
        <iLoading v-else/>
      </div>
      <videoSource v-if="showVideoSource" :videoParams = "videoParams" @on-closeVideo="closeVideo"></videoSource>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
</template>
<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import Request from '@/request'
  import axios from 'axios'
  import editor from '@/components/editor'
  import iLoading from '@/components/i-loading'
  import iScroll from '@/components/i-scroll'
  import photoSwipe from '@/components/photoSwipe/photo-swipe'
  import uploadPicture from '@/components/uploadPicture'
  import videoSource from '@/components/videoSource'
  import { slider, slideritem } from 'vue-concise-slider'
export default {
  props : {
    exchangeData:{
      type: Object,
      default: ()=>{}
    },
    canClick:{
      type:Boolean,
      default:()=> true
    }
  },
  components : {
    iLoading,
    iScroll,
    photoSwipe,
    uploadPicture,
    videoSource,
    slider,
    slideritem,
    editor
  },
  data() {
    return {
    	scrollRefresh : false,
      showPic: false,
      list: [],
      allPic: [],
      value1:4,
      isCommitting:false,
      isPicSuccessNum: -1,
      allLoad: false,
      currentIndex: 0,
      showUploadImg:false,
      isStartUpload: false, // 是否开始上传
      picList: [], // 图片列表
      //replyList:[],
      replyList1:[1,2,3],
      replyContent:'',
      contentValue:'',
      showReply:false,
      getGradeTeacherInfo:'',  //获得评分的老师信息
      gradeTeacherArr:'',     //如果有多个老师获得，即为数组循环播放
      data: {},
      fileList:[],
      imgPathArr:[],
      editContent:'',
      exchangeDetail:{},
      replyData:[],
      flag: false,
      prevClickTime: 0,
      currentAudio:'',
      lastPlayAudio:'',
      successAddKnowledge:false, //成功添加知识库
      showVoice:true,
      uploadHeadersData:{
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      videoParams:'',
      lastStudentIndex:-1,    //最后一个学生回复的下标
      showVideoSource:false,
      currentTime:'',
      dialogImageUrl: '',
      dialogVisible: false,
      uploadImgData:{
        token: ''
      },
      scrollOptions: {
        currentPage: 0,
        thresholdDistance:500,
        thresholdTime:100,
        autoplay:1000,
        loop:true,
        direction:'vertical',
        loopedSlides:1,
        slidesToScroll:1,
        timingFunction: 'ease',
        speed: 300
      }
    }
  },
  watch:{
    exchangeData(data){
      this.successAddKnowledge = false
      this.showReply = false
      if(data == undefined){
        this.exchangeDetail = false
      }else{
        this.exchangeDetail = {}
        this.picList = [];
        this.showUploadImg = false;
        this.getExchangeDetailAjax();
      }
    },
    exchangeDetail1(data){
      this.exchangeData = data;
      return this.exchangeData
      if(this.webApi.isEmpty(this.exchangeData)) return;
      this.getExchangeDetailAjax();
      this.picList = [];
    },
    list(list) {
        this.isPicSuccessNum = -1;
        this.allLoad = true;
        this.showPic = true;
    }
  },
  mounted(){
    this.currentTime = Date.parse(new Date())/1000;
    this.uploadImgData.token = this.techLoginInfo.token
    this.getExchangeDetailAjax();
  },
  create() {

  },
  computed : {
    ...mapState({
      host: state => state.global.host,
      //techLoginInfo : state => state.global.techLoginInfo,
    }),
    techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))},
    classOption () {   //轮播配置
      return {
        limitMoveNum: 2,
        step:0.3,
      }
    },
    replyList(){
      let arr = this.replyData
      let arr1 = []
      let haveMy = false
      let indexNum = 0
      this.lastStudentIndex = -1
      this.getGradeTeacherInfo = ''
      this.gradeTeacherArr = ''
      arr.forEach((item,index,value) => {
        if(arr[index].playStatus == undefined){
          arr[index].playStatus = false
          arr[index].showEdit = false
        }
        if(item.memberId==this.exchangeDetail.memberId){
          this.lastStudentIndex = index
        }
        if(item.grade != 0){
          arr1.push(item)
        }
      })
      arr1 = this.filterSameArr(arr1)
      if(arr1.length>0){
        for(let i = 0;i<arr1.length;i++){
          if(this.techLoginInfo.id == arr1[i].memberId){
            haveMy = true
            indexNum = i
          }
        }
        if(haveMy){
          this.getGradeTeacherInfo = arr1[indexNum]
          this.getGradeTeacherInfo.showtext = '您'
        }else{
          if(arr1.length == 1){
            this.getGradeTeacherInfo = arr1[0]
            this.getGradeTeacherInfo.showtext = arr1[0].nickName?arr1[0].nickName:arr1[0].realName
          }else{
            this.gradeTeacherArr = arr1
          }
        }
      }
      return arr
    }
  },
  methods : {
    ...mapActions('exchange',[
        'getExchangeDetail'
      ]),
    showUploadBtn(){
      this.showUploadImg=!this.showUploadImg
      this.fileList = []
      this.imgPathArr = []
      if(this.showUploadImg){   //回复显示时，需要把所有编辑的区域都隐藏
        this.exchangeDetail.replys.forEach((item,index)=>{
          item.showEdit = false
        })
      }
    },
    catchData(params){  //富文本编辑器组件返回的值
      this.replyContent = params
    },
    catchEditData(params){
      this.editContent = params
    },
    toAnswer(){  //我来回答
      Request.ajax('setThreadReplyState',{
        token:this.techLoginInfo.token,
        id:this.exchangeDetail.id
      }).then(res=>{
        if(res && res.state == 'success'){
          this.showReply = true
          this.exchangeDetail.isProcessing = '1'
          this.$emit('toAnswer',this.exchangeDetail)
        }else{
          this.webApi.alert(res.msg)
        }
      })
    },
    handleRemove(file,fileList) {
      this.imgPathArr = this.imgPathArr.filter(item=>item!=file.imgPath)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    onUploadChange(file,fileList){
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function(e){
        //console.log(this.result)//图片的base64数据
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`最多只能上传5个文件哦～`);
    },
    uploadImgFunc(file,fileList){
      let that = this
      let imgFile = file.file;//取到上传的图片
      let formData=new FormData();//通过formdata上传
      formData.append('file',imgFile);
      formData.append('token', this.techLoginInfo.token);
      axios.post('https://api.zbgedu.com/api/base/file/upload',formData,{  //http://apidemo.zbgedu.com/api/base/file/upload  http://47.96.2.242:8096/api/base/file/upload
        method: 'post',
        headers: {'Content-Type': 'multipart/form-data'}
      }).then(function (res) {
        //this.fileList.push({name:'1',url:res.data[0].storeFileUrl})
        console.log(res)
        that.imgPathArr.push(res.data[0].storeFileUrl)
      }).catch(function(error){
        console.log(error);
      })
    },
    sub() {
      //this.$refs.upload.submit();

      let content = this.webApi.trim(this.replyContent);

      if(content == ''&&this.imgPathArr.length == 0){
        this.webApi.alert('内容不能为空');
        return;
      }
      let imges = ''
      for(let i = 0;i<this.imgPathArr.length;i++){
        imges += `<img src="${this.imgPathArr[i]}"><br>`
      }
      //return
      //this.handleFocusState();
      //this.isStartUpload = true;
      const str = content.replace(/>/g, '&gt;').replace(/</g, '&lt;');
      let param = {
        token : this.techLoginInfo.token,
        id : this.exchangeData.id, //讨论主题id
        pageNo : 1, //(必)
        pageSize : 20, //(必)
        content : `<p>${str}</p><br>${imges}`, //(必)
        replaytype : 0, //(必)
        teacher: 'permission' //教学中心只有老师能够登录回复

      };

      Request.ajax('bbsreply',param).then(res => {

        if(!res || res.state != 'success'){
          this.webApi.alert('回复失败，请稍后重试');
          return false;
        }
        //this.$refs.uploadPicRef.handleEmptyList();
        //this.isStartUpload = false;
        this.replyContent = '';
        this.$refs.editor.clearContent()
        this.contentValue = '';
        this.imgPathArr = [];
        if(this.$refs.upload){
          this.$refs.upload.clearFiles()
        }
        this.$emit('hasAnswered',this.exchangeDetail)
        this.webApi.alert('评论成功');

        this.getExchangeDetailAjax();

      })

    },
    confirmEdit(params,index){   //确认编辑
      let imges = ''
      if(this.editContent=='' && this.imgPathArr.length == 0){
        this.webApi.alert('内容不能为空');
        return;
      }
      this.isCommitting = true
      for(let i = 0;i<this.imgPathArr.length;i++){
        imges += `<img src="${this.imgPathArr[i]}"><br>`
      }
      const str = this.editContent.replace(/>/g, '&gt;').replace(/</g, '&lt;')
      let param = {
        token:this.techLoginInfo.token,
        id:this.exchangeData.id,
        content:`<p>${str}</p><br>${imges}`,
        imgPath:this.imgPathArr.join(),
        clienttype:'pc',
        pid:params.pid
      }
      Request.ajax('editPost',param).then(res=>{
        if(res && res.state=='success'){
          this.$message({
            message: '编辑成功！',
            type: 'success'
          });
          /*params.content = this.editContent
          params.showEdit = false
          this.$set(this.exchangeDetail.replys,index,params)
          this.scrollRefresh = !this.scrollRefresh;*/
          this.getExchangeDetailAjax();
        }else{
          this.webApi.alert(res.msg||'系统异常，请稍后再试～')
        }
        this.isCommitting = false
      })
    },
    getExchangeDetailAjax() {
      let params = {
        "pageNo": 1,
        "pageSize": 1000,
        "id": this.exchangeData.id,
        'token' : this.techLoginInfo.token
      }
      if(!this.canClick){
        params.isStatistical = 1
      }
      Request.ajax('bbsdetail',params).then(res=>{
        //this.exchangeData = res.data
        this.exchangeDetail = res.data
        this.replyData = res.data.replys
        this.$nextTick(function () {
          setTimeout(()=>{     //若是回复里面有图片，加载图片需要一定时间，所以延迟200ms刷新滚动条
            this.scrollRefresh = !this.scrollRefresh;
          },200)
        })
      })
    },
    editComment(param,index){  //编辑回复
      this.exchangeDetail.replys.forEach((item,index)=>{
        item.showEdit = false
      })
      this.showUploadImg = false
      this.fileList = []
      this.imgPathArr = []
      let imgArr = []
      if(!this.webApi.isEmpty(param.imgPath)){
        imgArr =  param.imgPath.split(',')
        imgArr.forEach((item)=>{
          this.fileList.push({'url':'http://eximg.zbgedu.com'+item,'imgPath':item})
          this.imgPathArr.push(item)
        })
      }
      this.fileList.push()
      param.showEdit = true
      this.editContent = param.contentHtml.replace(/<[^>]+>/g,"").replace(/&gt;/g, '>').replace(/&lt;/g, '<')
      this.$set(this.exchangeDetail.replys,index,param)
      this.scrollRefresh = !this.scrollRefresh;
    },
    cancelEdit(params,index){  //取消编辑
      params.showEdit = false
      this.$set(this.exchangeDetail.replys,index,params)
      this.scrollRefresh = !this.scrollRefresh;
    },
    filterSameArr(list){   //过滤value相同的数组
      let t = [];
      list.forEach(item => {
        let repeat = false;
        for(let i = 0; i < t.length; i++){
          if(t[i].memberId === item.memberId){
            repeat = true;
            break
          };
        };
        if(!repeat) t.push(item);
      });
      return t
    },

    addBbs(params){
      Request.ajax('addBbs',{
        token:this.techLoginInfo.token,
        tid:params
      }).then((res)=>{
        if(res&&res.state=='success'){
          this.$message({
            message: '添加成功！',
            type: 'success'
          });
          this.successAddKnowledge = true
        }else{
          this.webApi.alert(res.msg)
        }
      })
    },
    showInput(data) {
      if(data){
        this.flag = true;
      }else{
        this.flag = false;
      }


    },
    checkVideoSource(params){
      this.showVideoSource = true
      this.videoParams = params
    },
    playAudio(param,index){
      var audio = document.getElementById("audioId");
      if(param.filePath == this.lastPlayAudio){
        param.playStatus = !param.playStatus
        this.$set(this.exchangeDetail.replys,index,param)
        if(self.status == "true") {//初始状态未播放，点击播放
          audio.pause();
          self.status = "false"
        }else{//已经在播放，点击暂停
          audio.play();
          self.status = "true"
        }
      }else{
        this.exchangeDetail.replys.forEach((value,index,array) => {
          value.playStatus = false
        })
        param.playStatus = !param.playStatus
        this.$set(this.exchangeDetail.replys,index,param)
        audio.src = param.filePath
        audio.play();
        self.status = "true"
      }
      this.lastPlayAudio = param.filePath
    },
    closeVideo(){
      this.showVideoSource = false
    },
    deleteComment(param){  //删除自己发表的评论
      this.$confirm('确定要删除这条回复吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Request.ajax('bbs_del',{
          'token':this.techLoginInfo.token,
          'id':param.id,
          'type':'1',
        }).then(res => {
          if(res.state && res.state=='success'){
            this.webApi.alert('回复删除成功！')
            this.getExchangeDetailAjax();
          }else{
            this.webApi.alert('回复删除失败！')
          }
        })
      }).catch(() => {

      });
    },
    // 是否编辑文章
    handleFocusState() {
      this.$refs.uploadPicRef && this.$refs.uploadPicRef.handleCloseUpload();
    },
    loadUpload(data) {
        if(data.state == 'error') {
          this.webApi.alert(`图片上传失败，请稍后再试`);
          return;
        }
        let content = this.webApi.trim(this.replyContent);

        if(content == ''){
            this.webApi.alert('内容不能为空');
            return false;
        }
        if (this.exchangeData.id == '') {
            this.webApi.alert('id不能为空');
            return false;
        }

        if (this.exchangeData.subjectId == '') {
            this.webApi.alert('科目id不能为空');
            return false;
        }


        let aarr=[],imges="",aa=data.imgPath;

        if(!this.webApi.isEmpty(aa)){
           aarr = aa.split(",");
            for(let i in aarr){
                imges += `<img src="${this.webApi.cdnImgUrl}${aarr[i]}"><br>`
            }
        }
        let param = {
            token : this.techLoginInfo.token,
            id : this.exchangeData.id, //讨论主题id
            pageNo : 1, //(必)
            pageSize : 20, //(必)
            content : `<p>${content}</p><br>${imges}`, //(必)
            replaytype : 0, //(必)
            teacher: 'permission' //教学中心只有老师能够登录回复

        };

        Request.ajax('bbsreply',param).then(res => {

          if(!res || res.state != 'success'){
            this.webApi.alert('回复失败，请稍后重试');
            return false;
          }
          this.$refs.uploadPicRef.handleEmptyList();
          this.isStartUpload = false;
          this.$refs.editor.clearContent()
          this.webApi.alert('评论成功');

          this.getExchangeDetailAjax();

        })


    },
  	 //处理图片路径
      setImgPath(imgPaths) {
        let imgPath=imgPaths.split(',');
        let imgPathArr=[];
        imgPath.forEach((item) => {
          if(!this.webApi.isEmpty(item)) {

            imgPathArr.push(item);
          }
        })
        return imgPathArr;
      },
      //设置图片路径域名
      getImgPath(imgPath) {
        if(imgPath.length>0){
            if(imgPath.substr(0,4)!="http"){
               return this.host.img+imgPath;
            }else{
              return imgPath;
            }
         }else{
          return imgPath;
         }
      },
      getreolyImg(html) {
       //创建一个div
         let divHtml = document.createElement("div");
         divHtml.innerHTML = html;
         let divHtmlimg = divHtml.getElementsByTagName("img");
         if(divHtmlimg.length<1){
              return '';
         }
         let divHtmlimgArr = [];
         for(let i=0;i<divHtmlimg.length;i++){
            divHtmlimgArr.push(divHtmlimg[i].getAttribute("src"));
         }
         return divHtmlimgArr;
      },
      // 打开预览图片
      openPreviewPic(index,data) {

        this.currentIndex = index;
        let _imgPath = data;
        this.allPic = [];
        for(let i=0;i<_imgPath.length;i++){
            this.allPic.push(this.getImgPath(_imgPath[i]))
        }
        if(this.isPicSuccessNum == -1) {
          this._picListInit();
        }else if(this.isPicSuccessNum < this.allPic.length) {
          this.webApi.alert('图片加载中，请耐心等待。。。！')
        }


      },
      // 图片列表初始
      _picListInit(callback) {

        let _list = [];

        this.isPicSuccessNum = 0;

        this.allPic.map(item =>{

          let newImg = new Image();

          newImg.onload = (() => {
            _list.push({
              src: item,
              w: newImg.width,
              h: newImg.height
            });

            if(_list.length == this.allPic.length){
                this.list = _list;
            }

            this.isPicSuccessNum++;

          })

          newImg.src = item;

        });

      },
      closePic(){
        this.showPic = false;
      }
  }
}

</script>
<style lang="stylus">
.ac-right-content {
    position: relative;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.ac-right-content .no-data{
  color:#fc3a6f;
  font-size:16px;
  text-align center;
  line-height 30px;
  padding-top 30px;
}
.ac-right-content .has-data{
  height:100%;
}
.ac-right-main{
  width: 100%;
  height: 100%;
}
.ac-right-content .ac-question {
    padding: 10px 20px 20px;
  background #fff
}
.ac-right-top {
    width: 100%;
    height: 40px;
    left: 0;
    z-index: 9;
    line-height: 34px;
    background-color: #fff;
}
.el-main
  background none
.top-header
  width 100%
  height 60px
  line-height 60px
  border-bottom 1px solid #e7eaf2
  background #fff
  .top-header-li
    width 70%
    height 60px
    float left
    overflow hidden
    display flex
    .text-span
      display inline-block
      width 100%
      margin-right 20px
      margin-left 20px
      color #999
      font-size 14px
      text-align left
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
    .iconWrap
      width 80px
      height 40px
      padding-top 20px
      margin-left 20px
      float left
      .chulizhong
        width 77px
        height 22px
        background url("../../assets/img/icon_image.png") no-repeat -0px -282px
      .usual-style
        width 78px
        height 20px
        border-radius 10px
        text-align center
        font-size 13px
        padding-left 18px
        position relative
        line-height 18px
        i
          display inline-block
          width 18px
          height 18px
          border-radius 10px
          font-style normal
          text-align center
          color #fff
          line-height 18px
          position absolute
          left 0
      .hasResolve
        color #729cd6
        border 1px solid #729cd6
        i
          background #729cd6
      .noAnswer
        border 1px solid #f29754
        color #f29754
        i
          background #f29754
      .noResolve
        border 1px solid #ff5656
        color #ff5656
        i
          background #ff5656
      .question-closely
        border 1px solid #5BBF48
        color #5BBF48
        i
          background #5BBF48
  .top-header-right
    float right
    margin-right 20px
    .add-button
      width 135px
      border none
      border-radius 13px
      height 25px
      line-height 25px
      text-align center
      background #FFD4E0
      color #FF366D
      font-size 14px
      cursor pointer
    .add-button:focus
      outline none
.ac-top-left {
    float: left;
}
.ac-top-right
  float: right;
  .yujing-icon-wrap
    position relative
    top 5px
    .yujing-icon
      display inline-block
      width 25px
      height 25px
      background url("../../assets/img/icon_image.png") no-repeat -247px -150px

.ac-top-left .ac-desc-avatar {
    float: left;
    width: 34px;
    height: 34px;
    border-radius: 50%;
}
.ac-desc-user-name {
    font-size: 16px;
    font-weight:bold;
    color: #29292D;
    margin-left: 10px;
}
.ac-desc-time {
    display: inline-block;
    font-size: 14px;
    color: #89949C;
}


.ac-right-content .ac-question .ac-question-title {
    font-size: 18px;
    color: #1e1e1e;
    border-bottom: 1px solid #e7eaf2;
    line-height: 20px;
    font-weight bold;
    margin-top 15px
    padding-bottom: 20px;
}
.ac-right-content .ac-question .ac-question-title .ac-list-type-0 {
    color: #fc3a6f;
    margin-right: 5px
}
.ac-right-content .ac-question .ac-question-title .ac-list-type-1 {
    color: #F7AC2B
}
.ac-right-content .ac-question .ac-question-title .ac-list-type-2 {
    color: #fc3a6f
}
.ac-right-content .ac-question .ac-question-video {
    font-size: 14px;
    color: #89949C;
    margin: 10px 0;
}
.ac-right-content .ac-question .ac-question-video {
    font-size: 14px;
    color: #89949C;
    margin: 10px 0;
}
.ac-right-content
  .ac-right-main
    .scroll
      .wrapper
        .ac-box
          .ac-answer
            min-height 500px
            .has-no-data
              .img-wrap
                width 114px
                height 84px
                background url("../../assets/img/icon_image.png") no-repeat -633px 0px
                margin 100px auto 0
              .text-p
                text-align center
                font-size 14px
                color #333
                margin-top 6px
          .popup-wrap
            position absolute
            top 0
            left 0
            width 100%
            height 100%
            cursor not-allowed
            z-index: 1;
            .hasDeleted-icon
              position absolute
              top 70px
              right 20px
              width 75px
              height 61px
              background #fff url("../../assets/img/icon_image.png") no-repeat -682px -159px

    .ac-question
      .atonce-btn-wrap
        text-align right
        .atonce-btn
          width 90px
          height 32px
          line-height 32px
          background #ff366d
          text-align: center;
          font-size 14px
          color #fff
          cursor pointer
          border-radius 4px
      .ac-question-video
        .ac-list-info-block
          .ac-list-info-video
            width 75px
            height 20px
            border 1px solid #ff366d
            color #fff
            .icon-ac-time
              display inline-block
              width 18px
              height 18px
              background url("../../assets/img/icon_image.png") no-repeat -44px 5px
              float: left
            .ac-desc-video-time
              display inline-block
              float: left
              font-size 12px
              width 55px
              height 18px
              line-height 18px
              text-align center
              background #ff366d
              color #fff
      .ac-question-exam
        .exam-wrap
          width 75px
          height 20px
          border 1px solid #acacac
          color #fff
          .icon-wrap
            display inline-block
            width 18px
            height 18px
            background url("../../assets/img/icon_image.png") no-repeat 3px -36px
            float: left
          .text-wrap
            display inline-block
            font-size 12px
            width 55px
            height 18px
            line-height 18px
            text-align center
            background #acacac
    .get-grade-wrap
      height 50px
      margin-top 10px
      background #fff
      border-radius 4px
      overflow hidden
      .get-grade
        line-height 50px
        position relative
        .slider-item
          display: block;
          font-size: inherit;
          align-items: inherit
          text-align left
        .get-grade-avatar
          width 30px
          height 30px
          border-radius 30px
          position: relative;
          top: 9px;
          margin-left: 20px;
        .ac-answer-icon
          display: inline-block;
          width: 56px;
          height: 16px;
          line-height: 16px;
          background: #ff366d;
          text-align: center;
          font-size: 12px;
          border-radius: 2px;
          color: #fff;
        .ac-answer-user-name
          font-size 15px
          color #1e1e1e
        .ac-answer-info
          float right
          width auto
          margin-right 20px
          .ac-answer-info-top
            color #666
            font-size 14px
            margin 0
        .el-rate
          display inline-block
          position: relative;
          top: -2px;
          width auto


.ac-list-info-block .ac-list-info-video {
    font-size: 12px;
    cursor: pointer;
    vertical-align: middle;
}
.ac-question-chapter{
	color: #ff366d;
	font-size: 12px;
	font-weight:bold;
	padding-left:5px;
}
.icon-ac-time, .icon-node-time{
	width: 20px;
    height: 19px;
    float:left;
    background: url(../../assets/img/video-box.png) no-repeat;
}
/*.ac-list-info-block .ac-desc-video-time{
	border: 1px solid #3E4E63;
    padding: 2px 5px;
    margin-left: -1px;
    float: left;
}*/
.ac-right-content .ac-question .ac-question-content {
    font-size: 15px;
    color: #1e1e1e;
    line-height: 24px;
    padding-bottom: 10px;
    padding-top: 20px;
}
.discussQA-imgPath {
    overflow: hidden;
    margin-bottom: 10px;
}
.discussQA-imgPath img {
    float: left;
    width: 80px;
    height: 80px;
    margin-right: 10px;
    margin-bottom: 10px;
    cursor: pointer;
}
.ac-question-handle{
	padding:10px 0;
}
.ac-question-handle p{
	display: inline-block;
	margin-right: 20px;
	cursor: pointer;
}
.ac-question-handle p:nth-child(1){
	color: #fff;
	background: #ff366d;
	padding:3px 10px;
	border-radius: 5px;

}
.ac-question-handle p:nth-child(2){
	color: #b5a2a7;
}
.ac-question-handle p .iconfont{
	padding-right: 5px;
}
.ac-question-reply{
	padding-top: 10px;
	padding-bottom: 30px;
}
.ac-question-reply textarea{
	width: 100%;
	height: 90px;
	background:#f7f8fa;
	border:1px solid #e7eaf2;
  box-sizing border-box
	border-radius:5px;
	outline:none;
	color:#b5a2a7;
	padding:10px;
	font-size:14px;
}
.question-reply-btn{
	position:relative;
}
.question-reply-btn i{
	position:absolute;
	left:0;
	top:12px;
	font-size:20px;
	color:#cccccc;
}
.question-reply-btn input{
	width:40px;
	height:30px;
	position:absolute;
	left:0;
	top:0;
	//opacity:0;
}
.question-reply-btn .replay-a{
	position:absolute;
	right:0;
	top:10px;
	font-size:14px;
	background:#ff366d;
	border-radius:5px;
	padding:0 10px;
	height:30px;
	line-height:30px;
	color:#fff;
}
.ac-answer{
  color:#1e1e1e;
  background #fff
}
.ac-answer-tit{
	width:100%;
	height:50px;
	line-height:41px;
  font-weight bold
	font-size:16px;
	padding-left:10px;
	border-bottom:1px solid #e7eaf2;
	border-top:10px solid #f7f7f7;

}
.ac-answer-li {
    position: relative;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-bottom: 1px solid #E9E9E9;
    padding: 5px 20px 15px 54px;
}
.ac-answer-avatar {
    position: absolute;
    top: 15px;
    bottom: 0;
    left: 20px;
    right: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
}
.ac-answer-info .ac-answer-info-top {
    display: block;
    font-size:15px;
    margin: 15px 0;
    overflow: hidden;
}
.ac-answer-info .ac-answer-info-top .ac-answer-icon{
  display inline-block
  width 56px
  height 16px
  line-height 16px
  background #ff366d
  text-align center
  font-size 12px
  border-radius 2px
  color #fff
}
.ac-answer-info .ac-answer-info-top .ac-answer-time{
  float right
  font-size 14px
  color #b5a2a7
}
.ac-answer-info .ac-answer-info-desc {
    clear: both;
    font-size: 14px;
}
.ac-answer-info
  .ac-answer-info-desc
    .edit-content-wrap
      white-space: initial;
      .el-textarea__inner
        background: #f7f8fa;
        resize: none;
        height 90px
        border: 1px solid #e7eaf2;
      .el-upload-wrap
        margin-top 20px
      .btn-wrap
        text-align right
        margin-top 20px
        .edit-btn-usual
          width 80px
          height 32px
          line-height 32px
          text-align center
          font-size 14px
          cursor pointer
          border-radius 4px
        .edit-btn-cancel
          color #666
          background #f5f5f5
          border 1px solid #e7e7e7
          margin-right 15px
        .edit-btn-confirm
          color #fff
          background #ff366d
          border 1px solid #ff366d


.ac-answer-info .an-answer-info-voice{
  clear: both;
  font-size 14px
  color #ff366d
  height 30px
}
.ac-answer-info .an-answer-info-voice .audio-icon{
  display inline-block
  width 250px
  height 30px
  border-radius 15px
  background #ffc2d3
  float: left
  position relative
}
.ac-answer-info .an-answer-info-voice .icon-audio{
  display inline-block
  width 20px
  height 20px
  position absolute
  top 5px
  left 13px
  background url("../../assets/img/icon_image.png") no-repeat -177px -78px
}
.ac-answer-info .an-answer-info-voice .icon-audio.playing{
  background url("../../assets/img/voicePlay.gif") no-repeat center center
}
.ac-answer-info .an-answer-info-voice  .time-audio{
  display inline-block
  height 30px
  font-size 14px
  line-height 30px
  margin-left 10px
}
.ac-answer-info .ac-answer-info-desc {
  line-height: 24px;
  word-break:break-all;
  white-space: pre-wrap;
}
.ac-answer-info
  .ac-answer-delete
    text-align right
    .ac-answer-delete-edit
      margin-left 10px
      position relative
      .icon-edit-wrap
        display inline-block
        width 12px
        height 12px
        background url("../../assets/img/icon_image.png") no-repeat -41px -116px
        position absolute
        left 0
        top 3px
.ac-answer-info .ac-answer-delete .ac-answer-delete-span{
  line-height: 24px;
  width 30px;
  color #999;
  font-size 12px
  height 18px
  margin-top 5px
  position relative
  padding-left 18px
  line-height 18px
  cursor pointer
}
.ac-answer-info .ac-answer-delete .ac-answer-delete-span .icon-shanchu{
  position absolute
  left -5px
  top 0
}
pre{
    white-space: pre-wrap;
    word-wrap: break-word;
}
.ac-answer-pic{
  // margin-top: -40px;
  margin-bottom: 10px;
}
.ac-answer-pic img{
    display:inline-block;
    width: 80px;
    height: 80px;
    margin-right: 10px;
    margin-bottom: 10px;
    cursor: pointer;
}
.delete-content{
  height 75px
}
.delete-content .text{
  text-align center
  font-size 14px
  color #333
  height 24px
  line-height:24px
}
.delete-content .button-wrap{
  text-align center
  margin-top 10px
}
.delete-content .button-wrap .b-a{
  display inline-block
  width 55px
  height 32px
  font-size 15px
  line-height 30px
  text-align center
  border-radius 3px
}
.delete-content .button-wrap .confirm{
  color #fff
  background #ff366d
  border 1px solid #ff366d
  margin-right 25px
}
.delete-content .button-wrap .cancel{
  color #333333
  background #fff
  border 1px solid #ddd
}

</style>
