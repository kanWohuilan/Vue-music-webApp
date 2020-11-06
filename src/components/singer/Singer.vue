<template>
<div class="wrapper">
  <transition name="slider">
    <router-view> </router-view>
     </transition>
   <transition name="searchh">
  <div class="search" v-show="searchShow">
  <div class="search-box-wrapper" >
      <SearchBox ref="searchBox"  @click.native="toSearch"></SearchBox>
    </div>
  </div>
  </transition>
  <div class="singer" ref="singer">
  
    <ListView :data='singers' @select ='selectSinger' class="list" ref="list" @scroll = 'scroll'/>
    
  </div>
  </div>
</template>

<script type="text/ecmascript-6">
 import SearchBox from '../../base/SearchBox'
  import ListView from '../../base/ListView'
  import { getSingerList } from '../../api/singer'
  import { ERR_OK } from '../../api/config'
  import Singer from '../../common/js/singer'
  import { playlistMixin } from '../../common/js/mixin'
  import {mapMutations} from 'vuex'
 
 

  const HOT_SINGER_LEN = 10
  const HOT_NAME = '热门'

  export default {
    mixins: [playlistMixin],
    data () {
      return {
        singers: [],
        searchShow: true,
      }
    },
    created () {
      this._getSingerList()
    },
    methods: {
      scroll(y) {
        console.log(y);
        if(y < -30) {
          this.searchShow = false
          // this.$refs.singer.style.top = 0 + 'px'
        }else {
          this.searchShow = true
          // this.$refs.singer.style.top = 100 + 'px'
        }
      },
       toSearch() {
        this.$router.push({
          path: '/search'
        })
      },
      ...mapMutations({
        setSinger: '_setSinger'
      }),
       handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
        // this.$store.state.commut()
      },
     
      _getSingerList () {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      _normalizeSinger (list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            })
          )
        })
        // 为了得到有序列表，我们需要处理 map
        let ret = []
        let hot = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
     
    },
    components: {
      ListView,
      SearchBox
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.wrapper
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
  .singer
    position: fixed
    top: 44px
    bottom: 0
    width: 100%
    transition all .3s
  .slider-enter-active, .slider-leave-active
    transition all .3s
  .slider-enter, .slider-leave-to
    transform: translate3d(100%,0,0)
</style>
