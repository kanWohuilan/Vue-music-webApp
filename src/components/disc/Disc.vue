<template>
  <transition appear name="slide">
    <MusicList :title="title" :bg-image="bgImage" :songs="songs" class="MusicList"></MusicList>
  </transition>
</template>

<script>
import MusicList from '../musicList/MusicList'
import { getSongList } from '../../api/recommend'
  import { ERR_OK } from '../../api/config'
  import { mapGetters } from 'vuex'
  import { createSong, isValidMusic, processSongsUrl } from '../../common/js/song'
  import {getplaylist,getsongUrl,getlyricl } from '../../api/getData'
  import axios from 'axios'
  import {Song2 } from '../../common/js/song'

export default {
  name:'disc',
  computed: {
      title () {
        return this.disc.dissname || this.disc.name
      },
      bgImage () {
        return this.disc.imgurl || this.disc.coverImgUrl
      },
      ...mapGetters([
        'disc'
      ])
    },
    data () {
      return {
        songs: []
      }
    },
    created () {
      this._getSongList()
      this._getplaylist()
    },
    methods: {
      _getSongList () {
        if (!this.disc.dissid) {
          // this.$router.push('/recommend')
          return
        }
        getSongList(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then((songs) => {
              this.songs = songs
            })
          }
        })
      },
      _getplaylist() {
        let songs = {
          item: []
        }
        if(!this.disc.id){
          // this.$router.push('/recommend')
          return
        }
        // axios.all([getplaylist(this.disc.id),get])
        getplaylist(this.disc.id).then((res) => {
          console.log(res.playlist.tracks);
          res.playlist.tracks.forEach(song => {
            songs.item.push(new Song2(song))
          })
        })

        this.songs = songs.item
        
        
       console.log(songs);
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((musicData) => {
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)


</style>