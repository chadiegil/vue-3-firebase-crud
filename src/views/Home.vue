<template>
  <!-- <SearchInput /> -->
  <div class="search">
    <label for="search">Search</label>
    <input type="text" class="search__input" v-model="query" />
    <button class="search__button">
      <svg class="search__icon" aria-hidden="true" viewBox="0 0 24 24">
        <!-- SVG icon code -->
      </svg>
    </button>
  </div>
  <div v-if="isLoading" class="center-spinner">
    <Spinner />
  </div>
  <div v-else>
    <div class="container grid">
      <div class="card" v-for="post in paginatedPosts" :key="post.id">
        <div class="inputBox">
          <span class="user">{{ post.title }}</span>
        </div>
        <div class="inputBox">
          <span> {{ post.description }}</span>
        </div>
        <div class="btns" v-if="isOwner(post)">
          <button>
            <span class="box card-btn-edit" @click.prevent="editPost(post.id)"
              >edit</span
            >
          </button>
          <button v-if="isOwner(post)">
            <span
              class="box card-btn-delete"
              @click.prevent="deletePost(post.id)"
              >delete</span
            >
          </button>
        </div>
      </div>
    </div>
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="goToPage(1)">First</button>
      <button :disabled="currentPage === 1" @click="prevPage">Prev</button>
      <button
        v-for="page in pages"
        :key="page"
        :class="{ active: page === currentPage }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
      <button :disabled="currentPage === totalPages" @click="nextPage">
        Next
      </button>
      <button
        :disabled="currentPage === totalPages"
        @click="goToPage(totalPages)"
      >
        Last
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { collection, getDocs } from "firebase/firestore";
import Spinner from "../components/Spinner.vue";
import { useRouter } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase/init.js";

const posts = ref([]);
const isLoading = ref(true);
const query = ref("");
const pageSize = 5; // Number of posts per page
const currentPage = ref(1);
const currentUser = ref("");
const router = useRouter();

const filteredPosts = computed(() => {
  return posts.value.filter((post) => post.title.includes(query.value));
});

const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return filteredPosts.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / pageSize);
});

const pages = computed(() => {
  const pagesArray = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pagesArray.push(i);
  }
  return pagesArray;
});

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, "posts"));
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
  posts.value = postsLocal;
  isLoading.value = false;
});
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;

      currentUser.value = uid;
    } else {
      // User is signed out
      // ...
      console.log("dd");
    }
  });
});

const isOwner = (post) => {
  return post.userId === currentUser.value;
};

const editPost = (id) => {
  router.push(`/edit/${id}`);
};

const deletePost = (id) => {
  router.push(`/delete/${id}`);
};

const goToPage = (page) => {
  currentPage.value = page;
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
</script>

<style scoped>
/* Pagination Styles */
.pagination {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-top: 20px;
  position: fixed; /* Change to 'fixed' to keep the pagination at the bottom */
  bottom: 10px;
  width: 100%; /* Add this line to make the pagination full-width */
  left: 0; /* Add this line to position the pagination at the left */
  padding: 0 10px; /* Add some padding to the pagination */
  background-color: #f2f2f2; /* Optional: Add a background color to the pagination */
}
.pagination button {
  background-color: #f2f2f2;
  border: none;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  margin: 0 5px;
  padding: 5px 10px;
  transition: background-color 0.3s ease;
  border-radius: 4px;
}

.pagination button:hover {
  background-color: #e0e0e0;
}

.pagination button:disabled {
  color: #999;
  cursor: not-allowed;
}

.pagination button.active {
  background-color: #7257fa;
  color: #fff;
}

.pagination button.active:hover {
  background-color: #7257fa;
}

/* pagination */

.container-btn {
  display: flex;
  align-items: end;
  justify-content: end;
  gap: 10px;
}

.grid {
  display: flex;
  flex-wrap: wrap;
}

/* buttons */

.box {
  width: 90px;
  height: auto;
  float: left;
  transition: 0.5s linear;
  position: relative;
  display: block;
  overflow: hidden;
  padding: 15px;
  text-align: center;
  margin: 0 5px;
  background: transparent;
  text-transform: uppercase;
  font-weight: 400;
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
  border-color: #262626;
  height: 100%;
  transform: translateX(0);
  transition: 0.3s transform linear, 0.3s height linear 0.3s;
}

.box:hover:after {
  border-color: #262626;
  height: 100%;
  transform: translateX(0);
  transition: 0.3s transform linear, 0.3s height linear 0.5s;
}

button {
  color: black;
  text-decoration: none;
  cursor: pointer;
  outline: none;
  border: none;
  background: transparent;
}
/* buttons */

/* card */

.btns {
  position: absolute;
  bottom: 10px;
}

.card {
  width: 290px;
  height: 274px;
  background: #f2f2f2; /* Set the background color to match the previous style */
  padding: 0.4em;
  border-radius: 6px;
  margin: 10px;
  position: relative;
}

.card-image {
  background-color: rgb(236, 236, 236);
  width: 100%;
  height: 60%;
  border-radius: 6px 6px 0 0;
}

.card-image:hover {
  transform: scale(0.98);
}

.category {
  text-transform: uppercase;
  font-size: 0.7em;
  font-weight: 600;
  color: rgb(63, 121, 230);
  padding: 10px 7px 0;
}

.card-btn-edit {
  background: green;
  color: white;
}
.card-btn-delete {
  background: red;
  color: white;
}
.card:hover {
  background: #e0e0e0; /* Set the background color on hover */
}

.heading {
  font-weight: 600;
  color: rgb(88, 87, 87);
  padding: 7px;
}

.heading:hover {
  cursor: pointer;
}

.author {
  color: gray;
  font-weight: 400;
  font-size: 11px;
  padding-top: 20px;
}

.name {
  font-weight: 600;
}

.name:hover {
  cursor: pointer;
}
/* search */
.search {
  margin: 10px;
  display: flex;
  justify-content: start;
  align-items: center;
  margin-top: 50px; /* Adjust the margin-top value to center the search box vertically */
}

.search__input {
  padding: 10px;
  width: 300px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  transition: box-shadow 0.3s ease;
}

.search__input:focus {
  outline: none;
  box-shadow: 0 0 5px #7257fa;
}

.filter {
  padding: 10px;
  width: 300px;
  border-radius: 5px;
  border: 1px solid #ccc;
  outline: none;
  margin-left: 20px;
}
</style>
