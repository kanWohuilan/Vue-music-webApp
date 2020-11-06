<template>
<div>
  <router-view> </router-view>
  <transition name="searchh">
  <div class="search" v-show="searchShow">
  <div class="search-box-wrapper" >
      <SearchBox ref="searchBox"  @click.native="toSearch"></SearchBox>
    </div>
  </div>
  </transition>
  <div class="recommend" ref="recommend">
    
    <Scroll ref="scroll" class="recommend-content" :data="discListF && newSongs" :click = 'true' :listenScroll ='true' @scroll='scroll' :probeType = '3'
    :pulldown ='true' @pulldown= 'pulldown'  >
      <div @touchend.prevent='reflashData'>
        
        <div class="placeholder"></div>
        <div class="reflash" ref="reflash"></div>
        <div class="reflash-text" ref="retext" v-show="false">已显示最新内容</div>
        <div v-if="recommends.length" class="slider-wrapper">
          <div class="slider-content">
            <slider ref="slider" :dotsShow='true'>
              <div v-for="(item,index) in recommends" :key="index">
                <a :href="item.linkUrl">
                  <img @load="loadImage" :src="item.picUrl">
                </a>
              </div>
            </slider>
          </div>
        </div>
        <div class="classIcon">
          <ul>
            <li v-for="(i,index) in iconName" :key="index" @click="toprank(index)">
              <div class="icon" ref="icon" :style="{ backgroundPosition: -35*index + 'px'} "></div>
              <span class="name">{{i}}</span>
            </li>
          </ul>
        </div>
        <div class="recommend-list">
          <div class="list-title">
            <h1>热门歌单推荐</h1>
            <span>更多歌单 </span>
          </div>
          <ul class="item-list ">
            <li  v-for="(item,index) in discListF" class="item" :key="index" @click="selectItem(item)">
              <div class="icon">
                <img width="105" height="105" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
          <div class="list-title">
            <h1>新歌推荐</h1>
            <span>更多新歌 </span>
          </div>
          <div class="newSongs">
         <newsongs ref="slider" :autoPlay= 'false'>
              <div v-for="(item,index) in newSongs" :key="index" class="slider-item">
                  <!-- <div v-for="song in item" :key="song">
                    
                   </div> -->
                  <div class="song" v-for="(i,index) in item" :key="index">
                    <div class="item" @click="playnewSong(i)">
                            <img @load="loadImage" :src="i.picUrl">
                    <h1 class="songName">{{i.name}} - {{i.song.artists[0].name}}</h1>
                    
                      <Icon name = 'songplay'  class="icon"/>
                    
                    </div>
                
                  </div>
               
              </div>
         </newsongs>
         
         </div>
         <div class="list-title">
            <h1>排行榜</h1>
            <span>更多 </span>
          </div>
          <div class="toplist">
            <toplist :autoPlay= 'false' ref="slider"> 
                <div v-for="(item,index) in topList" :key='index' class="slider-item">
                  <div class="detail" @click.stop="toToplist(item)"> 
                    <div class="bgImg"></div>
                    <img :src="item.coverImgUrl" alt="" width="100" height="100">
                    <div class="tracks">
                      <div class="title"><span class="title-a">{{toplistTitle(item.name)}}</span> <span class="title-b">{{item.updateFrequency}}</span></div>
                      <div v-for="(i,index) in item.tracks" :key="index" class="song">
                        <span class="num"> {{num(index+1)}}</span>
                        <span >{{i.first}} - {{i.second}}</span>
                      </div>
                    </div>
                  </div>
                </div>
            </toplist>
          </div>
        </div>
        
      </div>
      
    </Scroll>
    
  </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slider from '../../base/Slider'
  // import Loading from '../../base/loading/loading'
  import Scroll from '../../base/Scroll'
  import { getRecommend } from '../../api/recommend'
  import { getDiscList } from '../../api/recommend'
  import { ERR_OK } from '../../api/config'
   import { playlistMixin } from '../../common/js/mixin'
   import SearchBox from '../../base/SearchBox'
   import {getBanners ,getNewSongs,gethomePage,gettoplist,gettoplistdetail ,getsongUrl ,
   getlyricl ,getplaylist} from '../../api/getData'
   import  newsongs from '../../base/newsongs'
   import Icon from 'vue-svg-icon//Icon.vue'
  import toplist from '../../base/toplist'
    import {createNSong} from '../../common/js/song'
   import {mapMutations ,mapActions} from 'vuex'
   import axios from 'axios'
  

  export default {
       mixins: [playlistMixin],
       
    data () {
      return {
        recommends: [],
        discList: [],
        discListF: [],
        scrollY: -1,
        searchShow: true,
        iconName: ['排行榜','电台','视频','直播','歌手'],
        newSongs: [],
        topList: [],
        songdata : {},
        songlyricl: {}
      }
    },
    
    created () {
      
      this._getRecommend()
      this.banner()
      this._getDiscList()
      this._getNewSongs()
      this._gethomePage()
      this._gettoplist()
      this._gettoplistdetail()
    },
    activated () {
      setTimeout(() => {
        this.$refs.slider && this.$refs.slider.refresh()
      }, 20)
    },
    
    methods: {
      toprank(index) {
        if(index ===0 ) {
          this.$router.push({
            path: '/rank'
          })
        }
        if(index ===2) {
           this.$router.push({
            path: '/mv'
          })
        }
      },
      num(i) {
        
      return ('00'+i).slice(-2); 
       },
      
      toplistTitle(t) {
            let s = new String(t)
         return   s.substring(s.length-3)
      },
      banner() {
        getBanners({type:2}).then((res)=> {
          
        console.log(res);
      })
      },
       
      ...mapActions([
        'insertSong'
      ]),
      ...mapMutations({
        setDisc: '_setDisc',
        setSinger: '_setSinger'
      }),
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '111px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      selectItem(item) {
        
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
        console.log(this.$store.state.disc);
      },
      loadImage () {
        if (!this.checkloaded) {
          this.checkloaded = true
          setTimeout(() => {
            this.$refs.scroll.refresh()
          }, 20)
        }
      },
     
      _getRecommend () {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
            console.log(res.data.slider);
          }
        })
      },
      _getDiscList () {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
            this.discListF = this.discList.slice(0,6)         }
        })
      },
      _getNewSongs(){
        getNewSongs({limit:9}).then((res) => {
          let newong = this.division(res.result)
          newong.pop()
          this.newSongs = newong
          console.log(this.newSongs);
        })
      
      },
      _gethomePage() {
          gethomePage().then(res => {
            console.log(res);
          })  
      },   
      _gettoplist() {
          gettoplist().then(res => {
            console.log(res);
          })  
      }, 
      _gettoplistdetail() {
        gettoplistdetail().then(res => {
            
            this.topList = res.list.slice(0,3)
            console.log(this.topList);
          })  
      },     
       reflashData() {
         
         
        //  this.$refs.scroll.scrollTo(0,37,500)
         if(this.scrollY > 70) {
           
           this.$refs.reflash.style.display = `none`
           setTimeout(()=> {
             this.$refs.retext.style.display = `block`
           },100)
           
         }
       },
      scroll(pos) {
        this.scrollY = pos.y
        // console.log(this.scrollY);
        if(this.scrollY < -30) {
          this.searchShow = false 
          // this.$refs.recommend.style.top = 55 + 'px'
        }else {
          this.searchShow = true
          // this.$refs.recommend.style.top = 100 + 'px'
        }
      },
      pulldown(pos) {
        
        
        
        this._getRecommend()
      this.banner()
      this._getDiscList()
      this._getNewSongs()
       this._gettoplistdetail()
      },
      toSearch() {
        this.$router.push({
          path: '/search'
        })
      },
      division(arr) {
        let result = []
        for (let i = 0; i < arr.length; i+= 3) {
          result.push(arr.slice(i,i+3))
        }
        return result
      },
      playnewSong(i) {
        axios.all([getsongUrl(i.id),getlyricl(i.id)]).then(axios.spread((res,res2) => {
          console.log(res);
          // this.newsong = createNSong(res.data[0],i,res2)
          this.insertSong(createNSong(res.data[0],i,res2))
        }))
        // getsongUrl(i.id).then((res)=> {
        //   // console.log(createNSong(res.data[0],i))
        //   this.newsong = createNSong(res.data[0],i)
          
        //   this.songdata = res.data[0]
          
        //   // console.log(createNSong(res.data[0],i).duration)
        // })
        // getlyricl(i.id).then((res)=> {
        //   this.songlyricl =res
        //   // console.log(res);
        // })
        //     // this.insertSong(this.newsong)
          
        //   // this.$emit('select',item)
        //   setTimeout(() => {
        //     this.insertSong(createNSong(this.songdata,i,this.songlyricl))
        //     // console.log(this.songlyricl);
        //   }, );
      },
      toToplist(item) {
        this.$router.push({
          path: `/recommend/${item.id}`
        })
        this.setDisc(item)
        console.log(item);
      }
    },
    watch: {
      scrollY(newVal) {
        if(newVal === 0) {
          this.$refs.retext.style.display = `none`
          this.$refs.reflash.style.display = `block`
        }
        
      }
    },
    components: {
      Slider,
     SearchBox,
      Scroll,
      newsongs,
      Icon,
      toplist
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  .search
    position absolute
    width 100%
    z-index 1
    background #f2f2f2
    .search-box-wrapper
      margin 10px 16px
    &.searchh-enter-active, &.searchh-leave-active
      transition: all 0.3s 
    &.searchh-enter, &.searchh-leave-to
      opacity: 0
      transform translate3d(0,-100px,0)
  
  .recommend
    position: fixed
    width: 100%
    top: 44px
    bottom: 50px
    
    .recommend-content
      height: 100%
      overflow: hidden
      .reflash-text
        position relative
        left 50%
        transform translate(-15%,0)
        margin 10px 0 2px 0
        
      .reflash
        position: absolute;
        top 7px
        width: 100%;
        height: 40px;
        text-align center
        background-image url('./reflash.gif')
        background-repeat no-repeat
        background-size 40px 40px
        background-position 50% 50%
      .placeholder
        height 50px
        width 100%
      .slider-wrapper
        
        position: relative
        
        width: 100%
        height: 0
        padding-top: 40%
        overflow: hidden
        .slider-content
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
      .classIcon
        margin 20px 20px 10px 20px
        ul
          display flex
          text-align center
          justify-content space-between
          li
            flex 1
            
            
            .icon
              display inline-block
              background url('./sprite.png')  
              background-repeat no-repeat
              width 35px
              height 35px
            .name
              display block
              margin-top 5px
              font-size $font-size-medium
              color $color-text-hd

              
      .recommend-list
        
        .list-title
          position relative
          height: 65px
          line-height: 65px
          h1
            position absolute
            left 20px
            font-size: $font-size-large
            color: $color-text-hd
            font-weight 800
          span
            position absolute
            right 20px
            font-size $font-size-medium
            color $color-text-d
            vertical-align middle
            &:after
              content ""
              width 6px
              height 6px
              border-top: 1px solid $color-text-d;
              border-right: 1px solid $color-text-d;
              transform: rotate(45deg);
              display inline-block
              vertical-align middle
              margin-left 2px
              
              
        .item-list
          display flex 
          flex-wrap wrap
          justify-content: space-between
          padding 0 20px
          .item
            
            width 105px
            flex 0 0 100px
            display inline-block
            padding-bottom 10px
            .icon 
              padding-right: 20px
              img 
                border-radius 10px
            .text
              line-height: 20px
              overflow: hidden
              font-size: $font-size-medium
              .name
                margin-bottom: 5px
                color: $color-text-hd
              .desc
                line-height: 18px
                color: $color-text-hd
                font-size $font-size-small
                no-wrap()
          
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
