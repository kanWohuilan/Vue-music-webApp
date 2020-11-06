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
        .song
          padding 0 20px
          display flex
          flex-direction column
          justify-content center
          
          
          .item
            flex 1
            height 60px
            margin-bottom 10px
            position relative
            
            img
              
              width 60px
              height 60px
              border-radius 8px
              
            .songName 
              display inline-block
              position relative
              top -22px
              margin-left 10px
              color $color-text-hd
            .icon
              position absolute
              right 0
              top 20px
              height 25px
              width 25px
             
              
              
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