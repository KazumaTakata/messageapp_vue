<template>
  <div>

    <div id="chat__container">
      <div class="friendnamecontainer">
        <h2>{{this.$store.state.acitvename}}</h2>
      </div>
      <ul>
        <li v-for="(chat, index) in this.chats" v-bind:key="index">
          <div v-bind:class="chatbubblestyle(chat.which)">
            <div>
              <img class="profile-img" v-bind:src="getphoto(chat.friendid)"> {{getname(chat.friendid, chat.which)}}
            </div>
            <div class="time__container">
              {{chat.time}}
            </div>
            <div class="bubble__container">
              <span>
                {{chat.content}}
              </span>
            </div>
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
    getphoto: function(id, which) {
      if (which == 0) {
        return this.$store.state.myState.photourl
      } else {
        let photourl = this.$store.state.friends.filter(f => f.id == id)[0]
          .photourl
        return photourl
      }
    },
    getname: function(id, which) {
      if (which == 0) {
        return this.$store.state.myState.name
      } else {
        let name = this.$store.state.friends.filter(f => f.id == id)[0].name
        return name
      }
    },
    addchat: function() {
      var d = new Date()

      this.$store.commit('pushtalk', {
        content: this.chatinput,
        which: 0,
        friendid: this.$store.state.activefriendid,
        time: d.toLocaleString()
      })

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

    this.websocket.onmessage = jsonmessage => {
      console.log('message: ', jsonmessage.data)
      let parseddata = JSON.parse(event.data)
      if (parseddata.id == this.$store.state.activefriendid) {
        this.$store.commit('pushtalk', {
          content: parseddata.content,
          which: 1
        })
      }
    }
  }
}
</script >



<style lang="scss" scoped>
@import '../scss/color.scss';
@import '../scss/button.scss';
.profile-img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid rgb(73, 53, 53);
}
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

.bubble__container {
  margin: 20px;
}

.youchat span {
  background: rgb(103, 199, 65);
}

.mechat span {
  background: rgb(75, 21, 201);
}

span {
  padding: 10px;

  color: white;
  border-radius: 20px;
}

#chat__container {
  position: relative;
  height: calc(100vh - 80px);
  overflow-y: scroll;
}

.time__container {
  font-size: 0.5rem;
}

.addbutton {
  background: transparent;
  color: $border-color;
  font-size: 1px;
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
    font-size: 10px;
    border: 1px solid $border-color;
    border-radius: 15px;
    background: transparent;
    outline: none;
    margin-left: 10px;
  }
  input {
    border-radius: 20px;
    border: 1px solid $border-color;
    font-size: 20px;
    font-weight: 100;
    padding: 6px;
    outline: none;
  }
}
</style>
