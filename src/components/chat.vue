<template>
  <div>

    <div id="chat__container">
      <div class="friendnamecontainer">
        <h2>{{this.$store.state.acitvename}}</h2>
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
    </div>
    <div id="chatinput__container">
      <input v-model="chatinput" type="text" id="chatinput">
      <button v-on:click="addchat" class="addbutton">
        SEND
      </button>
    </div>
  </div>
</template>

<script>
// var webSocket = new WebSocket('ws://localhost:8084')
export default {
  data() {
    return {
      chatinput: '',
      websocket: ''
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
      this.chats.push({ content: this.chatinput, which: 0 })

      let sendobj = {
        myId: this.$store.state.token,
        friendId: this.$store.state.activefriendid,
        content: this.chatinput
      }

      this.websocket.send(JSON.stringify(sendobj))
    },
    chatbubblestyle: function(person) {
      return person == 0 ? 'mechat' : 'youchat'
    }
  },
  created() {
    this.websocket = this.$store.state.websocket_chat

    // webSocket.send(
    //   JSON.stringify({ ping: 'hey', myId: this.$store.state.token })
    // )

    this.websocket.addEventListener('message', event => {
      console.log('message: ', event.data)
      let parseddata = JSON.parse(event.data)
      if (parseddata.id == this.$store.state.activefriendid) {
        this.chats.push({ content: parseddata.content, which: 1 })
      }
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

#chat__container {
  position: relative;
  height: calc(100vh - 80px);
  overflow-y: scroll;
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
  padding: 10px;
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
