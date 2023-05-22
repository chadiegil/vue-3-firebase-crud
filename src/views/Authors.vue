<script setup>
import { ref, onMounted, computed } from "vue";
import { db } from "../firebase/init.js";

import { collection, getDocs } from "firebase/firestore";

import Spinner from "../components/Spinner.vue";

const authors = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, "users"));

  const authorLocal = [];

  querySnapshot.forEach((doc) => {
    const auth = {
      id: doc.id,
      name: doc.data().name,
      password: doc.data().password,
      gender: doc.data().gender,
    };

    authorLocal.push(auth);
  });
  authors.value = authorLocal;
  isLoading.value = false;
  console.log(authors.value);
});
</script>
<template>
  <div v-if="isLoading">
    <Spinner />
  </div>
  <div v-else>
    <h1>Authors</h1>
    <div class="grid">
      <div class="authors" v-for="author in authors" :key="author.id">
        <p :style="{ color: author.gender === 'male' ? 'blue' : 'red' }">
          {{ author.gender }}
        </p>
        <div class="cover">
          <p :style="{ color: author.gender === 'male' ? 'blue' : 'pink' }">
            {{ author.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: flex;
  align-items: center;

  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

/* card new */

.authors {
  position: relative;
  border-radius: 10px;
  width: 220px;
  height: 300px;
  background-color: whitesmoke;
  -webkit-box-shadow: 1px 1px 12px #000;
  box-shadow: 1px 1px 3px #000;
  -webkit-transform: preserve-3d;
  -ms-transform: preserve-3d;
  transform: preserve-3d;
  -webkit-perspective: 2000px;
  perspective: 2000px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  color: #000;
}

.cover {
  top: 0;
  position: absolute;
  background-color: lightgray;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  cursor: pointer;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
  -webkit-transform-origin: 0;
  -ms-transform-origin: 0;
  transform-origin: 0;
  -webkit-box-shadow: 1px 1px 12px #000;
  box-shadow: 1px 1px 12px #000;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  /* word-wrap: break-word; */
  white-space: nowrap; /* Prevents line breaks within the text */
  overflow: hidden; /* Hides any overflowing content */
  text-overflow: ellipsis;
}

.authors:hover .cover {
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
  -webkit-transform: rotatey(-80deg);
  -ms-transform: rotatey(-80deg);
  transform: rotatey(-80deg);
}

p {
  font-size: 20px;
  font-weight: bolder;
}
/* card new */

.card {
  width: 190px;
  height: 254px;
  border-radius: 20px;
  background: #f5f5f5;
  position: relative;
  padding: 1.8rem;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  transition: 0.5s ease-out;
  overflow: visible;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 50px;
}

h1 {
  font-weight: 550;
  color: dimgray;
  text-align: center;
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 30px;
}
</style>
