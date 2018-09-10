<template>
  <div class="container">
    <div class="paneltitlecontainer">
      <h2>{{chattitle}} Feeds</h2>
    </div>
    <div class="margin100px">

    </div>
    <div>
      <img class="background_photo" src="http://localhost:8181/img/chuttersnap-176529-unsplash-1536071573660.jpg" alt="">
      <img class="profile-img" src="http://localhost:8181/img/chuttersnap-176529-unsplash-1536071573660.jpg" alt="">
      <div>
        <h2>{{chattitle}}</h2>
      </div>
    </div>
    <ul>
      <li v-for="(feed, index) in currentFeed" v-bind:key="index">
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
    <button v-on:click="addfeed" v-if="showeditbutton" id="floating" class="feededitpos">
      <font-awesome-icon icon="edit" />
    </button>
    <button v-on:click="addfeed" id="floating" class="feedhomepos">
      <font-awesome-icon icon="home" />
    </button>
    <button v-on:click="addfeed" id="floating" class="feedpluspos">+ </button>

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
  computed: {
    currentFeed() {
      if (this.$store.state.friend.individualorgroup == 'group') {
        if (this.feeds.groupfeeds != undefined) {
          let groupfeeds = this.feeds.groupfeeds.filter(
            feed => feed.groupid == this.$store.state.friend.activegroupid
          )
          for (let i = 0; i < groupfeeds.length; i++) {
            let u = this.$store.state.friend.groupmember.find(
              f => f.id == groupfeeds[i].userId
            )
            if (u != undefined) {
              groupfeeds[i].name = u.name
              groupfeeds[i].profileurl = u.photourl
            }
          }
          return groupfeeds
        }
      } else {
        if (this.feeds.feeds != undefined) {
          return this.feeds.feeds.filter(
            feed => feed.userId == this.$store.state.friend.activefriendid
          )
        }
      }
    },
    chattitle() {
      if (this.$store.state.friend.individualorgroup == 'group') {
        return this.$store.state.friend.acitvegroupname
      } else {
        return this.$store.state.friend.acitvename
      }
    },
    showeditbutton() {
      if (this.$store.state.friend.individualorgroup == 'group') {
        let group = this.$store.state.friend.groups.find(
          g => g._id == this.$store.state.friend.activegroupid
        )

        return group.creatorid == this.$store.state.myState.id
      } else {
        return false
      }
    }
  },
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
      if (this.$store.state.friend.individualorgroup == 'group') {
        formData.append('groupid', this.$store.state.friend.activegroupid)
      }
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
          this.getfeed()
        })
        .catch(() => {
          console.log('FAILURE!!')
          this.successorfailuremessage = 'failed to upload'
        })
    },
    getfeed() {
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

          for (let i = 0; i < res.data.feeds.length; i++) {
            if (res.data.feeds[i].userId == this.$store.state.myState.id) {
              res.data.feeds[i]['name'] = this.$store.state.myState.name
              res.data.feeds[i][
                'profileurl'
              ] = this.$store.state.myState.photourl
            } else {
              let u = this.$store.state.friend.friends.find(
                f => f.id == res.data.feeds[i].userId
              )
              res.data.feeds[i]['name'] = u.name
              res.data.feeds[i]['profileurl'] = u.photourl
              console.log(u)
            }
          }

          this.feeds = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    }
  },
  created() {
    this.getfeed()
  }
}
</script >

<style lang="scss" scoped>
@import '../scss/color.scss';
@import '../scss/form.scss';
@import '../scss/button.scss';
@import '../scss/basic.scss';
.profile-img {
  width: 100px;
  height: 100px;
  position: relative;
  top: -60px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid rgb(73, 53, 53);
}

.background_photo {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

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
