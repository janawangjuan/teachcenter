<template>
  <div class="pieId" :id="id"></div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    name: "circularProgressBar",
    mounted(){
      this.drawPie()
    },
    props:{
      width:{    //圆环宽度
        type:Number,
        default:5
      },
      color:{
        type:String,
        default:"#f46"
      },
      total:{
        type:String,
        default:'100'
      },
      progress:{
        type:String,
        default:'10'
      },
      text:{
        type:String,
        default:""
      },
      id:{
        type:String,
        default:"pieId"
      },
      showProgress:{
        type:Boolean,
        default:true
      }
    },
    data(){
      return{
        labelTop:{//上层样式
          normal : {
            //color :'#6973DC',
            label : {
              show : true,
              position : 'center',
              formatter : '{b}',
              fontSize:14
            },
            labelLine : {
              show : false
            }
          }
        },
        labelBottom :{//底层样式
          normal : {
            color: '#eee',
            label : {
              show : false,
              position : 'bottom',
              fontSize:14
            },
            labelLine : {
              show : false
            }
          }
        }
      }
    },
    methods:{
      drawPie(){
        const this_ = this;
        this.chartPie = echarts.init(document.getElementById(this.id));
        this.chartPie.setOption({
          series : [
            {
              type : 'pie',
              center : ['50%', '50%'],//圆心坐标（div中的%比例）
              radius: [100-this.width+'%', '100%'],
              x: '0%', // for funnel
              hoverAnimation:false,
              legendHoverLink:false,
              clockwise:false,
              silent:true,
              //itemStyle : this.labelTop,//graphStyleA,//图形样式 // 当查到的数据不存在（并非为0），此属性隐藏
              label: {
                show: true,
                position: 'center',
                textStyle: {
                  fontSize: '18',
                  color:'#666'
                },
                verticalAlign:'center'
              },
              data : [{
                name:this.showProgress?parseFloat((this.progress/this.total*100).toFixed(2))+'%':this.progress,
                value:this.total-this.progress,
                itemStyle:this.labelBottom
              },{
                name:this.text,
                value:this.progress,
                itemStyle:this.labelTop
              }]
            }
          ],
          color: [this.color, '#eee'],
          tooltip:{
            show:false
          },
          animation:true
        })
      }
    },
  }
</script>

<style scoped>
.pieId{
  width: 100%;
  height: 100%;
}
</style>
