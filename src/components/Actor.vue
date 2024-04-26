<template>
    <div v-if="actor" class="whole">
      <div v-if="!editingName" class="top-out">
        <div class="top">
          <h3>{{ actor.name }}</h3> <button @click="editingName = true">Edit</button>
        </div>
      </div>
      <div v-else class="submit">
        <form @submit.prevent="saveName" class="submit">
          <input type="text" v-model="newName" required>
          <div>
            <button type="submit" class="apply">Apply</button>
            <button type="button" @click="cancelEdit('name')">Cancel</button>
          </div>
        </form>
      </div>
      <p v-if="showError2" style="color: red;" class="er">Please enter a name</p>

  
      <div v-if="!editingYear" class="top-out">
        <div class="top">
          <h3>Born: {{ actor.yearOfBirth }}</h3> <button @click="editingYear = true">Edit</button>
        </div>
      </div>
      <div v-else class="submit">
        <form @submit.prevent="saveYear" class="submit">
          <input type="number" v-model="newYear" required>
          <div>
            <button type="submit" class="apply">Apply</button>
            <button type="button" @click="cancelEdit('year')">Cancel</button>
          </div>
        </form>
      </div>
        <ul>
            <li v-for="film in actor.films" key="actor.id">
              <div v-if="filmToRemove !== film">
                {{ film }}
                <button @click="removeFilm(film)" class="remove">Remove</button>
              </div>
              <div v-else class="confirm">
                  Remove {{ film }}?
                  <button @click="confirmRemove(film)">Yes</button>
                  <button @click="cancelRemove">No</button>
              </div>
            </li>
            <li v-if="!showActorForm">
                <button class="addFilm" v-on:click="displayFilmForm" v-if="!showFilmForm">Assign Film</button>
            </li>
            <li v-if="showFilmForm">
                <div>
                    <form class="selectionForm">
                        <select v-model="selectedFilm">
                          <option class="selectActor" value="null"><span>Select Film</span></option>
                          <option v-for="film in actorlessFilms" :value="film">{{film.name}}</option>
                        </select>
                        <div class="submit">
                            <button type="submit" @click.prevent="submitForm" class="apply">Apply</button>
                            <button type="button" @click="cancelForm" class="cancel">Cancel</button>
                        </div>
                    </form>
                    <p v-if="showError" style="color: red;">Please enter a film</p>
                </div>
            </li>
        </ul>
    </div>
    <div v-else>
      <h1>Loading...</h1>
    </div>
  </template>

<script>
export default {
  name: 'Actor',
  data() {
    return {
      actor: null,
      showFilmForm: false,
      selectedFilm: null,
      showError: false,
      showError2: false,
      allFilms: null,
      editingName: false,
      editingYear: false,
      actorlessFilms: null,
      newName: null,
      newYear: null,
      filmToRemove: null,
    }
  },
  props: ['id'],
  computed: {
    actorlessFilms() {
      if (!this.actor) return [];
      this.actorlessFilms = this.allFilms.filter(film => !film.actors.includes(this.actor.name));
    }
  },
  mounted() {
    fetch('http://localhost:3000/actors/' + this.id)
      .then(res => res.json())
      .then(data => {
        this.actor = data;
        this.newName = this.actor.name;
        this.newYear = this.actor.yearOfBirth;
      })
      .catch(err => console.log(err.message));
    fetch('http://localhost:3000/films')
      .then(res => res.json())
      .then(data => {
        this.allFilms = data;
      })
      .catch(err => console.log(err.message));
  },
  methods: {
    displayFilmForm() {
      this.showFilmForm = true;
    },
    cancelForm() {
      this.showFilmForm = false;
      this.showError = false;
      this.selectedFilm = null;
    },
    submitForm() {
      if (!this.selectedFilm) {
        this.showError = true;
        return;
      }
      this.actor.films.push(this.selectedFilm.title);
      const index = this.allFilms.findIndex(film => film.title === this.selectedFilm.title);
      if (index !== -1) {
        this.allFilms[index].actors.push(this.actor.name);
      }
      this.selectedFilm = null;
      this.showActorForm = false;
      this.showError = false;
    },
    removeFilm(film) {
        this.filmToRemove = film;
    },

    confirmRemove(filmToRemove) {
    const film = this.actor.films.indexOf(filmToRemove)
    this.actor.films.splice(film, 1);
    this.filmToRemove = null;
    },

    cancelRemove() {
        this.filmToRemove = null;
    },


    cancelEdit(field) {
        if (field === 'name') {
            this.editingName = false;
            this.newName = this.actor.name;
            this.showError2 = false;

        } else if (field === 'year') {
            this.editingYear = false;
            this.newYear = this.actor.year;
            this.showError2 = false;

        }
    },
    saveName() {
      if (this.newName.trim() === '') {
        this.showError2 = true;
        return;
      }
      this.actor.name = this.newName;
      this.editingName = false;
      this.showError2 = false;
    },
    saveYear() {
      if (isNaN(this.newYear) || this.newYear === '') {
        this.showError = true;
        return;
      }
      this.actor.yearOfBirth = parseInt(this.newYear);
      this.editingYear = false;
      this.showError = false;
  },
  }
}
</script>

<style scoped>
  .whole {
    margin-top: 2rem;
    background-color: lightgray;
    padding: 2rem;
    margin-right: 50rem;
  }


  button {
      padding: 0.5rem;
      margin-bottom: 1rem;
      background-color: white;
      border-color: rgb(101, 141, 155);
      border-style: solid;
  }
  .addFilm {
      padding: 0.5rem 3rem;
  }

form {
    border-style: none;
  }

.submit {
  margin-left: 0.25rem;
  display: flex;
}

.submit button {
  display: inline-block;
}

.submit input {
  display: inline-block;
}
.top {
  margin-left: 2.35rem;
  display: grid;
  grid-template-columns: 10rem 5rem;
  grid-template-rows: 4rem 0;
}

h3 {
  margin-bottom: 2rem;
}

.remove {
  margin-left: 5rem;
}

.submit button {
  cursor: pointer;
  margin-top: 1rem;
}


ul {
  list-style-type: none;
}
input {
  height: 2.25rem;
  margin-top: 1rem;
  margin-right: 1rem;
}
.selectFilm span {
  color: white;
}
form {
  display: flex;
}

select {
  display: flex;
  height: 2.25rem;
  margin-right: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  margin-top: 1rem;
}

.er {
    margin-left: 2rem;
    margin-top: 0;
    margin-bottom: 0;
}

.selectionForm {
    border-style: solid;
}
.confirm {
    display: inline-block;
    margin-left: 4rem;
}


</style>