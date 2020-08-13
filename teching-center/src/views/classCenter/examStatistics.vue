<template>
  <div id="app" class="app">
    <div class="examStatistics-wrap">
      <el-container>
        <el-header>
          <iHeader></iHeader>
        </el-header>
        <el-main>
          <div class="examStatistics-content">
            <div class="title-wrap">
              <div class="title-left">当前位置：{{routeParams.className}}&gt;课表&gt;测评统计</div>
              <div class="title-right">
                <!--<a  href="https://apidemo.zbgedu.com/api/edu/userAction/examen/exportTestCount?verTT=1553773387505&token=c5dc0a32-88f5-4541-a666-9fc292eae481&classId=eed0b71334e711e9848a00163e0f507b&examId=fe650858a8ee3a44bb1fae62f7729763&courseArrangeDetailId=7130b08a34f111e9848a00163e0f507b&pageSize=1000&pageNum=1" download="教学中心" class="button-a" >导出表格</a>-->
                <a  :href="str" download="教学中心" class="button-a" >导出表格</a>
              </div>
            </div>
            <div class="name-wrap">
              <span class="name-content">测评名称：{{examInfo.examTitle}}</span>
              <span class="span1">题目数量：共{{examInfo.exerciesCount}}题</span>
              <span class="span1">测评时间：{{examInfo.createDate}}</span>
              <span class="span2">完成情况：{{examInfo.submintStuCount}}/{{examInfo.allStuCount}}人</span>
            </div>
            <div class="table-wrap">
              <div class="table-title-wrap">
                <el-input
                  v-model="studentName"
                  placeholder="请输入用户名/姓名搜索">
                  <i
                    class="el-icon-search el-input__icon"
                    slot="suffix"
                    @click="handleIconClick">
                  </i>
                </el-input>
                <el-checkbox-group v-model="checkList">
                  <el-checkbox  false-label='' true-label="0" name="state">未完成</el-checkbox>
                  <el-checkbox  false-label='' true-label="1" name="state">已完成</el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="table-content">
                <el-table
                  ref="multipleTable"
                  :data="tableData"
                  tooltip-effect="dark"
                  style="width: 100%"
                  @selection-change="handleSelectionChange">
                  <el-table-column
                    type="selection">
                  </el-table-column>
                  <el-table-column
                    type="index"
                    label="序号">
                  </el-table-column>
                  <el-table-column
                    prop="loginName"
                    label="用户名">
                  </el-table-column>
                  <el-table-column
                    prop="realName"
                    label="姓名">
                  </el-table-column>
                  <el-table-column
                    prop="isFinishName"
                    label="完成情况">
                  </el-table-column>
                  <el-table-column
                    label="答错/答对题数">
                    <template slot-scope="scope">{{ scope.row.allCount-scope.row.rightCount }}/{{ scope.row.rightCount }}题数</template>
                  </el-table-column>
                  <el-table-column
                    prop="accuracy"
                    label="正确率">
                  </el-table-column>
                  <el-table-column
                    label="操作">
                    <template slot-scope="scope"><a href="javascript:;" @click="previewErrorQ(scope.row.errorExercisesList)" style="color:#ff366d">错题预览</a></template>
                  </el-table-column>
                </el-table>
                <div class="opreating-wrap" v-if="!webApi.isEmpty(tableData)">
                  <el-checkbox v-model="allChecked" @change="allCheck()">全选</el-checkbox>
                  <p class="send-msg" @click="sendMessage">发送通知</p>
                </div>
              </div>
            </div>
          </div>
          <div class="popup-wrap" v-if="showPopupWrap">
            <div class="popup-box">
              <div class="popup-content-wrap">
                <div class="title">错题预览</div>
                <div class="popup-content">
                    <iframe v-if="showIfame" :src="frameSrc" width="100%" height="100%" frameborder="0"></iframe>
                </div>
              </div>
              <div class="close-btn" @click="closePreviewPopup">
                <i class="el-icon-close"></i>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
      <el-dialog
        title="发送通知"
        :visible.sync="dialogVisible"
        width="40%"
        center>
        <textarea class="replay-content" ref="replayContent" v-model="message"></textarea>
        <span slot="footer" class="dialog-footer">

			    <el-button size="small" @click="dialogVisible = false">取消</el-button>
           <el-button size="small" type="primary" @click="replay()">发送</el-button>
			  </span>
      </el-dialog>
    </div>
  </div>

</template>

<script>
  import iHeader from "@/components/i-header"
  import Request from '@/request'
  import iScroll from '@/components/i-scroll'
  import {mapState} from 'vuex'
  export default {
    name: "examStatistics",
    components:{
      iHeader,
      iScroll
    },
    computed:{
      ...mapState({
        //techLoginInfo:state=>state.global.techLoginInfo
      }),
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))}
    },
    watch:{
      checkList(val){
        this.getExamListByName()
      }
    },
    data(){
      return {
        className:'acca-班级',
        studentName:'',
        allChecked:false,
        checkList:'',
        str:'12341',
        showPopupWrap:false,
        dialogVisible:false,
        message:'',
        envType:parseInt(this.cookie.get('envType')),
        routeParams:this.$route.params,
        examInfo:'',
        showIfame:false,
        frameSrc: '',
        tableData:[],
        scrollRefresh:false,
        selectStudent:'',
        receiveIds:''
      }
    },
    mounted(){
      this.getExamList()
      this.getExportExcelUrl()
    },
    methods:{
      handleIconClick(){
        this.getExamListByName()
        this.studentName = ''
      },
      previewErrorQ(params){  //错题预览
        if(!params||params.length==0){
          this.webApi.alert('此学员暂无错题记录')
          return false
        }
        let host = ''
        if(this.envType == '1'){
          host = 'http://elearningdemo.zbgedu.com'
        }else{
          host = 'http://elearning.zbgedu.com'
        }
        let arr = []
        params.forEach((item)=>{
          arr.push(item.exerciseId)
        })
        let str = arr.join()
        this.frameSrc=host+'/#showAnswer?exerciseIds='+str
        this.showPopupWrap = true
        setTimeout(()=>{
          this.showIfame  = true
        },1000)
      },
      closePreviewPopup(){
        this.showPopupWrap = false
      },
      getExportExcelUrl(){
        let host = '';
        if(this.envType == '1'){
          host = 'https://apidemo.zbgedu.com'
        }else{
          host = 'https://api.zbgedu.com'
        }
        this.str = host+'/api/edu/userAction/examen/exportTestCount?verTT='+new Date().getTime()+'&token='+this.techLoginInfo.token+'&classId='+this.routeParams.classId+'&examId='+this.routeParams.examenId+'&courseArrangeDetailId='+this.routeParams.courseArrangeId+'&pageSize=1000&pageNum=1'
      },
      exportExcel(){
        Request.ajax('exportTestCount',{
          token:this.techLoginInfo.token,
          classId:this.routeParams.classId,
          examId:this.routeParams.examenId,
          courseArrangeDetailId:this.routeParams.courseArrangeId,
          pageSize:1000,
          pageNum:1
        },{ responseType: 'blob' }).then(res=>{
          if(res && res.state=='success'){
            let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
            let objectUrl = URL.createObjectURL(blob);
            window.location.href = objectUrl;
          }
        })
      },
      handleSelectionChange(val){
        this.selectStudent = val
      },
      allCheck(data){
        this.toggleSelection(this.tableData)
      },
      getExamList(){
        Request.ajax('getExamStatistics',{
          token:this.techLoginInfo.token,
          classId:this.routeParams.classId,
          examId:this.routeParams.examenId,
          courseArrangeDetailId:this.routeParams.courseArrangeId,
          pageSize:1000,
          pageNum:1
        }).then(res=>{
          if(res && res.state=='success'){
            this.examInfo = res.data
            this.tableData = res.data.queryList
          }
        })
      },
      getExamListByName(){
        Request.ajax('getTestCountCondition',{
          token:this.techLoginInfo.token,
          classId:this.routeParams.classId,
          examId:this.routeParams.examenId,
          courseArrangeDetailId:this.routeParams.courseArrangeId,
          userName:this.studentName,
          finishd:this.checkList,
          pageSize:1000,
          pageNum:1
        }).then(res=>{
          if(res && res.state=='success'){
            this.tableData = res.data.queryList
          }

        })
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row,!this.allSelect);
          });
          this.allSelect = !this.allSelect;
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      sendMessage(){
        if(this.selectStudent.length == 0){
          this.webApi.alert('请至少选中一个学生～')
          return
        }
        let receiveIdsArr = [];
        this.selectStudent.forEach(item => {
          receiveIdsArr.push(item.memberId);
        });
        this.receiveIds = receiveIdsArr.join(",");
        this.message = `同学您好！您的"${this.routeParams.className}"的"${this.examInfo.examTitle}"任务尚未完成！请尽快完成哦！`
        this.dialogVisible = true
      },
      replay(){
        var content = this.$refs.replayContent.value;
        if(!content){
          this.webApi.alert("请输入通知内容！");
          return;
        }
        Request.ajax('insertMessage',{
          "sendId": this.techLoginInfo.id,
          "textTitle": '通知',
          "text": content,
          "type": 0,
          "author": this.techLoginInfo.nickName,
          "receiveIds": this.receiveIds,
        }).then(res=>{
          if(res && res.state=="success"){
            this.webApi.alert("发送成功～");
            this.dialogVisible = false
          }else{
            this.webApi.alert(res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="stylus">
  @import "~@/assets/css/reset.styl"
  #app
    width 100%
    height 100%
    min-width 768px
    .examStatistics-wrap
      width 100%
      height 100%
      .el-container
        height 100%
        .el-main
          background #f7f7f7
          padding 0
          .popup-wrap
            position fixed
            z-index 30
            width 100%
            height 100%
            top 0
            left 0
            background rgba(0,0,0,0.3)
            .popup-box
              width: 1160px;
              height: 80%;
              opacity 1
              margin: 0 auto;
              position: relative;
              top: 50%;
              transform: translateY(-50%);
              .popup-content-wrap
                width 100%
                height 100%
                background #f7f7f7
                display flex
                flex-direction column
                .title
                  font-size 16px
                  height 76px
                  text-align center
                  color #1e1e1e
                  padding-top 35px
                  line-height 25px
                .popup-content
                  flex 1
                  width 1100px
                  margin 0 auto 20px
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
          .examStatistics-content
            width 1200px
            margin 0 auto
            height 100%
            display flex
            flex-direction column
            .title-wrap
              height 50px
              .title-left
                float left
                padding-left 5px
                color #ff366d
                font-size 14px
                line-height 50px
              .title-right
                float right
                width 100px
                margin-right 10px
                .button-a
                  width 100px
                  height 25px
                  background #FFD4E0
                  text-align center
                  margin-top 12px
                  line-height 25px
                  color #ff366d
                  cursor pointer
                  font-size 14px
                  border-radius 13px
                  border none
                .button-a:focus
                  outline none
            .name-wrap
              height 70px
              line-height 70px
              font-size 14px
              border-radius 10px
              background #fff
              .name-content
                color #333
                font-size 16px
                margin-right 20px
                margin-left 30px
              .span1
                color #666
                margin-right 30px
              .span2
                color #999
            .table-wrap
              background #fff
              border-radius 10px
              margin-top 10px
              flex 1
              margin-bottom 20px
              display flex
              flex-direction column
              .table-title-wrap
                height 50px
                .el-checkbox-group
                  display inline-block
                  margin-left 50px
                .el-input
                  width 360px
                  height 28px
                  margin: 10px 0 0 15px;
                  .el-input__inner
                    height 28px
                    line-height 28px
                    border-radius: 14px;
                  .el-input__suffix
                    top -6px
                  .el-input__suffix-inner
                    cursor pointer
              .table-content
                width 100%
                padding 0 15px
                flex 1
                overflow: hidden;
                display flex
                flex-direction column
                .el-table
                  flex 1
                  overflow: auto;
                  max-height: 100%
                  .el-table__header
                    th.is-leaf
                      background #f7f7f7
                      border none
                      text-align center
                    .el-table-column--selection
                      .el-checkbox
                        display none
                  .el-table__body
                    tr:nth-of-type(2n)
                      background-color: #f7f7f7;
                    td
                      border none
                      text-align center
                .opreating-wrap
                  padding 20px
                  .send-msg
                    display:inline-block;
                    width:88px;
                    height:26px;
                    text-align:center;
                    line-height:26px;
                    border-radius 13px
                    background #FFD4E0
                    color:#ff366d;
                    font-size:14px;
                    cursor:pointer;
      .el-dialog
        .el-dialog__body
          .replay-content
            width 100%
            min-height 160px
            font-size 14px
            resize none
            color #333333
            border 1px solid #eee
            padding: 5px;
            box-sizing: border-box;
          .replay-content:focus
            outline none
        .el-dialog__footer
          text-align right
    .f
      width 0
</style>
