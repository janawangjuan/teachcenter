<template>
  <div class="answerQuestion">
    <el-container class="answerQuestion-el-container">
      <el-header height="140">
        <div class="typeChange-wrap">
          <ul class="typeChange-ul">
            <li class="typeChange-li" v-for="(item,index) in typeList" :class="[selectTypeChange==index?'active':'']" @click="changeQuesitonType(index)"><i class="yujing-icon" v-if="index==0"></i>{{item}}</li>
          </ul>
          <span class="all-report-wrap" @click="toGather()"><i class="huizong-icon"></i>答疑汇总报告</span>
        </div>
        <div class="manage-box-select">
          <div class="ac-left-top myAc-left-top">
            <div class="ac-top-left">
              <el-form :inline="true" :rules="rules" :model="listFilterForm">
                <el-form-item label="选择项目/科目">
                  <el-cascader
                    size="mini"
                  :options="options1"
                  v-model="listFilterForm.selectedOptions"
                  :props="cascaderProps"
                  @change="handleChange">
                  </el-cascader>
                </el-form-item>
                <el-form-item label="选择课程">
                  <!--<el-select v-model="listFilterForm.classType" size="mini" placeholder="请选择" @change="changeRequirement()">
                    <el-option
                      :key="'zheshiquanbu'"
                      :label="'全部'"
                      :value="''">
                    </el-option>
                    <el-option
                      v-for="item in classSelectList"
                      :key="item.value"
                      :label="item.title"
                      :value="item.value">
                  </el-option>
                  </el-select>-->
                  <el-select
                    v-model="listFilterForm.classType"
                    size="mini"
                    @change="changeRequirement()"
                    multiple
                    collapse-tags
                    style="margin-left: 20px;"
                    placeholder="请选择（默认全部）">
                    <el-option
                      v-for="item in classSelectList"
                      :key="item.value"
                      :label="item.title"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!--<el-form-item label="选择班级">
                  <el-select v-model="listFilterForm.classId" size="mini" placeholder="请选择" @change="changeRequirement()">
                    <el-option
                      :key="'zheshiquanbu'"
                      :label="'全部'"
                      :value="''">
                    </el-option>
                    <el-option
                      v-for="item in classList"
                      :key="item.courseArrangeId"
                      :label="item.courseplanName"
                      :value="item.courseArrangeId">
                    </el-option>
                  </el-select>
                </el-form-item>-->
                <el-form-item label="问题状态">
                  <el-select v-model="listFilterForm.statusType" size="mini" placeholder="请选择" @change="changeRequirement()">
                    <el-option
                      v-for="item in statusType"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="问题来源">
                  <el-select v-model="listFilterForm.vortType" size="mini" placeholder="请选择" @change="changeRequirement()">
                    <el-option
                      v-for="item in vortType"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="提问时间">
                  <el-date-picker
                    v-model="listFilterForm.askTime"
                    type="daterange"
                    unlink-panels
                    range-separator="至"
                    size="mini"
                    @change="changeAskTime()"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    :picker-options="pickerOptions0"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="发帖时间超过">
                  <el-input v-model.number="listFilterForm.time" @input="changeTime" clearable class="el-input2"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="ac-top-middle">
              <multipleSearchInput @search="search"></multipleSearchInput>
              <!--<el-autocomplete
                v-model="keyWords"
                v-if="selectType!='1'"
                value-key="name"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"
                @select="handleSelect"
              >
                <el-select v-model="selectType" slot="prepend" placeholder="请选择">
                  <el-option label="关键词查询" value="1"></el-option>
                  <el-option label="学员用户名" value="2"></el-option>
                  <el-option label="学员姓名" value="3"></el-option>
                  <el-option label="教师用户名" value="4"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-autocomplete>
              <el-input v-else placeholder="请输入内容" v-on:input="listenSearch" v-model="keyWords" class="input-with-select">
                <el-select v-model="selectType" slot="prepend" placeholder="请选择">
                  <el-option label="关键词查询" value="1"></el-option>
                  <el-option label="学员用户名" value="2"></el-option>
                  <el-option label="学员姓名" value="3"></el-option>
                  <el-option label="教师用户名" value="4"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-input>-->
              <!--<input class="ac-search" type="text" placeholder="请输入搜索内容" v-on:input="listenSearch" ref="searches">
              <a class="ac-search-a" href="javascript:;" @click="search"><i class="iconfont icon-sousuo"></i></a>-->
            </div>
          </div>
        </div>
      </el-header>
      <el-container class="answerQuestion-s-el-container">
        <el-aside class="answerQuestion-s-el-aside">
          <div class="ac-left myAc-left">
            <div class="ac-left-content" v-if="exchangeListData">
            <div v-if="this.webApi.isEmpty(exchangeListData.data)" class="no-data-wrap">
              <div class="no-data">
                <div class="img-wrap">
                  <img class="img-no" src="../../assets/img/class-nodata.png" alt="暂无内容">
                </div>
                <p class="no-text">暂无答疑</p>
              </div>
            </div>
            <iScroll :id="'exchangeManage'" :is-refresh="scrollRefresh" v-else>
              <ul class="ac-list-ul">
                <div>
                  <li class="ac-list-li" :class="[activeIndex == index?'active':'']" v-for="(item,index) in exchangeListData.data">
                    <div class="ac-list-a">
                      <a class="ac-list-li-content js-ac-list-active" href="javascript:;" @click="openDetail(item,index)">
                        <div class="source-wrap">
                          <!--<div class="source-wrap-small">
                            <div class="source-wrap-mini">
                              源自：
                              <template v-if="item.taskType=='chapter'">{{item.courseName}} + {{item.chapterName}}</template>
                              <template v-if="item.taskType=='video'">{{item.courseName}} + {{item.chapterName}}</template>
                              <template v-if="item.taskType=='exam'">{{item.courseName}} + {{item.chapterName}}</template>
                            </div>
                            <div class="ac-list-info-div" v-if="item.taskprogress != '-1' && item.taskType != ' ' && item.taskType == 'video' && item.courseId && item.courseId != ' ' && item.chapterId && item.chapterId != ' ' && item.taskId && item.taskId != ' '?webApi.formatType(item.taskType,item.taskprogress):''">
                              <a class="ac-list-info-span ac-list-info-video" href="javascript:;"  @click="checkVideoSource(item)">
                                <i class="icon-wrap icon-source-video"></i>
                                <span class="ac-desc-video-time">{{ item.taskprogress != '-1' && item.taskType != ' ' && item.taskType == 'video' && item.courseId && item.courseId != ' ' && item.chapterId && item.chapterId != ' ' && item.taskId && item.taskId != ' '?webApi.formatType(item.taskType,item.taskprogress):''}} </span>
                              </a>
                            </div>
                            <div class="ac-list-info-div" v-if="item.taskType == 'exam'"><div class="exam-wrap" @click="checkExamSource(item)"><i class="icon-wrap icon-source-exam"></i><span class="text-wrap">题目</span></div> </div>
                          </div>-->
                        </div>
                        <div class="ac-list-title">
                          <div class="flex-l">
                            <div class="iconWrap">
                              <div class="chulizhong" v-if="item.isProcessing == '1'">

                              </div>
                              <template v-else>
                                <div class="hasResolve usual-style" v-if="item.solve=='1'">
                                  <i>✓</i>已解决
                                </div>
                                <div class="noAnswer usual-style" v-else-if="item.solve=='0'">
                                  <i>?</i>未回复
                                </div>
                                <div class="noResolve usual-style" v-else-if="item.solve=='2'">
                                  <i>!</i>已回复
                                </div>
                                <div class="question-closely usual-style" v-else-if="item.solve=='3'">
                                  <i>⇧</i>学员追问
                                </div>
                              </template>
                            </div>
                            <span class="ac-list-title-span">{{ item.title }}</span>
                          </div>
                          <div class="flex-r">
                            <div class="post-time-wrap">{{webApi.formatDate(item.updateTime,'ALL')}}<div class="yujing-icon-wrap" v-if="(currentTime-item.updateTime)>43200&&(item.solve=='0'||item.solve=='3')"><i class="yujing-icon"></i></div></div>
                          </div>
                        </div>
                        <p class="ac-list-desc">{{ item.contentSummary }}</p>
                        <div class="source-wrap-small">
                          <div class="source-wrap-mini">
                            源自：
                            <span :title="item.courseName+' + '+item.chapterName" v-if="item.taskType=='chapter'">{{item.courseName}} + {{item.chapterName}}</span>
                            <span :title="item.courseName+' + '+item.chapterName" v-if="item.taskType=='video'">{{item.courseName}} + {{item.chapterName}}</span>
                            <span :title="item.courseName" v-if="item.taskType=='course'||item.taskType==''">{{item.courseName}}</span>
                            <template v-if="item.taskType=='exam'">
                              <span :title="item.sourcePath" v-if="item.sourcePath">{{item.sourcePath}}</span>
                              <span :title="item.courseName+' + '+item.chapterName +''+ (item.taskCurrent?(' + 第'+item.taskCurrent+'题'):'')" v-else>{{item.courseName}} + {{item.chapterName}}{{item.taskCurrent?' + 第'+item.taskCurrent+'题':''}}</span>
                            </template>
                          </div>
                          <div class="ac-list-info-div" v-if="item.taskprogress != '-1' && item.taskType != ' ' && item.taskType == 'video' && item.courseId && item.courseId != ' ' && item.chapterId && item.chapterId != ' ' && item.taskId && item.taskId != ' '?webApi.formatType(item.taskType,item.taskprogress):''">
                            <a class="ac-list-info-span ac-list-info-video" href="javascript:;"  @click="checkVideoSource(item)">
                              <i class="icon-wrap icon-source-video"></i>
                              <span class="ac-desc-video-time">{{ item.taskprogress != '-1' && item.taskType != ' ' && item.taskType == 'video' && item.courseId && item.courseId != ' ' && item.chapterId && item.chapterId != ' ' && item.taskId && item.taskId != ' '?webApi.formatType(item.taskType,item.taskprogress):''}} </span>
                            </a>
                          </div>
                          <div class="ac-list-info-div" v-if="item.taskType == 'exam'"><div class="exam-wrap" @click="checkExamSource(item)"><i class="icon-wrap icon-source-exam"></i><span class="text-wrap">题目</span></div> </div>
                        </div>
                      </a>
                      <div class="ac-list-info">
                        <p class="ac-list-info-user"><img class="avatar" :src="host.img+item.headImg"><span class="ac-list-info-span user-name">{{ item.nikeName }}</span></p>
                        <ul class="ac-list-info-ul">
                          <li class="ac-list-info-li"><span class="ac-list-info-span"><i class="iconfont icon-duihua"></i><span class="ac-list-info-discuss-num">{{ item.replyCount ? item.replyCount : 0 }}条评论</span></span></li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <div class="text-count">
                    ∗当页查询到{{exchangeListData.data.length}}个问题，共查询到{{exchangeListData.totalCount}}个问题
                  </div>
                  <div class="pagination-wrap"><el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="sizeChange"
                    :current-page = "pageNo"
                    :pageSize="pageSize"
                    :total="exchangeListData.totalCount?exchangeListData.totalCount:0">
                  </el-pagination></div>
                </div>

              </ul>
            </iScroll>
          </div>
          <iLoading v-else/>
        </div>
        </el-aside>
        <el-main style="background: none" class="exchangeDetail-wrap-el-main" v-if="!this.webApi.isEmpty(exchangeListData.data)">
          <div class="ac-right">
          <exchangeDetail @toAnswer="toAnswer" @hasAnswered="hasAnswered" :exchangeData="firstOpen && exchangeListData.data?exchangeListData.data[0]:exchangeDetailData"></exchangeDetail>
        </div>
        </el-main>
      </el-container>
    </el-container>
    <!--<videoSource v-if="showVideoSource" :videoParams = "videoParams" @on-closeVideo="closeVideo"></videoSource>-->
    <div class="video-player-wrap"  v-if="showVideoSource">
      <div class="v-p-w-content">
        <div class="video-title">问题来源
          <i class="close-btn" @click="closeVideo"></i>
        </div>
        <div class="video-wrap">
          <videoPlayer :videoParams="videoParams"></videoPlayer>
        </div>
      </div>
    </div>
    <examSource @closeExam="closeExamPop" v-if="showExamSource" :examParams="examParams"></examSource>
    <chapterSource @closeChapter="closeChapterPop" v-if="showChapterSource" :chapterParams="chapterParams"></chapterSource>
    <selectChapter @cancelSelectChapter="cancelSChapter" @okSelectChapter="okSChapter" :courseId="curCourseId" :myChapterId="myChapterId" :selectChapterId="selectChapterId" v-if="showSelectChapter"></selectChapter>
  </div>
</template>

<script>
  import Request from '@/request'
  import iLoading from '@/components/i-loading'
  import videoSource from '@/components/videoSource'
  import videoPlayer from '@/components/videoPlayer'
  import examSource from '@/components/examSource'
  import exchangeDetail from '@/views/exchange/exchangeDetail'
  import iScroll from '@/components/i-scroll'
  import iPagination from '@/components/i-pagination'
  import multipleSearchInput from '@/components/multipleSearchInput'
  import {mapState,mapActions} from 'vuex'
  export default {
    name: "anwserQuestion",
    components:{
      iLoading,
      iScroll,
      iPagination,
      exchangeDetail,
      videoSource,
      examSource,
      videoPlayer,
      multipleSearchInput
    },
    filters:{

    },
    data() {
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 0) {
              callback(new Error('必须为正整数'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      return {
        scrollRefresh : false,
        pageNo: 1,
        pageSize: 20,
        activeIndex: 0,
        exchangeData:{},
        exchangeDetailData:{},
        firstOpen: true,
        selectType:'1',
        inputText:'',
        listFilterForm:{
          courseListId:'',
          classListId:'',
          selectedOptions:[],
          classType:[],
          vortType:'',
          statusType:'',
          askTime:null,
          classId:'',
          time:'12',
        },
        pickerOptions0: {   //设置提问时间不能大于当天
          disabledDate(time) {
            return time.getTime() > Date.now();//如果没有后面的-8.64e7就是不可以选择今天的
          }
        },
        cascaderProps:{
          children:"child",
          label:"title",
          value:"id"
        },
        categoryId:'',   //证书id
        subjectId:'',   //科目id
        knowledge_node_path1:'',
        knowledge_node_path2:'',
        typeList:['预警问题','全部问题'],
        exchangeListData:'',
        vortType: [{name:'全部',value:''},{name:'视频',value:'video'},{name:'题目',value:'exam'},{name:'章节',value:'chapter'},{name:'课程',value:'course'}],
        statusType:[{name:'全部',value:''},{name:'未回复',value:'0'},{name:'学员追问',value:'3'}],
        allStatusType:[{name:'全部',value:''},{name:'未回复',value:'0'},{name:'已回复',value:'2'},{name:'已解决',value:'1'},{name:'学员追问',value:'3'}],
        warnStatusType:[{name:'全部',value:''},{name:'未回复',value:'0'},{name:'学员追问',value:'3'}],
        selectTypeChange:0,
        type:3,
        orderBy:5,
        solve:'',
        keyWords: '',
        taskType: '',
        showPop: false,
        qid:'',
        exerciseId:'',
        curRenderClassIndex:'',
        courseId:'',
        showSelectChapter:false,
        curCourseId:'',  //筛选列表选中的课程
        selectChapterId:[],
        showExamSource:false,
        showVideoSource:false,
        examParams:'',
        myChapterId:[], //教师绑定的章节
        time:'12', //传24的时候为预警状态
        classSelectList:[],
        currentTime:'',
        end_time:'',
        start_time:'',
        showChapterSource:false,
        chapterParams:'',
        options1:[{id:'1',title:'全部科目'}],
        options:{},
        classList:[],
        selectObj:'',
        rules: {
          time: [
            { validator: checkAge, trigger: 'blur' }
          ]
        }

      }
    },
    created() {
      this.getExchangeListAjax();
    },
    mounted(){
      this.currentTime = Date.parse(new Date())/1000;
      this.getTeacherKnowledge()
      this.getCourseType()
      this.getCourseList()
    },
    computed : {
      ...mapState({
        host: state => state.global.host,
        envType:state => state.global.envType,
        //techLoginInfo : state => state.global.techLoginInfo,
        teacherClass: state => state.global.teacherClass
      }),
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))}
    },
    watch:{
      exchangeData(data){
        this.exchangeData = data;
      },
      "listFilterForm.selectedOptions":function (data) {
        if(data[0]==''){
          this.knowledge_node_path1 = data[0]
          this.knowledge_node_path2 = ''
        }else{
          this.knowledge_node_path1 = data[0]
          this.knowledge_node_path2 = data[1]
        }
        this.pageNo = 1;
        this.getExchangeListAjax()
      },
      selectChapterId(){
        this.pageNo = 1;
        this.getExchangeListAjax()
      },
    },
    methods : {
      sizeChange(val){
        this.pageNo = val
        this.getExchangeListAjax()
      },
      getExchangeListAjax() {
        this.exchangeListData = ''
        this.firstOpen = true
        this.exchangeDetailData = {}
        let time = this.listFilterForm.time
        if(this.listFilterForm.time === '' && this.selectTypeChange == 0){
          time = 12
        }
        console.log(this.listFilterForm.classType)
        let params = {
          "self": 0,
          "type": this.type,
          "ordertype": this.orderBy,
          "pageNo": this.pageNo,
          "pageSize": this.pageSize,
          "subjectId": '',
          'knowledge_node_path1':this.knowledge_node_path1,
          'knowledge_node_path2':this.knowledge_node_path2,
          'token' : this.techLoginInfo.token,
          'classId' : this.listFilterForm.classId,
          'teaching_type' : this.listFilterForm.classType.join(','),
          'courseId' : this.listFilterForm.courseListId,
          'solve': this.listFilterForm.statusType,
          'start_time':this.start_time,
          'end_time':this.end_time,
          'taskType': this.listFilterForm.vortType,
          'time':time,
          'chapterId':this.selectChapterId.join(','),
          'memberId':this.techLoginInfo.id,
          'request_type':'teaching'
        }
        if(this.selectObj){
          if(this.selectObj.type == 1){
            params.keyWords = this.selectObj.keyWords
          }else if(this.selectObj.type == 2 || this.selectObj.type == 3){
            params.studentId = this.selectObj.selectUser.memberId
          }else{
            params.teacherId = this.selectObj.selectUser.memberId
            params.is_teacher_answer = 1
          }
        }
        Request.ajax('bbslist',params).then((res)=>{
          if(res && res.state == 'success'){
            this.exchangeListData = res
            this.activeIndex = 0
            this.exchangeDetailData = res.data[0]?res.data[0]:{};
          }
          this.$nextTick(()=>{
            this.scrollRefresh = !this.scrollRefresh;
            /*setTimeout(()=>{
              this.scrollRefresh = !this.scrollRefresh;
            },200)*/
          })

        })
      },
      handleSelect(params){
        console.log(params)
      },
      querySearchAsync(queryString, cb){
        console.log(queryString)
        console.log(cb)
        Request.ajax('queryMemberByNameAndNickname',{
          token:this.techLoginInfo.token,
          name:queryString,
          type:1,
          limit:50
        }).then(res => {
          console.log(res.data)
          cb(res.data)
        })
      },
      changeTime(){
        this.getExchangeListAjax()
      },
      toGather(){
        window.open('/#/aqReportGather')
      },
      toAnswer(params){  //详情中点击了我来回答触发的事件
        this.exchangeListData.data.forEach((item,index)=>{
          if(item.id==params.id){
            item.isProcessing = 1
          }
        })
      },
      hasAnswered(params){  //详情中点击了我来回答触发的事件
        this.exchangeListData.data.forEach((item,index)=>{
          if(item.id==params.id){
            item.isProcessing = 0
            item.solve = 2
          }
        })
      },
      changeAskTime(){   //改变提问时间
        if(this.listFilterForm.askTime == null){
          console.log('kongla')
          this.start_time = ''
          this.end_time = ''
        }else{
          this.start_time = this.listFilterForm.askTime[0]
          this.end_time = this.listFilterForm.askTime[1]
        }
        this.pageNo = 1
        this.getExchangeListAjax()
      },
      changeRequirement(){
        this.pageNo = 1
        this.getExchangeListAjax()
      },
      handleChange(val){
      },
      getTeacherKnowledge(){
        Request.ajax('getTeacherKnowledge',{
          token:this.techLoginInfo.token
        }).then((res)=>{
          if(res&&res.state=='success'){
            let arr = this.copyData(res.data)
            this.options1 = this.filterCascaderData(arr)
          }
        })
      },
      getCourseList(){
        Request.ajax('queryCourseArray',{
          token:this.techLoginInfo.token,    //
          teacherId:this.techLoginInfo.eduUserId,
          courseplanName:'',
          finishStatus:0,
          pageSize:1000,
          currentPage:1
        }).then((res)=>{
          if(res && res.state == 'success'){
            if(res.data!=null){
              this.classList = res.data.pageResult
            }else{
              this.classList = []
            }
          }else{
            this.webApi.alert('服务器异常，请重试～')
          }

        })
      },
      getCourseType(){    //获取课程类型
        Request.ajax('getCourseTeacheringType',{
          token:this.techLoginInfo.token
        }).then((res)=>{
          if(res&&res.state=='success'){
            this.classSelectList = res.data
          }
        })
      },
      filterCascaderData(params){
        if(params){
          let options = params
          let arr = []
          arr.push({title:'全部项目',id:''})
          for(let key in options){
            arr.push(options[key])
            for(let key in options[key]){
            }
          }
          return arr
        }else{
          return []
        }
      },
      copyData(obj) {
        var newData = Array.isArray(obj) ? [] : {};

        for (var key in obj) {
          if (typeof obj[key] === 'object') {
            if(key =='child'){
              obj[key].unshift({title:'全部科目',id:''})
            }
            newData[key] = this.copyData(obj[key])
          } else {
            newData[key] = obj[key];
          }
        }

        return newData;
      },
      changeQuesitonType(params){  //切换全部问题和预警问题
        if(this.selectTypeChange == params){
          return
        }
        this.selectTypeChange = params
        this.listFilterForm.askTime = null
        this.start_time = ''
        this.end_time = ''
        if(params == 0){
          this.time = '12'
          this.solve = ''
          this.orderBy = 5
          this.statusType = this.warnStatusType
          this.listFilterForm.statusType = ''
          this.listFilterForm.time = '12'
        }else{
          this.time = ''
          this.orderBy = 1
          this.statusType = this.allStatusType
          this.listFilterForm.statusType = '0'
          this.listFilterForm.time = ''
        }
        this.pageNo = 1
        this.getExchangeListAjax()
      },
      closeChapterPop() {
        this.showChapterSource = false
      },
      cancelSChapter(){
        this.showSelectChapter = false
      },
      okSChapter(data){
        //console.log(data)
        this.selectChapterId = data
        this.showSelectChapter = false
      },
      checkExamSource(params){
        if(params.exerciseId==''&&params.exerciseVersionId==''){
          this.$api.alert('试题数据有误，无法展示试题详情~')
          return;
        }
        this.showExamSource = true
        this.examParams = params
        /*let str = 'elearning'
        if(this.envType == '1'){
          str = 'elearningdemo'
        }*/
        //window.open('http://'+str+'.zbgedu.com/#showAnswer?exerciseIds='+params.exerciseId)
      },
      checkChapterSource(params){
        this.showChapterSource = true,
          this.chapterParams = params
      },
      checkVideoSource(params){
        this.showVideoSource = true
        this.videoParams = params
      },
      closeExamPop(){
        this.showExamSource = false
      },
      closeVideo(){
        this.showVideoSource = false
      },
      checkExam(){  //查看题目
        this.qid = 1
        this.showPop = true
      },
      clearFilter(){  //清空筛选条件
        this.listFilterForm = {
          courseListId:'',
          classListId:''
        }
        this.selectChapterId = []
        this.curVortType = 0
        this.taskType = ''
        this.solve = ''
        this.type = 3
      },
      openDetail(data,index){
        this.firstOpen = false;
        this.activeIndex = index
        this.exchangeDetailData = data;
      },
      search(params) {
        /*if (this.keyWords == '') {
          this.webApi.alert('请输入搜索关键字');
          return false;
        }*/
        this.selectObj = params
        //this.keyWords = searchTxt;
        this.pageNo = 1;
        this.getExchangeListAjax();
        //this.$refs.searches.value = '';
        //this.keyWords = '';
      },
      listenSearch(){
        if(!this.webApi.trim(this.keyWords)){
          this.pageNo = 1
          //this.keyWords = ''
          this.getExchangeListAjax();
        }
      },
      jumpPage(index){
        this.pageNo = index;
        this.getExchangeListAjax();
      },
      prevPage(){
        this.pageNo = this.pageNo-1;
        this.getExchangeListAjax();
      },
      pageNext(){
        this.pageNo = this.pageNo+1;
        this.getExchangeListAjax();
      }
    }
  }
</script>

<style lang="stylus">
  .answerQuestion
    height: 100%
    width 100%
    padding 0 20px 20px 20px
    background #f9fafb
    position: relative
    .el-select
      .el-select__tags
        top 76%
    .answerQuestion-el-container
      height 100%
      .answerQuestion-s-el-container
        height 100%
        overflow hidden
        .answerQuestion-s-el-aside
          flex 1
        .exchangeDetail-wrap-el-main
          flex none
          width 60%
      .el-header
        padding 0
        border-bottom none
        .typeChange-wrap
          height 58px
          .typeChange-ul
            .typeChange-li
              float: left
              line-height 58px
              margin-right 50px
              font-size 16px
              cursor pointer
              &.active
                color #ff366d
              .yujing-icon
                display inline-block
                width 24px
                height 24px
                position relative
                background url("../../assets/img/icon_image.png") no-repeat -247px -150px
                top 5px
                margin-right 5px
          .all-report-wrap
            float right
            width 154px
            height 32px
            font-size 14px
            color #fff
            border-radius 4px
            display: inline-block;
            line-height 32px
            background #ff366d
            margin-top 14px
            cursor pointer
            .huizong-icon
              display inline-block
              width 24px
              height 24px
              float left
              margin 4px 8px 0 18px
              background url("../../assets/img/icon_image.png") no-repeat -582px 0px
      .el-container
        .el-aside
          border-radius 4px
          background #fff
        .el-main
          margin-left 10px
          background #fff
          border-left none
          border-radius 4px
          padding 0 0 20px 0
        .exchangeDetail-wrap-el-main
          padding 0
    .manage-box-select
      width: 100%
      background #fff
      border-radius 10px
      .ac-left-top
        display flex
        width: 100%
        padding 10px 0
        margin-bottom 10px
        .ac-top-left
          flex 1
          height: 100%;
          .el-form
            font-size 14px
            color #666
            margin 0px 0 0 15px
            .el-form-item
              margin-bottom 0px
              .el-input2
                .el-input__inner
                  height 28px
                  line-height 28px
                  width 100px
              .el-form-item__content
                height 28px
              .el-date-editor
                height 28px
                line-height 28px
            .ml20
              margin-left 20px
            .el-cascader
              .el-input__suffix
                .el-input__suffix-inner
                  position: absolute;
                  top: 0px;
                  right: 0px;
                .el-input__icon
                  display: inline-block;
                  width: 0;
                  height: 0;
                  vertical-align: middle;
                  border-bottom: 5px solid;
                  border-right: 5px solid transparent;
                  border-left: 5px solid transparent;
                  line-height: 28px;
                  color: #3f4e64;
                .el-icon-arrow-up:before
                  content: "";
                .el-icon-arrow-down:before
                  content: "";
            .el-select
              width 160px
              height 28px
              .el-input1
                .el-input__inner
                  color #333333
                  width 190px
                  font-size 12px
                  height 26px
                  line-height 26px
                  border-radius 0
              .el-input__suffix
                .el-input__suffix-inner
                  position: absolute;
                  top: 0px;
                  right: 0px;
                .el-input__icon
                  display: inline-block;
                  width: 0;
                  height: 0;
                  vertical-align: middle;
                  border-bottom: 5px solid;
                  border-right: 5px solid transparent;
                  border-left: 5px solid transparent;
                  line-height: 28px;
                  color: #3f4e64;
                .el-icon-arrow-up:before
                  content: "";
                .el-icon-arrow-down:before
                  content: "";
            .el-cascader
              .el-input__suffix
                .el-input__icon
                  border-top 5px solid
                  border-bottom none
                .el-input__suffix-inner
                  top 0
        .ac-top-middle
          position: relative
          top: 6px
          bottom: 0
          width: 300px
          margin-right: 20px;
          height: 28px
          .ac-search
            outline: 0
            width: 100%
            height: 100%
            padding: 0 10px
            border: 1px solid #eee
            border-radius: 15px
            font-size 12px
            background-color: #fff
            -webkit-box-sizing: border-box
            box-sizing: border-box
          .ac-search-a
            position: absolute
            top: 3px
            bottom: 0
            left: initial
            right: 11px
            display: inline-block
            width: 21px
            height: 20px
    .video-player-wrap
      position fixed
      background rgba(0,0,0,.3)
      width 100%
      height 100%
      top 0
      left 0
      z-index 99
      .v-p-w-content
        position absolute
        top 50%
        left 50%
        width 900px
        height 600px
        transform translate(-50%,-50%)
        .video-title
          height 50px
          text-align center
          line-height 50px
          font-size 14px
          color #333
          background-color: #f1f1f1
          .close-btn
            display inline-block
            width 26px
            height 26px
            background #333 url("../../assets/img/icon_image.png") no-repeat -127px 0px
            border-radius 50%
            float right
            right 20px
            position relative
            top 13px
            cursor pointer
        .video-wrap
          height 550px
  .ac-left {
    z-index: 1;
    position: relative;
    height: 100%;
  }
  .ac-right {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  .ac-left .ac-left-content {
    position: relative;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .ac-left-content .ac-list-ul {
    overflow: hidden;
    background #fff
  }
  .ac-left-content
    .no-data-wrap
      width 100%
      height 100%
      position relative
    .no-data
      position absolute
      top 50%
      left 50%
      transform: translate(-50%,-50%);
      .img-wrap
        text-align center
        .img-no
          width 196px
          height 190px
      .no-text
        margin-top 15px
        text-align center
        font-size 14px
        color #333

  .ac-left-content .ac-list-ul .ac-list-li {
    overflow: hidden;
    border-top: 1px solid #E9E9E9;
    margin-top: -2px;
    padding 12px 10px 12px
  }
  .ac-left-content .ac-list-ul .ac-list-li .ac-list-a {
    float: left;
    display: inline-block;
    width: 100%;
    height: 100%;
    padding: 0 10px;
  }
  .ac-left-content .ac-list-ul .ac-list-li.active .ac-list-a {
    background-color: #f7f7f7;
  }
  .ac-left-content .ac-list-ul .ac-list-li .ac-list-a .ac-list-li-content {
    position: relative;
    display inline-block
    width 100%
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding-left: 0;
  }
  .ac-left-content .ac-list-ul .ac-list-li .ac-list-a .ac-list-title {
    width: 100%;
    height: 100%;
    line-height: 20px;
    color: #3E4E63;
    font-size: 16px;
    overflow: hidden;
  }
  .ac-left-content .ac-list-ul .ac-list-li .ac-list-a .ac-list-li-content .ac-list-desc {
    line-height: 25px;
    overflow: hidden;
    text-overflow: initial;
    white-space: initial;
    width: 100%;
    font-size: 14px;
    margin-top 10px
    color: #333;
  }

  .ac-left-content .ac-list-ul .ac-list-li .ac-list-a .ac-list-info {
    overflow: hidden;
    margin-bottom: 6px;
  }
  .ac-left-content .ac-list-ul .ac-list-li .ac-list-a .ac-list-info .ac-list-info-user {
    float: left;
    display: inline-block;
    margin: 3px 0 0;
    line-height: 32px;
  }
  .ac-left-content .ac-list-ul .ac-list-li .ac-list-a .ac-list-info .ac-list-info-user .avatar {
    float: left;
    width: 32px;
    height: 32px;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    margin: 0 10px 0 0;
  }
  .ac-left-content .ac-list-ul .ac-list-li .ac-list-a .ac-list-info .ac-list-info-user .user-name {
    font-size: 12px;
    color: #B5A2A7;
  }
  .ac-left-content .ac-list-ul .ac-list-li .ac-list-a .ac-list-info .ac-list-info-ul {
    overflow: hidden;
    padding: 9px 0;
  }
  .ac-left-content .ac-list-ul .ac-list-li .ac-list-a .ac-list-info .ac-list-info-ul .ac-list-info-li {
    float: left;
    padding: 0 3px;
    margin-left 20px
  }
  .ac-left-content .ac-list-ul .ac-list-li .ac-list-a .ac-list-info .ac-list-info-ul .ac-list-info-li .ac-list-info-time {
    font-size: 12px;
  }
  .ac-left-content .ac-list-ul .ac-list-li .ac-list-a .ac-list-info .ac-list-info-ul .ac-list-info-li .ac-list-info-span {
    font-size: 12px;
    color: #B5A2A7;
    cursor: default;
    .iconfont{
      padding-right: 5px;
    }
  }
  .ac-left-content .ac-list-ul .ac-list-li .ac-list-a .ac-list-info .ac-list-info-ul .ac-list-info-li .ac-list-remove {
    cursor: pointer;
  }
  .ac-left-content .ac-list-ul .ac-list-li .ac-list-a .ac-list-info .ac-list-info-ul .ac-list-info-li .ac-list-info-video {
    float: left;
    font-size: 12px;
    cursor: pointer;
  }
  .ac-left-content
    .ac-list-ul
      .ac-list-li
        .ac-list-a
          .ac-list-li-content
            .ac-list-title-span
              font-size 16px
              color #333
              font-weight bold
            .source-wrap
              height 15px
              color #999
              font-size 13px
              line-height 34px
              .icon-wrap
                display inline-block
                width 14px
                height 14px
                margin-right 3px
                position relative
                top 2px
              .icon-source-video
                background url("../../assets/img/icon_image.png") no-repeat -40px -76px
              .icon-source-exam
                background url("../../assets/img/icon_image.png") no-repeat -39px -37px
              .ac-list-info-div
                display inline-block
                height 20px
                padding 0 5px
                font-size 12px
                line-height 20px
                background #ff366d
                border-radius 10px
                color #fff
                position: relative;
                top: -12px;
                .ac-list-info-span
                  color #fff
              .yujing-icon-wrap
                float right
                height 25px
                width 30px
                margin-top 3px
                .yujing-icon
                  display inline-block
                  width 25px
                  height 25px
                  background url("../../assets/img/icon_image.png") no-repeat -247px -150px
            .source-wrap-small
              flex 1
              overflow: hidden;
              margin-top 5px
              height: 28px;
              color: #999;
              font-size: 13px;
              line-height 32px
              .source-wrap-mini
                display inline-block
                max-width 80%
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              .icon-wrap
                display inline-block
                width 14px
                height 14px
                margin-right 3px
                position relative
                top 2px
              .icon-source-video
                background url("../../assets/img/icon_image.png") no-repeat -40px -76px
              .icon-source-exam
                background url("../../assets/img/icon_image.png") no-repeat -39px -37px
              .ac-list-info-div
                display inline-block
                height 20px
                padding 0 5px
                font-size 12px
                line-height 20px
                background #ff366d
                border-radius 10px
                color #fff
                position: relative;
                top: -12px;
                .ac-list-info-span
                  color #fff
              .ac-list-info-div
                width auto
            .ac-list-title
              display flex
              .flex-l
                flex 1
                height 20px
                overflow hidden
              .flex-r
                width 150px
                text-align right
                .post-time-wrap
                  font-size 12px
                  color #999
                  .yujing-icon-wrap
                    float right
                    height 25px
                    width 30px
                    margin-top -3px
                    .yujing-icon
                      display inline-block
                      width 25px
                      height 25px
                      background url("../../assets/img/icon_image.png") no-repeat -247px -150px
            .iconWrap
              float left
              .chulizhong
                width 77px
                height 22px
                background url("../../assets/img/icon_image.png") no-repeat -0px -282px
              .yujing-wrap
                float right
                .icon-yujing
                  display inline-block
                  width 25px
                  height 25px
                  background url("../../assets/img/icon_image.png") no-repeat -247px -113px
              .usual-style
                width 78px
                height 20px
                float: left
                border-radius 10px
                text-align center
                font-size 13px
                padding-left 18px
                position relative
                line-height 18px
                margin-right 5px
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
      .text-count
        font-size 12px
        color #f06e50
        padding-left 10px
        border-top: 1px solid #e9e9e9;
        line-height 30px
      .ac-list-li.active
        .ac-list-a
          .ac-list-li-content
            .ac-list-title-span
              color #ff366d
            .iconWrap
              .yujing-wrap
                .icon-yujing
                  background url("../../assets/img/icon_image.png") no-repeat -247px -68px
  .ac-left-content
    .ac-list-ul
      .ac-list-li
        .ac-list-info
          font-size 12px
          color #b5a2a7
          .ac-list-info-ul
            .ac-list-info-li
              .exam-wrap
                width 75px
                height 20px
                border 1px solid #acacac
                color #fff
                cursor pointer
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
                  float left
              .ac-list-info-video
                width 75px
                height 20px
                border 1px solid #acacac
                color #fff
                .ac-desc-video-time
                  display inline-block
                  float: left
                  font-size 12px
                  width 55px
                  height 18px
                  line-height 18px
                  text-align center
                  background #acacac
                  color #fff
      .ac-list-li.active
        .ac-list-a
          .ac-list-info
            .ac-list-info-ul
              .ac-list-info-li
                .exam-wrap
                  border 1px solid #fff
                  color #ff366d
                  .icon-wrap
                    background url("../../assets/img/icon_image.png") no-repeat 3px -87px
                  .text-wrap
                    background #fff
                .ac-list-info-video
                  border 1px solid #fff
                  color #ff366d
                  .ac-desc-video-time
                    background #fff
                    color #ff366d
</style>
