<template>
    <div>
        <div class="inner__chat__container" v-bind:class="{active: this.$store.state.isActiveChatmenu }">
            <ul>
                <li v-for="(chat, index) in this.chats" v-bind:key="index">
                    <div class="profile__container">
                        <img class="profile-img" v-bind:src="getphoto(chat.senderid)">
                        <div class="name__container">
                            {{getname(chat.senderid)}}
                            <div class="time__container">
                                {{chat.time}}
                            </div>
                        </div>

                        <div class="bubble__container">
                            {{chat.content}}
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
      return this.$store.state.grouptalks
    }
  },
  methods: {
    chatbubblestyle: function(person) {
      return person == 0 ? 'mechat' : 'youchat'
    },
    getphoto: function(id) {
      if (id == this.$store.state.myState.id) {
        return this.$store.state.myState.photourl
      }
      let photourl = this.$store.state.friends.filter(f => f.id == id)[0]
        .photourl
      return photourl
    },
    getname: function(id) {
      if (id == this.$store.state.myState.id) {
        return this.$store.state.myState.name
      }
      let name = this.$store.state.friends.filter(f => f.id == id)[0].name
      return name
    }
  }
}
</script>


<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/button.scss';
@import '../../scss/chat.scss';

.profile__container {
  display: flex;
}

.name__container {
  line-height: 25px;
  margin-left: 10px;
}

li {
  padding: 15px;
}
</style>