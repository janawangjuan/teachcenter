<template>
  <div id="wangeditor">
    <div ref="editorElem" style="text-align:left"></div>
  </div>
</template>
<script>
  import E from 'wangeditor'
  export default {
    name: 'editorElem',
    data () {
      return {
        editor: null,
        editorContent: ''
      }
    },
    props: ['catchData', 'content'],    // 接收父组件的方法
    watch: {
      /*content () {
        this.editor.txt.html(this.content)
      }*/
    },
    mounted () {
      this.editor = new E(this.$refs.editorElem)
      this.editor.customConfig.onchange = (html) => {
        this.editorContent = html
        this.catchData(this.editorContent)  // 把这个html通过catchData的方法传入父组件
      }
      this.editor.customConfig.menus = [          // 菜单配置
        'bold',  // 粗体
        'fontSize',  // 字号
        'italic',  // 斜体
        'underline',  // 下划线
        'foreColor',  // 文字颜色
      ]

      this.editor.create()     // 创建富文本实例
      if(this.content!=''){
        this.editor.txt.html(this.content)
      }
      /*if (!this.content) {
        this.editor.txt.html('请输入')
      }*/
    },
    methods:{
      clearContent(){
        this.editor.txt.clear()
      }
    }
  }
</script>
<style lang="stylus">
  #wangeditor {
    width: 100%;
  }
</style>
