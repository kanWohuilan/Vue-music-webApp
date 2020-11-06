<template>
  <div class="song-list">
    <ul>
      <li v-for="(song,index) in songs" :key="index" class="song" @click="selectItem(song,index)"> 
        <div class="rank" v-show="rank">{{index+1}}</div>
        <div class="content">
          <h2 class="name" v-html="song.name"></h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SongList',
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    rank: {
       type: Boolean,
      default: false
    }
  },
  methods: {
    getDesc(song){
      return `${song.singer}·${song.album}`
    },
    selectItem(song,index) {
      
      this.$emit('selectItem',song,index)
    }
  }
}
</script>

<style lang="stylus" scoped>
 @import "~@/common/stylus/variable.styl";
@import "~@/common/stylus/mixin.styl";
.song-list
  padding: 20px 30px
  .song
    display flex
    align-items center
    height 68px
    font-size: $font-size-medium
    .rank
      font-size 20px
      font-weight 400
      font-style italic
      flex: 0 0 25px
      width: 25px
      margin-right: 16px
      text-align: center
    .content
      flex 1
      line-height 20px
      overflow hidden

      .name
        no-wrap()
        color: rgba(0, 0, 0, 0.7)
        font-size $font-size-large
      .desc
        no-wrap()
        margin-top: 4px
        color: $color-text-d
</style>