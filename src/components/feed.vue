<template>
  <div class="container">
    <div class="paneltitlecontainer">
      <h2>Feeds</h2>
    </div>
    <div class="margin100px">

    </div>
    <ul>
      <li v-for="(feed, index) in feeds" v-bind:key="index">
        <div class="feedcard">
          <div class="profilecontainer">
            <img class="profile" v-bind:src="feed.profileurl">
            <div class="profilename">
              {{feed.name}}
            </div>
          </div>
          <template v-if="feed.photourl != ''">
            <img v-bind:src="feed.photourl">
          </template>

          <div class="feedcontent">
            {{feed.feedcontent}}
          </div>
        </div>
      </li>
    </ul>
    <button v-on:click="addfeed" id="floating">+ </button>

    <div class="panel" v-bind:class="{active: isActiveAddFeed}">
      <button v-on:click="addfeed" class="closebutton">
        <font-awesome-icon icon="times" />
      </button>

      <div class="form__container form__container_width">
        <h2 class="white-title">Type in your Feed</h2>
        <div>
          <textarea v-model="feedcontent" type="text"></textarea>
        </div>
        <label class="basicbutton" for="file-upload">
          <input type="file" v-on:change="handleFileUpload()" accept="image/*" style="display:none" id="file-upload" ref="file"> Choose file
        </label>
        <p>{{filechosenmessage}}</p>

        <div class="result__container">
          <button v-on:click="sendfeed" class="basicbutton">
            Submit feed
          </button>
          <div>
            {{successorfailuremessage}}
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      chatinput: '',
      isActiveAddFeed: false,
      feedcontent: '',
      file: '',
      filechosenmessage: '',
      feeds: [],
      successorfailuremessage: ''
    }
  },
  computed: {},
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0]
      this.filechosenmessage = 'file chosen'
    },
    addfeed: function(event) {
      this.isActiveAddFeed = !this.isActiveAddFeed
      this.filechosenmessage = ''
      this.successorfailuremessage = ''
    },
    sendfeed: function(event) {
      const home_url = `http://localhost:8181`
      const url = home_url + '/api/user/feed'

      let formData = new FormData()
      formData.append('image', this.file)
      formData.append('feedcontent', this.feedcontent)
      axios
        .post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-access-token': this.$store.state.token
          }
        })
        .then(() => {
          console.log('SUCCESS!!')
          this.successorfailuremessage = 'sucessfully uploaded'
        })
        .catch(() => {
          console.log('FAILURE!!')
          this.successorfailuremessage = 'failed to upload'
        })
    }
  },
  created() {
    const home_url = `http://localhost:8181`
    const url = home_url + '/api/user/feed'
    axios
      .get(url, {
        headers: {
          'x-access-token': this.$store.state.token
        }
      })
      .then(res => {
        console.log('SUCCESS!!')
        console.log(res)

        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].userId == this.$store.state.myState.id) {
            res.data[i]['name'] = this.$store.state.myState.name
            res.data[i]['profileurl'] = this.$store.state.myState.photourl
          } else {
            let u = this.$store.state.friend.friends.find(
              f => f.id == res.data[i].userId
            )
            res.data[i]['name'] = u.name
            res.data[i]['profileurl'] = u.photourl
            console.log(u)
          }
        }
        this.feeds = res.data
      })
      .catch(function(err) {
        console.log(err)
      })
  }
}
</script >

<style lang="scss" scoped>
@import '../scss/color.scss';
@import '../scss/form.scss';
@import '../scss/button.scss';
@import '../scss/basic.scss';
.panel {
  position: fixed;
  background: $main-color;
  height: 100vh;
  width: 100vw;
  top: calc(100vh + 300px);
  left: 0;
  z-index: 3;
  transition: 0.3s;
}

.margin100px {
  height: 50px;
}

.panel.active {
  top: 0;
}

.container {
  overflow: scroll;
  height: 100vh;
}

.feedcard {
  width: 400px;
  border-radius: 10px;
  box-shadow: 1px 1px 4px black;
  margin: 0px auto;
}

.feedcontent {
  padding: 20px;
}

ul {
  list-style: none;
}

li {
  padding: 30px;
  margin: 0px;
}

img {
  height: 300px;
  width: 300px;
  object-fit: cover;
}

.profile {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid rgb(73, 53, 53);
}

.profilename {
  padding: 10px;
}

.profilecontainer {
  display: flex;
  padding: 30px;
}
</style>
