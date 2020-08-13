<template>
	<div :id="id" class="scroll" :ref="id">
		<div id="wrapper" class="wrapper" ref="wrapper">
			<slot></slot>
		</div>
	</div>
</template>
<script>
	import ISCROLL from 'iscroll'
	export default{
		props : {
			id : {
				type : String,
				required : false,
				default : 'scroll'
			},
			isRefresh : {
				type : Boolean,
				required : false,
				default : false
			},
			toNum: { //滚动到某处位置
				type: Number,
				default: 0,
			},
      toTop:{
			  type:Boolean,
        default:true,
      }
		},
		data () {
			return {
				iScroll : ''
			}
		},
		created(){

		},
		mounted(){

			this.iScroll = this.IScroll(document.getElementById(this.id),this.$refs[this.id]);
			document.getElementById(this.id).querySelector(".iScrollVerticalScrollbar").style.zIndex = 0;
		},
		watch : {
			isRefresh () {
				this.$nextTick(()=>{
					this.refresh();
				})
			},
			toNum() {
				this.$nextTick(()=>{
					this.toScroll();
				})
			}
		},
		methods : {
			IScroll (dom,wrapper) {
	      let myScroll = new ISCROLL(dom, {
	        probeType: 3,
	        mouseWheel: true,
	        //speedRatioY : 200,
	        startX:0,
	        startY:0,
          preventDefault:false,
          fadeScrollbars:true,
	        scrollbars: true, // custom
	        interactiveScrollbars: true,
	        shrinkScrollbars: 'scale',
	        //fadeScrollbars: true
	      });
	      var scrollShadow = true;
	      myScroll.on('scroll', function(){
	        let children = wrapper.children;
	        if(Math.abs(this.y)){
	          if(scrollShadow){
	            let span = document.createElement("span");
	            span.setAttribute('class','wrapper-shadow');
	            wrapper.insertBefore(span,children[0]);
	            scrollShadow = false;
	          }
	        }else{
	          if(!scrollShadow){
	            wrapper.removeChild(wrapper.children[0]);
	            scrollShadow = true;
	          }
	        }
	      });
	      return myScroll;
	  	},
			refresh () {
			  if(this.toTop){
          this.iScroll.scrollTo(0,0);
        }
				this.iScroll.refresh();
			},
			toScroll() {
				console.log(this.toNum)
				this.iScroll.scrollTo(0,-this.toNum);
			}
		}
	}
</script>
<style lang="stylus">
	.scroll
		position : relative;
		width  100%
		height 100%
	.wrapper
		position relative
	.wrapper-shadow {
	  position: absolute;
	  top: 0;
	  bottom: 0;
	  left: 0;
	  right: 0;
	  z-index: 1;
	  display: inline-block;
	  width: 100%;
	  height: 20px;
	  background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeDE9IjAuNSIgeTE9IjAuMCIgeDI9IjAuNSIgeTI9IjEuMCI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzAwMDAwMCIgc3RvcC1vcGFjaXR5PSIwLjAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyYWQpIiAvPjwvc3ZnPiA=');
	  background-size: 100%;
	  background-image: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #ffffff), color-stop(100%, rgba(0, 0, 0, 0)));
	  background-image: -moz-linear-gradient(#ffffff, rgba(0, 0, 0, 0));
	  background-image: -webkit-linear-gradient(#ffffff, rgba(0, 0, 0, 0));
	  background-image: linear-gradient(#ffffff, rgba(0, 0, 0, 0));
	}
	.iScrollVerticalScrollbar {
	  position: absolute;
	  width: 4px;
	  bottom: 2px;
	  top: 2px;
	  right: 1px;
	  overflow: hidden;
	  pointer-events: none;
	}
	.iScrollIndicator {
	  position: absolute;
	  border-radius: 2px;
	  width: 100%;
	  transition-duration: 0ms;
	  display: block;
	  transform: translate(0px, 0px) translateZ(0px);
	  transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1);
	  background-color: #C9C9C9;
	}

	.iScrollVerticalScrollbar {
	  right: -3px;
	}
</style>
