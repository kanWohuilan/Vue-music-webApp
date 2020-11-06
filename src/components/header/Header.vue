<template>
  <div class="header">
    <!-- <div class="icon"></div> -->
    <h1 class="text">你好 打工人</h1>
  </div>
</template>

<script>
export default {
name: 'Header'
}
</script>

<style lang="stylus" >

 @import "~@/common/stylus/variable.styl";
@import "~@/common/stylus/mixin.styl";


.header
 
  height: 44px;
  text-align: center;
  position relative
  z-index 11
  font-size: 0
  background $color-theme-g
  color: #fff
  
  .icon
    display: inline-block
    vertical-align: top
    margin-top: 6px
    width: 34px
    height: 35px
    margin-right: 9px
    bg-image('logo')
    background-size: 34px 35px
  .text
    display: inline-block
    vertical-align: top
    line-height: 44px
    font-size: $font-size-large
    

</style>