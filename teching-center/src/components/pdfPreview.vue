<template>
  <div class="pdfPreview-wrap">
    <div class="error-wrap">无法获取有效文件，请联系网站管理员~</div>
    <pdf
         v-for="i in numPages"
         :key="i"
         :src="src"
         :page="i"
         style="display: inline-block; width: 99%;border:1px solid #eee"
    >
    </pdf>
  </div>
</template>

<script>
  import pdf from 'vue-pdf'

  export default {
    name: "pdfPreview.vue",
    props:['taskInfo'],
    components:{
      pdf
    },
    data() {
      return {
        src: '',
        numPages: undefined,
      }
    },
    mounted() {
      //const loadingTask = pdf.createLoadingTask('https://exstatic.zbgedu.com'+this.taskInfo.pdfUrl);
      const loadingTask = pdf.createLoadingTask('https://exstatic.zbgedu.com/upload/admin/201906/d92a9c2d69129f66f1fdbe755591d582.pdf');
      this.src = loadingTask
      this.src.then(pdf => {
        this.numPages = pdf.numPages;
      });
    }
  }
</script>

<style lang="stylus">
  .pdfPreview-wrap
    width 100%
    height 100%
    background #fff
    overflow auto
    .error-wrap
      position absolute
      color #ff366d
      width 100%
      text-align center
      top 50px
  .fff
    width 0
</style>
