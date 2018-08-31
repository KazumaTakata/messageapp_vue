import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    token: "",
    activefriendid: "",
    myState: {},
    talks: "",
    acitvename: "No Friend Chosen",
    acitvegroupname: "No Group Chosen",
    friends: [],
    callcoming: [],
    isActiveAddfriend: false,
    isActiveLogin: true,
    isActiveProfile: false,
    isActiveNotification: false,
    isActiveCreateGroup: false,
    websocket_video: "",
    websocket_chat: "",
    notificationlist: [],
    groups: [],
    isActiveChatmenu: true,
    activegroupid: "",
    grouptalks: [],
    individualorgroup: "individual",
  },
  getters: {
    getfriend: state => i => {
      return state.friends[i];
    },
  },
  mutations: {
    settoken(state, token) {
      state.token = token;
    },
    setactivefriendid(state, friendid) {
      state.activefriendid = friendid;
    },
    settalks(state, talks) {
      state.talks = talks;
    },
    setactivename(state, name) {
      state.acitvename = name;
    },
    setfriend(state, friend) {
      state.friends = friend;
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
    toggleaddfriend(state) {
      state.isActiveAddfriend = !state.isActiveAddfriend;
    },
    togglelogin(state) {
      state.isActiveLogin = !state.isActiveLogin;
    },
    toggleprofile(state) {
      state.isActiveProfile = !state.isActiveProfile;
    },
    toggleGroup(state) {
      state.isActiveCreateGroup = !state.isActiveCreateGroup;
    },
    togglenotification(state) {
      state.isActiveNotification = !state.isActiveNotification;
    },
    togglechatmenu(state) {
      state.isActiveChatmenu = !state.isActiveChatmenu;
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
    pushtalk(state, talk) {
      state.talks.push(talk);
    },
    pushgrouptalk(state, talk) {
      state.grouptalks.push(talk);
    },
    setgroup(state, group) {
      state.groups = group;
    },
    setactivegroup(state, groupid) {
      state.activegroupid = groupid;
    },
    setgrouptalks(state, talks) {
      state.grouptalks = talks;
    },
    setindividualorgroup(state, individualorgroup) {
      state.individualorgroup = individualorgroup;
    },
    setactivegroupname(state, groupname) {
      state.acitvegroupname = groupname;
    },
  },
});

export default store;
