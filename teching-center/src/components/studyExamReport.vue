<template>
  <div class="AssessmentPropContainer">
    <div v-show="questionAnswerReportData==''">
      <iLoading></iLoading>
    </div>
    <div v-show="questionAnswerReportData" class="AssessmentMain">
      <div class="AssessmentContainer">
        <div class="AssessmentCanvas">
          <!--/* 作答成绩 */-->
          <div class="AssessmentCanvasItem">
            <div class="AssessmentCanvasBox">
              <canvas id="examresultsTwo" width="220px" height="220px"/>
              <div class="AssessmentCanvasText">
                <big>
                  {{questionAnswerReportData.answerScore}}
                </big>
                <span>分</span>
              </div>
            </div>
            <h5 class="AssessmentCanvasTitle">作答成绩</h5>
          </div>
          <!--{/* 正确率 */}-->
          <div class="AssessmentCanvasItem">
            <div class="AssessmentCanvasBox">
              <canvas id="correctness2" width="220px" height="220px"/>
              <div class="AssessmentCanvasText">
                <big>
                  {{((questionAnswerReportData.questionCount - questionAnswerReportData.misCount) / questionAnswerReportData.questionCount * 100).toFixed(0)}}
                </big>
                <span>%</span>
              </div>
            </div>
            <h5 class="AssessmentCanvasTitle">正确率</h5>
          </div>
          <!--{/* 作答时间 */}-->
          <div class="AssessmentCanvasItem">
            <div class="AssessmentCanvasBox">
              <canvas id="answertime2" width="220px" height="220px"/>
              <div class="AssessmentCanvasText">
                    <span>
                        {{Math.floor(questionAnswerReportData.totalTime / 60)}}分{{questionAnswerReportData.totalTime % 60}}秒
                    </span>
              </div>
            </div>
            <h5 class="AssessmentCanvasTitle">作答时间</h5>
          </div>
        </div>

        <div class="AssessmentResult">
          <div class="AssessmentResultTitle">
            <span class="AssessmentResultTitleItem">
                <span class="AssessmentResultTitleBlock AssessmentResultTitleCorrect"></span>
                <span class="AssessmentResultTitleText">正确</span>
            </span>
            <span class="AssessmentResultTitleItem">
                <span class="AssessmentResultTitleBlock AssessmentResultTitleRrror"></span>
                <span class="AssessmentResultTitleText">错误</span>
            </span>
          </div>
          <div class="AssessmentResultContainer">
            <span :class="['AssessmentResultItem',item.correctFlag?'AssessmentResultItemCorrect':'AssessmentResultItemError']" v-for="(item,index) in questionAnswerReportData.questionAnswerList" >{{index + 1}}</span>
          </div>
        </div>

        <div class="AssessmentButtonGroup">
          <button class="abtn1" @click="onParsingClickHandle">查看解析</button>
          <!--<button class="abtn1" @click="onParsingOfErrorClickHandle">查看错题解析</button>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import {mapState} from 'vuex'
  import iLoading from '@/components/i-loading'
  import Request from '@/request'
  export default {
    name: "studyExamReport",
    data(){
      return{
        urlSearch: {},  // url 参数保存
        questionAnswerReportData:''
      }
    },
    components:{
      iLoading
    },
    props:{
      studentInfo:{
        type:Object
      }
    },
    computed:{
      ...mapState({
        envType:state => state.global.envType,
      }),
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))}
    },
    mounted(){
      this.getReportData()
    },
    methods:{
      getArcConfig() { // 获取 canvas 背景圆的数据
        return  [
          {
            size: 99,
            color: '#fff6ef'
          },
          {
            size: 90,
            color: '#ffffff'
          },
          {
            size: 75,
            color: '#f2f2f2'
          },
          {
            size: 73,
            color: '#ffffff'
          }
        ]
      },
      getReportData(){
        axios.post('https://'+(this.envType=='1'?'apitikudemo':'apitiku')+'.zbgedu.com/interface/question/v1/selectTestPaperAnswerReport',
          {
            teacherToken:this.techLoginInfo.token,
            memberId:this.studentInfo.memberId||this.studentInfo.studentId,
            studentTestpaperId:this.studentInfo.studentTestPaperId,
            //testPaperType:3
          }).then(res => {
          if(res && res.state == 'success'){
            this.questionAnswerReportData = res.data
            this.canvasExamresults()
            this.canvasCorrectness()
            this.canvasAnswertime()
          }else{
            this.webApi.alert('服务器异常，请稍后重试~')
          }
        })
      },
      onCloseHistory(e) { // 关闭
        console.log(e)
        e.preventDefault();
        this.props.onCloseHistory()
      },
      onParsingClickHandle() { // 查看解析
        /*let data = this.questionAnswerReportData;
        const {token,memberId} = this.techLoginInfo;
        data.isParsing = 1
        data.id = data.testPaperId
        console.log(data)
        this.webApi.source('exam',{...data,token,memberId})*/
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
          taskId:this.questionAnswerReportData.taskId
        }).then(res=>{
          if(res.state == 'success'){
            this.frameUrl = 'https://'+str+'.zbgedu.com/preview?question=paperInfoPreview&type='+(res.data.itemId==1?'acca':'cma')+'&value='+res.data.examenId+ '&id=' + this.techLoginInfo.token+'&agent=0';
            window.open(this.frameUrl)
          }else{
            this.$api.alert('服务器异常，请重试~')
          }
        })
      },
      onParsingOfErrorClickHandle() { // 查看错题解析
        let data = this.questionAnswerReportData;
        const {token,memberId} = this.techLoginInfo;
        data.checkErrorQuestion = 1
        data.id = data.testPaperId
        this.webApi.source('exam',{...data,token,memberId})
      },
      canvasExamresults() { // 得分情况 canvas 绘制
        let canvas = document.getElementById('examresultsTwo');
        if (!canvas) return;

        let ctx = canvas.getContext("2d");

        let x = 110;
        let y = 110;
        let anticlockwise = true;
        let startAngle = 0;
        let endAngle = Math.PI*2;

        let configArc = this.getArcConfig();

        for (let i=0; i<configArc.length; i++) {
          ctx.fillStyle = configArc[i].color;
          ctx.beginPath();
          let radius = configArc[i].size;
          ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
          ctx.closePath();
          ctx.fill();
        }

// 计算得分百分比
        let percentage = (this.questionAnswerReportData.answerScore / this.questionAnswerReportData.score).toFixed(0);

// 百分比圆绘制
        let startAngle2 = Math.PI*((1 - percentage) * 2);
        let endAngle2 = 0;

        let gradient=ctx.createLinearGradient(0,0,170,0);
        gradient.addColorStop("0","#fa742b");
        gradient.addColorStop("1","#ffe985");

        ctx.strokeStyle = gradient;
        ctx.lineCap = 'round';
        ctx.lineWidth = 8;

        ctx.beginPath();
        ctx.arc(x, y, 60, startAngle2, endAngle2, false);
        ctx.stroke();
      },

      canvasCorrectness() { // 正确率 canvas 绘制
        let canvas = document.getElementById('correctness2');
        if (!canvas) return;

        let ctx = canvas.getContext("2d");

        let x = 110;
        let y = 110;
        let anticlockwise = true;
        let startAngle = 0;
        let endAngle = Math.PI*2;

        let configArc = this.getArcConfig();
        configArc[0].color = '#f3f8fe';

        for (let i=0; i<configArc.length; i++) {
          ctx.fillStyle = configArc[i].color;
          ctx.beginPath();
          let radius = configArc[i].size;
          ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
          ctx.closePath();
          ctx.fill();
        }

// 计算百分比
        let percentage = ((this.questionAnswerReportData.questionCount - this.questionAnswerReportData.misCount) / this.questionAnswerReportData.questionCount).toFixed(2);
        percentage = percentage == '0.00' ? 1 : percentage;

// 百分比圆绘制
        let startAngle2 = Math.PI*((1 - percentage) * 2);
        let endAngle2 = 0;

        let gradient=ctx.createLinearGradient(0,0,170,0);
        gradient.addColorStop("0","#736efe");
        gradient.addColorStop("0.75","#5efce8");

        ctx.strokeStyle = gradient;
        ctx.lineCap = 'round';
        ctx.lineWidth = 8;

        ctx.beginPath();
        ctx.arc(x, y, 60, startAngle2, endAngle2, false);
        ctx.stroke();
      },

      canvasAnswertime() { // 作答时间 canvas 绘制
        let canvas = document.getElementById('answertime2');
        if (!canvas) return;

        let ctx = canvas.getContext("2d");

        let x = 110;
        let y = 110;
        let anticlockwise = true;
        let startAngle = 0;
        let endAngle = Math.PI*2;

        let configArc = this.getArcConfig();
        configArc[0].color = '#f3fcf5';

        for (let i=0; i<configArc.length; i++) {
          ctx.fillStyle = configArc[i].color;
          ctx.beginPath();
          let radius = configArc[i].size;
          ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
          ctx.closePath();
          ctx.fill();
        }

// 百分比圆绘制
        let startAngle2 = Math.PI*2;
        let endAngle2 = 0;

        let gradient=ctx.createLinearGradient(0,0,170,0);
        gradient.addColorStop("0","#58cffb");
        gradient.addColorStop("1","#f0ff00");

        ctx.strokeStyle = gradient;
        ctx.lineCap = 'round';
        ctx.lineWidth = 8;

        ctx.beginPath();
        ctx.arc(x, y, 60, startAngle2, endAngle2, false);
        ctx.stroke();
      }
    }
  }
</script>

<style lang="stylus">
  .AssessmentProp {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,.4);
    z-index: 100;
    .AssessmentContainer{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      background: #fff;
      .AssessmentResultContainer {
        padding: 0 20px;
      }

      .AssessmentTitle {
        position: relative;
        height: 50px;
        line-height: 50px;
        font-size: 18px;
        font-weight: bold;
        background: #f5f5f5;
        padding-left:20px;
      }

      .AssessmentPropsTitleClose {
        width: 50px;
        height: 50px;
        position: absolute;
        top: 0;
        right: 0;
        background: url("../assets/img/icon_image.png") no-repeat center 18px;
        cursor: pointer;
      }
    }
  }
  .AssessmentPropContainer {
    .AssessmentReturn {
      height: 62px;
      line-height: 62px;
      &-button {
        width: 82px;
        height: 62px;
        background: url("../assets/img/icon_image.png") no-repeat 12px center;
        text-indent: 30px;
        font-size: 14px;
        color: #333333;
        cursor: pointer;
      }
    }
    .AssessmentMain {
      width: 100%;
      border-radius: 10px;
      box-shadow: 0px 0px 35px 0px rgba(0, 0, 0, 0.06);
      padding: 30px 35px;
    }
    .AssessmentContainer {
      border-radius: 6px;
      padding-bottom: 50px;
    }
    AssessmentTitle {
      height: 50px;
      line-height: 50px;
      background-color: #f5f5f5;
      color: #333333;
      font-size: 18px;
      text-align: center;
      font-weight: bold;
      margin: 0;
    }
    .AssessmentCanvas {
      display: flex;
      width: 745px;
      margin: 25px auto 40px;
      .AssessmentCanvasItem:nth-child(2) {
        margin: 0 40px;
      }
      .AssessmentCanvasBox {
        position: relative;
        font-size: 0;
      }
      .AssessmentCanvasText {
        color: #333333;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        big {
          font-size: 30px;
        }
        span {
          font-size: 20px;
        }
      }
      .AssessmentCanvasTitle {
        text-align: center;
        font-size: 16px;
        color: #333333;
      }
    }
    .AssessmentResult {
      .AssessmentResultTitle {
        text-align: center;
        margin-bottom: 35px;
        .AssessmentResultTitleItem {
          font-size: 0;
          height: 12px;
          margin-right: 30px;
        }
        .AssessmentResultTitleBlock {
          display: inline-block;
          width: 12px;
          height: 12px;
          background-color: #f0f0f0;
          border-radius: 2px;
          margin-right: 5px;
          vertical-align: middle;
        }
        .AssessmentResultTitleCorrect {
          background-color: #76ccaf;
        }
        .AssessmentResultTitleRrror {
          background-color: #e5605d;
        }
        .AssessmentResultTitleFlag {
          background: #f0f0f0 url("../assets/img/icon_image.png") no-repeat left top 6px;
        }
        .AssessmentResultTitleText {
          display: inline-block;
          vertical-align: middle;
          font-size: 12px;
          color: #666666;
        }
      }
      .AssessmentResultContainer {
        width: 840px;
        margin: 0 auto 35px;
        overflow: auto;
        max-height: 200px;
        padding-left: 50px;
      }
      .AssessmentResultItem {
        display: inline-block;
        width: 28px;
        height: 28px;
        line-height: 28px;
        border-radius: 4px;
        text-align: center;
        color: #fff;
        font-size: 12px;
        margin-right: 30.5px;
        margin-bottom: 27px;
        .AssessmentResultItem:nth-child(15n) {
          margin-right: 0;
        }
        .AssessmentResultItemFlag {
          background-image: url("../assets/img/icon_image.png");
          background-repeat: no-repeat;
          background-position: left top;
        }
      }
      .AssessmentResultItemCorrect {
        background-color: #76ccaf;
      }
      .AssessmentResultItemError {
        background-color: #fb6e74;
      }
    }
    .AssessmentButtonGroup {
      text-align: center;
      .abtn1 {
        margin-right: 56px;
        width:96px;
        height:32px;
        border:1px solid rgba(253,170,41,1);
        border-radius:4px;
        color:#FDAA29;
        font-size: 12px;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
      }
    }

    &-record {
      width: 100%;
      border-radius: 10px;
      background-color: #fff;
      box-shadow: 0px 0px 35px 0px rgba(0, 0, 0, 0.06);
      margin-top: 20px;
      padding: 30px 35px;

      img {
        display: inline-block
      }
    }
  }

</style>



