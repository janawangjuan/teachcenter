<template>
<div class="courseQRCode-wrap">
  <div class="filter-wrap">
    <unfoldCollapse  @checkForm="searchClassList">
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
        <el-form-item label="授课类型">
          <el-select v-model="filterData.courseType" placeholder="授课类型">
            <el-option :label="item.title" :value="item.value" v-for="(item,index) in courseTypeSelectList" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程名称">
          <el-input v-model="filterData.versionTitle" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="教学课程名称">
          <el-input v-model="filterData.courseTitle" placeholder="请输入教学课程名称"></el-input>
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
      <div slot="empty">
        <noData></noData>
      </div>
      <el-table-column
        prop="courseTitle"
        label="教学课程名称">
      </el-table-column>
      <el-table-column
        prop="versionTitle"
        label="课程名称">
      </el-table-column>
      <el-table-column
        prop="teachingType"
        label="授课类型">
        <template slot-scope="scope">{{handleCourseType(scope.row.teachingType)}}</template>
      </el-table-column>
      <el-table-column
        prop="seasonTitle"
        label="所属版本">
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
        label="二维码">
        <template slot-scope="scope">
          <template v-if="scope.row.qrcodeUrl">
            <img width="40" height="40" :src="host.img + scope.row.qrcodeUrl" alt="二维码">
          </template>
          <template v-else>
            ----
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="qrcodeUpdateName"
        label="二维码上传人">
        <template slot-scope="scope">{{scope.row.qrcodeUpdateName?scope.row.qrcodeUpdateName:'----'}}</template>
      </el-table-column>
      <el-table-column
        label="二维码上传时间">
        <template slot-scope="scope">{{scope.row.qrcodeUpdateDate?webApi.formatDate(scope.row.qrcodeUpdateDate/1000,'YMD'):'----'}}</template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <a href="javascript:;" @click="uploadClick(scope.row)">上传二维码</a><br/>
          <a v-if="scope.row.qrcodeUrl" href="javascript:;" @click="deleteClick(scope.row)">删除二维码</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div style="height: 40px;text-align: center;">
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
  <el-dialog title="上传二维码" :visible.sync="dialogVisible">
    <el-upload
      ref="upload"
      action="http://api.zbgedu.com/api/base/file/upload"
      class="avatar-uploader"
      list-type="picture-card"
      v-if="showUploadImg"
      :headers="uploadHeadersData"
      :auto-upload="true"
      :show-file-list="false"
      :limit="1"
      :on-exceed="handleExceed"
      :data="uploadImgData"
      :on-change="onUploadChange"
      :http-request="uploadImgFunc"
      accept="image/*"
      :on-remove="handleRemove">
      <img v-if="imageUrl" :src="host.img+imageUrl" width="100%" height="100%" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
      <el-button size="small" type="primary" @click="confirmUpload">确认</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
  import Request from '@/request'
  import unfoldCollapse from '@/components/unfoldCollapse'
  import uploadPicture from '@/components/uploadPicture'
  import noData from '@/components/noData'
  import axios from 'axios'
  import {mapState} from 'vuex'
  export default {
    name: "courseQRCode",
    computed:{
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))},
      ...mapState({
        host: state => state.global.host,
      }),
    },
    components:{
      uploadPicture,
      noData,
      unfoldCollapse
    },
    data(){
      return {
        filterData:{
          item:'',
          subject:'',
          courseType:'',
          className:'',
          courseTitle:'',
          versionTitle:''
        },
        uploadHeadersData:{
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json;charset=UTF-8'
        },
        uploadImgData:{
          token: ''
        },
        fileList:[],
        loading:false,
        pageNo:1,
        pageSize:20,
        showUploadImg:true,
        totalCount:0,
        imageUrl:'',
        options1:[],
        options2:[],
        ItemCategoryList:'',
        imgPathArr:'',
        dialogVisible:false,
        courseTypeSelectList:[],
        courseTypeList:[{name:'全部',value:'',},{name:'普通网课',value:'onlinecourse',},{name:'普通面授',value:'facecourse',},{name:'网课翻转课程',value:'flipped',},{name:'EZ课程',value:'ezcourse',},{name:'直播课',value:'livelesson',},{name:'趣学',value:'interestcourse'}],
        tableData:[],
        selectData:''
      }
    },
    mounted(){
      this.uploadImgData.token = this.techLoginInfo.token
      this.findItemCategoryList()
      this.getList()
      this.getCourseType()
      console.log(this.host)
    },
    methods:{
      getCourseType(){    //获取课程类型
        Request.ajax('getTeachingType',{
          token:this.techLoginInfo.token
        }).then((res)=>{
          if(res&&res.state=='success'){
            //暂时屏蔽ez和优博
            this.courseTypeSelectList = res.data
          }
        })
      },
      getList(){
        this.loading = true
        let itemText = '',courseCategoryText = ''
        if(this.filterData.item != ''){
          itemText = this.handleArray(this.filterData.item,this.options1,'itemId').itemName
        }
        if(this.filterData.subject != ''){
          courseCategoryText = this.handleArray(this.filterData.subject,this.options2,'courseCategoryId').name
        }
        Request.ajax('getCourseInfoPagerByParam',{
          token:this.techLoginInfo.token,
          courseTitle:this.filterData.courseTitle,  //教学课程名称
          versionTitle:this.filterData.versionTitle, //课程名称
          techItemId:this.filterData.item, //项目名称
          teachingType:this.filterData.courseType,
          courseCategoryId:this.filterData.subject, //科目名称
          pageIndex:this.pageNo,
          pageSize:this.pageSize,
        }).then(res => {
          this.loading = false
          if(res && res.state == 'success'){
            this.tableData = res.data.result
            this.totalCount = res.data.total
          }else{
            this.webApi.alert(res.msg)
          }
        })
      },
      deleteClick(params){  //删除二维码
        this.$confirm('此操作将删除该课程二维码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Request.ajax('deleteQrcodeByCourseId',{
            token:this.techLoginInfo.token,
            courseId:params.courseId
          }).then(res => {
            if(res && res.state == 'success'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getList()
            }else{
              this.webApi.alert(res.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
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
      searchClassList(){
        this.pageNo = 1
        this.getList()
      },
      uploadClick(params){
        this.selectData = params
        this.imageUrl = ''
        this.dialogVisible = true
      },
      confirmUpload(){
        if(this.imageUrl == ''){
          this.webApi.alert('请先上传二维码~')
          return
        }
        Request.ajax('updateQrcodeByCourseId',{
          token:this.techLoginInfo.token,
          courseId:this.selectData.courseId,
          qrcodeUrl:this.imageUrl
        }).then(res => {
          if(res && res.state == 'success'){
            this.dialogVisible = false
            this.$message({
              message: '课程二维码上传成功！',
              type: 'success'
            });
            this.getList()
          }else{
            this.webApi.alert(res.msg)
          }
        })
      },
      handleCourseType(params){
        return this.courseTypeList.filter(item => item.value==params).length>0?(this.courseTypeList.filter(item => item.value==params)[0].name):''
      },
      handleArray(params,arr,key){  //传入一个值，一个数组，返回这个数组中等于这个值的对象
        return arr.filter(item => item[key] == params)[0]
      },
      handleExceed(files, fileList) {
        this.$message.warning(`最多只能上传5个文件哦～`);
      },
      onUploadChange(file,fileList){
        var reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = function(e){
          //console.log(this.result)//图片的base64数据
        }
      },
      handleRemove(file,fileList) {
        this.imgPathArr = this.imgPathArr.filter(item=>item!=file.imgPath)
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
          that.imageUrl = res.data[0].storeFileUrl
        }).catch(function(error){
          that.webApi.alert(error.msg)
        })
      },
      changeItem(params){
        this.options2 = this.options1.filter(item => params == item.itemId)[0].courseCategoryList
        this.filterData.subject = ''
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
    }
  }
</script>

<style scoped lang="stylus">
.courseQRCode-wrap
  height 100%
  padding-bottom 20px
  overflow auto
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
</style>
