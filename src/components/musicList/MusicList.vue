<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h2 class="title" v-html="title"></h2>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper" >
        <div class="palyBtn" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <Scroll :data= "songs" class="list" ref="list" :probeType = 'probeType' 
    :listenScroll = 'listenScroll' @scroll="scroll" :click = 'click' 
    > 
    <div class="song-list-wrapper">
      <SongList :songs = 'songs' @selectItem = 'selectItem' :rank ='rank'> </SongList>
    </div>
    </Scroll>
  </div>
</template>

<script>
import Scroll from '../../base/Scroll'
import SongList from './SongList'
import {mapActions} from 'vuex'
import { playlistMixin } from '../../common/js/mixin'
  import {getplaylist,getsongUrl,getlyricl,getsongdetail} from '../../api/getData'
  import axios from 'axios'
export default {
  name: 'MusicList',
  mixins: [playlistMixin],
  data() {
    return {
      scrollY: 0,
      click:true
    }
  },
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    title: {
      type: String,
      default() {
        return ''
      }
    },
    bgImage: {
      type: String,
      default() {
        return ''
      }
    },
        rank: {
       type: Boolean,
      default: false
    }
  },
  computed: {
      bgStyle () {
        return `background-image:url(${this.bgImage})`
      }
    },
  components: {
    Scroll,
    SongList
  },
  created() {
  
    this.probeType = 3
    this.listenScroll = true
    // this.setLyric()
  },
  mounted() {

    this.bgImageHeight = this.$refs.bgImage.clientHeight
    this.minTransalteY = -this.bgImageHeight + 40
    this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
  },
  methods: {
    handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
    scroll(pos) {
      this.scrollY = pos.y
    },
    back() {
      this.$router.back()
    },
    selectItem(song,index) {
          if(this.$route.params.id <100000000 && this.$route.params.id > 100) {
            song.getduration()
          }
          axios.all([getsongUrl(song.id),getlyricl(song.id),getsongdetail(song.id)]).then(axios.spread((res,res2,res3) => {
          // songs.item.forEach( i => {
          //   // i.url = res.url
            song.url = res.data[0].url
            // if(!song.lyricl) {
            //   song.lyric = res2.lrc.lyric
            // }
            // song.duration = res3.songs[0].dt/1000
            
            console.log(res);
            console.log(res2);
            console.log(res3);
            this.selectPaly({
            list:this.songs,
            index,
      })
          // })
        }))
       
      
      console.log(this.songs);
     
    },
    // setLyric() {
    //  this.songs.forEach(song => {
    //       getlyricl(song.id).then((l,index) => {
    //         this.song[index].lyric = l
    //       })
    //  })
    // },
     
    ...mapActions([
      'selectPaly',
      'randomPlay'
    ]),
    random() {
      this.randomPlay({
        list: this.songs
      })
    },
    
  },
  watch: {
    scrollY(newval) {
      let blur = 0
      let scale = 0
      let zindex = 0
      let translateY = Math.max(this.minTransalteY, newval)
      this.$refs.layer.style.transform = `translate3d(0,${translateY}px,0)`
      let percent = Math.abs(newval / this.bgImageHeight)
      if(newval > 0) {
        scale = percent +1
        this.$refs.bgImage.style.transform = `scale(${scale})`
      }else {
        blur = Math.min(20*percent,20)
        this.$refs.filter.style.filter = `blur(${blur}px)`
      }
      if(newval<  this.minTransalteY) {
        zindex = 102
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = 40 + 'px'
        this.$refs.playBtn.style.display = 'none'
       
      }else{
         this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.playBtn.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zindex
        
       
      
      
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/common/stylus/variable"

  .music-list
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    z-index 100
    background $color-background
    
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
      color: #f6f6f6
    .bg-image
      position relative
      width 100%
      height 0
      padding-top 70%
      transform-origin: top
      background-size cover
      z-index 102
      
      .play-wrapper
        position absolute
        left 50%
        transform translateX(-50%) 
        bottom: 20px
        z-index: 1
        
        .palyBtn
          width 145px
          border 1px solid $color-theme
          border-radius 100px
          text-align center
          padding  7px 0
          .icon-play
            display: inline-block
            vertical-align middle
            margin-right: 6px
            font-size: $font-size-medium-x
            color $color-theme
          .text
            font-size: $font-size-small
            color $color-theme
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position absolute
      width 100%
      height 100%
      background $color-background
      z-index 10
    .list
      position absolute
      top 0
      bottom 0
      z-index 100
      width 100%
      // background $color-background

      


        
</style>