<template>
  <div class="player" v-show="playlist.length > 0">
    <transition name="normal">
    <div class="normal-player" v-show="fullScreen">
      <div class="background"> 
        <img width="100%" height="100%" :src="currentSong.image"/>
      </div>
      <div class="top">
        <div class="back"  @click="back">
          <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="currentSong.name"></h1>
        <h2 class="subtitle" v-html="currentSong.singer"></h2>
      </div>
      <div class="middle" 
       @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd">
        <div class="middle-l" ref="middleL">
          <div class="cd-wrapper" ref="cdWrapper">
            <div class="cd" ref="imageWrapper">
              <img ref="image" :class="cdCls" class="image" :src="currentSong.image" />
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">
              {{playingLyric}}
            </div>
          </div>
        </div>
        <Scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current': currentLineNum ===index}"
                   v-for="(line,index) in currentLyric.lines"
                   :key="index"
                >{{line.txt}}</p>
              </div>
              
            </div>
          </Scroll>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot" :class="{'active':currentShow==='cd'}"></span>
          <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l">{{currentTime | showDate}}</span>
          <div class="progress-bar-wrapper"> 
            <ProgressBar :percent="percent" @percentChange = 'percentChange'> </ProgressBar>
          </div>
          <span class="time time-r">{{currentSong.duration | showDate}}</span>
        </div>
        <div class="operators">
          <div class="icon i-left" @click="changeMode">
            <i :class="iconMode"></i>
          </div>
          <div class="icon i-left">
            <i class="icon-prev" @click="prev"></i>
          </div>
          <div class="icon i-center" >
            <i :class="playIcon" @click="togglePlaying"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-next" @click="next"></i>
          </div>
          <div class="icon i-right">
            <i @click="toggleFavorite(currentSong)" class="icon" :class="favoriteIcon"></i>
          </div>
        </div>
      </div>
    </div>
    </transition>
    <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="open" ref="miniplayer">
       <div class="icon">
          <div class="imgWrapper" ref="miniWrapper">
            <img ref="miniImage" width="40" height="40" :src="currentSong.image" :class="cdCls">
          </div>
        </div>
        <div class="maskk" ref="maskk"></div>
        <div class="mask">
        <div class="text" ref="text">
          <div class="inner" ref="inner">
          <p class="name" ref="name">{{currentSong.name}}--{{currentSong.singer}}</p>
          <p class="name"  v-show="doubleSongname">{{currentSong.name}}--{{currentSong.singer}}</p>
          <!-- <p class="desc" v-html="currentSong.singer"></p> -->
          </div>
        </div>
        </div>
        <div class="control" @click.stop="togglePlaying">
       <ProgressCircle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          </ProgressCircle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
    </div>
    </transition>
    <audio :src="currentSong.url" ref="audio" @playing="ready"  @error="error"  @timeupdate="updateTime"
    @ended="end"> </audio>
    <PlayList ref="playlist"></PlayList>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import {formatDate} from '../../common/js/utils'
import {shuffle} from '../../common/js/util'
import ProgressBar from './ProgressBar'
import {playMode} from '../../common/js/config'
import Lyric from 'lyric-parser'
import Scroll from '../../base/Scroll'
  import { prefixStyle } from '../../common/js/dom'
  import PlayList from '../PlayList'
  import ProgressCircle from '../../base/progress-circle'
   import { playerMixin } from '../../common/js/mixin'



 const timeExp = /\[(\d{2}):(\d{2}):(\d{2})]/g
  const transform = prefixStyle('transform')
   const transitionDuration = prefixStyle('transitionDuration')
export default {
  components: {
    ProgressBar,
    Scroll,
    PlayList,
    ProgressCircle
  },
  data() {
    return{
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      playingLyric: '',
      currentShow: 'cd',
      radius: 32,
      doubleSongname: false
    }
  },
  name: 'Player',
  computed: {
    ...mapGetters(["currentIndex", "fullScreen", "playing", "playlist","currentSong",'mode','sequenceList', 'favoriteList']),
     playIcon () {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
     percent () {
        return this.currentTime / this.currentSong.duration
      },
    iconMode() {
      return this.mode === playMode.sequence? 'icon-sequence' : this.mode === playMode.loop? 'icon-loop' : 'icon-random'
    },
     miniIcon () {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
        favoriteIcon () {
      return this.getFavoriteIcon(this.currentSong)
    }
      
  },
  created() {
    this.touch = {}
    
  },
  // mounted() {
  //   setTimeout(() => {
  //     this.textScroll()
  //   }, 20);
  // },
  
  methods: {
    ...mapMutations({
      _setFullScreen: '_setFullScreen',
      _setPlaying: '_setPlaying',
      _setcurrentIndex: '_setcurrentIndex',
      _setMode: '_setMode',
      _setPlaylist: '_setPlaylist'
    }),
      ...mapActions([
        'savePlayHistory',
         'saveFavoriteList',
      'deleteFavoriteList'
      ]),
       toggleFavorite (song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
      
    },
    getFavoriteIcon (song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    isFavorite (song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    textScroll() {
      let nameWidth = this.$refs.name.offsetWidth
      
      let textWidth = this.$refs.text.offsetWidth
      let inner =  this.$refs.inner
      let text = this.$refs.text
      let mask = this.$refs.maskk
        console.log(textWidth);
        console.log(nameWidth);
        text.scrollLeft = 0
         if(textWidth > nameWidth -70 ){
           mask.style.background = `rgba(184,197,203,0)`
            return} else {this.doubleSongname = true
            // this.songReadyy = true
            }
        // inner.innerHTML += inner.innerHTML;
        
    this.init =  setInterval(function(){
            if(nameWidth < text.scrollLeft){
                text.scrollLeft -= nameWidth;}
                
            else if(  text.scrollLeft === nameWidth -15) {
              mask.style.background = `linear-gradient(to right, rgba(184,197,203,0),rgba(244,246,248, 0) 15%, rgba(244,246,248, 0) 85%,rgba(184,197,203,1) 100%)`
              
            }
             else {
              text.scrollLeft++;
              mask.style.background = `linear-gradient(to right, rgba(184,197,203,1),rgba(244,246,248, 0) 15%, rgba(244,246,248, 0) 85%,rgba(184,197,203,1) 100%)`
            }
        }, 30);

        // clearInterval(init)

      
    // }
    

        
      
    },
    percentChange(percent) {
      this.$refs.audio.currentTime = percent * this.currentSong.duration
      if (this.currentLyric) {
        this.currentLyric.seek(this.$refs.audio.currentTime * 1000)
      }
    },
    back() {
      
      this._setFullScreen(false)
      console.log(this.currentSong.url);
      // setTimeout(() => {
      //   this.textScroll()
      // }, 20);
    },
    open() {
      this._setFullScreen(true)
    },
    togglePlaying() {
      this._setPlaying(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
      console.log(this.$store.state.favoriteList);
    },
    prev() {
      // clearInterval(this.init)
      //   this.doubleSongname =false
      if(!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
          this.loop()
        }else {
          let index = this.currentIndex +1
      if(index === this.playlist.length) {
        index = 0
      }
      this._setcurrentIndex(index)
      if(!this.playing) {
        this.togglePlaying()
      }
        }
      
       this.songReady =false
    },
    next() {
      // clearInterval(this.init)
      //   this.doubleSongname =false
      if(!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
          this.loop()
        }else {
          let index = this.currentIndex -1
      if(index === -1) {
        index = this.playlist.length -1
      }
      this._setcurrentIndex(index)
       if(!this.playing) {
        this.togglePlaying()
      }
        }
      
      this.songReady = false
    },
    ready() {
      
      
        this.textScroll()
      
          
        
      clearTimeout(this.timer)
        // 监听 playing 这个事件可以确保慢网速或者快速切换歌曲导致的 DOM Exception
        this.songReady = true
        this.canLyricPlay = true
        this.savePlayHistory(this.currentSong)
        // 如果歌曲的播放晚于歌词的出现，播放的时候需要同步歌词
        if (this.currentLyric && !this.isPureMusic) {
          this.currentLyric.seek(this.currentTime * 1000)
        }
    },
    error(){
      this.songReady = true
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    changeMode() {
      const mode = (this.mode +1) % 3
     this._setMode(mode)
     let list = null
     if(mode === playMode.random) {
      list = shuffle(this.sequenceList)
     }else {
       list = this.sequenceList
     }
     this.resetCurrentIndex(list)
     this._setPlaylist(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item)=>{
        return item.id ===this.currentSong.id
      })
      this._setcurrentIndex(index)
    },
    
    end() {
      
      clearInterval(this.init)
        this.doubleSongname =false
        // this.songReadyy = false
        
      if(this.mode === playMode.loop){
        this.loop()
      }else{
        this.next()
      }
      
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    getLyric () {
        this.currentSong.getLyric().then((lyric) => {
          if (this.currentSong.lyric !== lyric) {
            return
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          this.isPureMusic = !this.currentLyric.lines.length
          if (this.isPureMusic) {
            this.pureMusicLyric = this.currentLyric.lrc.replace(timeExp, '').trim()
            this.playingLyric = this.pureMusicLyric
          } else {
            if (this.playing && this.canLyricPlay) {
              // 这个时候有可能用户已经播放了歌曲，要切到对应位置
              this.currentLyric.seek(this.currentTime * 1000)
            }
          }
        }).catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
      },
     handleLyric ({ lineNum, txt }) {
        if (!this.$refs.lyricLine) {
          return
        }
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
    middleTouchStart(e) {
      this.touch.initiated = true
      this.touch.directionLocked = ''
      this.touch.startX = e.touches[0].pageX
      this.touch.startY = e.touches[0].pageY
      this.touch.moved = false
      
    },
    middleTouchMove(e) {
      if(!this.touch.initiated) {
          return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const deltaY = e.touches[0].pageY - this.touch.startY
      
      if(!this.touch.directionLocked) {
        if(Math.abs(deltaX) > Math.abs(deltaY)) {
          this.touch.directionLocked = 'h'
        } else if (Math.abs(deltaX) >= Math.abs(deltaY)){
          this.touch.directionLocked = 'v'
        }
      }
      if(this.touch.directionLocked === 'v') {
        return
      }
      if(!this.touch.moved) {
        this.touch.moved = true
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0,Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style[transitionDuration] = 0
    },
    middleTouchEnd () {
        if (!this.touch.moved) {
          return
        }
        let offsetWidth
        let opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const time = 300
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
        this.touch.initiated = false
      },
      showPlaylist() {
        this.$refs.playlist.show()
      }
        
  },
  watch: {
    // currentIndex(newVal){
    //    if(newVal) {
          
    //    }
    // },
    
    // fullScreen(newVal){
    //   if(newVal) {
    //     clearInterval(this.init)
    //     this.doubleSongname =false
    //     return
    //   }
    //   if(!newVal ) {
    //     setTimeout(() => {
    //       this.textScroll()
    //     }, 20);
    //   }
    // },
    $route: {
      handler(n,o) {
        if(!n.params.id && n.path !== '/rank'  && n.path !== '/search') {
          this.$refs.miniplayer.style.bottom = 50 +'px'
        }else {
          this.$refs.miniplayer.style.bottom = 0 +'px'
        }
        // console.log(n);
        if(n.path === '/search' ) {
          this.$refs.miniplayer.style.display = 'none'
        }else{
          this.$refs.miniplayer.style.display = 'flex'
        }
        
      }
    },
    currentSong(newSong,oldSong) {
      if(newSong) {
        clearInterval(this.init)
        this.doubleSongname =false
        //  setTimeout(() => {
        //   this.textScroll()
        // }, 20);
      }
      if(newSong.id === oldSong.id){
        return
      }
      if(this.currentLyric) {
        this.currentLyric.stop()
      }
      setTimeout(() => {
        this.$refs.audio.play()
        this.getLyric()
      },1000)
    },                                              
    playing(newPlaying) {
      if(!newPlaying) {
        clearInterval(this.init)
        this.doubleSongname =false
      }
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying? audio.play() : audio.pause()
      })
      
    }
  },
  filters: {
    showDate: function (value) {
      if(value<1000){
        let date = new Date(value * 1000);
      return formatDate(date, "m:ss");
      }
      else {
        let date = new Date(value);
      return formatDate(date, "m:ss");
      }
      
    },
  },
 
};
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.player 
  .normal-player 
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    &.normal-enter-active, &.normal-leave-active
      transition: all 0.4s
      .top, .bottom
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity: 0
      .top
        transform: translate3d(0, -100px, 0)
      .bottom
        transform: translate3d(0, 100px, 0)
    .top
      position: relative
      margin-bottom: 25px
      .back
        position absolute
        top: 0
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 9px
          font-size: $font-size-large-x
          color: $color-theme
          transform: rotate(-90deg)
      .title
        width: 70%
        margin: 0 auto
        line-height: 40px
        text-align: center
        no-wrap()
        font-size: $font-size-large
        color: $color-text
      .subtitle
        line-height: 20px
        text-align: center
        no-wrap()
        font-size: $font-size-medium
        color: $color-text
    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
    .middle
      position fixed
      width: 100%
      top: 80px
      bottom: 170px
      white-space: nowrap
      font-size: 0
      .middle-l
        display inline-block
        vertical-align top
        position: relative
        width: 100%
        height: 0
        padding-top: 80%
        .cd-wrapper
          position: absolute
          left: 10%
          top: 0
          width: 80%
          box-sizing: border-box
          height: 100%
          .cd
            width: 100%
            height: 100%
            border-radius: 50%
            .image
              position: absolute
              left: 0
              top: 0
              width: 100%
              height: 100%

              border-radius: 50%
              border: 10px solid rgba(255, 255, 255, 0.1)
            .play
              animation: rotate  20s linear infinite
            .pause
              animation-play-state paused 
        .playing-lyric-wrapper
          width: 80%
          margin: 30px auto 0 auto
          overflow: hidden
          text-align: center
          .playing-lyric
            height: 20px
            line-height: 20px
            font-size: $font-size-medium
            color: $color-text-l
      .middle-r
          display: inline-block
          
      
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
            .pure-music
              padding-top: 50%
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
    .bottom
      position: absolute
      bottom: 50px
      width: 100%
      .dot-wrapper
        text-align: center
        font-size: 0
        .dot
          display inline-block
          vertical-align top
          margin: 0 4px
          width: 8px
          height: 8px
          border-radius: 50%
          background: $color-text-l
          &.active
            width: 20px
            border-radius: 5px
            background: $color-text-ll
      .progress-wrapper
        display: flex
        align-items: center
        width: 80%
        margin: 0px auto
        padding: 10px 0
        .progress-bar-wrapper
            flex: 1
        .time
          display inline-block
          color: $color-text
          font-size: $font-size-small
          flex: 0 0 30px
          line-height: 30px
          width: 30px
          &.time-l
            text-align: left
          
          &.time-r
            text-align: right
          
      .operators
        display: flex
        align-items: center
        .icon
          flex: 1
          color: $color-theme
          i
            font-size: 30px
        .i-left
          text-align: right
        .i-center
          padding: 0 20px
          text-align: center
          i
            font-size: 40px
        .i-right
          text-align: left
        .icon-favorite
          color: $color-sub-theme
          
  .mini-player
    display: flex
    align-items: center
    position: fixed
    left: 0
    bottom: 50px
    border-radius 0 30px 30px 0
    z-index: 180
    width: 100%
    height: 60px
    background: #b8c5cb
    transition: all 0.4s
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .icon
      -webkit-box-flex: 0;
      flex: 0 0 40px
      width: 40px
      height: 40px
      padding: 0 10px 0 20px
      .imgWrapper
        height: 100%
        width: 100%
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
    .maskk 
      position absolute
      height 22px
      left 65px
      right 105px
      // background: linear-gradient(to right, rgba(184,197,203,1),rgba(244,246,248, 0) 15%, rgba(244,246,248, 0) 85%,rgba(184,197,203,1) 100%)
      z-index 101
      
    .mask
      display: flex
      position relative
      right -30px
      flex-direction: column
      justify-content: center
      z-index 100
      flex: 1
      line-height: 20px
      overflow: hidden
      margin-right  35px
      
      
      .text
        position relative
        left 0
        top 0
        z-index 1
        height 100%
        width 100%
        overflow: hidden
        .inner
          margin-bottom: 2px
          font-size: $font-size-medium
          color: $color-text-ll
          width 1000px
          height 20px
          overflow: hidden
          .name
            display inline-block
            padding-right  70px
      .desc
        no-wrap()
        font-size: $font-size-small
        color: $color-text-ll
    .control
      flex: 0 0 30px
      
      padding 0 10px
      .progress-circle
        position relative
        left 5px
      .icon-play-mini, .icon-pause-mini
        font-size: 30px
        color: $color-text-ll
      .icon-mini
       
        font-size: 32px
        position: absolute
        left: 0
        top: 0
      .icon-playlist
        margin-right 10px
        font-size: 26px
        color: $color-text-ll
      
      
        

@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)
</style>


