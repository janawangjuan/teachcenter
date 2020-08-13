<template>
  <div class="teacherDetails-wrap">
    <div class="return-wrap">
      <span class="return-span" @click="returnBack"><i class="el-icon-back icon-usual"></i>返回</span>
    </div>
    <div class="filter-wrap">
      <div class="filter">
        <div class="title-wrap">
          <span class="name-span">{{teacherInfo.teacherName}}</span>答疑明细
        </div>
        <el-form :inline="true"  size="mini">
          <el-form-item label="项目：">
            {{teacherInfo.knowledgeItem}}
          </el-form-item>
          <el-form-item label="科目：">
            {{teacherInfo.knowledgeCategory}}
          </el-form-item>
          <el-form-item label="课程选择">
            <el-select v-model="filterData.classType" placeholder="">
              <el-option label="全部课程" value=""></el-option>
              <el-option v-for="(item,index) in classSelectList" :value="item.value" :key="index" :label="item.title"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="提问时间">
            <el-date-picker
              v-model="filterData.askTime"
              type="daterange"
              unlink-panels
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              :picker-options="pickerOptions0"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="filterData.userName" placeholder="标题"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-wrap">
          <a href="javascript:;" class="search-btn" @click="selectList"><i class="el-icon-search"></i>搜索</a>
          <a :href="urlStr" download="教学中心" class="search-btn"><i class="el-icon-printer"></i>导出</a>
        </div>
      </div>
    </div>
    <div class="table-wrap">
      <el-table
        :data="tableData"
        tooltip-effect="dark"
        v-loading="loading"
        :stripe="true"
        size="mini"
        height="100%"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="50"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="标题">
          <template slot-scope="scope">
            <a :class="['title-a',scope.row.isdelete==1?'isDetele-a':'']" href="javascript:;" @click="showExamDeatail(scope.row)"><span v-if="scope.row.isdelete=='1'">（已删除）</span>{{scope.row.title}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="grad"
          width="120"
          label="学生评分">
        </el-table-column>
        <el-table-column
          label="项目">
          <template slot-scope="scope">
            {{teacherInfo.knowledgeItem}}
          </template>
        </el-table-column>
        <el-table-column
          label="科目">
          <template slot-scope="scope">
            {{teacherInfo.knowledgeCategory}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="courseName"
          label="课程">
        </el-table-column>
        <el-table-column
          width="120"
          prop="courseType"
          label="类型">
          <template slot-scope="scope">
            {{getClassTextFromType(scope.row.courseType)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="tasktype"
          width="120"
          label="来源">
          <template slot-scope="scope">
          <div class="ac-list-info-li" v-if="scope.row.tasktype== 'video'"><a class="ac-list-info-span ac-list-info-video" link="#video/ff8080814f607c24014f68797ae11714/ff8080814f607c24014f687e0b72171b/8a22ecb55fb31e2a015ffb59e84a0298/30?return_link=myAc&amp;return_render=on&amp;return_hash=on" href="javascript:;"  @click="checkVideoSource(scope.row)"><i class="icon icon-ac-time"></i><span class="ac-desc-video-time">{{webApi.formatType(scope.row.tasktype,scope.row.taskprogress)}} </span></a></div>
          <div class="ac-list-info-li" v-if="scope.row.tasktype == 'chapter'"><div class="exam-wrap" @click="checkChapterSource(scope.row)"><i class="icon-wrap"></i><span class="text-wrap">章节</span></div> </div>
          <div class="ac-list-info-li" v-if="scope.row.tasktype == 'exam'"><div class="exam-wrap" @click="checkExamSource(scope.row)"><i class="icon-wrap"></i><span class="text-wrap">题目</span></div> </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="提问时间">
        </el-table-column>
      </el-table>
    </div>
    <div style="height: 40px;padding-top:10px;text-align: center;">
      <el-pagination
        background
        layout="prev, pager, next, sizes, total"
        :pageSize="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :total="totalCount">
      </el-pagination>
    </div>
    <div class="modal-wrap" v-if="showExamDeatailModal">
      <div class="content-wrap">
        <i class="close-btn" @click="close"></i>
        <div class="content">
          <exchangeDeatail :exchangeData="exchangeData" :canClick="true"></exchangeDeatail>
        </div>
      </div>
    </div>
    <!--<videoSource v-if="showVideoSource" :videoParams = "sourceParams" @on-closeVideo="closeVideo"></videoSource>-->
    <div class="video-player-wrap"  v-if="showVideoSource">
      <div class="v-p-w-content">
        <div class="video-title">问题来源
          <i class="close-btn" @click="closeVideo"></i>
        </div>
        <div class="video-wrap">
          <videoPlayer :videoParams="sourceParams"></videoPlayer>
        </div>
      </div>
    </div>
    <examSource @closeExam="closeExamPop" v-if="showExamSource" :examParams="sourceParams"></examSource>
    <chapterSource @closeChapter="closeChapterPop" v-if="showChapterSource" :chapterParams="sourceParams"></chapterSource>
  </div>
</template>

<script>
  import exchangeDeatail from '../exchange/exchangeDetail'
  import videoPlayer from '@/components/videoPlayer'
  import examSource from '@/components/examSource'
  import chapterSource from '@/components/chapterSource'
  import Request from '@/request'

  export default {
    name: "teacherDetails",
    components:{
      exchangeDeatail,
      videoPlayer,
      chapterSource,
      examSource,
    },
    computed:{
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))},
    },
    props:{
      teacherInfo:{
        type:Object,
        default:()=>{}
      },
      dateInfo:{
        default:null,
      },
    },
    mounted(){
      let now = new Date();
      console.log(this.teacherInfo)
      /*let startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10);
      let endDate = this.webApi.getLastMonthToday()*/
      this.filterData.askTime.push(this.dateInfo?this.dateInfo[0]:'')
      this.filterData.askTime.push(this.dateInfo?this.dateInfo[1]:'')
      this.getList()
      this.getCourseType()
      this.getExportExcelUrl()
    },
    data(){
      return{
        filterData:{
          classType:'',
          studentName:'',
          askTime:[],
          userName:''
        },
        sourceParams:'',
        showVideoSource:false,
        showExamSource:false,
        showChapterSource:false,
        loading:false,
        totalCount:0,
        pageNo:1,
        pageSize:20,
        urlStr:'',
        envType:parseInt(this.cookie.get('envType')),
        classSelectList:[],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now();//如果没有后面的-8.64e7就是不可以选择今天的
          }
        },
        showExamDeatailModal:false,
        exchangeData:{},

        tableData:[],
      }
    },
    methods:{
      returnBack(){
        this.$emit('returnBack')
      },
      close(){
        this.showExamDeatailModal = false
      },
      selectList(){
        this.pageNo = 1
        this.getExportExcelUrl()
        this.getList()
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
      checkExamSource(params){
        this.showExamSource = true
        this.sourceParams = params
        let str = 'elearning'
        if(this.envType == '1'){
          str = 'elearningdemo'
        }
        //window.open('http://'+str+'.zbgedu.com/#showAnswer?exerciseIds='+params.exerciseId)
      },
      getExportExcelUrl(){
        let host = '';
        if(this.envType == '1'){
          host = 'https://apidemo.zbgedu.com'
        }else{
          host = 'https://api.zbgedu.com'
        }
        let startDate = this.filterData.askTime?this.filterData.askTime[0]:""
        let endDate = this.filterData.askTime?this.filterData.askTime[1]:""
        this.urlStr = host+'/api/userAction/php/bbs/exportBbsStatisticalInfo?verTT='+new Date().getTime()+'&token='+this.techLoginInfo.token+'&knowledgeItem='+this.teacherInfo.knowledgeItemId+'&knowledgeCategory='+this.teacherInfo.knowledgeCategoryId+'&courseType='+this.filterData.classType+'&teacherId='+this.teacherInfo.teacherId+'&title='+this.filterData.userName+'&startDate='+startDate+'&endDate='+endDate;
      },
      checkChapterSource(params){
        this.showChapterSource = true,
          this.sourceParams = params
      },
      checkVideoSource(params){
        this.showVideoSource = true
        this.sourceParams = params
      },
      closeExamPop(){
        this.showExamSource = false
      },
      closeVideo(){
        this.showVideoSource = false
      },
      closeChapterPop() {
        this.showChapterSource = false
      },
      getList(){
        this.loading = true
        Request.ajax('bbsStatisticalInfo',{
          knowledgeItem:this.teacherInfo.knowledgeItemId,
          knowledgeCategory:this.teacherInfo.knowledgeCategoryId,
          courseType:this.filterData.classType,
          token:this.techLoginInfo.token,
          teacherId:this.teacherInfo.teacherId,
          startDate:this.filterData.askTime?this.filterData.askTime[0]:'',
          endDate:this.filterData.askTime?this.filterData.askTime[1]:'',
          title:this.filterData.userName,
          pageNo:this.pageNo,
          pageSize:this.pageSize
        }).then(res=>{
          this.loading = false
          if(res && res.state == 'success'){
            this.tableData = res.data
            this.totalCount = res.total
          }else{
            this.webApi.alert(res.msg)
          }
        })
      },
      getClassTextFromType(params){
        console.log(params)
        console.log(this.classSelectList)
        for(let i = 0;i<this.classSelectList.length;i++){
          if(this.classSelectList[i].value == params){
            return this.classSelectList[i].title
          }
        }
        return params
      },
      handleCurrentChange(params){
        this.pageNo = params
        this.getList()
      },
      handleSizeChange(params){
        this.pageSize = params
        this.pageNo = 1
        this.getList()
      },
      showExamDeatail(param){
        this.exchangeData.id = param.id
        this.showExamDeatailModal = true
      }
    }
  }
</script>

<style lang="stylus">
  .teacherDetails-wrap
    width 100%
    height 100%
    display flex
    flex-direction column
    padding-bottom: 20px;
    .return-wrap
      padding-top 10px
      height 40px
      line-height 30px
      padding-left 20px
      font-size 14px
      font-weight bold
      color #333
      .return-span
        cursor pointer
        .icon-usual
          margin-right 5px
          font-weight bold
    .filter-wrap
      padding 20px
      .title-wrap
        line-height 40px
        margin-bottom 10px
        font-size 14px
        .name-span
          font-size 16px
          font-weight bold
          margin-right 5px
      .filter
        padding 20px
        border 1px solid #f7f7f7
        border-radius 4px
        position relative
        .el-form--inline
          .el-form-item
            margin-right 30px
        .btn-wrap
          width 100%
          position absolute
          left 0
          text-align center
          bottom -12px
          .search-btn
            display inline-block
            padding 0 10px
            height 24px
            font-size 14px
            line-height 24px
            background #fff
            border 1px solid #f7f7f7
            border-radius 4px
    .table-wrap
      padding 0 20px
      margin-top 20px
      flex 1
      .el-table
        .title-a
          color #ff366d
        .isDetele-a
          color #c2c2c2
        .ac-list-info-li
          .exam-wrap
            width 75px
            height 20px
            margin: 0 auto;
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
              float: left
              display inline-block
              font-size 12px
              width 55px
              height 18px
              line-height 18px
              text-align center
              background #acacac
          .ac-list-info-video
            width 75px
            height 20px
            border 1px solid #acacac
            color #fff
            .icon-ac-time
              display inline-block
              width 18px
              height 18px
              background url("../../assets/img/icon_image.png") no-repeat 6px -125px
              float: left
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
        th
          text-align center
          background #f7f7f7
          border none
          text-align center
          border none
        .el-table__body
          tr.hover-row
            td
              background #f5f7fa
      .el-pagination
        text-align center
        margin-top 15px
    .modal-wrap
      position fixed
      top 0
      left 0
      z-index: 10;
      background rgba(0,0,0,0.5)
      width 100%
      height 100%
      .content-wrap
        position absolute
        top 50%
        left 50%
        transform translate(-50%,-50%)
        width: 700px;
        height 70%;
        .close-btn
          display inline-block
          width 26px
          height 26px
          background #333 url("../../assets/img/icon_image.png") no-repeat -127px 0px
          border-radius 50%
          position absolute
          top -13px
          right -13px
          z-index 5
          cursor pointer
        .content
          height 100%
          overflow hidden
          background #fff
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
  .ffff
    width 1px
</style>
