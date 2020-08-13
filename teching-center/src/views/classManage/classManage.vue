<template>
<div class="classManage-wrap">
  <!--<header class="header-wrap">班级类型：
    <el-select v-model="classType">
      <el-option
        label="面授课"
        value="1">
      </el-option>
      <el-option
        label="优播课"
        value="2">
      </el-option>
    </el-select>
  </header>-->
  <div class="content">
    <div class="mianshou-content" v-if="$route.params.type=='2'">
      <div class="content-left">
        <div class="left-head">
          <div class="text-wrap">我的班级</div>
          <div class="search-wrap">
            <input class="ac-search" type="text" v-on:input="listenCourseName" placeholder="输入您要寻找的班级名称" v-model="courseName" ref="searches">
            <a class="ac-search-a" href="javascript:;" @click="search"><i class="iconfont icon-sousuo"></i></a>
          </div>
          <div class="changeStyle-wrap">
            <el-radio-group v-model="styleType" @change="changeStyleType" fill="#eeeeee">
              <el-radio-button label="1"><div class="div-b div-usual"></div></el-radio-button>
              <el-radio-button label="2"><div class="div-a div-usual"></div></el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="left-content">
          <template v-if="classList&&classList.length>0">
            <iScroll id="leftContentScroll" :is-refresh="scrollRefresh">
              <ul class="ul-wrap" :class="[styleType==1?'':'ul-wrap-vertical']">
                <li class="li-wrap" v-for="(item,index) in classList" :class="[index==selectClassIndex?'active':'']" @click="changeClassDetail(item,index)">
                  <div class="li-left">
                    <div class="img-wrap">
                      <img class="img-c" :src="item.coverPath?host.img+item.coverPath:'/static/classImg.png'" :alt="item.courseplanName">
                    </div>
                  </div>
                  <div class="li-right">
                    <p class="title-wrap">{{item.courseplanName}}</p>
                    <p class="subject-name-wrap">项目-科目：{{item.itemName}}-{{item.courseCategoryName}}</p>
                    <div class="a-wrap"><a href="javascript:;" class="enterClass" @click.stop="enterClass(item,index)">进入班级</a></div>
                    <div class="endtime-wrap"><p class="endtime-p">有效期：{{webApi.formatDate(item.endDate/1000,'YMD')}}</p></div>
                  </div>
                </li>
              </ul>
              <el-pagination
                v-if="totalRecord>8"
                background
                layout="prev, pager, next"
                @current-change="sizeChange"
                @prev-click="prevSize"
                @next-click="nextSize"
                :pageSize="8"
                :total="totalRecord">
              </el-pagination>

            </iScroll>
          </template>
          <template v-else>
            <div class="has-no-data">
              <div class="img-wrap">
                <img class="img-no" src="../../assets/img/class-nodata.png" alt="暂无内容">
              </div>
              <p class="no-text">暂无内容</p>
            </div>
          </template>
        </div>
      </div>
      <transition  name="flip" mode="out-in">
        <div class="content-right" v-if="showContentRight&&classList&&classList.length>0">
          <template v-if="classDetailInfo">
            <div class="right-head">{{classDetailInfo.courseplanName}}</div>
            <div class="right-content">
              <!--<iScroll id="rightContentScroll" :is-refresh="scrollRefresh1">-->
              <div class="c-wrap">
                <div class="rencent-wrap">
                  <div class="title-wrap">
                    <p class="p-wrap">近期安排</p>
                  </div>
                  <div class="today-wrap">
                    <p class="today-p">今日面授课</p>
                    <template v-if="classDetailInfo.courseDateToday">
                      <p>日期：{{classDetailInfo.courseDateToday}}  上课时段：{{classDetailInfo.coursePeriodToday}}</p>
                      <p>教学点：{{classDetailInfo.universityName}}</p>
                    </template>
                    <template v-else>
                      <div class="nodata">
                        <p>该班级暂无课程</p>
                      </div>
                    </template>
                  </div>
                  <div class="next-wrap">
                    <p class="next-p">下次面授课</p>
                    <template v-if="classDetailInfo.courseDateNext">
                      <p>日期：{{classDetailInfo.courseDateNext}}  上课时段：{{classDetailInfo.coursePeriodNext}}</p>
                      <p>教学点：{{classDetailInfo.universityName}}</p>
                    </template>
                    <template v-else>
                      <div class="nodata">
                        <p>该班级暂无课程</p>
                      </div>
                    </template>
                  </div>
                </div>
                <div class="answer-report">
                  <div class="title-wrap">
                    <p class="p-wrap">答疑报告 <!--<a class="check-a" @click="toAQDetail" href="javascript:;">查看详情&nbsp;&gt;</a>--></p>
                  </div>
                  <p class="answer-number">问题数：{{bbsCountInfo.all_count}}</p>
                  <div class="aq-echart" id="aqEchart">
                  </div>
                  <!--<ul class="answer-ul" v-if="bbsCountInfo">
                    <li class="answer-li" @click="toAQ(1)"><svgBar class="progressBar" :value="bbsCountInfo.unanswered" :options="{radius:37,circleWidth:2,maxValue:bbsCountInfo.all_count,pathColors: ['#e7e7e7','#F29754'],textColor:'#666666'}"></svgBar><p class="num-p">未回复数</p></li>
                    <li class="answer-li" @click="toAQ(2)"><svgBar class="progressBar" :value="bbsCountInfo.replied" :options="{radius:37,circleWidth:2,maxValue:bbsCountInfo.all_count,pathColors: ['#e7e7e7','#ff5656'],textColor:'#666666'}"></svgBar><p class="num-p">已回复数</p></li>
                    <li class="answer-li" @click="toAQ(0)"><svgBar class="progressBar" :value="bbsCountInfo.resolved" :options="{radius:37,circleWidth:2,maxValue:bbsCountInfo.all_count,pathColors: ['#e7e7e7','#729CD6'],textColor:'#666666'}"></svgBar><p class="num-p">已解决数</p></li>
                    <li class="answer-li" @click="toAQ(3)"><svgBar class="progressBar" :value="bbsCountInfo.asked" :options="{radius:37,circleWidth:2,maxValue:bbsCountInfo.all_count,pathColors: ['#e7e7e7','#8DC200'],textColor:'#666666'}"></svgBar><p class="num-p">已追问数</p></li>
                  </ul>-->
                </div>
                <div class="courseComplete-wrap">
                  <div class="title-wrap">
                    <p class="p-wrap">授课进度</p>
                  </div>
                  <div id="courseCompletePie" class="courseCompletePie">
                    <svgBar class="progressBar" :value="classDetailInfo.finishRate?classDetailInfo.finishRate:0" :options="options"></svgBar>
                    <!--<el-progress type="circle" :percentage="80" text-inline="true" stroke-width="20" color="#8e71c7"></el-progress>-->
                  </div>
                </div>
              </div>
              <!--</iScroll>-->
            </div>
          </template>
          <template v-else>
            <div style="height: 100%"><iLoading></iLoading></div>
          </template>
        </div>
      </transition>
    </div>
    <div class="youbo-big-wrap" v-if="$route.params.type=='1'">
      <youboComponent></youboComponent>
    </div>


  </div>
</div>
</template>

<script>
  import iScroll from '@/components/i-scroll'
  import svgBar from 'svg-progress-bar'
  import iLoading from '@/components/i-loading'
  import {mapState,mapMutations,mapActions} from 'vuex'
  import Request from '../../request'
  import youboComponent from './youboke'
  import echarts from 'echarts'
  export default {
    name: "classManage",
    components:{
      iScroll,
      svgBar,
      iLoading,
      youboComponent
    },
    mounted(){
      this.getCourseList()
    },
    computed:{
      ...mapState({
        //techLoginInfo:state => state.global.techLoginInfo,
        selectClassInfo:state => state.classManage.selectClassInfo,
        classDetailInfo:state => state.classManage.classDetailInfo,
        host:state => state.global.host
      }),
      techLoginInfo(){
        return JSON.parse(this.cookie.get('techLoginInfo'))
      },
      options(){
        return{
          radius:70,
          circleWidth:24,
          maxValue:100,
          pathColors: ['#eeeeee','#6973DC'],
          textColor:'#999999',
          text:function(value){
            return '<div style=display:block;width:100%;position:absolute;top:50px;font-size:18px;color:#333333;line-height:20px;height:20px;>'+value+'%<br/><span style=font-size:14px;line-height:20px; >课程完成度</span></div>'
          }
        }
      }
    },
    data(){
      return {
        scrollRefresh:false,
        scrollRefresh1:false,
        styleType:1,   //班级列表排列方式，1为横向排列，2为竖向
        classType:this.$route.params.type,
        classList:[],
        aqXseris:[],
        curClassInfo:'',
        selectClassIndex:0,
        showContentRight:true,
        bbsCountInfo:'',
        courseplanName:'',
        courseName:'',
        currentPage:1,
        totalRecord:0
      }
    },
    watch:{
      $route: {
        handler() {
          if(this.$route.params.type==2){
            this.getCourseList()
          }
          //深度监听，同时也可监听到param参数变化
        },
        deep: true,
      },
      classType(data){
        if(data==1){
          this.getCourseList()
        }
      },
      selectClassInfo(){
        this.bbsCountInfo = ''
        this.showContentRight = !this.showContentRight
        this.updateClassDetailInfo({
          classDetailInfo:''
        })
        this.getClassDetailInfo({
          token:this.techLoginInfo.token,
          courseArrangeId:this.selectClassInfo.courseArrangeId
        }).then(res=>{
          this.showContentRight = !this.showContentRight
          this.getBbsCount(res.data.courseArrangeId)
        })
      }
    },
    methods:{
      ...mapMutations('classManage',[
        'updateSelectClassInfo',
        'updateClassDetailInfo'
      ]),
      ...mapActions('classManage',['getClassDetailInfo']),
      search(){
        let str = this.$refs.searches.value
        /*if(str == ''){
          this.webApi.alert('请输入搜索关键字');
          return false;
        }*/
        this.getCourseList()
      },
      toAQDetail(){
        window.open('#/classCenter/dataStatisticsAq/'+this.classDetailInfo.courseArrangeId, '_blank')
      },
      toAQ(params){
        window.open('/#/classCenter/dataStatisticsAq/'+this.classDetailInfo.courseArrangeId+'?type='+params,'_blank')
      },
      drawAq(){  //答疑柱状图
        this.aqEchart = echarts.init(document.getElementById('aqEchart'));
        this.aqEchart.setOption({
          color: ['#000','#000','#ff3366','#334455'],
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            top:'20',
            bottom: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              data : ['已解决', '未回复', '已回复', '追问'],
              axisTick: {
                show: false,
              },
              axisLabel:{
                color:'#666'
              },
              axisLine:{
                lineStyle:{
                  color: '#ddd'
                }
              },
              splitLine:false

            }
          ],
          yAxis : [
            {
              type : 'value',
              axisTick: {
                show: false,
              },
              axisLabel:{
                show:false
              },
              splitLine:false,
              axisLine:{
                lineStyle:{
                  color: '#ddd'
                }
              },
            }
          ],
          series : [
            {
              type:'bar',
              barWidth: '24px',
              data:this.aqXseris,
              itemStyle: {
                normal: {
                  color: function (params) {
                    var colorList = ['#EE4477', '#F28943', '#FF585B', '#79C269'];
                    return colorList[params.dataIndex];
                  }
                }
              },
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
            }
          ]
        })
        this.aqEchart.on("click", this.eConsole);
      },
      eConsole(params){
        console.log(params)
        //window.locatio
        window.open('/#/classCenter/dataStatisticsAq/'+this.classDetailInfo.courseArrangeId+'?type='+params.dataIndex,'_blank')
        //window.open('/#/youboCenter/aqStatistics/'+this.selectClass.classId+'?type='+params.dataIndex,'_blank')
      },
      getCourseList(){
        Request.ajax('getCourseArranges',{
          token:this.techLoginInfo.token,    //
          teacherId:this.techLoginInfo.eduUserId,
          courseplanName:this.courseName,
          finishStatus:0,
          pageSize:8,
          currentPage:this.currentPage
        }).then((res)=>{
          if(res && res.state == 'success'){
            if(res.data!=null){
              this.selectClassIndex = 0
              this.classList = res.data.result
              this.totalRecord = res.data.total
              this.$nextTick(function () {
                setTimeout(()=>{
                  this.scrollRefresh = !this.scrollRefresh;
                },100)
              })
              if(res.data.result.length>0){
                this.updateSelectClassInfo({
                  selectClassInfo:res.data.result[0]
                })
              }
            }else{
              this.classList = []
            }
          }else{
            this.webApi.alert('服务器异常，请重试～')
          }

        })
        /*setTimeout(()=>{
          this.classList = [{"courseArrangeId": "0b4db5b443e211e9aa3af8b156c7e183", "courseplanName": "123456","endDate": 1552320000000},{ "courseArrangeId": "1433280b35a111e99750f8b156c7e183", "courseplanName": "96385241", "endDate": 1551196800000}]
        },500)*/
      },
      listenCourseName(){   //监听搜索框值改变
        if(!this.webApi.trim(this.$refs.searches.value)){
          this.currentPage = 1
          this.getCourseList()
        }
      },
      getBbsCount(params){
        Request.ajax('classBbsCount',{
          token:this.techLoginInfo.token,
          classId:params
        }).then(res=>{
          if(res && res.state=='success'){
            this.bbsCountInfo = res.data
            this.aqXseris[0] = this.bbsCountInfo.resolved
            this.aqXseris[1] = this.bbsCountInfo.unanswered
            this.aqXseris[2] = this.bbsCountInfo.replied
            this.aqXseris[3] = this.bbsCountInfo.asked
            this.drawAq()
          }else{
            this.webApi.alert(res.msg)
          }
        })
      },
      sizeChange(val){
        this.currentPage = val
        this.getCourseList()
      },
      prevSize(){
        this.currentPage--
        this.getCourseList()
      },
      nextSize(){
        this.currentPage++
        this.getCourseList()
      },
      changeStyleType(){
        this.scrollRefresh = !this.scrollRefresh
      },
      enterClass(params,index){
        this.changeClassDetail(params,index)
        sessionStorage.setItem("store",JSON.stringify(this.$store.state))
        window.open("#/classCenter/classCenterIndex/"+params.courseArrangeId, "_blank")
      },
      changeClassDetail(params,index){
        if(this.selectClassIndex == index){
          return
        }
        this.updateSelectClassInfo({
          selectClassInfo:params
        })
        //this.getBbsCount(params.courseArrangeId)
        this.selectClassIndex = index
      }
    }
  }
</script>

<style lang="stylus">
  .classManage-wrap
    background #f9fafb
    width 100%
    height 100%
    padding 20px
    display flex
    flex-direction column
    .flip-enter-active {
      transition: all .3s cubic-bezier(0.55, 0.085, 0.68, 0.53); //ease-in-quad
    }
    .flip-leave-active {
      transition: all .35s cubic-bezier(0.25, 0.46, 0.45, 0.94); //ease-out-quad
    }
    .flip-enter, .flip-leave-to {
      transform: scaleX(0) translateZ(0);   //scaleY(0) translateZ(0);
      opacity: 0;
    }
    .header-wrap
      height 60px
      font-size 18px
      color #2F344A
      .el-select
        color #2f344a
        .el-input--suffix
          .el-input__inner
            border none
            background none
            width 150px
            font-size 22px
            font-weight bold
        .el-input
          .el-select__caret
            font-size 18px
            color #2f344a
    .content
      width 100%
      flex 1
      overflow hidden
      .youbo-big-wrap
        width 100%
        height 100%
    .mianshou-content
      flex 1
      display flex
      width 100%
      height 100%
      overflow hidden
      .content-left
        flex: 1 1 auto;
        display flex
        flex-direction column
        border-radius 4px
        background #fff
        padding-bottom 20px
        .left-head
          height 60px
          border-bottom 1px solid #F5F5F5
          .text-wrap
            width 100px
            float: left
            margin-left 15px
            line-height 60px
            font-size 16px
            color #2F344A
          .search-wrap
            position: relative
            top: 16px
            right: 0
            bottom: 0
            left: 10px
            width: 300px
            float: left
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
          .changeStyle-wrap
            float: right
            margin-right 40px
            margin-top 12px
            .el-radio-button__inner
              padding 0
              border-radius 0
              border 1px solid #eee
              .div-usual
                width 34px
                height 34px
              .div-a
                background url("../../assets/img/icon_image.png") no-repeat -125px -78px
              .div-b
                background url("../../assets/img/icon_image.png") no-repeat -123px -37px
            .el-radio-button__orig-radio:checked+.el-radio-button__inner
              background #eee
              border 1px solid #eee
        .left-content
          flex 1
          width 100%
          overflow hidden
          .has-no-data
            .img-wrap
              text-align center
              margin-top 200px
              .img-no
                width 196px
                height 190px
            .no-text
              margin-top 20px
              text-align center
              font-size 14px
              color #333
          .scroll
            .el-pagination
              text-align center
              margin-top 20px
            .ul-wrap
              overflow hidden
              padding-left 5px
              .li-wrap:hover
                transform: scale(1.02);
              &.ul-wrap-vertical
                .li-wrap
                  width 250px
                  height 305px
                  border 1px solid #E9E9E9
                  box-shadow none
                  .li-left
                    width 250px
                    height 135px
                    .img-wrap
                      margin 0
                      .img-c
                        width 250px
                        height 135px
                  .li-right
                    width 250px
                    .a-wrap
                      margin-top 20px
                    .endtime-wrap
                      margin-top 15px
              .li-wrap
                width 540px;
                transition transform 0.3s ease-out
                box-sizing border-box
                box-shadow 0px 6px 8px 1px rgba(97,97,97,0.06)
                height 180px;
                border-radius 4px
                cursor pointer
                overflow hidden
                float: left
                margin 8px 20px 10px 10px
                .li-left
                  width 270px
                  height 180px
                  float: left
                  .img-wrap
                    margin 18px 0 0 4px
                    .img-c
                      width 270px
                      height 145px
                .li-right
                  float: left
                  width 268px
                  overflow hidden
                  .title-wrap
                    padding 0 15px
                    margin-top 25px
                    color #333
                    font-size 16px
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                  .subject-name-wrap
                    font-size 12px
                    color #93999F
                    margin-top 6px
                    padding-left 15px
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                  .a-wrap
                    margin-top 20px
                    margin-left 15px
                    .enterClass
                      display inline-block
                      width 95px
                      height 25px
                      line-height 25px
                      background:rgba(255,212,224,1);
                      border-radius:13px;
                      text-align center
                      font-size 14px
                      color #FF366D
                  .endtime-wrap
                    margin-top 16px
                    padding 0 5px
                    .endtime-p
                      border-top 1px solid #f5f5f5
                      font-size 12px
                      padding-left 10px
                      color #93999F
                      line-height 32px
                &.active
                  border 1px solid #e9e9e9
                  .title-wrap
                    color #ff366d
      .content-right
        width 510px
        background #fff
        margin-left 20px
        flex: 0 0 auto;
        display flex
        flex-direction column
        .right-head
          height 60px
          border-bottom 1px solid #F5F5F5
          padding-left 30px
          line-height 60px
          color #2F344A
          font-size 18px
        .right-content
          flex 1
          overflow hidden
          .c-wrap
            height 100%
            overflow auto
            .title-wrap
              height 50px
              padding-top 20px
              .p-wrap
                font-size 16px
                color #333
                font-weight bold
                padding-left 20px
                line-height 30px
                .check-a
                  float right
                  margin-right 20px
                  color #FF366D
                  font-size 12px
            .rencent-wrap,.courseComplete-wrap,.answer-report
              width 450px
              margin 20px auto 0
              box-shadow:0px 6px 8px 1px rgba(97,97,97,0.06);
              border-radius:4px;
            .rencent-wrap
              height 280px
              .today-p
                margin-top 10px
              .today-p,.next-p
                color #FF366D
                font-size 14px
                margin-bottom 5px
              .today-wrap,.next-wrap
                padding 0 20px
                height 100px
                font-size 14px
                color #333
                line-height 28px
                .nodata
                  color #666
            .courseComplete-wrap
              height 250px
              .courseCompletePie
                width 150px
                height 150px
                margin 18px 0 0 75px
            .answer-report
              height 300px
              margin-bottom 30px
              .aq-echart
                height 200px
              .answer-number
                font-size 12px
                padding-left 23px
                margin-top 10px
                color #333
              .answer-ul
                width 400px
                margin 20px auto 0
                .answer-li
                  width 100px
                  float: left
                  cursor pointer
                  .progressBar
                    width 72px
                    height 72px
                    margin 0 auto
                    .circles-wrap
                      .circles-integer
                        font-size 14px
                  .num-p
                    margin-top 5px
                    text-align center
                    font-size 14px
                    color #666
  .ffff
    width 100%
</style>
