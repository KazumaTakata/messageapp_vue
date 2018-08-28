<template>
    <div>
        <ul>
            <li v-for="(item, index) in videolist" v-bind:key="index">

                <div>
                    <img class="profile-img" v-bind:src="getphoto(item.friendid)"> {{getname(item.friendid)}}
                </div>
                <div>
                    {{item.time}}
                </div>
                <div class="video__container">
                    <div class="inner__video__container">
                        <video id="gum" v-bind:src="item.video_local" playsinline></video>
                        <video id="gum" v-bind:src="item.video_remote" playsinline></video>
                    </div>
                    <div>
                        Note
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>


<script>
import axios from 'axios'
export default {
  data() {
    return {
      videolist: []
    }
  },
  created() {
    this.getVideoList()
  },
  methods: {
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

li:hover {
  background: $hover-color;
  //   color: white;
}

.video__container {
  top: 0;
  left: 0;
  position: fixed;
  //   height: 100vh;
  background: white;
  width: 100%;
  z-index: 10;

  .inner__video__container {
    display: flex;

    video {
      width: 50%;
      height: auto;
    }
  }
}
</style>