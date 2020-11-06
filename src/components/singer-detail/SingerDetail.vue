<template>
  <div class="singer-detail">
    <MusicList :songs = 'songs[0]' :bgImage = 'singer.avater' :title= 'singer.name'> </MusicList>
  </div>
</template>

<script>
import {getSingerDetail} from '../../api/singer'
 import { ERR_OK } from '../../api/config'
import {mapGetters} from 'vuex'
import { createSong, isValidMusic, processSongsUrl } from '../../common/js/song'
import MusicList from '../musicList/MusicList'
export default {
  name:'SingerDetail',
  components: {
    MusicList,
  },
  computed : {
    title() {
      return this.singer.name
    },

    ...mapGetters([
      'singer'
    ])
  },
  data() {
    return {
      songs: [],
    }
  },
  created () {
      this._getDetail()
    },
  methods: {
    _getDetail () {
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            processSongsUrl(this._normalizeSongs(res.data.list)).then((songs) => {
              this.songs.push(songs)
              console.log(songs);
              this.songs.push(this._normalizeSongs(res.data.list))
            })
          }
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          let { musicData } = item
          
            ret.push(createSong(musicData))
          
        })
        return ret
      }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/common/stylus/variable"
  

.singer-detail
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  z-index 100
  background: $color-background 

</style>