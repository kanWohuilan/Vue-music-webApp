<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text" class="box" ref="input" :placeholder='placeholder'  v-model="query" >
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
import {debounce} from '../common/js/util'
export default {
  name: 'SearchBox',
  props: {
    placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    
  },
  data() {
    return {
      query: ''
    }
  },
  methods: {
    clear() {
      this.query = ''
    },
    setQuery(query) {
      this.query = query
    },
    focus() {
      this.$refs.input.focus()
    },
    blur() {
         this.$refs.input.blur()
    }
  },
  watch: {
    $route:{
      handler(val,oldval){
        if(val.path === '/search') {
          this.focus()
        }else {
          this.blur()
        }
      },
    },
  },
 
   created () {
      this.$watch('query',debounce((newQuery) => {
        this.$emit('query' ,newQuery)
      },300))
    }
}
</script>

<style lang="stylus" scoped>
  @import "~@/common/stylus/variable"
.search-box
  display flex
  align-items center
  height 35px
  width 100%
  padding 0 6px
  background: #fff
  border-radius: 20px
  .icon-search
    font-size: 24px
    color: rgba(0, 0, 0, 0.5)
  .box
    flex: 1
    margin: 0 5px
    line-height: 18px
    background: #fff
    // color: $color-text
    font-size: $font-size-medium
    outline  0
    color rgba(0, 0, 0, 0.8)
    caret-color  $color-theme
    &::-webkit-input-placeholder
      color: rgba(0, 0, 0, 0.4)
  .icon-dismiss
    font-size: 16px
    color: rgba(0, 0, 0, 0.5)
</style>