<template>
  <div id="app">
     
    <Header/>
   
    <TabBar/>
     <keep-alive>
    <router-view></router-view>
     </keep-alive>
    <player> </player>
  </div>
 
</template>

<script>
import Header from './components/header/Header'
import TabBar from './components/tabbar/TabBar'
import player from './components/player/Player'

export default {
  name: 'App',
  components: {
    Header,
    TabBar,
    player,
   
  }
}
</script>

<style lang="stylus">
 @import "~@/common/stylus/reset.css";
 @import "~@/common/stylus/index.styl";

 
</style>
