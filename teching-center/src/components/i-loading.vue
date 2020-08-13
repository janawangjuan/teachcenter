<template>
  <aside class="loader-main">
    <div class="loader-content" v-if="loadingType == 'loading'">
      <div class="loader-box" >
        <div class="loader" :class="'loader-'+size">loading...</div>
      </div>
    </div>

    <span class="text-loader-content" v-else>
      <span class="text-loader"></span>
    </span>
  </aside>
</template>

<script>
export default {
  name: 'loading',
  props : {
    size : {
      type : String,
      default : 'middle'
    },
    loadingType : {
      type : String,
      required : false,
      default : 'loading'
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="stylus">
  @import '~@/assets/css/module.styl'
  .loader-content {
    position: relative;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    min-height: 150px;
  }
  .loader-main
    display inline
  .loader-content
    relative()
    display inline-block
    size(100%)
    min-height 150px
  .loader-box
    absolute()
    size(100%)
    // background-color: #fff;
  .loader
    midden(1em,1em)
    border-radius: 50%;
    text-indent: -9999em;
    -webkit-animation: load 1.5s infinite linear;
    animation: load 1.5s infinite linear;
  .loader-small
    font-size 12px
  .loader-middle
    font-size: 20px;
  .loader-big
    font-size: 30px;
  .loader-white
    midden(1em,1em)
    font-size: 12px;
    border-radius: 50%;
    text-indent: -9999em;
    -webkit-animation: loadWhite 1.5s infinite linear;
    animation: loadWhite 1.5s infinite linear;
  .loader-12
    font-size: 12px;
  .text-loader-box
    absolute()
    size(100%)
    background-color #fff

  .text-loader-content
    display: inline-block;
    width: 48px;
    overflow: hidden;
    vertical-align -0.25rem
  .text-loader
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    -webkit-animation: textLoad 2s infinite linear;
    animation: textLoad 2s infinite linear;

  @-webkit-keyframes load {
    0%,
    100% {
      box-shadow: 0em -3em 0em 0.2em #ff366d, 2em -2em 0 0em #ff366d, 3em  0em 0 -0.5em #ff366d, 2em 2em 0 -0.5em #ff366d, 0em 3em 0 -0.5em  #ff366d, -2em 2em 0 -0.5em #ff366d, -3em 0em 0 -0.5em #ff366d, -2em -2em 0 0em #ff366d;
    }
    12.5% {
      box-shadow: 0em -3em 0em 0em #ff366d, 2em -2em 0 0.2em #ff366d, 3em  0em 0 0em #ff366d, 2em 2em 0 -0.5em #ff366d, 0em 3em 0 -0.5em #ff366d,  -2em 2em 0 -0.5em #ff366d, -3em 0em 0 -0.5em #ff366d, -2em -2em 0 -0.5em #ff366d;
    }
    25% {
      box-shadow: 0em -3em 0em -0.5em #ff366d, 2em -2em 0 0em #ff366d, 3em 0em 0 0.2em #ff366d, 2em 2em 0 0em #ff366d, 0em 3em 0 -0.5em #ff366d,  -2em 2em 0 -0.5em #ff366d, -3em 0em 0 -0.5em #ff366d, -2em -2em 0 -0.5em #ff366d;
    }
    37.5% {
      box-shadow: 0em -3em 0em -0.5em #ff366d, 2em -2em 0 -0.5em #ff366d,  3em 0em 0 0em #ff366d, 2em 2em 0 0.2em #ff366d, 0em 3em 0 0em #ff366d,  -2em 2em 0 -0.5em #ff366d, -3em 0em 0 -0.5em #ff366d, -2em -2em 0 -0.5em #ff366d;
    }
    50% {
      box-shadow: 0em -3em 0em -0.5em #ff366d, 2em -2em 0 -0.5em #ff366d,  3em 0em 0 -0.5em #ff366d, 2em 2em 0 0em #ff366d, 0em 3em 0 0.2em  #ff366d, -2em 2em 0 0em #ff366d, -3em 0em 0 -0.5em #ff366d, -2em -2em 0  -0.5em #ff366d;
    }
    62.5% {
      box-shadow: 0em -3em 0em -0.5em #ff366d, 2em -2em 0 -0.5em #ff366d,  3em 0em 0 -0.5em #ff366d, 2em 2em 0 -0.5em #ff366d, 0em 3em 0 0em  #ff366d, -2em 2em 0 0.2em #ff366d, -3em 0em 0 0em #ff366d, -2em -2em 0  -0.5em #ff366d;
    }
    75% {
      box-shadow: 0em -3em 0em -0.5em #ff366d, 2em -2em 0 -0.5em #ff366d,  3em 0em 0 -0.5em #ff366d, 2em 2em 0 -0.5em #ff366d, 0em 3em 0 -0.5em  #ff366d, -2em 2em 0 0em #ff366d, -3em 0em 0 0.2em #ff366d, -2em -2em 0  0em #ff366d;
    }
    87.5% {
      box-shadow: 0em -3em 0em 0em #ff366d, 2em -2em 0 -0.5em #ff366d, 3em 0em 0 -0.5em #ff366d, 2em 2em 0 -0.5em #ff366d, 0em 3em 0 -0.5em  #ff366d, -2em 2em 0 0em #ff366d, -3em 0em 0 0em #ff366d, -2em -2em 0  0.2em #ff366d;
    }
  }
  @-webkit-keyframes loadWhite {
    0%,
    100% {
      box-shadow: 0em -3em 0em 0.2em #ffffff, 2em -2em 0 0em #ffffff, 3em  0em 0 -0.5em #ffffff, 2em 2em 0 -0.5em #ffffff, 0em 3em 0 -0.5em  #ffffff, -2em 2em 0 -0.5em #ffffff, -3em 0em 0 -0.5em #ffffff, -2em -2em 0 0em #ffffff;
    }
    12.5% {
      box-shadow: 0em -3em 0em 0em #ffffff, 2em -2em 0 0.2em #ffffff, 3em  0em 0 0em #ffffff, 2em 2em 0 -0.5em #ffffff, 0em 3em 0 -0.5em #ffffff,  -2em 2em 0 -0.5em #ffffff, -3em 0em 0 -0.5em #ffffff, -2em -2em 0 -0.5em #ffffff;
    }
    25% {
      box-shadow: 0em -3em 0em -0.5em #ffffff, 2em -2em 0 0em #ffffff, 3em 0em 0 0.2em #ffffff, 2em 2em 0 0em #ffffff, 0em 3em 0 -0.5em #ffffff,  -2em 2em 0 -0.5em #ffffff, -3em 0em 0 -0.5em #ffffff, -2em -2em 0 -0.5em #ffffff;
    }
    37.5% {
      box-shadow: 0em -3em 0em -0.5em #ffffff, 2em -2em 0 -0.5em #ffffff,  3em 0em 0 0em #ffffff, 2em 2em 0 0.2em #ffffff, 0em 3em 0 0em #ffffff,  -2em 2em 0 -0.5em #ffffff, -3em 0em 0 -0.5em #ffffff, -2em -2em 0 -0.5em #ffffff;
    }
    50% {
      box-shadow: 0em -3em 0em -0.5em #ffffff, 2em -2em 0 -0.5em #ffffff,  3em 0em 0 -0.5em #ffffff, 2em 2em 0 0em #ffffff, 0em 3em 0 0.2em  #ffffff, -2em 2em 0 0em #ffffff, -3em 0em 0 -0.5em #ffffff, -2em -2em 0  -0.5em #ffffff;
    }
    62.5% {
      box-shadow: 0em -3em 0em -0.5em #ffffff, 2em -2em 0 -0.5em #ffffff,  3em 0em 0 -0.5em #ffffff, 2em 2em 0 -0.5em #ffffff, 0em 3em 0 0em  #ffffff, -2em 2em 0 0.2em #ffffff, -3em 0em 0 0em #ffffff, -2em -2em 0  -0.5em #ffffff;
    }
    75% {
      box-shadow: 0em -3em 0em -0.5em #ffffff, 2em -2em 0 -0.5em #ffffff,  3em 0em 0 -0.5em #ffffff, 2em 2em 0 -0.5em #ffffff, 0em 3em 0 -0.5em  #ffffff, -2em 2em 0 0em #ffffff, -3em 0em 0 0.2em #ffffff, -2em -2em 0  0em #ffffff;
    }
    87.5% {
      box-shadow: 0em -3em 0em 0em #ffffff, 2em -2em 0 -0.5em #ffffff, 3em 0em 0 -0.5em #ffffff, 2em 2em 0 -0.5em #ffffff, 0em 3em 0 -0.5em  #ffffff, -2em 2em 0 0em #ffffff, -3em 0em 0 0em #ffffff, -2em -2em 0  0.2em #ffffff;
    }
  }


  @-webkit-keyframes textLoad {
    0%,100% {
      box-shadow: 8px 0 0 0 #4A90E2, 24px 0 0 0 #3E4E63, 40px 0 0 0 #338A86;
    }
    16.66% {
      box-shadow: 24px 0 0 0 #4A90E2, 24px 0 0 0 #4A90E2, 24px 0 0 0 #4A90E2;
    }
    33.33% {
      box-shadow: 8px 0 0 0 #3E4E63, 24px 0 0 0 #338A86, 40px 0 0 0 #4A90E2;
    }
    50% {
      box-shadow: 24px 0 0 0 #3E4E63, 24px 0 0 0 #3E4E63, 24px 0 0 0 #3E4E63;
    }
    66.66% {
      box-shadow: 8px 0 0 0 #338A86, 24px 0 0 0 #3E4E63, 40px 0 0 0 #3E4E63;
    }
    83.33% {
      box-shadow: 24px 0 0 0 #338A86, 24px 0 0 0 #338A86, 24px 0 0 0 #338A86;
    }
  }

  @keyframes load {
    0%,
    100% {
      box-shadow: 0em -3em 0em 0.2em #ff366d, 2em -2em 0 0em #ff366d, 3em  0em 0 -0.5em #ff366d, 2em 2em 0 -0.5em #ff366d, 0em 3em 0 -0.5em  #ff366d, -2em 2em 0 -0.5em #ff366d, -3em 0em 0 -0.5em #ff366d, -2em -2em 0 0em #ff366d;
    }
    12.5% {
      box-shadow: 0em -3em 0em 0em #ff366d, 2em -2em 0 0.2em #ff366d, 3em  0em 0 0em #ff366d, 2em 2em 0 -0.5em #ff366d, 0em 3em 0 -0.5em #ff366d,  -2em 2em 0 -0.5em #ff366d, -3em 0em 0 -0.5em #ff366d, -2em -2em 0 -0.5em #ff366d;
    }
    25% {
      box-shadow: 0em -3em 0em -0.5em #ff366d, 2em -2em 0 0em #ff366d, 3em 0em 0 0.2em #ff366d, 2em 2em 0 0em #ff366d, 0em 3em 0 -0.5em #ff366d,  -2em 2em 0 -0.5em #ff366d, -3em 0em 0 -0.5em #ff366d, -2em -2em 0 -0.5em #ff366d;
    }
    37.5% {
      box-shadow: 0em -3em 0em -0.5em #ff366d, 2em -2em 0 -0.5em #ff366d,  3em 0em 0 0em #ff366d, 2em 2em 0 0.2em #ff366d, 0em 3em 0 0em #ff366d,  -2em 2em 0 -0.5em #ff366d, -3em 0em 0 -0.5em #ff366d, -2em -2em 0 -0.5em #ff366d;
    }
    50% {
      box-shadow: 0em -3em 0em -0.5em #ff366d, 2em -2em 0 -0.5em #ff366d,  3em 0em 0 -0.5em #ff366d, 2em 2em 0 0em #ff366d, 0em 3em 0 0.2em  #ff366d, -2em 2em 0 0em #ff366d, -3em 0em 0 -0.5em #ff366d, -2em -2em 0  -0.5em #ff366d;
    }
    62.5% {
      box-shadow: 0em -3em 0em -0.5em #ff366d, 2em -2em 0 -0.5em #ff366d,  3em 0em 0 -0.5em #ff366d, 2em 2em 0 -0.5em #ff366d, 0em 3em 0 0em  #ff366d, -2em 2em 0 0.2em #ff366d, -3em 0em 0 0em #ff366d, -2em -2em 0  -0.5em #ff366d;
    }
    75% {
      box-shadow: 0em -3em 0em -0.5em #ff366d, 2em -2em 0 -0.5em #ff366d,  3em 0em 0 -0.5em #ff366d, 2em 2em 0 -0.5em #ff366d, 0em 3em 0 -0.5em  #ff366d, -2em 2em 0 0em #ff366d, -3em 0em 0 0.2em #ff366d, -2em -2em 0  0em #ff366d;
    }
    87.5% {
      box-shadow: 0em -3em 0em 0em #ff366d, 2em -2em 0 -0.5em #ff366d, 3em 0em 0 -0.5em #ff366d, 2em 2em 0 -0.5em #ff366d, 0em 3em 0 -0.5em  #ff366d, -2em 2em 0 0em #ff366d, -3em 0em 0 0em #ff366d, -2em -2em 0  0.2em #ff366d;
    }
  }
  @keyframes loadWhite {
    0%,
    100% {
      box-shadow: 0em -3em 0em 0.2em #ffffff, 2em -2em 0 0em #ffffff, 3em  0em 0 -0.5em #ffffff, 2em 2em 0 -0.5em #ffffff, 0em 3em 0 -0.5em  #ffffff, -2em 2em 0 -0.5em #ffffff, -3em 0em 0 -0.5em #ffffff, -2em -2em 0 0em #ffffff;
    }
    12.5% {
      box-shadow: 0em -3em 0em 0em #ffffff, 2em -2em 0 0.2em #ffffff, 3em  0em 0 0em #ffffff, 2em 2em 0 -0.5em #ffffff, 0em 3em 0 -0.5em #ffffff,  -2em 2em 0 -0.5em #ffffff, -3em 0em 0 -0.5em #ffffff, -2em -2em 0 -0.5em #ffffff;
    }
    25% {
      box-shadow: 0em -3em 0em -0.5em #ffffff, 2em -2em 0 0em #ffffff, 3em 0em 0 0.2em #ffffff, 2em 2em 0 0em #ffffff, 0em 3em 0 -0.5em #ffffff,  -2em 2em 0 -0.5em #ffffff, -3em 0em 0 -0.5em #ffffff, -2em -2em 0 -0.5em #ffffff;
    }
    37.5% {
      box-shadow: 0em -3em 0em -0.5em #ffffff, 2em -2em 0 -0.5em #ffffff,  3em 0em 0 0em #ffffff, 2em 2em 0 0.2em #ffffff, 0em 3em 0 0em #ffffff,  -2em 2em 0 -0.5em #ffffff, -3em 0em 0 -0.5em #ffffff, -2em -2em 0 -0.5em #ffffff;
    }
    50% {
      box-shadow: 0em -3em 0em -0.5em #ffffff, 2em -2em 0 -0.5em #ffffff,  3em 0em 0 -0.5em #ffffff, 2em 2em 0 0em #ffffff, 0em 3em 0 0.2em  #ffffff, -2em 2em 0 0em #ffffff, -3em 0em 0 -0.5em #ffffff, -2em -2em 0  -0.5em #ffffff;
    }
    62.5% {
      box-shadow: 0em -3em 0em -0.5em #ffffff, 2em -2em 0 -0.5em #ffffff,  3em 0em 0 -0.5em #ffffff, 2em 2em 0 -0.5em #ffffff, 0em 3em 0 0em  #ffffff, -2em 2em 0 0.2em #ffffff, -3em 0em 0 0em #ffffff, -2em -2em 0  -0.5em #ffffff;
    }
    75% {
      box-shadow: 0em -3em 0em -0.5em #ffffff, 2em -2em 0 -0.5em #ffffff,  3em 0em 0 -0.5em #ffffff, 2em 2em 0 -0.5em #ffffff, 0em 3em 0 -0.5em  #ffffff, -2em 2em 0 0em #ffffff, -3em 0em 0 0.2em #ffffff, -2em -2em 0  0em #ffffff;
    }
    87.5% {
      box-shadow: 0em -3em 0em 0em #ffffff, 2em -2em 0 -0.5em #ffffff, 3em 0em 0 -0.5em #ffffff, 2em 2em 0 -0.5em #ffffff, 0em 3em 0 -0.5em  #ffffff, -2em 2em 0 0em #ffffff, -3em 0em 0 0em #ffffff, -2em -2em 0  0.2em #ffffff;
    }
  }


  @keyframes textLoad {
    0%,100% {
      box-shadow: 8px 0 0 0 #4A90E2, 24px 0 0 0 #3E4E63, 40px 0 0 0 #338A86;
    }
    16.66% {
      box-shadow: 24px 0 0 0 #4A90E2, 24px 0 0 0 #4A90E2, 24px 0 0 0 #4A90E2;
    }
    33.33% {
      box-shadow: 8px 0 0 0 #3E4E63, 24px 0 0 0 #338A86, 40px 0 0 0 #4A90E2;
    }
    50% {
      box-shadow: 24px 0 0 0 #3E4E63, 24px 0 0 0 #3E4E63, 24px 0 0 0 #3E4E63;
    }
    66.66% {
      box-shadow: 8px 0 0 0 #338A86, 24px 0 0 0 #3E4E63, 40px 0 0 0 #3E4E63;
    }
    83.33% {
      box-shadow: 24px 0 0 0 #338A86, 24px 0 0 0 #338A86, 24px 0 0 0 #338A86;
    }
  }
</style>
