// import * as types from './mutation-types'
 const mutations = {
  _setSinger(state,singer) {
    state.singer = singer
  },
  _setPlaying (state, flag) {
    state.playing = flag
  },
  _setFullScreen(state, flag) {
    state.fullScreen = flag
  },
  _setPlaylist(state, list) {
    state.playlist = list
  },
  _setSequenceList(state, list) {
    state.sequenceList = list
  },
  _setMode (state, mode) {
    state.mode = mode
  },
  _setcurrentIndex (state, index) {
    state.currentIndex = index
  },
  _setDisc (state,disc) {
    state.disc = disc
  },
  _setTopList (state,topList) {
    state.topList = topList
  },
  _searchHistory (state,searchHistory) {
    state.searchHistory = searchHistory
  },
  _setplayHistory (state, history) {
    state.playHistory = history
  },
  _setfavoriteList (state, list) {
    state.favoriteList = list
  }
}

export default mutations