<template>
<div>
    <button v-on:click="sidebaropen" id='menu_button'>
        <font-awesome-icon icon="plus" />
    </button>
    <div id="sidebar" v-bind:class="{active: isActive}">
        <button v-on:click="searchopen" class="icon_button">
            <font-awesome-icon icon="search"/>
        </button>
         <button v-on:click="profileopen"  class="icon_button">
            <font-awesome-icon icon="user-circle"/>
        </button>
        <ul>
            <li v-for="(item, index) in sidebarItems"  v-bind:key="index">
                <router-link v-bind:to="item">{{item}}</router-link>
            </li>
        </ul>
        <!-- <button class="loginbutton">
            LOGIN/SIGNUP
        </button> -->
    </div>
    <div class="addfriendpanel" v-bind:class="{active: isActiveAddfriend}" >
        <button v-on:click="searchopen" class="closebutton">
            <font-awesome-icon icon="times"/>
        </button>
        <div class="form__container">
            <h2>Type in your friend name</h2>
            <div>
                <input v-model="friendname" type="text">
                <button v-on:click="findfriend" class="searchbutton">
                    <font-awesome-icon icon="search"/>
                </button>
                <p>{{nofindmessage}}</p>
            </div>
            <div class="result__container">
                <div>
                    <img v-bind:src="this.searchuserphotourl" alt="">
                </div>
                <p>{{searchusername}}</p>
                <p>{{friendadderror}}</p>
                <button v-on:click="addfriend" class="addfriendbutton">
                    ADD THIS FRIEND
                </button>
            </div>
            
            
        </div>
    </div>

    <div class="addfriendpanel" v-bind:class="{active: isActiveProfile}" >
        <button v-on:click="profileopen" class="closebutton">
            <font-awesome-icon icon="times"/>
        </button>
        <div class="form__container">
            <div class="result__container">
                <img src="https://www.gstatic.com/webp/gallery3/1.png" alt="">
                <button class="addfriendbutton">
                    CHANGE PROFILE PHOTO
                </button>
            </div>
            <div>
                <input type="text">
                <button class="addfriendbutton">
                    CHANGE PROFILE NAME
                </button>
            </div>
        </div>
    </div>

    <div class="addfriendpanel" v-bind:class="{active: isActiveLogin}" >
        <div class="form__container">
            <h1>Please login or Signup</h1>
            <form action="" onsubmit="event.preventDefault();">
                <p for="">name</p>
                <input v-model="username"  type="text">
                
                <p for="">password</p>
                <input v-model="userpassword" type="password">
                <p class="errormessage">{{loginerrmessage}}</p>
                <div>
                    <input type="submit" v-on:click="loginsubmit">
                </div>
                
            </form>
        </div>
    </div>
</div>
</template>


<script>
import axios from "axios";
import state from "../appstate.js";

export default {
  data() {
    return {
      isActive: true,
      isActiveAddfriend: true,
      isActiveProfile: false,
      isActiveLogin: false,
      sidebarItems: ["chat", "video", "feed"],
      username: "",
      userpassword: "",
      loginerrmessage: "",
      friendname: "",
      searchusername: "",
      searchuserid: "",
      searchuserphotourl: "http://localhost:8181/img/defaultprofile.jpg",
      nofindmessage: "",
      friendadderror: ""
    };
  },

  methods: {
    sidebaropen: function(event) {
      console.log("clicked");
      this.isActive = !this.isActive;
    },
    searchopen: function(event) {
      this.isActiveAddfriend = !this.isActiveAddfriend;
    },
    profileopen: function(event) {
      this.isActiveProfile = !this.isActiveProfile;
    },

    loginsubmit: async function(event) {
      const home_url = `http://localhost:8181`;
      const login_url = "/api/user/login";
      const url = home_url + login_url;

      try {
        let result = await axios.post(url, {
          name: this.username,
          password: this.userpassword
        });
        console.log(result);

        this.isActiveLogin = false;
        state.token = result.data.token;
      } catch (err) {
        console.log(err);
        this.loginerrmessage =
          "Your name is already used or your password is not correct";
      }
    },
    addfriend: async function(event) {
      if (this.searchuserid != "") {
        const home_url = `http://localhost:8181`;
        const login_url = "/api/friend/add/" + this.searchuserid;
        const url = home_url + login_url;

        try {
          let result = await axios({
            method: "get",
            url: url,
            headers: { "x-access-token": state.token }
          });
          console.log(result);
        } catch (err) {
          console.log(err);
          this.friendadderror = "This person is aleady yor friend";
        }
      } else {
      }
    },

    findfriend: async function(event) {
      console.log(state.token);
      const home_url = `http://localhost:8181`;
      const login_url = "/api/friend/" + this.friendname;
      const url = home_url + login_url;

      try {
        let result = await axios({
          method: "get",
          url: url,
          headers: { "x-access-token": state.token }
        });
        console.log(result);
        if (result.data.name != undefined) {
          this.searchuserid = result.data.id;
          this.searchusername = result.data.name;
          this.searchuserphotourl = result.data.photourl;
        } else {
          this.nofindmessage = "No friend found !!";
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../scss/color.scss";

.searchbutton {
  background: transparent;
  border: none;
  font-size: 1.6rem;
  color: white;
  transition: 0.2s;
  outline: none;
}
.searchbutton:hover {
  transform: scale(1.1);
}

.addfriendbutton {
  background: transparent;
  border: none;
  font-size: 1.6rem;
  color: white;
  transition: 0.2s;
  outline: none;
  margin-top: 20px;
  border: 1px solid white;
}

.addfriendbutton:hover {
  transform: scale(1.1);
}

.icon_button {
  background: transparent;
  border: none;
  font-size: 1.6rem;
  margin-top: 10px;
  margin-left: 10px;
  color: white;
  transition: 0.2s;
  outline: none;
}

.icon_button:hover {
  transform: scale(1.1);
}

#sidebar {
  position: absolute;
  width: 210px;
  height: 100vh;
  background: $sidebar-background;
  left: 0;
  z-index: 1;
  transition: 0.4s;
}

#sidebar.active {
  left: -210px;
}

#menu_button {
  color: $border-color;
  position: absolute;
  top: 10px;
  left: 10px;
  border: none;
  font-size: 1.6rem;
  z-index: 2;
  background: transparent;
  outline: none;
  transition: 0.4s;
}

#menu_button:hover {
  transform: rotate(45deg);
}
ul {
  position: relative;
  top: 50px;
}

li {
  padding: 30px 0;
  color: white;
}

li:hover {
  background: $hover-color;
}

a {
  text-decoration: none;
  color: white;
}

.addfriendpanel {
  position: fixed;
  background: pink;
  height: 100vh;
  width: 100vw;
  top: calc(100vh + 300px);
  z-index: 3;
  transition: 0.3s;
}

.addfriendpanel.active {
  top: 0;
}

.closebutton {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  font-size: 1.5rem;
  color: white;
  border: none;
  outline: none;
}

.form__container {
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);

  input[type="text"],
  input[type="password"] {
    font-size: 1.3rem;
    border-radius: 10px;
    border: none;
    outline: none;
    padding: 10px;
    margin: 30px;
  }

  input[type="submit"] {
    background: transparent;
    font-size: 1.3rem;
    border-radius: 10px;
    border: 1px solid white;
    padding: 10px;
    color: white;
    outline: none;
  }
  input[type="submit"]:hover {
    color: rgb(209, 87, 78);
    border: 1px solid rgb(209, 87, 78);
  }
  p {
    font-weight: 600;
  }

  .errormessage {
    color: rgb(209, 87, 78);
  }
}

.result__container {
  height: 200px;
  margin: 30px;

  img {
    height: 100px;
    width: 100px;
    border-radius: 50%;
  }
}

.loginbutton {
  position: absolute;
  left: 10px;
  bottom: 20px;
  background: transparent;
  border: none;
  font-size: 1.6rem;
  color: white;
  transition: 0.2s;
  outline: none;
  margin-top: 20px;
  border: 1px solid white;
}
</style>
