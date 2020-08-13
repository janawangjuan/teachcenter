<template>
  <aside class="env-type">
  	<div class="env-type-content">
  		<a class="env-type-close" href="javascript:;" @click="envTypeClose">&#10006;</a>
  		<p class="env-type-title">请选择开发环境！</p>
  		<ul class="env-type-ul">
  			<li class="env-type-li" v-for="(item, index) in envTypeArray">
  				<a class="env-type-a " :class="[item.type == envType ? 'active' : '']" href="javascript:;" @click="changeEnvType(index)">
  					{{item.name}}
  				</a>
  			</li>
  		</ul>
  	</div>

  </aside>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'loading',
  data () {
    return {
      envTypeArray: [
      	{
      		name: '正式',
      		type: 0
      	},
      	{
      		name: '测试',
      		type: 1
      	},
      	{
      		name: '开发',
      		type: 2
      	},
      	{
      		name: '模拟',
      		type: 3
      	}
      ]
    }
  },
  created(){

  },
  computed: {
    ...mapState({
    	envType: state => state.global.envType
    })
  },
  methods:{
  	...mapMutations(['UPDATEDATA']),
  	changeEnvType (index){
  		this.UPDATEDATA({
  		  envType: index
  		});
  		this.cookie.set('envType', index, { path: '' });
  		this.cookie.remove('techLoginInfo', { path: '' });
  		window.location.reload();
  	},
  	envTypeClose(){
  		this.UPDATEDATA({
  		  isEnv: false
  		});
  	}
  }
}
</script>

<style lang="stylus" scoped>
  @import '../assets/css/module.styl'
  .env-type{
  	position: fixed;
  	top: 0;
  	left: 0;
  	z-index: 99999;
  	width: 100%;
  	height: 100%;
  	background-color: rgba(0,0,0,.5);
  }
  .env-type-content{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 336px;
		height: 120px;
		margin: auto;

		-webkit-overflow-scrolling: touch;
		padding: 0;
		background-color: #fff;
		-webkit-background-clip: content;
		border-radius: 8px;

		box-shadow: 1px 1px 50px rgba(0,0,0,.3);
  }
  .env-type-close{
		position: absolute;
		top: 10px;
		right: 10px;
		font-size: 18px;
  }
  .env-type-title{
		padding: 0 80px 0 20px;
		height: 42px;
		line-height: 42px;
		border-bottom: 1px solid #eee;
		font-size: 14px;
		color: #333;
		overflow: hidden;
		background-color: #F8F8F8;
		border-radius: 2px 2px 0 0;
  }
  .env-type-ul{
  	overflow: hidden;
		text-align: right;
		padding: 20px;
		pointer-events: auto;
		user-select: none;
		-webkit-user-select: none;
  }
  .env-type-li{
  	float: left;

  }
  .env-type-a{
  	display: inline-block;
  	height: 28px;
    line-height: 28px;
    margin: 5px 5px 0;
    padding: 0 15px;
    border: 1px solid #dedede;
    background-color: #fff;
    color: #333;
    border-radius: 2px;
    font-weight: 400;
    cursor: pointer;
    text-decoration: none;
  }
  .env-type-a.active{
  	border-color: #1E9FFF;
  	background-color: #1E9FFF;
  	color: #fff;
  }
</style>
