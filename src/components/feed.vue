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
     <button id="floating">+</button>
    </div>
   
</template>

<script>
export default {
  data() {
    return {
      chatinput: '',
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
  methods: {},
  created() {}
}
</script >



<style lang="scss" scoped>
@import '../scss/color.scss';

#floating {
  position: absolute;
  color: white;
  bottom: 30px;
  right: 30px;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: $sidebar-background;
  box-shadow: 2px 2px 1px $main-bg-color;
  outline: none;
  border: none;
}

.friendnamecontainer {
  padding: 30px;
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
