<template>
  <div class="youboStudyAction-wrap">
    <div v-if="showMainView" class="mainview-wrap">
      <div class="filter-wrap">
        <unfoldCollapse @checkForm="searchClassList">
          <el-form :inline="true"  size="mini">
            <el-form-item label="项目">
              <el-select v-model="filterData.item" placeholder="项目" @change="changeItem">
                <el-option value="" label="全部项目"></el-option>
                <el-option v-for="(item,index) in options1" :value="item.itemId" :key="index" :label="item.itemName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="科目">
              <el-select v-model="filterData.subject" placeholder="科目">
                <el-option value="" label="全部科目"></el-option>
                <el-option v-for="(item,index) in options2" :value="item.courseCategoryId" :key="index" :label="item.courseCategoryName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="filterData.status" placeholder="状态">
                <el-option label="全部" value=""></el-option>
                <el-option label="未开始" value="1"></el-option>
                <el-option label="进行中" value="2"></el-option>
                <el-option label="已结束" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班级名称">
              <el-input v-model="filterData.className" placeholder="请输入班级名称"></el-input>
            </el-form-item>
          </el-form>
        </unfoldCollapse>
      </div>
      <div class="table-wrap">
        <el-table
          :data="tableData"
          tooltip-effect="dark"
          v-loading="loading"
          :stripe="true"
          size="mini"
          style="width: 100%">
          <el-table-column
            prop="className"
            label="班级名称">
          </el-table-column>
          <el-table-column
            prop="courseName"
            label="课程名称">
          </el-table-column>
          <el-table-column
            prop="courseVersionName"
            label="教学版本">
            <template slot-scope="scope">{{scope.row.versionName?scope.row.versionName:'一'}}</template>
          </el-table-column>
          <el-table-column
            prop="itemName"
            label="项目">
          </el-table-column>
          <el-table-column
            prop="courseCategoryName"
            label="科目">
          </el-table-column>
          <el-table-column
            prop="classBatchName"
            label="批次">
          </el-table-column>
          <el-table-column
            prop="timeLine"
            label="有效期">
            <template slot-scope="scope">{{webApi.formatDate(scope.row.startTime/1000,'YMD')}}至{{webApi.formatDate(scope.row.endTime/1000,'YMD')}}</template>
          </el-table-column>
          <el-table-column
            prop="classStatus"
            width="80"
            label="状态">
            <template slot-scope="scope"><span v-if="scope.row.classStatus==1">未开始</span><span v-if="scope.row.classStatus==2">进行中</span><span v-if="scope.row.classStatus==3">已结束</span></template>
          </el-table-column>
          <el-table-column
            prop="studentNum"
            width="80"
            label="学员数">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <a href="javascript:;" @click="toStudent(scope.row)">学员明细</a>
              <a href="javascript:;" @click="toClass(scope.row)">班级汇总</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="height: 50px;text-align: center;">
        <el-pagination
          background
          layout="prev, pager, next,sizes,total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="pageNo"
          :pageSize="pageSize"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <template v-if="!showMainView && showStudentDetails">
      <studentDetails :studentInfo="studentInfo" @returnBack="returnBack"></studentDetails>
    </template>
    <template v-if="!showMainView && showClassGather">
      <classGather :classInfo = "classInfo" @returnBack="returnBack"></classGather>
    </template>
  </div>
</template>

<script>
  import studentDetails from './studentDetails'
  import classGather from './classGather'
  import unfoldCollapse from '@/components/unfoldCollapse'
  import Request from '@/request'

  export default {
    name: "youboStudyAction",
    components:{
      studentDetails,
      classGather,
      unfoldCollapse
    },
    computed:{
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))}
    },
    mounted(){
      this.getClassList()
      //this.getKnowledgeCategory()
      this.findItemCategoryList()
    },
    data(){
      return{
        filterData:{
          item:'',
          subject:'',
          status:'2',
          className:''
        },
        showMainView:true,
        showStudentDetails:false,
        showClassGather:false,
        studentInfo:'',
        classInfo:'',
        totalCount:0,
        pageSize:20,
        loading:true,
        pageNo:1,
        tableData:[],
        options1:[],
        options2:[],
        ItemCategoryList:'',
      }
    },
    methods:{
      toStudent(params){
        this.studentInfo = params
        this.showMainView = false
        this.showStudentDetails = true
      },
      toClass(params){
        this.classInfo = params
        this.showMainView = false
        this.showClassGather = true
      },
      returnBack(){
        this.showStudentDetails = false
        this.showClassGather = false
        this.showMainView = true
      },
      getClassList(){  //获取班级列表
        this.loading = true
        Request.ajax('getClassStatistics',{
          token:this.techLoginInfo.token,
          itemId:this.filterData.item,
          courseCategoryId:this.filterData.subject,
          classStatus:this.filterData.status,
          pageSize:this.pageSize,
          className:this.filterData.className,
          currentPage:this.pageNo,
          classBatchId:''
        }).then(res=>{
          this.loading = false
          if(res && res.state == 'success'){
            this.tableData = res.data.result
            this.totalCount = res.data.total
          }else{
            this.webApi.alert(res.msg)
          }
        })
      },
      findItemCategoryList(){
        Request.ajax('getItemCategory',{
          token:this.techLoginInfo.token,
        }).then(res=>{
          if(res && res.state == 'success'){
            this.ItemCategoryList = res.data
            this.options1 = res.data
            //this.totalCount = res.data.totalRecord
          }else{
            this.webApi.alert(res.msg)
          }
        })
      },
      changeItem(params){
        this.options2 = this.options1.filter(item => params == item.itemId)[0].courseCategoryList
        this.filterData.subject = ''
        /*this.filterData.subject = ''
        this.options1.forEach((item,index)=>{
          if(item.id == params){
            console.log(item.child)
            if(item.child){
              this.options2 = item.child
            }else{
              this.options2 = [{
                title:'全部科目',
                id:''
              }]
            }

          }
        })*/
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
      getKnowledgeCategory(){
        Request.ajax('getKnowledgeCategory',{
          token:this.techLoginInfo.token
        }).then(res=>{
          if(res && res.state=='success'){
            let arr = this.copyData(res.data)
            this.options1 = this.filterCascaderData(arr)
          }else{
            this.webApi.alert(res.msg)
          }
        })
      },
      searchClassList(){
        this.pageNo = 1
        this.getClassList()
      },
      handleCurrentChange(params){
        this.pageNo = params
        this.getClassList()
      },
      handleSizeChange(params){
        this.pageSize = params
        this.pageNo = 1
        this.getClassList()
      },
    }
  }
</script>

<style lang="stylus">
  .youboStudyAction-wrap
    width 100%
    height 100%
    .mainview-wrap
      overflow auto
      height 100%
      .el-form-item__label
        width 70px
    .filter-wrap
      padding 20px
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
      padding-bottom 20px
      flex 1
      overflow auto
      .el-table
        th
          text-align center
          background #f7f7f7
          border none
        td
          text-align center
          border none
      .el-pagination
        text-align center
        margin-top 15px
  .ffffff
    width 1px
</style>
