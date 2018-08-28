<template>
    <div>
        <ul>
            <li v-on:click="videoopen" v-for="(item, index) in videolist" v-bind:key="index" v-bind:id="index">

                <div>
                    <img class="profile-img" v-bind:src="getphoto(item.friendid)"> {{getname(item.friendid)}}
                </div>
                <div>
                    {{item.time}}
                </div>
                <template v-if=" String( whichvideo ) === String( index )">
                    <div class="video__container">
                        <button v-on:click="videoclose" class="closebutton">
                            <font-awesome-icon icon="times" />
                        </button>
                        <div class="inner__video__container">
                            <video id="gum" v-bind:src="item.video_local" playsinline></video>
                            <video id="gum" v-bind:src="item.video_remote" playsinline></video>
                        </div>
                        <div class="video__comment">
                            Note
                        </div>
                        <div>
                            ofiewjfoewjfoewajoifejwa
                        </div>
                    </div>
                </template>
            </li>
        </ul>
    </div>
</template>


<script>
import axios from 'axios'
export default {
  data() {
    return {
      videolist: [],
      whichvideo: ''
    }
  },
  created() {
    this.getVideoList()
  },
  methods: {
    videoopen: function(event) {
      //   console.log(event.target.id)
      this.whichvideo = String(event.target.id)
    },
    videoclose: function(event) {
      console.log(event.target.id)
      this.whichvideo = ''
    },
    getVideoList: async function(event) {
      const home_url = `http://localhost:8181`
      const url = home_url + `/api/video/${this.$store.state.activefriendid}`

      let result = await axios({
        method: 'get',
        url: url,
        headers: { 'x-access-token': this.$store.state.token }
      })
      console.log(result)
      this.videolist = result.data
    },
    getphoto: function(id) {
      let photourl = this.$store.state.friends.filter(f => f.id == id)[0]
        .photourl
      return photourl
    },
    getname: function(id) {
      let name = this.$store.state.friends.filter(f => f.id == id)[0].name
      return name
    }
  }
}
</script>


<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/form.scss';
@import '../../scss/button.scss';
@import '../../scss/photo.scss';

li {
  padding: 20px;
}

li * {
  pointer-events: none;
}

li:hover {
  background: $hover-color;
  //   color: white;
}

.video__container {
  top: 0;
  left: 0;
  position: fixed;
  height: 100vh;
  background: black;
  width: 100%;
  z-index: 10;
  color: white;

  .inner__video__container {
    display: flex;

    video {
      width: 50%;
      height: auto;
    }

    .video__comment {
    }
  }
}
</style>