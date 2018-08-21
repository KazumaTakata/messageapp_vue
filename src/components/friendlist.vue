<template>
  <ul v-if="!isLoading">
      <li  v-for="friend in friends" :key="friend.id">
        <div class="list__container">
            <img v-bind:src="friend.photourl">
            <div class="list__name">
              {{friend.name}}
            </div>
        </div>
      </li>
  </ul>
  <ul v-else>
    <li>
       Loading...
    </li>
  </ul>
</template>

<script>
import axios from "axios";
import state from "../appstate.js";
export default {
  name: "FriendList",
  data() {
    return {
      isLoading: true,
      friends: []
    };
  },
  methods: {
    loadfrienddata: async function() {
      // setTimeout(() => {
      // this.isLoading = false
      // this.friends = [
      //   {name: 'kazuma', pic: require('../assets/defaultprofile.png'), id: 1},
      //   {name: 'kazuma', pic: require('../assets/defaultprofile.png'), id: 2},
      //   {name: 'kazuma', pic: require('../assets/defaultprofile.png'), id: 3} ]
      // }, 3000)
      const home_url = `http://localhost:8181`;
      const url = home_url + "/api/friend";

      try {
        let result = await axios({
          method: "get",
          url: url,
          headers: { "x-access-token": state.token }
        });
        console.log(result);
        this.friends = result.data;
        this.isLoading = false;
      } catch (err) {
        console.log(err);
      }
    }
  },
  created() {
    this.loadfrienddata();
  }
};
</script>

<style lang="scss" scoped>
@import "../scss/color.scss";
img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid rgb(73, 53, 53);
}

ul {
  list-style: none;
  padding: 0px 0px;
  margin-top: 50px;
}
li {
  padding: 10px 30px;
  width: 150px;
  border-bottom: 1px solid $border-color;
}

li:hover {
  background: $hover-color;
  color: white;
}

.list__container {
  display: flex;
}

.list__name {
  line-height: 40px;
  margin-left: 20px;
}
</style>
