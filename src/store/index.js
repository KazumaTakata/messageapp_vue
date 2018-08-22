import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViN2MwYTA2Y2YzN2RmMDY0NmUxZTY4YiIsImlhdCI6MTUzNDg1Nzc0MCwiZXhwIjoxNTM0OTQ0MTQwfQ.B1g1bZo3pfBId02B9xHjtO_FnGCJiPX20FOP4fceb44",
    activefriendid: "",
    myState: {},
    talks: "",
    acitvename: "",
    friends: [],
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
  },
});

export default store;
