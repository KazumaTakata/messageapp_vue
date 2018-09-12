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
    updateinvidivualtalk(state, obj) {
      state.talks[obj.index].content = obj.content;
    },
    addresponse(state, obj) {
      if (state.grouptalks[obj.id].response == undefined) {
        Vue.set(state.grouptalks[obj.id], "response", [
          {
            content: obj.content,
            filepath: obj.filepath,
            senderid: obj.senderid,
            time: obj.time,
          },
        ]);
      } else {
        state.grouptalks[obj.id].response.push({
          content: obj.content,
          filepath: obj.filepath,
          senderid: obj.senderid,
          time: obj.time,
        });
      }
    },
  },
};

export default module;
