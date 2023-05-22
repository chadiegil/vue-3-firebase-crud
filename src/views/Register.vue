<script setup>
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import Spinner from "../components/Spinner.vue";
import { db } from "../firebase/init.js";
import { collection, addDoc } from "firebase/firestore";

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const gender = ref("");
const errMsg = ref("");
const router = useRouter();
const isLoading = ref(false);

// creating a users

const createUser = async () => {
  const colRef = collection(db, "users");

  const userObj = {
    name: email.value,
    password: password.value,
    gender: gender.value,
  };

  await addDoc(colRef, userObj);
  // isLoading.value = true;
  console.log(gender.value);
};

const register = async (e) => {
  e.preventDefault();

  if (password.value !== confirmPassword.value) {
    alert("password dont match");
    confirmPassword.value = "";
    password.value = "";
    return;
  }

  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
      router.push("/authors");
    })
    .catch((err) => (errMsg.value = extractValueInParenthesis(err.message)));
  isLoading.value = true;
  createUser();
  console.log(gender.value);
};

function extractValueInParenthesis(str) {
  const regex = /\((.*?)\)/; // regex to match text inside parentheses
  const matches = str.match(regex);
  if (matches) {
    const value = matches[1].replace("auth/", ""); // remove "auth/" prefix
    return value;
  }
  return ""; // return empty string if no match found
}
</script>
<template>
  <div v-if="isLoading">
    <Spinner />
  </div>
  <div class="container" v-else>
    <div class="card">
      <form class="form" @submit.prevent="register">
        <p class="form-title">Register account</p>
        <div class="inputBox">
          <input type="email" v-model="email" required />
          <span class="user">Username</span>
        </div>
        <div class="inputBox">
          <input type="password" v-model="password" required />
          <span>Password</span>
        </div>
        <div class="inputBox">
          <input type="password" v-model="confirmPassword" required />
          <span>Confirm Password</span>
        </div>
        <div class="radio-style">
          <div>
            <input type="radio" id="male" value="male" v-model="gender" />
            <label for="male">Male</label>
          </div>
          <div>
            <input type="radio" id="female" value="female" v-model="gender" />
            <label for="female">Female</label>
          </div>
        </div>
        <p v-if="errMsg" class="errMsg">{{ errMsg }}</p>
        <button type="submit" class="enter">Register</button>
        <p class="signup-link">
          Already have an account ?
          <router-link to="/sign-in">Sign In</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login {
  color: #000;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: block;
  font-weight: bold;
  font-size: x-large;
}

.card {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 350px;
  width: 300px;
  flex-direction: column;
  gap: 35px;
  background: #e3e3e3;
  box-shadow: 16px 16px 32px #c8c8c8, -16px -16px 32px #fefefe;
  border-radius: 8px;
}

.inputBox {
  position: relative;
  width: 250px;
}

.inputBox input {
  width: 100%;
  padding: 10px;
  outline: none;
  border: none;
  color: #000;
  font-size: 1em;
  background: transparent;
  border-left: 2px solid #000;
  border-bottom: 2px solid #000;
  transition: 0.1s;
  border-bottom-left-radius: 8px;
}

.inputBox span {
  margin-top: 5px;
  position: absolute;
  left: 0;
  transform: translateY(-4px);
  margin-left: 10px;
  padding: 10px;
  pointer-events: none;
  font-size: 12px;
  color: #000;
  text-transform: uppercase;
  transition: 0.5s;
  letter-spacing: 3px;
  border-radius: 8px;
}

.inputBox input:valid ~ span,
.inputBox input:focus ~ span {
  transform: translateX(113px) translateY(-15px);
  font-size: 0.8em;
  padding: 5px 10px;
  background: #000;
  letter-spacing: 0.2em;
  color: #fff;
  border: 2px;
}

.inputBox input:valid,
.inputBox input:focus {
  border: 2px solid #000;
  border-radius: 8px;
}

.enter {
  height: 45px;
  width: 100px;
  border-radius: 5px;
  border: 2px solid #000;
  cursor: pointer;
  background-color: transparent;
  transition: 0.5s;
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 2px;
  margin-bottom: 1em;
}

.enter:hover {
  background-color: rgb(0, 0, 0);
  color: white;
}
</style>
