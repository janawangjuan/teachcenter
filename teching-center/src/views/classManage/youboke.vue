<template>
  <div class="youbo-wrap">
    <div class="youbo-head">
      <div class="text-wrap">我的班级</div>
      <div class="search-wrap">
        <input class="ac-search" type="text" v-model="listenCourseName" placeholder="输入您要寻找的班级名称">
        <a class="ac-search-a" href="javascript:;" @click="search"><i class="iconfont icon-sousuo"></i></a>
      </div>
      <!--<div class="changeStyle-wrap" @click="changeClassType">
        {{classType?'往期班级课程':'返回班级列表'}}
      </div>-->
    </div>
    <div class="youbo-content">
      <div class="going-class-wrap" v-if="classType">
        <div class="going-left">
          <div v-if="classList" style="height: 100%; overflow: hidden">
            <div v-if="classList.length>0" style="height: 100%">
              <iScroll id="youboContentScroll1" :is-refresh="scrollRefresh">
                <ul class="wrap-ul">
                  <li :class="['wrap-li','wrap-li'+index,item.classId==selectClass.classId?'active':'']" @click="changeClass(item)" v-for="(item,index) in classList" :key="index">
                    <div class="li-left">
                      <div class="li-left-l">
                        <div class="img-wrap">
                          <img class="class-img" :src="item.bigCoverPath?'http://eximg.zbgedu.com'+item.bigCoverPath:'/static/flippedClassBg.png'" alt="" />
                          <div class="shadow-wrap"><span class="ml10">开课中</span></div>
                        </div>
                        <div class="text-wrap">
                          <p class="className">{{item.className}}</p>
                          <p class="timeline">班级有效期：{{webApi.formatDate(item.startTime,'YMD')}}至{{webApi.formatDate(item.endTime,'YMD')}}</p>
                          <p class="student-num"><i></i>学员数量：{{item.studentNum}}人</p>
                          <p class="item-cretifacate-wrap">项目：{{item.categoryName}} <span class="ml20">&nbsp;&nbsp;&nbsp;科目：{{item.subjectName}}</span></p>
                        </div>
                      </div>
                      <div class="li-left-r">
                        <div class="li-left-r-t">
                          <div v-if="item.openCourseState!='-1'">
                            <span v-if="item.openCourseState=='1'"><i class="isLive-icon"></i>正在直播</span>
                            <span v-else>下次直播时间：{{webApi.formatDate(item.openCourseStartTime,'ALL')}}</span>
                          </div>
                        </div>
                        <div class="li-left-r-b">
                          <div class="enter-btn" @click="enterClass(item)">进入班级</div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="pagination-wrap">
                  <el-pagination
                    background
                    layout="prev, pager, next, total"
                    :pageSize="pageSize"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :total="totalCount">
                  </el-pagination>
                </div>
              </iScroll>
            </div>
            <div v-else>
              <div class="has-no-data">
                <div class="img-wrap">
                  <img class="img-no" src="../../assets/img/class-nodata.png" alt="暂无内容">
                </div>
                <p class="no-text">暂无内容</p>
              </div>
            </div>
          </div>
          <div v-else>
            <iLoading></iLoading>
          </div>
        </div>
        <div class="going-right" v-if="classList&&classList.length>0">
          <iScroll id="youboContentRightScroll" :is-refresh="scrollRefresh1">
            <div class="going-right-content">
              <div class="go-r-title">
                <p class="go-r-t-p usual-title">{{selectClass.courseName}}</p>
              </div>
              <div class="live-wrap"  v-if="openCourseList&&openCourseList.length>0">
                <div class="live-wrap-title usual-title">直播预告</div>
                <div class="live-list-wrap">
                  <ul class="live-ul">
                    <li class="live-li" v-for="(item,index) in openCourseList">
                      <div class="live-li-left">
                        <div class="live-img-wrap">
                          <img style="width: 110px;height: 64px" :src="'http://eximg.zbgedu.com'+item.liveCover" alt="直播背景图">
                        </div>
                        <div class="live-status" v-if="item.isNow=='1'">直播中</div>
                      </div>
                      <div class="live-li-right">
                        <div class="l-l-r-top">{{item.title}}</div>
                        <div class="l-l-r-bottom">开始时间：{{webApi.formatDate(item.startTime,'ALL')}}</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="aq-wrap">
                <div class="aq-title usual-title">
                  答疑报告
                  <!--<span class="aq-go-detail">查看详情&nbsp;&nbsp;&gt;&gt;</span>-->
                </div>
                <div class="aq-content">
                  <div class="aq-c-data">问题总数：{{aqData.all_count}}</div>
                  <div class="aq-echart" id="aqEchart">
                  </div>
                </div>
              </div>
              <div class="class-progress-wrap" v-if="courseProgress">
                <div class="c-p-w-title usual-title">课程进度</div>
                <div class="c-p-w-current">本周：第{{courseProgress.currWeekIndex}}周</div>
                <div class="circle-wrap"><el-progress type="circle" :percentage="Number(Math.round((courseProgress.currWeekIndex/courseProgress.weekNum*100) * 100) / 100)" color="#6A76D9" :show-text="false" :width="90" :stroke-width="10"></el-progress></div>
                <div class="text-wrap">
                  <div class="text1">{{Number(Math.round((courseProgress.currWeekIndex/courseProgress.weekNum*100) * 100) / 100)}}%</div>
                  <div class="text2">进度</div>
                  <div class="text3">{{courseProgress.weekNum}}周</div>
                </div>
              </div>
            </div>
          </iScroll>
        </div>
      </div>
      <div class="gone-class-wrap" v-else>
        <iScroll id="youboContentScroll" :is-refresh="scrollRefresh">
          <ul class="wrap-ul" v-if="classList&&classList.length>0">
            <li class="wrap-li" v-for="(item,index) in classList" :key="index">
              <div class="li-left">
                <div class="li-left-l">
                  <div class="img-wrap">
                    <img class="class-img" src="/static/classImg.png" alt="" />
                    <div class="shadow-wrap"><span class="ml10">开课中</span></div>
                  </div>
                  <div class="text-wrap">
                    <p class="className">ACCA 优播课程</p>
                    <p class="timeline">班级有效期：{{webApi.formatDate(item.startTime,'ALL')}}</p>
                    <p class="student-num"><i></i>学员数量：20人</p>
                    <p class="item-cretifacate-wrap">项目：ACCA <span class="ml20">科目：AAA</span></p>
                  </div>
                </div>
                <div class="li-left-r">
                  <div class="li-left-r-t">
                    <!--<span v-if="false"><i class="isLive-icon"></i>正在直播</span>
                    <span v-else>下次直播时间：2019年08月20日</span>-->
                  </div>
                  <div class="li-left-r-b">
                    <div class="enter-btn">进入班级</div>
                  </div>
                  <div class="line-border"></div>
                </div>
              </div>
              <div class="li-right">
                <div class="li-right-l">
                  <div class="title">
                    <i class="title-icon"></i>汇总报告
                  </div>
                  <div class="num-content">
                    <p class="usual-p">问题总数：203</p>
                    <p class="usual-p">未回复：203</p>
                    <p class="usual-p">学员追问：203</p>
                    <p class="usual-p">预警问题：203</p>
                  </div>
                </div>
                <div class="li-right-r">
                  <div :id="'radderContent'+index" class="radderContent"></div>
                </div>
              </div>
            </li>
          </ul>
          <div v-else>
            <div class="has-no-data">
              <div class="img-wrap">
                <img class="img-no" src="../../assets/img/class-nodata.png" alt="暂无内容">
              </div>
              <p class="no-text">暂无内容</p>
            </div>
          </div>
        </iScroll>
      </div>

    </div>
  </div>
</template>

<script>
  import iScroll from '@/components/i-scroll'
  import echarts from 'echarts'
  import Request from '@/request'
  import iLoading from '@/components/i-loading'
  export default {
    name:'youboke',
    components:{
      iScroll,
      iLoading
    },
    computed : {
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))}
    },
    data(){
      return {
        listenCourseName:'',
        classList:'',
        state:'4',
        pageSize:5,
        pageNo:1,
        totalCount:0,
        openCourseList:'',
        scrollRefresh:false,
        scrollRefresh1:false,
        courseProgress:'',
        selectClass:'',
        currentClassIndex:'', //当前选中的班级序号
        aqData:'',
        aqXseris:[0,0,0,0],
        classType:true,   //true是进行中，false是往期
      }
    },
    mounted(){
      this.getClasses()
    },
    methods:{
      handleCurrentChange(params){
        this.pageNo = params
        this.getClasses()
      },
      handleSizeChange(params){
        this.pageSize = params
        this.pageNo = 1
        this.getClasses()
      },
      search(){
        this.getClasses()
      },
      changeClass(params){
        this.selectClass = params
        this.getOpenCourseList()
        this.getCourseProgress()
        this.getAqData()
      },
      enterClass(params){
        sessionStorage.setItem("store",JSON.stringify(this.$store.state))
        window.open("#/youboCenter/youboCenterIndex/"+params.classId, "_blank")
      },
      getClasses(){
        Request.ajax('getYouboClasses',{
          'token' : this.techLoginInfo.token,
          'state':this.state,
          'name':this.listenCourseName,
          'pageIndex':this.pageNo,
          'pageSize':this.pageSize
        }).then((res)=>{
          if(res && res.state == 'success'){
            this.classList = res.data.result||[]
            this.totalCount = res.data.total
            if(this.state==4){
              if(this.classList.length>0){
                this.selectClass = this.classList[0]
                this.getOpenCourseList()
                this.getCourseProgress()
                setTimeout(()=>{
                  this.getAqData()
                },100)

              }
            }
            this.$nextTick(()=>{
              this.scrollRefresh = !this.scrollRefresh;
            })
          }else{
            this.classList = []
            this.webApi.alert(res.msg||'服务器异常，请重试~')
          }
        })
      },
      getOpenCourseList(){  //获取直播预告
        console.log(this.selectClass)
        Request.ajax('openCourseTrailer',{
          'token' : this.techLoginInfo.token,
          'courseId':this.selectClass.courseId
        }).then((res)=>{
          if(res && res.state == 'success'){
            this.openCourseList = res.data
          }
          this.$nextTick(()=>{
            this.scrollRefresh1 = !this.scrollRefresh1;
          })

        })
      },
      getCourseProgress(){
        Request.ajax('getYouboCourseProgress',{
          'token' : this.techLoginInfo.token,
          'classId':this.selectClass.classId
        }).then((res)=>{
          if(res && res.state == 'success'){
            this.courseProgress = res.data
          }
          this.$nextTick(()=>{
            this.scrollRefresh1 = !this.scrollRefresh1;
          })

        })
      },
      changeClassType(){
        this.classType = !this.classType
        this.classList = ''
        if(this.classType){
          this.state = 1
          this.getClasses()
        }else{
          this.state = 0
          this.getClasses()
          for(let i = 0;i<3;i++){
            setTimeout(()=>{
              this.drawPie(i)
            },100)

          }
        }
      },
      getAqData(){  //classBbsCount
        Request.ajax('classBbsCount',{
          'token' : this.techLoginInfo.token,
          'classId':this.selectClass.classId
        }).then((res)=>{
          if(res && res.state == 'success'){
            this.aqData = res.data
            this.aqXseris[0] = this.aqData.resolved
            this.aqXseris[1] = this.aqData.unanswered
            this.aqXseris[2] = this.aqData.replied
            this.aqXseris[3] = this.aqData.asked
            this.drawAq()
          }
          this.$nextTick(()=>{
            this.scrollRefresh1 = !this.scrollRefresh1;
          })

        })
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
        window.open('/#/youboCenter/aqStatistics/'+this.selectClass.classId+'?type='+params.dataIndex,'_blank')
      },
      drawPie(params){
        const this_ = this;
        const chartPie = echarts.init(document.getElementById('radderContent'+params));
        chartPie.setOption({
          tooltip: {},
          legend: {
            data: [ '实际开销（Actual Spending）']
          },
          radar: {
            // shape: 'circle',
            name: {
              textStyle: {
                color: '#666',
                fontSize:'12px',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            indicator: [
              { name: '已解决', max: 30000},
              { name: '已回复', max: 38000},
              { name: '未回复', max: 52000},
              { name: '学员追问', max: 25000}
            ],
            radius: 40
          },
          series: [{
            type: 'radar',
            // areaStyle: {normal: {}},
            data : [
              {
                value : [ 28000, 31000, 42000, 21000],
                name : '实际开销（Actual Spending）'
              }
            ]
          }]
        })
      }
    }
  }
</script>

<style lang="stylus">
  .youbo-wrap
    width 100%
    height 100%
    background #fff
    display flex
    flex-direction: column;
    .pagination-wrap
      text-align center
      margin-top 20px
    .youbo-head
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
        margin-top 14px
        width 110px
        height 32px
        border-radius 4px
        background #FF658F
        line-height 32px
        text-align center
        font-size 14px
        color #fff
        cursor pointer
    .youbo-content
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
      .going-class-wrap
        height 100%
        display flex
        .going-left
          flex 1
          padding 20px 0
        .going-right
          width 420px
          margin 20px
          box-shadow:0px 0px 10px 0px rgba(97,97,97,0.15);
          border-radius:4px;
          overflow: hidden
          .going-right-content
            padding 0 20px
          .usual-title
            font-size 14px
            color #333333
            font-weight bold
          .go-r-title
            .go-r-t-p
              padding-top 10px
              line-height 44px
              border-bottom 1px solid #eee
          .class-progress-wrap
            margin-top 20px
            position relative
            padding-bottom 40px
            .c-p-w-current
              margin-top 10px
              font-size 12px
              color #666
            .circle-wrap
              text-align center
              margin-top 20px
            .text-wrap
              position absolute
              width 100%
              text-align center
              top 95px
              .text1
                font-size 14px
                color #333
              .text2
                font-size 12px
                color #666
              .text3
                font-size 12px
                color #333
                margin-top 35px
          .aq-wrap
            .aq-title
              height 40px
              line-height 40px
              margin-top 10px
            .aq-go-detail
              font-weight normal
              font-size 12px
              color #666666
              float: right
            .aq-content
              .aq-c-data
                font-size 12px
                color #666
              .aq-echart
                width 400px
                height 200px
          .live-wrap
            overflow hidden
            .live-wrap-title
              height 55px
              line-height 55px
            .live-list-wrap
              .live-ul
                overflow: hidden;
                max-height: 220px;
              .live-li
                overflow hidden
                margin-bottom 10px
                .live-li-left
                  position relative
                  float: left
                  border-radius 5px
                  overflow hidden
                  .live-img-wrap
                    width 110px
                    height 64px
                    background #000
                  .live-status
                    position absolute
                    left 0
                    top 0
                    width 56px
                    height 24px
                    line-height 24px
                    text-align center
                    background rgba(0,0,0,.6)
                    font-size 12px
                    color #FED203
                .live-li-right
                  margin-left 10px
                  float: left
                  width 260px
                  color #666
                  .l-l-r-top
                    font-size 14px
                    margin-top 5px
                    width 260px
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  .l-l-r-bottom
                    font-size 12px
                    margin-top 8px
  .wrap-ul
        padding 0 10px 10px 24px
        overflow hidden
        .wrap-li
          margin-top 10px
          float: left
          width 100%
          height 220px
          border 1px solid #fff
          box-shadow:0px 6px 8px 1px rgba(97,97,97,0.06)
          box-sizing border-box
          transition all ease 0.3s
          display flex
          &.wrap-li0
            margin-top 0px
          &.active
            border:1px solid rgba(255, 54, 109, 0.17);
            box-shadow:0px 0px 22px 2px rgba(255,54,109,0.06);
            color #ff366d !important;
            .li-left
              .li-left-l
                .text-wrap
                  color #ff366d
                  .className
                    color #ff366d
              .li-left-r
                .li-left-r-t
                  color #ff366d
          &:hover
            border:1px solid rgba(255, 54, 109, 0.17);
            box-shadow:0px 0px 22px 2px rgba(255,54,109,0.06);
            color #ff366d !important;
            .li-left
              .li-left-l
                .text-wrap
                  color #ff366d
                  .className
                    color #ff366d
              .li-left-r
                .li-left-r-t
                  color #ff366d
                .li-left-r-b
                  .enter-btn
                    cursor pointer
                    background: #ffd4e0;
                    color: #ff366d;
                    border 1px solid #ffd4e0;
          .li-left
            flex 1
            height 100%
            display flex
            .li-left-l
              flex 1
              display flex
              .img-wrap
                width 320px
                height 100%
                position: relative
                .shadow-wrap
                  position absolute
                  width 320px
                  height 24px
                  left 0
                  bottom 20px
                  background rgba(0,0,0,0.3)
                  line-height 24px
                  font-size 12px
                  color #fff
                  .ml10
                    margin-left: 10px
                .class-img
                  width 320px
                  height 175px
                  margin-top 23px
              .text-wrap
                flex 1
                font-size 12px
                color #666
                margin-left 20px
                min-width 200px
                .className
                  font-size 16px
                  color #333
                  margin-top 35px
                .timeline
                  margin-top 5px
                .student-num
                  margin-top 8px
                .item-cretifacate-wrap
                  margin-top 60px
                  font-size 14px
            .li-left-r
              width 250px
              padding-right 25px
              position relative
              .line-border
                position absolute
                right 0
                top 15px
                width 1px
                height 190px
                background #EEEEEE
              .li-left-r-t
                height 50px
                text-align right
                font-size 14px
                color #333
                margin-top 30px
                .isLive-icon
                  display inline-block
                  background #000
                  width 18px
                  height 18px
                  margin-right 10px
                  position relative
                  top 4px
              .li-left-r-b
                margin-top 70px
                .enter-btn
                  float: right
                  width  110px
                  height 40px
                  line-height 40px
                  border 1px solid #d1d1d1
                  background #fff
                  font-size 14px
                  color #333
                  text-align center
                  border-radius 20px
          .li-right
            width 450px
            .li-right-l
              width 170px
              float: left
              height 100%
              .title
                padding-top 15px
                padding-left 20px
                height 65px
                line-height 50px
                font-size 14px
                color #333333
                font-weight bold
                .title-icon
                  display inline-block
                  width 18px
                  height 18px
                  position relative
                  top 3px
                  margin-right 4px
              .num-content
                .usual-p
                  padding-left 40px
                  line-height 26px
                  font-size 12px
                  color #666
            .li-right-r
              width 280px
              height 100%
              float: left
              .radderContent
                width 200px
                height 200px



  .jj
    width 0
</style>
