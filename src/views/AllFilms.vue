<template>
  <div>
    <button class="addFilm" v-on:click="displayFilmForm" v-if="!showFilmForm">Add Film</button>
    <form v-if="showFilmForm">
      <div class="input-container">
        <label for="title">Title:</label>
        <input type="text" id="title" required v-model="title" placeholder="Enter title">
      </div>
      <div class="input-container">
        <label for="year">Year:</label>
        <input type="number" id="year" required v-model.number="year" placeholder="Enter year">
      </div>
      <div class="submit">
        <button type="submit" @click.prevent="submitForm">Submit</button>
        <button type="button" @click="cancelForm">Cancel</button>
      </div>
      <p v-if="showError" style="color: red">Please fill in all fields</p>
    </form>
  </div>
  <ul v-if="displayFilms.length > 0">
    <li v-for="film in displayFilms" :key="film.id" class="line">
      <div v-if="filmToRemove !== film">
        <button @click="selectRemoveFilm(film)" class="remove">Delete</button>
        <FilmTitle :film="film" @close="removeFilm(film)"></FilmTitle>
      </div>  
      <div v-else class="confirm">
          Delete {{ film.title }}?
          <button @click="removeFilm(film)">Yes</button>
          <button @click="cancelRemove">No</button>
      </div>
      
    </li>
  </ul>
</template>

<script>
import FilmTitle from '../components/FilmTitle.vue'

export default {
  name: 'App',
  components: {
    FilmTitle
  },
  data() {
    return {
      films: [],
      showFilmForm: false,
      title: "",
      year: "",
      showError: false,
      search: "",
      displayFilms: [],
      sortBy: null,
      filmToRemove: null,
    }
  },
  watch: {
    sortBy() {
      this.sortFilms();
    }
  },
  mounted() {
    fetch('http://localhost:3000/films')
      .then(res => res.json())
      .then(data => {
        this.films = data
        this.displayFilms = this.films.sort((a, b) => a.title.localeCompare(b.title))
      })
      .catch(err => console.log(err.message))
  },
  methods: {
    selectRemoveFilm(film) {
      this.filmToRemove = film
    },
    removeFilm(film) {
      const index = this.films.indexOf(film)
      this.films.splice(index, 1)
    },
    cancelRemove() {
        this.filmToRemove = null;
    },
    displayFilmForm() {
      this.showFilmForm = true;
    },
    cancelForm() {
      this.showFilmForm = false;
      this.showError = false;
    },
    submitForm() {
      if (this.title === "" || this.year === "" || this.year === 0) {
        this.showError = true;
        return;
      }
      this.showFilmForm = false;
      const newId = this.films.length === 0 ? 1 : this.films[this.films.length - 1].id + 1;
      const newFilm = {
        "id": newId,
        "title": this.title,
        "year": this.year,
        "actors": []
      };
      this.title = "";
      this.year = "";
      this.films.push(newFilm);
      this.showError = false;
      this.sortFilms();
    },
    sortFilms() {
      this.displayFilms.sort((a, b) => a.title.localeCompare(b.title));
    },
  }
}
</script>


<style>

form {
  border: 1px solid #ccc;
  padding: 20px;
  max-width: 400px;
  box-sizing: border-box;
  border-color: rgb(101, 141, 155);
}

.input-container {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

label {
  margin-right: 10px;
}

input[type="text"],
input[type="number"] {
  flex: 1;
  padding: 8px;
  box-sizing: border-box;
  border-style: solid;
  border-color: rgb(101, 141, 155);
}

.submit {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.submit button,
.addFilm {
  margin-right: 10px;
  cursor: pointer;
  padding: 1rem 2rem;
  background-color: white;
  border-color: rgb(101, 141, 155);
  border-style: solid;
}

ul {
  list-style-type: none;
}

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

.search {
  border-style: none;
  margin-left: 10rem;
}

.sort { 
  border-style: none;
  margin-left: 10rem;
  display: flex;
  align-items: center;
  padding: 0 10rem;
}

select {
  padding: 0.5rem 5rem;
  font-size: 1rem;
  text-align: left;
  border-color: rgb(101, 141, 155);
  border-width: 0.15rem;
}

.container {
  display: flex;
}
.line {
}
  
</style>
