<template>
	<div class="pagination-box">
		<ul class="pagination">
			<template v-if="pageStart>1">
				<li class="pagination-li js-pagination-prev" @click="pagePrev">
				  <a class="pagination-a pagination-prev" href="javascript:;">
				  &lt;
				  </a>
				</li>
			</template>
			<template v-if="pageStart>pagePrevs && pageStartI > 1">
				<li class="pagination-li js-pagination-li" data-pageno="1" @click="pageChange(1)"><a class="pagination-a" href="javascript:;">1...</a></li>
			</template>

			<template v-if="totalCount>20 && pageForNum">
				<li v-for="page in pageForNum" v-if="page >= pageStartI" class="pagination-li js-pagination-li " :class="page==pageNo ? 'select' : ''" data-pageno="page" @click="pageChange(page)"><a class="pagination-a" href="javascript:;">{{page}}</a></li>
			</template>

			<template v-if="pageForNum != pageTotal && pageTotal-pageStart>pageNexts">
				<li class="pagination-li js-pagination-li" data-pageno="pageTotal" @click="pageChange(pageTotal)"><a class="pagination-a" href="javascript:;">...{{pageTotal}}</a></li>
			</template>

			<template v-if="pageStart<pageTotal">
				<li class="pagination-li js-pagination-next" @click="pageNext">
				  <a class="pagination-a pagination-next" href="javascript:;">
				  &gt;
				  </a>
				</li>
			</template>
	  </ul>
	</div>
</template>
<script>
	export default{
		name : 'pagination',
		props : {
			pageNo : {
				type : Number
			},
			pageSize : {
				type : Number
			},
			totalCount : {
				type : Number
			},
			isRefresh : {
				type : Boolean
			}
		},
		data (){
			return {
				pageStart : '',
				pageStartI : 1,
				pagePrevs : 4,
				pageNexts : 4,
				pageForNum : '',
				pageTotal : ''
			}
		},
		created (){
			this.pagin();
		},
		watch : {
			isRefresh () {
				this.pagin();
			}
		},
		methods : {
			pagin(){
				this.pageTotal = Math.ceil(this.totalCount/+this.pageSize);
				this.pageStart = +this.pageNo;
				this.pageForNum = this.pageStart+this.pagePrevs;
				//debugger;
				if(this.pageTotal>this.pageForNum){
					if(this.pageStart<=this.pagePrevs){
						this.pageStartI = 1;
						this.pageForNum = this.pageForNum;
					}else if(this.pageStart<this.pagePrevs+this.pageNexts){
						this.pageForNum = this.pageForNum;
						this.pageStartI = this.pageForNum-this.pagePrevs-this.pagePrevs;
					}else if(this.pageStart>=this.pagePrevs+this.pageNexts && this.pageStart<=this.pageTotal-this.pageNexts){
						this.pageForNum = this.pageStart+this.pageNexts;
						this.pageStartI = this.pageStart-this.pagePrevs;
					}else if(this.pageStart>this.pageTotal-this.pageNexts){
						this.pageForNum = this.pageTotal;
						this.pageStartI = this.pageTotal-this.pagePrevs-this.pagePrevs;
					}
				}else{
					this.pageForNum = this.pageTotal;
					this.pageStartI = this.pageTotal-this.pagePrevs-this.pagePrevs;
				}
				if(+this.pageForNum>+this.pageTotal){
					this.pageForNum = this.pageTotal;
				}
			},
			pageChange (index){
				this.$emit('pageChange',index)
			},
			pagePrev (){
				this.$emit('pagePrev')
			},
			pageNext(){
				this.$emit('pageNext')
			}
		}
	}
</script>
<style lang="stylus" scoped>
	.pagination-box {
	  width: 100%;
	  padding: 10px;
	}
	.pagination-box .pagination {
	  overflow: hidden;
	  text-align: center;
	}
	.pagination-box .pagination .pagination-li {
	  display: inline-block;
	  overflow: hidden;
	}
	.pagination-box .pagination .pagination-li .pagination-a {
	  display: inline-block;
	  min-width: 24px;
	  padding: 0px 8px;
	  height: 24px;
	  line-height: 24px;
	  margin-left: 10px;
	  text-align: center;
	  font-size: 12px;
	  color: #a7a8ac;
	  background-color: #eff2f5;
	}
	.pagination-box .pagination .pagination-li .pagination-prev, .pagination-box .pagination .pagination-li .pagination-next {
	  float: left;
	  font-size: 18px;
	  font-family: cursive;
	}
	.pagination-box .pagination .pagination-li .pagination-prev .icon, .pagination-box .pagination .pagination-li .pagination-next .icon {
	  float: left;
	}
	.pagination-box .pagination .pagination-li .pagination-prev {
	  margin-left: 0;
	}
	.pagination-box .pagination .pagination-li .pagination-a:hover {
	  background-color: #daf0ef;
	}
	.pagination-box .pagination .pagination-li.select .pagination-a {
	  color: #fff;
	  background-color: #3e4e63;
	}
</style>
