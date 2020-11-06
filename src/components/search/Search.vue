<template>
  <div class="search">
    <div class="top">
       <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h2 class="titlel" >搜索</h2>
   </div>
    <div class="search-box-wrapper">
      <SearchBox ref="searchBox" @query="onQueryChange"></SearchBox>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query" >
      <Scroll class="shortcut" :data = 'shortcut' ref="shortcut" :click = 'true'>
        <div>
        <div class="hot-key">
          <h1 class="title">热门搜索 </h1>
            <ul>
              <li class="item" v-for="(item,index) in hotKey" :key="index" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          
        </div>
        <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear"  @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
          </div>
          </div>
      </Scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query='query' @select = 'saveSearch' ref="suggest"> </suggest>
    </div>
    <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
    <router-view> </router-view>
    
  </div>
</template>

<script>

import SearchBox from '../../base/SearchBox'
import suggest from '../suggest/suggest'
import SearchList from '../search-list/search-list'
import { saveSearch } from '../../common/js/cache'
  import { getHotKey } from '../../api/search'
  import { ERR_OK } from '../../api/config'
  import { playlistMixin, searchMixin } from '../../common/js/mixin'
import {mapGetters ,mapActions} from 'vuex'
import Scroll from '../../base/Scroll'
import confirm from '../../base/confirm'
export default {
  mixins: [playlistMixin],
    name:'Search',
    components: {
      SearchBox,
      suggest,
      Scroll,
      SearchList,
      confirm
    },
    data () {
      return {
        hotKey: [],
        query: ''
      }
    },
    computed: {
      shortcut() {
        return this.hotKey.concat(this.searchHistory)
      },
      ...mapGetters([
        'searchHistory'
      ])
    },
    created () {
      this._getHotKey()
    },
    mounted() {
      // this.$refs.searchBox.$el.input.focus()
    },
    methods: {
        back() {
      this.$router.back()
    },
       handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''

        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()

        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
      },
       _getHotKey () {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
            console.log(this.hotKey);
          }
        })
      },
      addQuery(query){
        this.$refs.searchBox.setQuery(query)
      },
      onQueryChange(query) {
          this.query = query
      },
      saveSearch(item) {
        this.saveSearchHistory(this.query)
        console.log(this.searchHistory);
      },
      showConfirm() {
        this.$refs.confirm.show()
      },
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
        'clearSearchHistory'
      ])
      
    },
    watch: {
      query (newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    },
}
</script>

<style lang="stylus" scoped>
  @import "~@/common/stylus/variable"
.search
  position: fixed
  top 44px
  bottom  0
  z-index 100  !important 
  width 100%
  background $color-background
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
    .titlel
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
  .search-box-wrapper
    margin: 20px
  .shortcut-wrapper
    position: fixed
    top: 120px
    bottom: 0
    width: 100%
    .shortcut
      height: 100%
      overflow: hidden
      .hot-key
        margin: 0 20px 20px 20px
        .title
          margin-bottom: 20px
          padding-left 5px
          font-size: $font-size-large
          color: $color-text-hd
          font-weight 800
        .item
          display: inline-block
          padding: 5px 10px
          margin: 0 20px 10px 0
          border-radius: 6px
          background: #ffffff
          font-size: $font-size-medium
          color: $color-text-d
      .search-history
        position: relative
        margin: 0 20px
        .title
          display: flex
          align-items: center
          height: 40px
          
          .text
            flex: 1
            font-size: $font-size-large
            color: $color-text-hd
            font-weight 800
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
  .search-result
    position: fixed
    width: 100%
    top: 120px
    bottom 0
</style>