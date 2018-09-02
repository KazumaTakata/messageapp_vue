import Vue from "vue";
import Vuex from "vuex";
import ChatState from "./chatstate";
import FriendState from "./friendstate";
import ViewState from "./viewstate";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    friend: FriendState,
    chat: ChatState,
    view: ViewState,
  },
  state: {
    token: "",
    myState: {},
    callcoming: [],
    currentmode: "chat",
    websocket_video: "",
    websocket_chat: "",
    notificationlist: [],
  },
  getters: {
    getfriend: state => i => {
      return state.friend.friends[i];
    },
  },
  mutations: {
    settoken(state, token) {
      state.token = token;
    },
    setmyState(state, myState) {
      state.myState = myState;
    },
    setPhoto(state, photourl) {
      state.myState.photourl = photourl;
    },
    setName(state, newname) {
      state.myState.name = newname;
    },
    setwebsocket_video(state, websocket) {
      state.websocket_video = websocket;
    },
    setwebsocket_chat(state, websocket) {
      state.websocket_chat = websocket;
    },
    pushtonotificationlist(state, notification) {
      state.notificationlist.push(notification);
    },
    popnotificationlist(state) {
      state.notificationlist.pop();
    },
    pushcomingcall(state, comingid) {
      state.callcoming.push(comingid);
    },
    popcomingcall(state, comingid) {
      var index = state.callcoming.indexOf(comingid);
      if (index !== -1) state.callcoming.splice(index, 1);
    },
    changemode(state, mode) {
      state.currentmode = mode;
    },
  },
});

export default store;
