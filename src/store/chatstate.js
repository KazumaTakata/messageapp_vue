import Vue from "vue";

const module = {
  state: {
    talks: [],
    grouptalks: [],
  },
  mutations: {
    settalks(state, talks) {
      state.talks = talks;
    },
    pushtalk(state, talk) {
      state.talks.push(talk);
    },
    pushgrouptalk(state, talk) {
      state.grouptalks.push(talk);
    },
    setgrouptalks(state, talks) {
      state.grouptalks = talks;
    },
    plusonestargroup(state, id) {
      if (state.grouptalks[id].star != undefined) {
        state.grouptalks[id].star += 1;
      } else {
        Vue.set(state.grouptalks[id], "star", 1);
      }
    },
  },
};

export default module;
