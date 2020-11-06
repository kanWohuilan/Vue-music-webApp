import { getLyric, getSongsUrl } from '../../api/song'
import { ERR_OK } from '../../api/config'
import { Base64 } from 'js-base64'
import { getlyricl,getsongdetail,getartist } from '../../api/getData'


export default class Song {
  constructor ({ id, mid, singer, name, album, duration, image, url ,lyric}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.filename = `C400${this.mid}.m4a`
    this.url = url
    this.lyric =lyric
  }

  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}

export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: musicData.url
  })
}

function filterSinger (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

export function isValidMusic (musicData) {
  return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0)
}

export function processSongsUrl (songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return getSongsUrl(songs).then((purlMap) => {
    songs = songs.filter((song) => {
      const purl = purlMap[song.mid]
      if (purl) {
        song.url = purl.indexOf('http') === -1 ? `http://dl.stream.qqmusic.qq.com/${purl}` : purl
        return true
      }
      return false
    })
    return songs
  })
}
export function createNSong (musicData,musicData2,musicData3) {
  return new Song({
    id: musicData2.id,
    // mid: musicData.songmid,
    singer: musicData2.song.artists[0].name,
    name: musicData2.name,
    album: musicData2.song.album.name,
    duration: musicData2.song.duration/1000,
    image: musicData2.picUrl,
    url: musicData.url,
    lyric:musicData3.lrc.lyric
  })
}

export class Song2 {
  constructor(track) {
    this.name = track.name
    this.id = track.id
    this.album = track.al.name
    this.singer = track.ar[0].name
    this.image = track.al.picUrl
    // this.duration =musicData2.song.duration/1000,
    // this.image=musicData2.picUrl,
    // this.url= musicData.url,
    // this.lyric=musicData3.lrc.lyric
    
  }
  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getlyricl(this.id).then((res) => {
         
          this.lyric = res.lrc.lyric
          resolve(this.lyric)
        
      })
    })
  }
  getduration() {
    if (this.duration) {
      return Promise.resolve(this.duration)
    }

    return new Promise((resolve, reject) => {
      getsongdetail(this.id).then((res) => {
         
          this.duration = res.songs[0].dt/1000
          resolve(this.duration)
        
      })
    })
  }
}
export class Mv {
  constructor(item) {
    this.picUrl = item.cover
    this.id =  item.artistId
    this.name = item.name
    this.playCount =item.playCount
    this.artistName = item.artistName
  }
  getavatar () {
    if (this.avatar) {
      return Promise.resolve(this.avatar)
    }
    return new Promise((resolve, reject) => {
      getartist(this.id).then((res) => {
         
          this.avatar = res.artist.img1v1Url
          resolve(this.avatar)
        
      })
    })
  }
}



// export class Disc {
//   constructor(disc) {
//     this.imgurl = 
//   }
// }

