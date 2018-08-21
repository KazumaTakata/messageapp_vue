<template>
    <div id="chat__container">
        <ul v-if="!isLoading">
            <li v-for="(chat, index) in chats" v-bind:key="index">
                <div v-bind:class="chatbubblestyle(chat.person)" >
                    <span>
                         {{chat.content}}
                    </span>
                </div>
            </li>
        </ul>
        <ul v-else>
            <li>Loading...</li>
        </ul>
        <div id="chatinput__container">
            <input v-model="chatinput"  type="text" id="chatinput">
            <button  v-on:click="addchat" class="addbutton" >
                <font-awesome-icon icon="plus" />
            </button>
        </div>
    </div>
</template>

<script>
import state from "../appstate.js";
export default {
  data() {
    return {
      isLoading: true,
      chats: [],
      chatinput: ""
    };
  },
  methods: {
    addchat: function() {
      console.log(state.token);
      this.chats.push({ content: this.chatinput, person: 1 });

      //network post request to server
    },
    chatbubblestyle: function(person) {
      return person == 0 ? "mechat" : "youchat";
    }

    // loadchatdata: function() {
    //   setTimeout(() => {
    //     this.isLoading = false;
    //     this.chats = [
    //       { content: "hello", person: 1 },
    //       { content: "hello what", person: 0 },
    //       { content: "hello what", person: 0 },
    //       { content: "hello what", person: 0 }
    //     ];
    //   }, 2000);
    // }
  },
  created() {
    this.loadchatdata();
  }
};
</script >



<style lang="scss" scoped>
@import "../scss/color.scss";
ul {
  list-style: none;
}

li {
  padding: 30px;
  margin: 0px;
}

.mechat {
  text-align: right;
}

.youchat {
  text-align: left;
}

.youchat span {
  background: rgb(103, 199, 65);
}

.mechat span {
  background: rgb(75, 21, 201);
}

span {
  padding: 20px;
  color: white;
  border-radius: 20px;
}

.chat__container {
  position: relative;
}

.addbutton {
  background: transparent;
}

#chatinput {
  width: 100%;
  /* position: absolute;
    bottom: 10px; */
}

#chatinput__container {
  position: absolute;
  bottom: 30px;
  left: 220px;
  width: calc(90% - 210px);
  //   min-width: 600px;
  margin: 0 auto;
  display: flex;

  button {
    font-size: 25px;
    border: 2px solid $border-color;
    border-radius: 15px;
    background: transparent;
    outline: none;
    margin-left: 10px;
  }
  input {
    border-radius: 10px;
    border: 2px solid $border-color;
    font-size: 25px;
    padding: 6px;
    outline: none;
  }
}
</style>
