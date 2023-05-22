<script setup>
import { ref, onMounted } from "vue";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/init.js";
import Spinner from "../components/Spinner.vue";

const userPosts = ref([]);
const isLoading = ref(true);

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      const postsRef = collection(db, "posts");

      const q = query(postsRef, where("userId", "==", uid));

      const querySnapshot = await getDocs(q);
      const postsLocal = [];

      querySnapshot.forEach((doc) => {
        const post = {
          id: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          category: doc.data().category,
          createdAt: doc.data().createdAt,
          userId: doc.data().userId,
        };
        postsLocal.push(post);
      });
      userPosts.value = postsLocal;
      isLoading.value = false;
    } else {
      // User is signed out
      // ...
    }
  });
});
</script>

<template>
  <h1 class="title-heading">Feed</h1>
  <div v-if="isLoading">
    <Spinner />
  </div>
  <div v-else class="card-grid">
    <div v-for="post in userPosts" :key="post.id" class="card">
      <div class="container-btn">
        <button @click.prevent="editPost(post.id)"></button>
        <button @click.prevent="deletePost(post.id)"></button>
      </div>
      <h3 class="card__title">{{ post.title }}</h3>
      <p class="card__content">
        {{ post.description }}
      </p>
      <p>
        category
        {{ post.category }}
      </p>
      <div class="card__date">{{ post.createdAt }}</div>
      <div class="card__arrow">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          height="15"
          width="15"
        >
          <path
            fill="#fff"
            d="M13.4697 17.9697C13.1768 18.2626 13.1768 18.7374 13.4697 19.0303C13.7626 19.3232 14.2374 19.3232 14.5303 19.0303L20.3232 13.2374C21.0066 12.554 21.0066 11.446 20.3232 10.7626L14.5303 4.96967C14.2374 4.67678 13.7626 4.67678 13.4697 4.96967C13.1768 5.26256 13.1768 5.73744 13.4697 6.03033L18.6893 11.25H4C3.58579 11.25 3.25 11.5858 3.25 12C3.25 12.4142 3.58579 12.75 4 12.75H18.6893L13.4697 17.9697Z"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title-heading {
  text-align: center;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin: 20px;
}

.card {
  --border-radius: 0.25rem;
  --primary-color: #2980b9;
  --secondary-color: #3c3852;
  width: 100%;
  font-family: "Arial";
  padding: 1rem;
  cursor: pointer;
  border-radius: var(--border-radius);
  background: #fff;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.15);
  position: relative;
}

.card > * + * {
  margin-top: 1rem;
}

.card .card__content {
  color: var(--secondary-color);
  font-size: 0.9rem;
}

.card .card__title {
  padding: 0;
  font-size: 1.2rem;
  font-weight: bold;
}

.card .card__date {
  color: #6e6b80;
  font-size: 0.8rem;
}

.card .card__arrow {
  position: absolute;
  background: var(--primary-color);
  padding: 0.5rem;
  border-radius: 50%;
  bottom: -10px;
  right: -10px;
  transition: 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.15);
}

.card svg {
  transition: 0.2s;
  fill: #fff;
}

/* hover */
.card:hover .card__title {
  color: var(--primary-color);
  text-decoration: underline;
}

.card:hover .card__arrow {
  background: #111;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.15);
}

.card:hover .card__arrow svg {
  transform: translateX(3px);
}

.container-btn {
  display: flex;
  align-items: end;
  justify-content: flex-end;
  gap: 10px;
}
</style>
