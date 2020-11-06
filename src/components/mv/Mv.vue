<template>
  <div class="mv">
   <transition name="searchh">
  <div class="search" v-show="searchShow">
  <div class="search-box-wrapper" >
      <SearchBox ref="searchBox"  @click.native="toSearch"></SearchBox>
    </div>
  </div>
  </transition>
  <Scroll ref="scroll" class="mv-content" :data ='Mvs' :click = 'true' :listenScroll ='true' @scroll='scroll' :probeType = '3'
      >

    <div>
     <div class="placeholder"></div> 
  <div class="list-title">
        <h1>Mv精选</h1>
        <span>更多MV </span>
      </div>
     <div class="recommendmv">
    <ul class="recommendmv-wrapper"> 
      <li class="recommendmv-item" v-for="(item,index) in recommendMv" :key="index">
         
        <span class="playcount">
          <Icon name= 'playicon' class="icon" scale = '1.1'/>
          {{item.playCount}}</span>
        <img :src="item.picUrl" alt="" >
        <div class="content">
          <h1 class="name">{{item.name}}</h1>
          <!-- <span v-for="(s,index) in item.artists" :key="index">{{mvName(item.artists)}}</span> -->
          <span class="artists">{{ aname(item.artists)}} </span>
        </div>
      </li>
    </ul>
  </div>
  <div class="list-title">
        <h1>更多精彩MV</h1>
        <span>MV分类</span>
      </div>
       <div class="newmv">
    <ul class="newmv-wrapper"> 
      <li class="newmv-item" v-for="(item,index) in Mvs" :key="index">
         <div class="item">
           <Icon name= 'playsolid' class="playsolid" scale = '4'/>
           <span class="playcount">
          <Icon name= 'playicon' class="icon" scale = '1.1'/>
          {{item.playCount}}</span>
           <img :src="item.picUrl" alt=""  ></div>
        
        <div class="content">
          <h1 class="name">{{item.name}}</h1>
          <h1 class="artistName">{{item.artistName}}</h1>
          <!-- <img :src="item.avatar" alt="" width="25" height="25"> -->
        </div>
        
      </li>
    </ul>
  </div>
  </div>
  </Scroll>
 
  </div>
</template>

<script>
   import SearchBox from '../../base/SearchBox'
   import { getnewMv ,getrecommendMv,getartist} from '../../api/getData'
   import Icon from 'vue-svg-icon/Icon.vue'
   import Scroll from '../../base/Scroll'
   import {Mv} from '../../common/js/song'
export default {
  components: {
  SearchBox,
  Icon,
  Scroll
  },
  data() {
  return{ 
    searchShow: true,
    recommendMv: [],
    Mvs: []
  }
},
  created() {
    this._getnewMv()
  },
  mounted() {
    console.log(this.Mvs);
  },
  methods: {  
     toSearch() {
        this.$router.push({
          path: '/search'
        })
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
    aname(n) {
      if(n.length > 1) {
        return n[0].name + '/' + n[1].name
      }else {
        return n[0].name
      }
    },
    _getnewMv() {
      getnewMv().then(res => {
        // this.newMv = res.data
        console.log(res);
        res.data.forEach(mv => {
          let m = new Mv (mv)
          this.Mvs.push(m) 
          // m. getavatar()
          
        });
      })
      getrecommendMv().then(res => {
        console.log(res);
        this.recommendMv = res.result
        
      })
      
      getartist(768306).then((res) => {
        console.log(res);
      })
   
    }}
    
}
</script>

<style lang="stylus" scoped>
  @import "~@/common/stylus/variable"
    @import "~@/common/stylus/mixin"
.mv
  position fixed
  top 44px
  bottom 0
  left 0
  width 100%
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
  .mv-content
    position fixed
    bottom 50px
    top 44px
    .placeholder
      height 50px
      width 100%
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
    .recommendmv
      .recommendmv-wrapper
        padding 0 20px
        display flex
        width 100%
        flex-wrap wrap
        justify-content space-between
        
        .recommendmv-item
          position relative
          flex 0 0 48%
          margin-bottom 10px
         
          
          .playcount
            position absolute  
            right 5px
            top 5px
            color $color-text-ll
            font-size 8px
            .icon
              color $color-text-ll
          img 
            border-radius 6px
            width 100%
          .content
            width 100%
            .name
              font-size 16px
              font-weight 500
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break: break-all;
              overflow hidden
              color $color-text-hd
              margin  5px 0
              line-height 20px
            .artists
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
    .newmv
     
     .newmv-wrapper
      
      margin 0 20px
      .newmv-item
        margin-bottom 15px
        
        
        .item
          width 100%
          margin 10px 0 
          padding-top 60%
          height: 0;
          position relative
          .playsolid
            position absolute  
            top 50%
            left  50%
            transform translate(-50%,-50%)
            color rgba(255, 255, 255, .4)
            z-index 100
          .playcount
            position absolute  
            z-index 10
            right 8px
            top 8px
            color $color-text-ll
            font-size 12px
            .icon
              color $color-text-ll
          img 
            position absolute
            top 0
            left 50%
            border-radius: 5px;
            transform translate(-50% , 0)
            height 100%
            width 100%
        .content
          margin 10px 0
          .name
            font-weight 800
            color $color-text-d
          .artistName
            font-size 15px
            line-height 24px
            
          
</style>