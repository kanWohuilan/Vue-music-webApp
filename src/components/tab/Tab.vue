<template>
  <div class="tab">
  <router-link class="tab-item" tag="div" to="/recommend">
    <span class="tab-text">推荐</span>
  </router-link>
  <router-link class="tab-item" tag="div" to="/singer">
    <span class="tab-text">歌手</span>
  </router-link>
  <router-link class="tab-item" tag="div" to="/rank">
    <span class="tab-text">排行</span>
  </router-link>
  <router-link class="tab-item" tag="div" to="/search">
    <span class="tab-text">搜索</span>
  </router-link>

  </div>
</template>

<script>
export default {
  name: 'Tab'

}
</script>

<style lang="stylus" scoped>
 @import "~@/common/stylus/variable.styl";
@import "~@/common/stylus/mixin.styl";

.tab
  display  flex
  text-align center
  height 44px
  font-size: $font-size-medium
  .tab-item
    flex 1
    line-height 44px
    .tab-text
      padding-bottom 4px
      color: $color-text-l
  .is-active
    .tab-text
      color: $color-theme
      border-bottom: 2px solid $color-theme
</style>