<template>
  <div class="container">
    <div class="friendnamecontainer">
      {{this.$store.state.acitvename}}
    </div>
    <ul>
      <li v-for="(feed, index) in feeds" v-bind:key="index">
        <div class="feedcard">
          <div class="profilecontainer">
            <img class="profile" v-bind:src="feed.photourl">
            <div class="profilename">
              {{feed.name}}
            </div>
          </div>
          <img v-bind:src="feed.photourl">
          <div class="feedcontent">
            {{feed.content}}
          </div>
        </div>
      </li>
      <li v-for="(feed, index) in feeds" v-bind:key="index">
        <div class="feedcard">
          <div class="profilecontainer">
            <img class="profile" v-bind:src="feed.photourl">
            <div class="profilename">
              {{feed.name}}
            </div>
          </div>
          <img v-bind:src="feed.photourl">
          <div class="feedcontent">
            {{feed.content}}
          </div>
        </div>
      </li>
    </ul>
    <button v-on:click="addfeed" id="floating">+ </button>

    <div class="addfriendpanel" v-bind:class="{active: isActiveAddFeed}">
      <button v-on:click="addfeed" class="closebutton">
        <font-awesome-icon icon="times" />
      </button>
      <div class="form__container form__container_width">
        <h2>Type in your Feed</h2>
        <div>
          <textarea v-model="friendname" type="text"></textarea>
        </div>
        <label class="custom-file-upload" for="file-upload">
          <input type="file" accept="image/*" style="display:none" id="file-upload"> Choose file
        </label>
        <div class="result__container">
          <button class="addfriendbutton">
            Submit feed
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      chatinput: '',
      isActiveAddFeed: false,
      feeds: [
        {
          name: 'jully',
          content: 'hello',
          photourl: 'http://localhost:8181/img/defaultprofile.jpg'
        }
      ]
    }
  },
  computed: {
    // chats() {
    //   return this.$store.state.talks
    // }
  },
  methods: {
    addfeed: function(event) {
      console.log('ee')
      this.isActiveAddFeed = !this.isActiveAddFeed
    }
  },
  created() {}
}
</script >



<style lang="scss" scoped>
@import '../scss/color.scss';
@import '../scss/form.scss';
@import '../scss/button.scss';

.addfriendpanel {
  position: fixed;
  background: pink;
  height: 100vh;
  width: 100vw;
  top: calc(100vh + 300px);
  left: 0;
  z-index: 3;
  transition: 0.3s;
}

.addfriendpanel.active {
  top: 0;
}

.container {
  overflow: scroll;
  height: 100vh;
}

.feedcard {
  width: 400px;
  box-shadow: 1px 1px 4px black;
  margin: 0 auto;
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
