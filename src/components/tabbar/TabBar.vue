<template>
  <van-tabbar v-model="active"  inactive-color="#333">
  <van-tabbar-item to="/recommend"> 
    <span>推荐</span>
    <template #icon="props">
      <icon :name="props.active ? icon.active[0] : icon.inactive[0]" />
    </template>
  </van-tabbar-item >
    <van-tabbar-item to="/mv">
    <span>视频</span>
    <template #icon="props">
      <icon :name="props.active ? icon.active[1] : icon.inactive[1]" />
    </template>
  </van-tabbar-item>
    <van-tabbar-item  to="/singer">
    <span>歌手</span>
    <template #icon="props">
      <icon :name="props.active ? icon.active[2] : icon.inactive[2]" />
    </template>
  </van-tabbar-item>
    <van-tabbar-item to="/user">
    <span>我的</span>
    <template #icon="props">
      <icon :name="props.active ? icon.active[3] : icon.inactive[3]" />
    </template>
  </van-tabbar-item>

</van-tabbar>
</template>

<script>
import Icon from 'vue-svg-icon/Icon.vue'
export default {
  components: {
    Icon
  },
  name: 'TabBar',
  data() {
    return {
      active: 0,
      icon: {
        active: ['music-action','vedio-active-01-01','s-a-01','singer-active'],
        inactive: ['music','vedio-01','s-01','singer']
      },
    };
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"
/* .van-tabbar-item--active .van-tabbar-item__text .van-tabbar-item__icon {
    color: #fff;
} */
/* .van-tabbar-item__text {
    color: black;
} */
  .van-tabbar-item
    .van-tabbar-item__icon
      .svg-icon
        color #666
        height 20px
        width 20px
  .van-tabbar-item--active
    .van-tabbar-item__icon
      .svg-icon
        color $color-theme
        font-weight 800
        height 20px
        width 20px
    .van-tabbar-item__text
      span 
        color $color-theme


     


</style>