<template>
    <div>
        <div class="inner__chat__container" v-bind:class="{active: this.$store.state.isActiveChatmenu }">
            <ul>
                <li v-for="(chat, index) in this.chats" v-bind:key="index">
                    <div v-bind:class="chatbubblestyle(chat.which)">
                        <div>
                            <img class="profile-img" v-bind:src="getphoto(chat.friendid,  chat.which)"> {{getname(chat.friendid, chat.which)}}
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
    </div>
</template>


<script>
export default {
  computed: {
    chats() {
      return this.$store.state.talks
    }
  },
  methods: {
    chatbubblestyle: function(person) {
      return person == 0 ? 'mechat' : 'youchat'
    },
    getphoto: function(id, which) {
      if (which == 0 || which === true) {
        return this.$store.state.myState.photourl
      } else {
        let photourl = this.$store.state.friends.filter(f => f.id == id)[0]
          .photourl
        return photourl
      }
    },
    getname: function(id, which) {
      if (which == 0 || which === true) {
        return this.$store.state.myState.name
      } else {
        let name = this.$store.state.friends.filter(f => f.id == id)[0].name
        return name
      }
    }
  }
}
</script>


<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/button.scss';
@import '../../scss/chat.scss';
</style>