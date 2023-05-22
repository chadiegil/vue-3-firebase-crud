<script setup>
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import { auth } from "../firebase/init.js";
import { onMounted, ref } from "vue";
const isLoggedIn = ref(false);
const emailName = ref("");

const router = useRouter();

onMounted(() => {
  //check the current loggin user
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
      emailName.value = getEmailName(user.email);
    } else {
      isLoggedIn.value = false;
    }
  });
});

const handleSignout = () => {
  if (confirm("Want to exit?")) {
    signOut(auth).then(() => {
      router.push("/");
    });
  }
};

function getEmailName(email) {
  // Split the email address on the @ symbol.
  const parts = email.split("@");

  // Return the first part of the email address.
  return parts[0];
}
</script>
<template>
  <nav>
    <div class="navbar">
      <div class="logo">
        <router-link to="/">Cheaptalk</router-link>
      </div>
      <div class="menu">
        <ul>
          <li>
            <router-link to="/">Home</router-link>
          </li>
          <!-- <li>
            <router-link to="/feed">Feed</router-link>
          </li> -->

          <li>
            <router-link to="/create-post" v-if="isLoggedIn">Posts</router-link>
          </li>
          <li>
            <router-link to="/authors">Authors</router-link>
          </li>
          <li>
            <router-link to="/feed">Authors Post</router-link>
          </li>
          <li v-if="!isLoggedIn">
            <router-link to="/register">Register</router-link>
          </li>
          <li v-if="!isLoggedIn">
            <router-link to="/sign-in">Login</router-link>
          </li>
          <li>
            <button @click="handleSignout" v-if="isLoggedIn">
              <span class="box"> {{ emailName }} </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
nav {
  width: 100%;
  height: 75px;
  background: #e3e3e3;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  color: black;
}
nav .navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 90%;
  background: #e3e3e3;
  margin: auto;
  color: black;
}
nav .navbar .logo a {
  color: black;
  font-size: 27px;
  font-weight: 600;
  text-decoration: none;
}
nav .navbar .menu ul {
  display: flex;
  align-items: center;
}
.navbar .menu li {
  list-style: none;
  margin: 0 15px;
}
.navbar .menu li a {
  color: black;
  font-size: 17px;
  font-weight: 500;
  text-decoration: none;
}
section {
  display: flex;
  height: 100vh;
  width: 100%;
  align-items: center;
  justify-content: center;
  color: #96c7e8;
  font-size: 70px;
}
.logo {
  color: white;
  font-weight: bold;
  font-size: 20px;
}
.button a {
  position: fixed;
  bottom: 20px;
  right: 20px;
  color: #fff;
  background: #2980b9;
  padding: 7px 12px;
  font-size: 18px;
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0.15);
}

.email-style {
  padding: 0px 2px 0px 3px;
}

/* button1 */
.box {
  width: 140px;
  height: auto;
  float: left;
  transition: 0.5s linear;
  position: relative;
  display: block;
  overflow: hidden;
  padding: 8px;
  text-align: center;
  margin: 0 3px;
  background: transparent;
  text-transform: uppercase;
  font-weight: 900;
}

.box:before {
  position: absolute;
  content: "";
  left: 0;
  bottom: 0;
  height: 4px;
  width: 100%;
  border-bottom: 4px solid transparent;
  border-left: 4px solid transparent;
  box-sizing: border-box;
  transform: translateX(100%);
}

.box:after {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  border-top: 4px solid transparent;
  border-right: 4px solid transparent;
  box-sizing: border-box;
  transform: translateX(-100%);
}

.box:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

.box:hover:before {
  border-color: #e4dfdf;
  height: 100%;
  transform: translateX(0);
  transition: 0.3s transform linear, 0.3s height linear 0.3s;
}

.box:hover:after {
  border-color: #e4dfdf;
  height: 100%;
  transform: translateX(0);
  transition: 0.3s transform linear, 0.3s height linear 0.5s;
}

button {
  color: rgb(0, 0, 0);
  text-decoration: none;
  cursor: pointer;
  outline: none;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  color: white;
}
</style>
