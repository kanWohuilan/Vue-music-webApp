<template>
  <transition appear name="slide">
  <div class="rank" ref="rank">
     <router-view></router-view>
     <div class="top">
       <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h2 class="title" >排行榜</h2>
     </div>
    <Scroll :data="topList" class="toplist" ref="toplist" :click ='true'>
      <ul ref="ul">
        <li @click="selectItem(item)" class="item" v-for="(item,index) in topList" :key="index">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl"/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songList" :key="index">
              <span>{{index + 1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </Scroll>
   
  </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../../base/Scroll'
 
  import { getTopList } from '../../api/rank'
  import { ERR_OK } from '../../api/config'
  import { playlistMixin } from '../../common/js/mixin'
  import { mapMutations } from 'vuex'

  export default {
    mixins: [playlistMixin],
    created () {
      this._getTopList()
    },
    data () {
      return {
        topList: []
      }
    },
    
    methods: {
      back() {
      this.$router.back()
    },
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '44px' : '0px'

        this.$refs.rank.style.bottom = bottom
        this.$refs.toplist.refresh()
        
      },
      selectItem (item) {
        
        this.$router.push({
          path: `/rank/${item.id}`
        })
        this.setTopList(item)
      },
      _getTopList () {
        getTopList().then((res) => {
          if (res.code === ERR_OK) {
            this.topList = res.data.topList
          }
        })
      },
      ...mapMutations({
        setTopList: '_setTopList'
      })
    },
    watch: {
      topList () {
        setTimeout(() => {
          this.$Lazyload.lazyLoadHandler()
        }, 20)
      },
       $route:{
      handler(val,oldval){
        if(val.path === '/rank') {
          this.$refs.rank.style.zIndex = -1
        }else {
          this.$refs.rank.style.zIndex = 0
        }
      },
    },
    },
    components: {
      Scroll,
      
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
  .rank
    position: fixed
    width: 100%
    top: 44px
    bottom: 0
    z-index 100  !important 
    background-color $color-background
    .top
      position absolute
      z-index 99
      top -44px
      background #fff
      height 44px
      width 100%
      .back
        position absolute
        top 0
        left 6px
        z-index 200
        .icon-back
          font-size: $font-size-large-x
          color: $color-theme
          padding 10px
          display block
    .title
      text-align center
      position: absolute
      top: 0
      left 10%
      width 80%
      z-index 200
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text-d
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        // margin 20px 20px 0 20px
        padding-top 20px
        
        &:last-child
          padding-bottom  20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-text-l
          color: $color-text-hd
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
     
</style>

