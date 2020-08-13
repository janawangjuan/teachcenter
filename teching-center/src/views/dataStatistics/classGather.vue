<template>
  <div class="classGather-wrap">
    <div class="return-wrap">
      <span class="return-span" @click="returnBack"><i class="el-icon-back icon-usual"></i>返回</span>
    </div>
    <div class="filter-wrap">
      <div class="filter">
        <div class="main-text">
          <span class="item-span">班级：{{classInfo.className}}</span>
          <span class="item-span">项目：{{classInfo.itemName}}</span>
          <span class="item-span">科目：{{classInfo.courseCategoryName}}</span>
          <span class="item-span">批次：{{classInfo.classBatchName}}</span>
          <span class="item-span">学员数：{{classInfo.studentNum}}</span>
        </div>
        <div class="btn-wrap">
          <!--<a href="javascript:;" class="search-btn"><i class="el-icon-search"></i>搜索</a>-->
          <!--<a href="javascript:;" class="search-btn"><i class="el-icon-printer"></i>导出</a>-->
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
          label="学习周">
          <template slot-scope="scope">
            {{getWeekName(scope.row.weekindex)}}&nbsp;({{scope.row.startDate.replace(new RegExp('-','g'),"/")}}-{{scope.row.endDate.replace(new RegExp('-','g'),"/")}})
          </template>

        </el-table-column>
        <el-table-column
          label="平均学习进度">
          <template slot-scope="scope">{{scope.row.averageLearnProgress=='-1'?'--':(scope.row.averageLearnProgress+'%')}}</template>
        </el-table-column>
        <el-table-column
          label="视频完成率">
          <template slot-scope="scope">{{scope.row.videoCompletionRate=='-1'?'--':(scope.row.videoCompletionRate+'%')}}</template>
        </el-table-column>
        <el-table-column
          label="作业完成率">
          <template slot-scope="scope">{{scope.row.examCompletionRate=='-1'?'--':(scope.row.examCompletionRate+'%')}}</template>
        </el-table-column>
        <el-table-column
          label="直播参与率">
          <template slot-scope="scope">{{scope.row.openCourseCompletionRate=='-1'?'--':(scope.row.openCourseCompletionRate+'%')}}</template>
        </el-table-column>
        <el-table-column
          label="直播回放参与率">
          <template slot-scope="scope">{{scope.row.openCoursePlaybackCompletionRate=='-1'?'--':(scope.row.openCoursePlaybackCompletionRate+'%')}}</template>
        </el-table-column>
        <el-table-column
          label="文档参与率">
          <template slot-scope="scope">{{scope.row.pdfreadCompletionRate=='-1'?'--':(scope.row.pdfreadCompletionRate+'%')}}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import Request from '@/request'

  export default {
    name: "classGather",
    computed:{
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))},
    },
    props:{
      classInfo:{
        type:Object,
        default:()=>{}
      }
    },
    mounted(){
      console.log(this.classInfo)
      this.findClassProgressCount()
    },
    data(){
      return{
        filterData:{
          plan:'',
          studentName:'',
          userName:''
        },
        loading:true,
        pageNo:1,
        totalCount:0,
        tableData:[],
      }
    },
    methods:{
      returnBack(){
        this.$emit('returnBack')
      },
      findClassProgressCount(){
        Request.ajax('findClassProgressCount',{
          token:this.techLoginInfo.token,
          classId:this.classInfo.classId,
          courseId:this.classInfo.courseVersionId,
          /*itemId:this.classInfo.itemId,
          courseCategoryId:this.classInfo.courseCategoryId,
          classBatchId:this.classInfo.classBatchId,
          versionId:this.classInfo.veduCourseId,
          className:this.classInfo.className,
          itemName:this.classInfo.itemName,
          classBatchName:this.classInfo.classBatchName,
          courseCategoryName:this.classInfo.courseCategoryName,
          studentNum:this.classInfo.studentNum,*/
          pageSize:20,
          currentPage:this.pageNo
        }).then(res=>{
          this.loading = false
          if(res && res.state == 'success'){
            this.tableData = res.data.rowList
          }else{
            this.webApi.alert(res.msg)
          }
        })
      },
      getWeekName(params){
        let str = ''
        if(params == '-1'){
          str = '全部'
        }else{
          str = '第'+this.webApi.toZhDigit(params+1)+'周'
        }
        return str
      }
    }
  }
</script>

<style lang="stylus">
  .classGather-wrap
    width 100%
    height 100%
    display flex
    padding-bottom: 20px;
    flex-direction column
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
      .filter
        padding 20px
        border 1px solid #f7f7f7
        border-radius 4px
        position relative
        .main-text
          line-height 30px
          .item-span
            margin-right 30px
            font-size 14px
            color #333
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
      .el-table
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
  .ffff
    width 1px
</style>
