<template>
    <div>
        <div class="inner__chat__container" v-bind:class="{active: this.$store.state.view.isActiveChatmenu }">
            <ul>
                <template v-if="this.$store.state.chat.talks.length>0">
                    <li v-for="(chat, index) in this.$store.state.chat.talks" v-bind:key="index">
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
                            <div v-if="chat.filepath != undefined">
                                <!-- <div class="file__preview">
                                <font-awesome-icon icon="file" />
                            </div> -->
                                <div>
                                    <h6>
                                        FILE
                                    </h6>
                                    <div class="file__container">
                                        {{chat.filepath.split("/")[chat.filepath.split("/").length -1]}}
                                    </div>
                                    <a :href="chat.filepath" download="sample.txt">
                                        <font-awesome-icon icon="download" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </li>
                </template>
                <template v-else>
                    There is no talk with {{this.$store.state.friend.acitvename}}.
                </template>
            </ul>
        </div>
    </div>
</template>


<script>
export default {
  computed: {},
  methods: {
    chatbubblestyle: function(person) {
      return person == 0 ? 'mechat' : 'youchat'
    },
    getphoto: function(id, which) {
      if (which == 0 || which === true) {
        return this.$store.state.myState.photourl
      } else {
        let photourl = this.$store.state.friend.friends.filter(
          f => f.id == id
        )[0].photourl
        return photourl
      }
    },
    getname: function(id, which) {
      if (which == 0 || which === true) {
        return this.$store.state.myState.name
      } else {
        let name = this.$store.state.friend.friends.filter(f => f.id == id)[0]
          .name
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

.file__preview {
  font-size: 3rem;
  width: 100px;
  margin-left: auto;
}
</style>