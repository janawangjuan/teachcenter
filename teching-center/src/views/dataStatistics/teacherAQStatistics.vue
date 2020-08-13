<template>
  <div class="teacherAQStatistics-wrap">
    <div v-show="showMainView" class="mainview-wrap">
      <div class="filter-wrap">
        <unfoldCollapse  @checkForm="searchList">
          <el-form :inline="true"  size="mini">
            <el-form-item label="项目">
              <el-select v-model="filterData.item" placeholder="项目" @change="changeItem">
                <el-option v-for="(item,index) in options1" :value="item.id" :key="index" :label="item.title"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="科目">
              <el-select v-model="filterData.subject" placeholder="科目">
                <el-option v-for="(item,index) in options2" :value="item.id" :key="index" :label="item.title"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="教师用户名">
              <el-input v-model="filterData.name" placeholder="请输入教师用户名"></el-input>
            </el-form-item>
            <el-form-item label="提问时间">
              <el-date-picker
                v-model="filterData.askTime"
                type="daterange"
                unlink-panels
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions0"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </unfoldCollapse>
        <div class="export-btn-wrap">
          <el-button size="mini"><a :href="urlStr" download="教学中心" class="search-btn"><i class="el-icon-printer"></i>导出</a></el-button>
        </div>
      </div>
      <div class="table-wrap">
        <el-table
          :data="tableData"
          tooltip-effect="dark"
          v-loading="loading"
          :stripe="true"
          size="mini"
          @sort-change="sortChange"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="50"></el-table-column>
          <el-table-column
            prop="teacherName"
            label="教师姓名">
          </el-table-column>
          <el-table-column
            prop="gardCount"
            sortable="custom"
            :sort-method="sortByGrade"
            label="获星数">
          </el-table-column>
          <el-table-column
            prop="answerCount"
            sortable="custom"
            label="答疑数量">
          </el-table-column>
          <el-table-column
            prop="knowledgeItem"
            label="项目">
          </el-table-column>
          <el-table-column
            prop="knowledgeCategory"
            label="科目">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <a class="color-a" href="javascript:;" @click="toStudent(scope.row)">明细</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="height: 40px;text-align: center;">
        <el-pagination
          background
          layout="prev, pager, next, sizes, total"
          :pageSize="pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <template v-if="!showMainView">
      <teacherDetails @returnBack="returnBack" :dateInfo="filterData.askTime" :teacherInfo="teacherInfo"></teacherDetails>
    </template>
  </div>
</template>

<script>
  import teacherDetails from './teacherDetails'
  import unfoldCollapse from '@/components/unfoldCollapse'
  import Request from '@/request'

  export default {
    name: "teacherAQStatistics",
    components:{
      teacherDetails,
      unfoldCollapse
    },
    computed:{
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))},
    },
    async mounted(){
      this.$message({
        message:'请先选择筛选条件，然后点击搜索按钮查询数据',
        type:'info'
      })
      let now = new Date();
      let startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10);
      let endDate = this.webApi.getLastMonthToday()
      this.filterData.askTime.push(endDate)
      this.filterData.askTime.push(startDate)
      const {data} = await this.getKnowledgeCategory()
      if(data.length > 1){
        this.changeItem(data[1].id)
      }
      //this.getList()
      this.getExportExcelUrl()
    },
    data(){
      return{
        filterData:{
          item:'',
          subject:'',
          name:'',
          askTime:[]
        },
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now();//如果没有后面的-8.64e7就是不可以选择今天的
          }
        },
        teacherInfo:{},  //点击明细时传过去的教师信息
        showMainView:true,
        showStudentDetails:false,
        showClassGather:false,
        gradeSort:'',
        urlStr:'',
        answerSort:'',
        totalCount:0,
        envType:parseInt(this.cookie.get('envType')),
        pageNo:1,
        pageSize:20,
        tableData:[],
        loading:false,
        options1:[],
        options2:[]
      }
    },
    methods:{
      toStudent(params){
        this.showMainView = false
        this.teacherInfo = params
      },
      sortByGrade(a,b){

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
        this.urlStr = host+'/api/userAction/php/bbs/exportBbsStatisticalData?verTT='+new Date().getTime()+'&token='+this.techLoginInfo.token+'&knowledgeItem='+this.filterData.item+'&knowledgeCategory='+this.filterData.subject+'&teacherName='+this.filterData.name+'&gradeSort='+this.gradeSort+'&answerSort='+this.answerSort+'&startDate='+startDate+'&endDate='+endDate+'&pageSize=1000&pageNum=1'
      },
      sortChange(a,b,c){
        if(a.column){
          if(a.prop=="gardCount"){
            this.answerSort = ''
            if(a.order == "ascending"){
              this.gradeSort = 'asc'
            }else{
              this.gradeSort = 'desc'
            }
          }else{
            this.gradeSort = ''
            if(a.order == "ascending"){
              this.answerSort = 'asc'
            }else {
              this.answerSort = 'desc'
            }
          }
        }else{
          this.gradeSort = '';
          this.answerSort = '';
        }
        this.pageNo = 1
        this.getList()
      },
      searchList(){
        this.getExportExcelUrl()
        this.getList()
      },
      getList(){
        this.loading = true
        this.tableData=[]
        Request.ajax('bbsStatisticalData',{
          knowledgeItem:this.filterData.item,
          knowledgeCategory:this.filterData.subject,
          teacherName:this.filterData.name,
          pageNo:this.pageNo,
          pageSize:this.pageSize,
          token:this.techLoginInfo.token,
          gradeSort:this.gradeSort,
          answerSort:this.answerSort,
          startDate:this.filterData.askTime?this.filterData.askTime[0]:'',
          endDate:this.filterData.askTime?this.filterData.askTime[1]:'',
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
      changeItem(params){
        this.filterData.subject = ''
        this.filterData.item = params
        this.options1.forEach((item,index)=>{
          if(item.id == params){
            if(item.child){
              this.options2 = item.child
            }else{
              this.options2 = [{
                title:'全部科目',
                id:''
              }]
            }

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
      getKnowledgeCategory(){
        return Request.ajax('getKnowledgeCategory',{
          token:this.techLoginInfo.token
        }).then(res=>{
          if(res && res.state=='success'){
            let arr = this.copyData(res.data)
            this.options1 = this.filterCascaderData(arr)
            return {
              data:this.options1
            }
          }else{
            this.webApi.alert(res.msg)
          }
        })
      },
      returnBack(){
        this.showMainView = true
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
    }
  }
</script>

<style lang="stylus">
  .teacherAQStatistics-wrap
    width 100%
    height 100%
    .mainview-wrap
      height 100%
      overflow auto
      .el-form-item__label
        width 90px
      .export-btn-wrap
        text-align right
        margin-top 20px
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
          .mr20
            margin-right: 20px
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
      padding 0 20px 20px
      margin-top 20px
      .el-table
        .color-a
          color #ff366d
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

