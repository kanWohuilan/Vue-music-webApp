<template>
  <div class="wrapper" ref="wrapper">
    
      <slot> 
      </slot>
    </div>
  
</template>
#ff
<script>
import BScroll from 'better-scroll'
  const DIRECTION_H = 'horizontal'
  const DIRECTION_V = 'vertical'
export default {
  props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: false
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: null
      },
      pullup: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      },
      pulldown: {
        type: Boolean,
        default: false
      },
      
      directionLockThreshold: {
        type: Number,
        default: 0
      },
  },
  name:'Scroll',
  mounted() {
    setTimeout(() => {
      this._Initscroll()
    },20)
  },
  methods: {
    _Initscroll(){
      if(!this.$refs.wrapper){
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper,{
        probeType: this.probeType,
        click: this.click,
        //  eventPassthrough: this.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V,
        //   directionLockThreshold: this.directionLockThreshold
      })
      if(this.listenScroll) {
        this.scroll.on('scroll',(pos) => {
          this.$emit('scroll',pos)
        })
      }
      if(this.pullup) {
        this.scroll.on('scrollEnd',() => {
          if(this.scroll.y <= this.scroll.maxScrollY + 50) {
            this.$emit('scrollToEnd')
          }
        })
      }
       if (this.pulldown) {
        this.scroll.on('touchEnd', (pos) => {
          // 下拉动作
          if (pos.y > 50) {
            this.$emit('pulldown',pos)
            console.log('正在刷新')
          }
        })
      }
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data() {
        setTimeout(() => {
      this.refresh()
    },20)
    }
    
  }
}
</script>

<style>

</style>