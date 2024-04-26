<template>
  <div v-if="film" class="whole">
    <div v-if="!editingTitle">
      <div class="top">
        <h3>{{ film.title }}</h3> <button @click="editingTitle = true">Edit</button>
      </div>
    </div>
    <div v-else class="submit">
      <form @submit.prevent="saveTitle" class="submit">
        <input type="text" v-model="newTitle" required>
        <div>
          <button type="submit" class="apply">Apply</button>
          <button type="button" @click="cancelEdit('title')">Cancel</button>
        </div>
      </form>
    </div>
    <p v-if="showError2" style="color: red;">Please enter a name</p>

    <div v-if="!editingYear">
      <div class="top">
        <h3>Year: {{ film.year }}</h3> <button @click="editingYear = true">Edit</button>
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
          <li v-for="actor in film.actors">
              {{ actorToRemove !== actor ? actor :  'Delete ' + actor + '?'}}
              <div v-if="actorToRemove !== actor">
                <button @click="selectRemoveActor(actor)" class="remove">Remove</button>
              </div>
              <div v-else class="confirm">
                  <button @click="removeActor(actor)">Yes</button>
                  <button @click="cancelRemove">No</button>
              </div>
          </li>
          <li v-if="!showActorForm">
              <button class="addActor" v-on:click="displayActorForm">Assign Actor</button>
          </li>
          <li v-if="showActorForm">
              <div>
                  <form>
                      <select v-model="selectedActor">
                        <option class="selectActor" value="null"><span>Select Actor</span></option>
                        <option v-for="actor in filmlessActors" :value="actor">{{actor.name}}</option>
                      </select>
                      <p v-if="showError" style="color: red;">Please enter a name</p>
                      <div class="submit">
                          <button type="submit" @click.prevent="submitForm">Apply</button>
                          <button type="button" @click="cancelForm">Cancel</button>
                      </div>
                  </form>
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
  data() {
    return {
      editingTitle: false,
      editingYear: false,
      newTitle: '',
      newYear: '',
      showError: false,
      film: null,
      showActorForm: false,
      allActors: null,
      filmlessActors: null,
      selectedActor: null,
      actorToRemove:  null,
      showError2: false,
    }
  },
  props: ['id'],
  methods: {
    selectRemoveActor(actor) {
      this.actorToRemove = actor
    },
    cancelRemove() {
        this.actorToRemove = null;
    },
    closeFilm() {
      this.$emit('close')
    },
    saveTitle() {
      if (this.newTitle.trim() === '') {
        this.showError2 = true;
        return;
      }
      this.film.title = this.newTitle;
      this.editingTitle = false;
      this.showError = false;
      this.newTitle = this.film.title;
    },
    saveYear() {
      if (isNaN(this.newYear) || this.newYear === '') {
        this.showError = true;
        return;
      }
      this.film.year = parseInt(this.newYear);
      this.newYear = '';
      this.editingYear = false;
      this.showError = false;
      this.newYear = this.film.year;
    },
    cancelEdit(field) {
      if (field === 'title') {
        this.editingTitle = false;
        this.newTitle = this.film.title;
      } else if (field === 'year') {
        this.editingYear = false;
        this.newYear = this.film.year;
      }
      this.newTitle = this.film.title;
      this.newYear = this.film.year;
      this.showError2 = false;
    },
    displayActorForm() {
        this.showActorForm = true;
      },
    cancelForm() {
        this.showActorForm = false;
        this.showError = false;
      },
      submitForm() {
          if (this.selectedActor === null) {
              this.showError = true;
              return;
          }
          this.film.actors.push(this.selectedActor.name)
          this.selectedActor.films.push(this.film.name)
          this.showError = false;
          let j = this.filmlessActors.indexOf(this.selectedActor)
          if (j !== -1) {
            this.filmlessActors.splice(j, 1);
          }
          this.selectedActor = null
          this.showActorForm = false
      },
      removeActor(actor) {
            const index = this.film.actors.indexOf(actor)
            this.film.actors.splice(index, 1)
            for (let i=0; i<this.allActors.length; i++) {
              if (this.allActors[i].name === actor) {
                for (let j = 0; j<this.allActors[i].films.length; j++) {
                    let j = this.allActors[i].films.indexOf(this.film.name)
                    this.allActors[i].films.splice(j, 1)
                    if (this.allActors[i].films.length===0) {
                      this.filmlessActors.push(this.allActors[i])
                    }
                }
              }
            }
        },
  },
  
  mounted() {
    fetch('http://localhost:3000/films/' + this.id)
      .then(res => res.json())
      .then(data => {
        this.film = data
        this.newTitle = this.film.title;
        this.newYear = this.film.year;
      })
      .catch(err => console.log(err.message))

    fetch('http://localhost:3000/actors')
      .then(res => res.json())
      .then(data => {
        this.allActors = data
        this.filmlessActors = this.allActors.filter((actor)=> {
          if (actor.films.length === 0) {
            return actor
          }
        })
      })
      .catch(err => console.log(err.message))
  },
  computed: {
      displayedActors() {
          return this.film.actors.slice(0, this.numActors)
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
  .addActor {
      padding: 0.5rem 3rem;
  }
  li {
      margin: 1rem 0.25rem;
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
  margin-left: 4rem;
}

.submit button {
  cursor: pointer;
  margin-top: 1rem;
}

.apply button {
  margin-right: 1rem;
}

ul {
  list-style-type: none;
  display: grid;
}
input {
  height: 2.25rem;
  margin-top: 1rem;
  margin-right: 1rem;
}
.selectActor span {
  color: white;
}
li {
  display: flex;
}
</style>