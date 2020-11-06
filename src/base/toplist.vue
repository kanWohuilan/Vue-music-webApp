<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots" v-show="dotsShow">
      <span class="dot" v-for="(item,index) in dots" :key="item" :class="{active: currentPageIndex === index}"> </span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { addClass } from '../common/js/dom'
  import BScroll from 'better-scroll'
  export default {
    name: 'newsongs',
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      },
      dotsShow: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    mounted () {
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()
        if(this.autoPlay) {
          this._paly()
        }
      }, 20)
      window.addEventListener('resize',() =>{
        if(!this.slider) {
          return
        }
        this._setSliderWidth (true)
        this.slider.refresh()
      })
      
  
    },
    methods: {
     refresh () {
        if (this.slider) {
          this._setSliderWidth(true)
          this.slider.refresh()
        }
      },
      _setSliderWidth (isResize) {
        this.children = this.$refs.sliderGroup.children
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          this.children[i].classList.add('slider-item')
          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider () {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          },
          click:true
        })
        this.slider.on('scrollEnd',() => {
          let pageIndex = this.slider.getCurrentPage().pageX
          
          this.currentPageIndex = pageIndex
          if(this.autoPlay) {
            clearTimeout(this.timer)
            this._paly()
          }
        })
        
      },
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      _paly() {
        
      this.timer = setTimeout(() => {
          this.slider.next()
        }, this.interval)
      }
      
     
      
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  .slider
    position relative
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        align-content center
        
        .detail
          margin  0 20px
          position relative
          height 100px
          border-radius 20px
          .bgImg
            position absolute
            left 0
            top 0
            width 100%
            height 100%
            opacity: 0.6
            // filter: blur(20px)
            z-index -1
            vertical-align middle
            background-color #d7d7d7
            border-radius 10px
          img 
            background-size 100px 100px
            width 100px
            height 100px
            border-radius 10px
            // box-sizing: border-box
          .tracks
            display flex
            flex-direction column
            position absolute
            left 115px
            top 50%
            transform translate(0 ,-50%)
            width 60%
            
            .title
              margin-bottom 5px
              .title-a
                font-size 14px
                color $color-text-hd
                font-weight 700
              .title-b
                font-size 5px
            .song
              text-overflow: ellipsis
              overflow: hidden
              white-space: nowrap
              font-size 11px
              padding-top 5px
              color $color-text-d
              .num
                padding-right 5px
                font-size 14px
                font-weight 700
                color $color-text-hd
              
              
                
                
              
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 18px
      transform: translateZ(1px)
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 3px
        width: 6px
        height: 6px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>