<template>
  <div id="chat__container">
    <div class="friendnamecontainer">
      {{this.$store.state.acitvename}}
    </div>
    <ul>
      <li v-for="(chat, index) in this.chats" v-bind:key="index">
        <div v-bind:class="chatbubblestyle(chat.which)">
          <span>
            {{chat.content}}
          </span>
        </div>
      </li>
    </ul>

    <div id="chatinput__container">
      <input v-model="chatinput" type="text" id="chatinput">
      <button v-on:click="addchat" class="addbutton">
        SEND
      </button>
    </div>

  </div>
</template>

<script>
var webSocket = new WebSocket('ws://localhost:8084')
export default {
  data() {
    return {
      chatinput: ''
    }
  },
  computed: {
    chats() {
      console.log('ee')
      return this.$store.state.talks
    }
  },
  methods: {
    addchat: function() {
      this.chats.push({ content: this.chatinput, person: 1 })

      let sendobj = {
        myId: this.$store.state.token,
        friendId: this.$store.state.activefriendid,
        content: this.chatinput
      }

      webSocket.send(JSON.stringify(sendobj))

      //network post request to server
    },
    chatbubblestyle: function(person) {
      return person == 0 ? 'mechat' : 'youchat'
    }
  },
  created() {
    webSocket.addEventListener('open', function(event) {
      console.log('connected')
    })

    webSocket.addEventListener('message', function(event) {
      console.log('message: ', event.data)
    })
  }
}
</script >



<style lang="scss" scoped>
@import '../scss/color.scss';
@import '../scss/button.scss';
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
  color: $border-color;
}
.addbutton:hover {
  color: $font-color;
}

#chatinput {
  width: 100%;
  color: $font-color;
}

.friendnamecontainer {
  padding: 20px;
  border-bottom: 1px solid $border-color;
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
