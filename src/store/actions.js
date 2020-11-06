import { saveSearch, clearSearch, deleteSearch, savePlay, saveFavorite, deleteFavorite } from '../common/js/cache'
import {playMode} from '../common/js/config'
import {shuffle} from '../common/js/util'
function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPaly = function({commit,state},{list,index}) {
  commit('_setPlaylist',list)
  commit('_setSequenceList',list)
  commit('_setcurrentIndex',index)
  commit('_setFullScreen',true)
  commit('_setPlaying',true)

}
export const randomPlay = function ({ commit }, { list }) {
  commit('_setMode', playMode.random)
  commit('_setSequenceList', list)
  let randomList = shuffle(list)
  commit('_setPlaylist', randomList)
  commit('_setcurrentIndex', 0)
  commit('_setFullScreen', true)
  commit('_setPlaying', true)
}
export const insertSong = function ({ commit, state }, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit('_setPlaylist', playlist)
  commit('_setSequenceList', sequenceList)
  commit('_setcurrentIndex', currentIndex)
  commit('_setFullScreen', true)
  commit('_setPlaying', true)
}
export const saveSearchHistory = function ({ commit }, query) {
  commit('_searchHistory', saveSearch(query))
}
export const deleteSearchHistory = function ({ commit }, query) {
  commit('_searchHistory', deleteSearch(query))
}
export const clearSearchHistory = function ({ commit }) {
  commit('_searchHistory', clearSearch())
}
export const deleteSong = function ({ commit, state }, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit('_setPlaylist', playlist)
  commit('_setSequenceList', sequenceList)
  commit('_setcurrentIndex', currentIndex)

  if (!playlist.length) {
    commit('_setPlaying', false)
  }
}

export const deleteSongList = function ({ commit }) {
  commit('_setcurrentIndex', -1)
  commit('_setPlaylist', [])
  commit('_setSequenceList', [])
  commit('_setPlaying', false)
}

export const savePlayHistory = function ({ commit }, song) {
  commit('_setplayHistory', savePlay(song))
}

export const saveFavoriteList = function ({ commit }, song) {
  commit('_setfavoriteList', saveFavorite(song))
}

export const deleteFavoriteList = function ({ commit }, song) {
  commit('_setfavoriteList', deleteFavorite(song))
}