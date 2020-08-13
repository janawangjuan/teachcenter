<template>
  <div class="classCenterIndex-wrap">
    <div class="classCenterIndex-wrap-z">
      <classCenterHeader :classId="$route.params.classId"></classCenterHeader>
      <div class="content">
        <div class="content-left">
          <div class="left-wrap">
            <template v-if="courseArrangeList">
              <template v-if="courseArrangeList&&courseArrangeList.length>0">
                <iScroll :id="'leftWrap'" :is-refresh="scrollRefresh" :toTop="false">
                  <ul class="ul-wrap">
                    <li class="li-wrap" v-for="(item,index) in courseArrangeList1">
                      <div class="title-wrap">
                        <div class="title-wrap-left">
                          <span class="span-usual ml0">上课日期：{{item.courseDate}}</span>
                          <span class="span-usual">上课时段：{{item.coursePeriod}}</span>
                          <span class="span-usual">讲师：{{item.realName}}</span>
                          <span class="span-usual">教学点：{{item.universityName}}</span>
                        </div>
                        <div class="title-wrap-right">
                          <span class="span-usual">试卷任务：共{{item.classExamenRespList?item.classExamenRespList.length:0}}个试卷任务</span>
                          <span class="showMore-wrap" @click="showMore(item,index)" v-html="item.isShow?'收起更多':'展开更多'"></span>
                        </div>
                      </div>
                        <div class="more-wrap" v-show="item.isShow">
                          <div class="addExam-wrap">
                            <div class="exam-wrap">
                              <ul class="ul-wrap1" v-if="item.classExamenRespList&&item.classExamenRespList.length>0">
                                <li class="li-wrap1" :class="[index1%2==0?'leaf':'',index1==0?'first-li':'']" v-for="(option,index1) in item.classExamenRespList">
                                  <div class="title-exam">{{option.examenName}}</div>
                                  <div class="operating-wrap">
                                    <a href="javascript:;" @click="toPreview(option)" class="operating-a mr25"><i class="yulan-icon icon-wrap"></i>预览</a>
                                    <a href="javascript:;" @click="toTestpaper(option)" class="operating-a mr25"><i class="fenxi-icon icon-wrap"></i>卷面分析</a>
                                    <a href="javascript:;" @click="toExam(option)" class="operating-a mr25"><i class="tongji-icon icon-wrap"></i>完成情况</a>
                                    <a href="javascript:;" class="operating-a" @click="deleteExam(item,index,option)"><i class="shanchu-icon icon-wrap"></i>删除</a>
                                  </div>
                                </li>
                              </ul>
                            </div>
                            <div class="button-wrap">
                              <a href="javascript:;" class="button-a" @click="addExam(item,index)">添加试卷</a>
                            </div>
                          </div>
                        </div>
                    </li>
                  </ul>
                </iScroll>
              </template>
              <template v-else>
                <div class="has-no-data-wrap">
                  <div class="has-no-data">
                    <div class="img-wrap">
                      <img class="img-no" src="../../assets/img/class-nodata.png" alt="暂无内容">
                    </div>
                    <p class="no-text">暂无内容，点击其他日期试试吧～</p>
                  </div>
                </div>
              </template>
            </template>
            <template v-else>
              <iLoading></iLoading>
            </template>
          </div>
        </div>
        <div class="content-right">
          <div class="right-wrap">
            <Calendar @choseDay="clickDay" @changeMonth="changeDate" :sundayStart="true" :markDate="markDate" :textTop="textTop"></Calendar>
            <div class="all-wrap">
              <el-button type="primary" @click="checkAllList">查看全部课表</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="addExam-popup" v-if="showAddExamPopup">
      <div class="popup-box">
        <div class="popup-content-wrap">
          <div class="title-wrap">
            添加测评
          </div>
          <template>
            <div class="el-tree-wrap" v-if="data3">
              <el-tree
                :data="data3"
                check-strictly
                node-key="id"
                :props="defaultProps"
                :default-expand-all="true"
                ref="tree">
                <span class="custom-tree-node" slot-scope="{ node, data }"><span v-if="data.taskType=='exam'||data.taskType=='appraisal'"><el-checkbox :disabled="data.isHas" v-model="node.checked"  style="margin-right: 5px;"><span class="node-label-text">{{node.label}}</span></el-checkbox></span><span class="node-label-text" v-else>{{node.label}}</span></span>
              </el-tree>
            </div>
            <div v-else>
              <iLoading></iLoading>
            </div>
          </template>

          <div class="button-wrap">
            <el-button @click="cancelAddExam" size="small" type="info" plain>取消</el-button>
            <el-button @click="confimAddExam" size="small" type="primary">确定</el-button>
          </div>

        </div>
        <div class="close-btn" @click="closeAddExamPopup">
          <i class="el-icon-close"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import iScroll from '@/components/i-scroll'
  import classCenterHeader from '@/components/classCenterHeader'
  import Calendar from 'vue-calendar-component';
  import Request from '../../request'
  import iLoading from '@/components/i-loading'
  export default {
    name: "classCenterIndex",
    components:{
      iScroll,
      classCenterHeader,
      Calendar,
      iLoading
    },
    mounted(){
      //this.data4 = this.data3
      this.getClassDetail()
      //this.curDate = this.webApi.formatDate(new Date()/1000,'YMD')
      //this.getTreeData()
      this.getTimetableList()
    },
    computed:{
      ...mapState({
        //techLoginInfo:state=>state.global.techLoginInfo,
        host:state => state.global.host,
        envType:state => state.global.envType,
      }),
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))},
      courseArrangeList1(){
        let arr = this.courseArrangeList
        console.log(arr)
        arr.forEach((item,index,value) => {
          if(arr[index].isShow == undefined){
            arr[index].isShow = false
            arr[index].isFirstShow = false
            //arr[index].classExamenRespList = []
          }
        })
        return arr
      }
    },
    data(){
      return{
        textTop:["日","一", "二", "三", "四", "五", "六"],   //手动改变日历插件头部文字
        scrollRefresh:false,
        courseArrangeList:[],
        curDate:'',
        courseId:'',
        examList:[],
        markDate:[], //有课的日期需要标记
        showAddExamPopup:false,
        data3: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        ids:[],
        data4:[],
        classDetailInfo:"",
        selectExamInfo:{
          params:{},
          index:''
        }
      }
    },
    methods:{
      getClassDetail(){
        Request.ajax('queryCourseDetail',{
          token:this.techLoginInfo.token,   //
          courseArrangeId:this.$route.params.classId
        }).then((res)=>{
          if(res && res.state=='success'){
            this.classDetailInfo = res.data
          }else{
            this.classDetailInfo = {}
            this.webApi.alert(res.msg||'服务器异常，请稍后重试～')
          }
        })
      },
      toTestpaper(params){
        window.open('#/testpaperAnalysis/'+params.classId+'/'+params.courseResourseId+'/'+encodeURIComponent(this.classDetailInfo.courseplanName))
      },
      toExam(params){
        let str = encodeURIComponent(this.classDetailInfo.courseplanName)
        console.log(str)
        window.open('#/faceCompletion/'+params.classId+'/'+params.courseResourseId+'/'+str)
      },
      toPreview(params){
        let times = new Date().getTime() + 30 * 60 * 1000;
        let date = new Date(times);
        let local = window.location;
        let hostname = local.hostname;
        if (/\.zbgedu\.com/.test(hostname)) {
          hostname = 'zbgedu.com'
        }
        //document.cookie = "zbgeduId=" + this.techLoginInfo.token + ";path=/;domain="+hostname+";expires="+ date.toGMTString() + ";source=source;";
        this.cookie.remove('zbgeduId')
        let str = 'mstiku'
        if(this.envType == '1'){
          str = 'mstikudemo'
        }
        //this.frameUrl = 'https://'+str+'.zbgedu.com/preview?question=getAnswerAnalysis&type=acca&value='+this.examenInfo.taskId+ '&id=' + this.techLoginInfo.token+'agent=0';

        Request.ajax('getTaskInfoAndProgress',{
          token:this.techLoginInfo.token,
          taskId:params.courseResourseId
        }).then(res=>{
          if(res.state == 'success'){
            this.frameUrl = 'https://'+str+'.zbgedu.com/preview?question=paperInfoPreview&type='+(res.data.itemId==1?'acca':'cma')+'&value='+res.data.examenId+ '&id=' + this.techLoginInfo.token+'&agent=0';
            window.open(this.frameUrl)
          }else{
            this.$api.alert('服务器异常，请重试~')
          }
        })
          /*this.showExamSource = true
          this.examParams = params*/
        /*let times = new Date().getTime() + 30 * 60 * 1000;
        let date = new Date(times);
        let local = window.location;
        let hostname = local.hostname;
        if (/\.zbgedu\.com/.test(hostname)) {
          hostname = 'zbgedu.com'
        }
        //document.cookie = "zbgeduId=" + this.techLoginInfo.token + ";path=/;domain="+hostname+";expires="+ date.toGMTString() + ";source=source;";
        this.cookie.remove('zbgeduId')
        let str = 'mstiku'
        if(this.envType == '1'){
          str = 'mstikudemo'
        }
        //this.frameUrl = 'https://'+str+'.zbgedu.com/preview?question=getAnswerAnalysis&type=acca&value='+this.examenInfo.taskId+ '&id=' + this.techLoginInfo.token+'agent=0';

        Request.ajax('getTaskInfoAndProgress',{
          token:this.techLoginInfo.token,
          taskId:params.examenId
        }).then(res=>{
          if(res.state == 'success'){
            this.frameUrl = 'https://'+str+'.zbgedu.com/preview?question=paperInfoPreview&type='+(res.data.itemId==1?'acca':'cma')+'&value='+res.data.examenId+ '&id=' + this.techLoginInfo.token+'&agent=0';
            window.open(this.frameUrl)
          }else{
            this.$api.alert('服务器异常，请重试~')
          }
        })*/
        /*let str = ''
        if(this.envType=='1'){
          str = '?env=demo'
        }
        window.open('http://tm.zbgedu.com/getexamen/index.html#/question/all/'+params.examenId+str)*/
      },
      confimAddExam(){
        let arr = this.$refs.tree.getCheckedNodes()
        if(arr.length == 0){
          this.webApi.alert('请至少选择一个作业！')
        }else{
          this.saveClassExamen(arr)
        }
      },
      cancelAddExam(){
        this.showAddExamPopup = false
      },
      showMore(params,index){   //展开所有列表
        /*if(!params.isShow){
          this.courseArrangeList1.forEach((item,index)=>{
            item.isShow = false
          })
        }*/
        params.isShow = !params.isShow
        this.selectExamInfo.params = params
        this.selectExamInfo.index = index
        if(!params.isFirstShow){
          params.isFirstShow = true
          this.getExamList(params).then(res=>{
            params.classExamenRespList = res.data
            this.$set(this.courseArrangeList1,index,params)
          })
        }
        this.$nextTick(()=>{
          this.scrollRefresh = !this.scrollRefresh;
        })
      },
      saveClassExamen(params){
        let arr = []
        for(let i = 0;i<params.length;i++){
          let obj1 = params[i]
          let obj={
            classId:this.$route.params.classId,
            courseArrangeDetailId:this.selectExamInfo.params.courseArrangeDetailId,
            chapterId:obj1.lessonCategoryId,
            examenId:obj1.examenId,
            examenName:obj1.name,
            courseId:this.courseId,
            courseResourseId:obj1.id
          }
          arr.push(obj)
        }
        let param = JSON.stringify(arr)
        Request.ajax('saveClassExamen',{
          classExamenDate:param
        }).then(res=>{
          if(res&&res.state=='success'){
            this.getExamList( this.selectExamInfo.params).then(res=>{
              this.selectExamInfo.params.classExamenRespList = res.data
              this.$set(this.courseArrangeList1,this.selectExamInfo.index,this.selectExamInfo.params)
              this.showAddExamPopup = false
              this.$nextTick(()=>{
                this.scrollRefresh = !this.scrollRefresh;
              })
            })
          }else{
            this.webApi.alert(res.msg)
          }

          console.log(res)
        })
      },
      clickDay(data){
        this.curDate = this.Toyyyy_MM_dd(this.webApi.dateAddZero(data))
        console.log(this.curDate)
        this.getTimetableList('fromDate')
      },
      Toyyyy_MM_dd(setDate){
        let valDate=setDate.substring(0, 4) + "-" + setDate.substring(4, 6) + "-" + setDate.substring(6, 8);
        return valDate;
      },
      changeDate(data){
        console.log(data)
      },
      closeAddExamPopup(){
        this.showAddExamPopup = false
      },
      addExam(item,index){
        this.data3 = ''
        this.searchCourseAppraisalTaskBySubjectId()
        this.selectExamInfo.params = item
        this.selectExamInfo.index = index
        this.showAddExamPopup = true
      },
      getTreeData(){
        setTimeout(()=>{
          this.data4 = this.filterTreeData(this.data3,this.ids)

        },1000)
      },
      getTimetableList(param){   //获取课表列表
        this.courseArrangeList = ''
        Request.ajax('queryCourseArrayDetailList',{
          token:this.techLoginInfo.token,
          courseArrangeId:this.$route.params.classId,   //eed0b71334e711e9848a00163e0f507b
          courseDate:this.curDate
        }).then((res)=>{
          if(res && res.state == 'success'){
            if(param == 'fromDate'){   //通过日期切换，课表需要全部展开
              res.data.detailRowDMOList.forEach((item,index,value)=>{
                item.isShow = false
                this.showMore(item,index)
              })
            }
            //console.log(res.data.detailRowDMOList)
            this.courseArrangeList = res.data.detailRowDMOList
            this.courseArrangeList.forEach(item=>{
              this.markDate.push(item.courseDate)
            })
          }else{
            this.courseArrangeList = []
            this.webApi.alert('获取课表失败，请重试～')
          }
        })
      },
      changeObjKey(params){
        let keyMap={
          "chapters":"children",
          "examens":"children",
          "alias":"name"
        }
        for(var i = 0;i < params.length;i++){
          var obj = params[i];
          for(var key in obj){
            var newKey = keyMap[key];
            if(newKey){
              if(!this.webApi.isEmpty(obj[key])){
                obj[newKey] = obj[key];
                delete obj[key];
              }
            }
          }
          if(params[i].children&&params[i].children.length>0){
            this.changeObjKey(params[i].children)
          }
        }
      },
      checkAllList(){
        this.curDate = ''
        this.getTimetableList()
      },
      getExamList(params){ //获取课表下的作业任务列表
        return new Promise((resolve,reject)=>{
          Request.ajax('queryClassExamen',{
            courseArrangeDetailId:params.courseArrangeDetailId
          }).then(res=>{
            console.log(res)
            if(res && res.state == 'success'){
              resolve(res)
            }else{
              this.webApi.alert(res.msg||'服务器异常，请稍后重试～')
            }

          })
        })
      },
      searchCourseAppraisalTaskBySubjectId(){
        Request.ajax('searchCourseTaskBySubjectId',{
          subjectId:this.classDetailInfo.courseCategoryId,
          courseArrangeId:this.$route.params.classId,
          token:this.techLoginInfo.token
        }).then(res=>{
          this.data3 = res.data
          this.courseId = res.data[0].id
          this.changeObjKey(this.data3)
          console.log(this.data3)
        })
      },
      filterTreeData(data,ids){  //处理后台返回的treedata数据，disabled
        if (!Array.isArray(ids)) {
          return data
        }

        var copyData = JSON.stringify(data, function(key, value) {
          if (typeof value === 'object') {
            console.log(value.id)
            if (ids.indexOf(value.id) !== -1) {
              value.disabled = true;
            }
          }
          return value;
        }, 2);
        return JSON.parse(copyData);
      },
      deleteExam(option,index,params){
        this.$confirm('确定要删除测评吗?', '删除测评', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(params)
          this.selectExamInfo.params = option
          this.selectExamInfo.index = index
          Request.ajax('deleteClassExamen',{
            courseArrangeDetailId:params.courseArrangeDetailId,
            examenId:params.examenId,
            classId:params.classId
          }).then(res=>{
            if(res && res.state =='success'){
              this.getExamList(this.selectExamInfo.params).then(res=>{
                this.selectExamInfo.params.classExamenRespList = res.data
                this.$set(this.courseArrangeList1,this.selectExamInfo.index,this.selectExamInfo.params)
              })
              this.$nextTick(()=>{
                this.scrollRefresh = !this.scrollRefresh;
              })
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
</script>

<style lang="stylus">
  .classCenterIndex-wrap
    background #f9fafb
    width 100%
    height 100%
    .classCenterIndex-wrap-z
      padding 20px
      height 100%
      display flex
      flex-direction column
      .title
        width 100%
        height 130px
        background #fff
        border-radius 4px
        overflow hidden
        .img-wrap
          width 250px
          height 130px
          float: left
          .course-img
            width 250px
            height 130px
        .title-right
          float: left
          color #333
          margin-left 30px
          .course-p
            height 50px
            font-size 16px
            line-height 50px
            margin-top 10px
          .subject-name-p
            font-size 14px
          .teacher-p
            height 50px
            font-size 14px
            margin-top 10px
      .content
        flex 1
        width 100%
        display flex
        overflow hidden
        .content-left
          flex 1
          padding 25px 20px 0px 0
          .left-wrap
            width 100%
            height 100%
            background #fff
            border-radius 4px
            overflow hidden
            .has-no-data-wrap
              width 100%
              height 100%
              position relative
            .has-no-data
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
                margin-top 20px
                text-align center
                font-size 14px
                color #333
            .ul-wrap
              padding 20px
              .li-wrap
                overflow hidden
                border 1px solid #eee
                margin-bottom 20px
                .more-wrap
                  max-height 500px
                  padding 0 20px
                  .addExam-wrap
                    border-top 1px solid #f5f5f5
                    .exam-wrap
                      .ul-wrap1
                        .li-wrap1
                          height 45px
                          padding 0 20px
                          .title-exam
                            float: left
                            line-height 45px
                            font-size 14px
                          .operating-wrap
                            float right
                            width 350px
                            height 45px
                            line-height 44px
                            .operating-a
                              font-size 13px
                              color #666
                              .icon-wrap
                                display inline-block
                                width 18px
                                height 18px
                                position: relative;
                                top: 5px;
                                margin-right: 3px;
                              .yulan-icon
                                background url('../../assets/img/icon_image.png') no-repeat -179px -210px
                              .fenxi-icon
                                background url('../../assets/img/icon_image.png') no-repeat -179px -181px
                              .tongji-icon
                                background url('../../assets/img/icon_image.png') no-repeat -179px -151px
                              .shanchu-icon
                                background url('../../assets/img/icon_image.png') no-repeat -179px -117px

                            .mr25
                              margin-right 25px
                        .leaf
                          background #f5f5f5
                        .first-li
                          margin-top 10px
                    .button-wrap
                      height 65px
                      .button-a
                        width 90px
                        height 25px
                        background  #FFD4E0
                        color #FF366D
                        font-size 14px
                        line-height 25px
                        text-align center
                        border-radius 13px
                        margin-top 20px
                .title-wrap
                  display flex
                  padding 23px 0
                  .title-wrap-left
                    flex 1
                    padding-left 25px
                    word-break: break-all;
                  .title-wrap-right
                    width 280px
                  .span-usual
                    display inline-block
                    line-height 32px
                    font-size 14px
                    color #333
                    margin-right 20px
                  .ml0
                    margin-left 0px
                .showMore-wrap
                  float: right
                  font-size 14px
                  line-height 32px
                  color #FF366D
                  margin-right 30px
                  cursor pointer
        .content-right
          width 410px
          margin-right 40px
          .right-wrap
            margin-top 25px
            .all-wrap
              margin-top 20px
              .el-button
                width 410px
            .wh_content_all
              background #fff
              border-radius 4px
              .wh_top_changge
                li
                  height 70px
                .wh_content_li
                  color #333
                  font-size 18px
                  font-weight bold
                .wh_jiantou1
                  width 36px
                  height 36px
                  border none
                  border-radius 50%
                  background url('../../assets/img/icon_image.png') no-repeat -241px -191px
                  transform: rotate(0deg)
                .wh_jiantou2
                  width 36px
                  height 36px
                  border none
                  border-radius 50%
                  background url('../../assets/img/icon_image.png') no-repeat -241px -245px
                  transform: rotate(0deg)
              .wh_content_item
                color #666
                font-size 15px
                font-weight bold
                height 50px
                .wh_isToday
                  color #FF366D
                  background none
                .wh_item_date
                  border-radius 50%
                  transition all .3s
                  &.wh_chose_day
                    background #FF366D
                    color #fff
                .wh_item_date:not(.wh_chose_day):hover
                  border-radius 50%
                  background #FF7AA7
                  color #fff
                .wh_isMark
                  background #fff
                  border 1px solid #ff366d
                  color #ff366d
    .addExam-popup
      position fixed
      top 0
      left 0
      width 100%
      height 100%
      background: rgba(0,0,0,.6);
      .popup-box
        width: 650px;
        height: 660px;
        opacity 1
        background: #eee;
        margin: 0 auto;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        padding: 20px 15px;
        .popup-content-wrap
          width 100%
          height 100%
          background #fff
          .title-wrap
            height 60px
            text-align center
            line-height 60px
            font-size 18px
            color #1e1e1e
          .el-tree-wrap
            height 490px
            overflow auto
          .el-tree
            .node-label-text
              font-size 14px
          .button-wrap
            text-align right
            padding-right 20px
            margin-top 20px
        .close-btn
          position: absolute;
          right: -17px;
          top: -17px;
          width: 34px;
          height: 34px;
          text-align: center;
          line-height: 34px;
          font-size: 25px;
          font-weight: 700;
          color: #b5a2a7;
          border-radius: 17px;
          background: #fff;
          cursor: pointer;
  .ffffff
    width 100%
</style>
