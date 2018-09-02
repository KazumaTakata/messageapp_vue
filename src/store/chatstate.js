const module = {
  state: {
    talks: "",
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
  },
};

export default module;
