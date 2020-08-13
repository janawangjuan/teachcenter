<template>
  <div class="overallReport-wrap">
    <div class="overallReport-left">
      <div class="left-top">
        <div class="usual-compeleted">
          <div class="u-c-title-wrap">
            <div class="u-c-title">总体完成情况</div>
          </div>
          <p class="text-p">学员总人数：42人</p>
          <div class="u-c-left">
            <p class="text-p">课程任务数：共17个视频任务</p>
            <p class="text-p">测评任务数：共8套测评任务</p>
            <p class="text-p">练习任务数：共8套练习任务</p>
            <p class="text-p">直播任务数：共3场直播任务</p>
          </div>
          <div class="u-c-right">
            <p class="text-p">观看视频总用时：24h12m9s</p>
            <p class="text-p">测评总用时：24h12m9s</p>
            <p class="text-p">练习总用时：24h12m9s</p>
            <p class="text-p">本周学习总用时：24h12m9s</p>
          </div>
        </div>
        <div class="usual-compeleted fr">
          <div class="u-c-title-wrap">
            <div class="u-c-title">平均完成情况</div>
          </div>
          <p class="text-p">平均完成率：20%</p>
          <div class="u-c-left">
            <p class="text-p">课程任务：平均完成11个任务</p>
            <p class="text-p">测评任务：平均完成2套测评任务</pv>
            <p class="text-p">练习任务：平均完成3套练习任务</p>
            <p class="text-p">直播任务：平均观看2场直播</p>
          </div>
          <div class="u-c-right">
            <p class="text-p">观看视频平均用时：24h12m9s</p>
            <p class="text-p">测评平均用时：24h12m9s</p>
            <p class="text-p">练习平均用时：24h12m9s</p>
            <p class="text-p">本周学习平均用时：24h12m9s</p>
          </div>
        </div>
      </div>
      <div class="left-bottom">
        <div class="l-b-content" v-if="showCompeletChart">
          <div class="l-b-title">
            <div class="title-left">任务用时图表</div>
            <div class="title-right">任务完成图表</div>
          </div>
          <div class="chart-wrap">
            <div id="time-chart" class="time-chart"></div>
          </div>
        </div>
        <div class="l-b-content"v-else></div>
      </div>
    </div>
    <div class="overallReport-right">
      <div class="content-right-content">
        <div class="content-right-title">
          <div class="title-left"><i class="icon-zhuangyuan"></i>状元榜</div>
          <div class="title-right"><el-select v-model="practiceType" size="small">
            <el-option :value="'1'" label="全部练习"></el-option>
            <el-option :value="'2'" label="已学习"></el-option>
            <el-option :value="'3'" label="未学习"></el-option>
          </el-select></div>
        </div>
        <div class="content-right-main">
          <iScroll :is-refresh="scrollRefresh">
            <ul class="rank-ul">
              <li class="rank-li" v-for="(item,index) in rankList">
                <div class="left">
                  <div class="avater-wrap">
                    <img class="avater-img" src="http://eximg.zbgedu.com/upload/avatar/big_0.png" alt="default">
                  </div>
                  {{item.name}}
                </div>
                <div class="right">
                  <template v-if="index>2">{{index+1}}</template>
                  <template v-else>
                    <div class="jiangbei" :class="[{first:index==0},{second:index==1},{third:index==2}]"></div>
                  </template>
                </div>
              </li>
            </ul>
          </iScroll>
        </div>
        <div class="student-num-wrap">共120位学员，还有20位学员未开启学习进程！</div>
      </div>
    </div>
  </div>
</template>

<script>
  import iScroll from '@/components/i-scroll'

  export default {
    name: "overallReport",
    components:{
      iScroll
    },
    data(){
      return{
        showCompeletChart:true,
        scrollRefresh:true,
        practiceType:"1",
        rankList:[{name:'小二黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'}]
      }
    }
  }
</script>

<style lang="stylus">
  .overallReport-wrap
    width 100%
    height 100%
    padding-top 20px
    display flex
    .overallReport-left
      flex 1
      .left-top
        height 320px
        background #fff
        border-radius 4px
        .usual-compeleted
          float: left
          margin-left 30px
          &.fr
            float: left
            margin-left 50px
          .text-p
            font-size 14px
            color #333
            margin-bottom 20px
          .u-c-title-wrap
            margin-top 24px
            margin-bottom 30px
            .u-c-title
              width 110px
              height 25px
              background #FFB861
              border-radius 13px
              color #fff
              font-size 12px
              text-align center
              line-height 25px
          .u-c-left
            float: left
            margin-right 10px
          .u-c-right
            float: left
      .left-bottom
        height 540px
        background #fff
        border-radius 4px
        margin-top 30px
        .l-b-content
          .l-b-title
            line-height 25px
            .title-left
              float: left
              margin-top 40px
              margin-left 30px
              font-size 18px
              color #333
            .title-right
              float: right
              margin-right 50px
              width 125px
              height 25px
              font-size 14px
              line-height 25px
              text-align center
              background #ffd4e0
              color #ff366d
              border-radius 13px
              margin-top 40px
    .overallReport-right
      width 315px
      margin-left 20px
      background #fff
      border-radius 4px
      .content-right-content
        display flex
        height 100%
        padding-bottom 40px
        flex-direction column
        .content-right-title
          height 70px
          font-size 12px
          color #333
          line-height 70px
          .title-left
            float left
            font-weight bold
            .icon-zhuangyuan
              display inline-block
              width 16px
              height 16px
              margin 27px 7px 0 27px
              background url("../../assets/img/icon_image.png") no-repeat -638px -143px
              float left
          .title-right
            float right
            height 70px
            width 100px
            margin-right 28px
            .el-select
              .el-input
                height 50px
              .el-input--small
                .el-input__inner
                  height 28px
                  line-height 28px
        .content-right-main
          flex 1
          overflow hidden
          position relative
          .rank-ul
            padding-bottom 20px
            .rank-li
              height 45px
              line-height 45px
              .left
                float left
                font-size 14px
                color #666
                .avater-wrap
                  float left
                  margin-left 25px
                  margin-right 10px
                  padding-top 7px
                  height 38px
                  .avater-img
                    width 32px
                    height 32px
              .right
                float right
                width 30px
                font-size 14px
                font-weight bold
                height 45px
                text-align center
                margin-right 20px
                color #666
                .jiangbei
                  width 20px
                  height 24px
                  margin-left 5px
                  margin-top 10px
                .first
                  background url("../../assets/img/icon_image.png") no-repeat -638px -231px
                .second
                  background url("../../assets/img/icon_image.png") no-repeat -638px -200px
                .third
                  background url("../../assets/img/icon_image.png") no-repeat -638px -167px
        .student-num-wrap
          position: absolute;
          bottom: 20px;
          padding-left 12px
          height 38px
          width 315px;
          box-shadow:0px 0px 10px 0px rgba(0, 0, 0, 0.05);
          line-height 38px
          color:#333;
          font-size 12px
  .j
    width 0
</style>
