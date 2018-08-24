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
    friends: [],
    isActiveAddfriend: false,
    isActiveLogin: true,
    isActiveProfile: false,
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
  },
});

export default store;
