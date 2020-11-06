<template>
  <div class="user">
      <transition name="searchh">
  <div class="search" v-show="searchShow">
  <div class="search-box-wrapper" >
      <SearchBox ref="searchBox"  @click.native="toSearch"></SearchBox>
    </div>
  </div>
  </transition>
   <transition name="slide">
    <div class="user-center">
     <div class="user-top">
       <div class="avatar-wrapper">
         <div class="avatar"></div>
       </div>
       <h1 class="name">登录/注册</h1>
       <!-- <p>登录立享专属推荐</p> -->
     </div>
      <div class="switches-wrapper">
        <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
      </div>
      <div ref="playBtn" class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" class="list-scroll" v-if="currentIndex===0" :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll ref="playList" class="list-scroll" v-if="currentIndex===1" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
  </div>
  
</template>

<script>
import SearchBox from '../../base/SearchBox'
 import Switches from '../../base/switches/switches'
  import Scroll from '../../base/Scroll'
  import SongList from '../musicList/SongList'
  import NoResult from '../../base/no-result/NoResult'
  import { mapGetters, mapActions } from 'vuex'
  import { playlistMixin } from '../../common/js/mixin'
export default {
   data() {
  return{ 
    searchShow: true,
     currentIndex: 0,
        switches: [
          {
            name: '我喜欢的'
          },
          {
            name: '最近听的'
          }
        ]
    
  }
},
 computed: {
      noResult () {
        if (this.currentIndex === 0) {
          return !this.favoriteList.length
        } else {
          return !this.playHistory.length
        }
      },
      noResultDesc () {
        if (this.currentIndex === 0) {
          return '暂无收藏歌曲'
        } else {
          return '你还没有听过歌曲'
        }
      },
      ...mapGetters([
        'favoriteList',
        'playHistory'
      ])
    },
components: {
  SearchBox,
    Switches,
      Scroll,
      SongList,
      NoResult
},
methods: {
  toSearch() {
        this.$router.push({
          path: '/search'
        })
      },
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '111px' : ''
        this.$refs.listWrapper.style.bottom = bottom
        this.$refs.favoriteList && this.$refs.favoriteList.refresh()
        this.$refs.playList && this.$refs.playList.refresh()
      },
      switchItem (index) {
        this.currentIndex = index
      },
      selectSong (song) {
        this.insertSong(song)
      },
      back () {
        this.$router.back()
      },
      random () {
        let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
        if (list.length === 0) {
          return
        }
        this.randomPlay({
          list
        })
      },
      ...mapActions([
        'insertSong',
        'randomPlay'
      ])
},
 
}
</script>
<style lang="stylus" scoped>
  @import "~@/common/stylus/variable"
.user
  position fixed
  top 44px
  bottom 0
  left 0
  width 100%
  .search
    position absolute
    width 100%
    z-index 10
    background #f2f2f2
    .search-box-wrapper
      margin 10px 16px
    &.searchh-enter-active, &.searchh-leave-active
      transition: all 0.3s 
    &.searchh-enter, &.searchh-leave-to
      opacity: 0
      transform translate3d(0,-100px,0)
  .user-center
    position: fixed
    top: 110px
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .user-top
      width 100%
      position relative
      margin 0 auto
      height 180px
      background url('./img.jpg') no-repeat  
      background-size   110%
      background-position -20px 0
      border-radius 30px
      
      .avatar-wrapper
        position absolute
        top 15px
        left 36px
        width 18%
        .avatar
          width 100%
          height 0
          padding-top 100%
          background url('user.jpg') no-repeat 
          background-size contain
          background-position 0 7px
          border 2px solid rgba(0,0,0,.1)
          // background-color #fff
          // background-color rgba(0,0,0,.2)
          border-radius 50%
      .name
        position absolute
        left 32%
        top 34px
        font-size 15px
      // p 
      //   position absolute
      //   left 30%
      //   top 45px
      //   font-size 14px
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 230px
      bottom: 50px
      width: 100%
      background-color #fff
      border-radius 30px
      .list-scroll
        height: 100%
        overflow: hidden
        // .list-inner
        //   padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>