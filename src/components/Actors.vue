<template>
<div class="whole">
    <button class="addActor" v-on:click="displayActorForm" v-if="!showActorForm">Add Actor</button>
    <form v-if="showActorForm">
      <div class="input-container">
        <label for="title">Name:</label>
        <input type="text" id="name" required v-model="name" placeholder="Enter name">
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
    <ul>
        <li v-for="actor in displayActors">
              <div v-if="actorToRemove !== actor">
                <button @click="selectRemoveActor(actor)" class="remove">Delete</button>
                {{ actor.name }}
              </div>
              <div v-else class="confirm">
                  Remove "{{ actor.name }}"?
                  <button @click="removeActor(actor)">Yes</button>
                  <button @click="cancelRemove">No</button>
              </div>
      
        </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      actors: [],
      showActorForm: false,
      showError: false,
      search: "",
      displayActors: [],
      sortBy: null,
      name: "",
      year: "",
      actorToRemove: null,
    }
  },
  watch: {
    sortBy() {
      this.sortActors();
    }
  },
  mounted() {
    fetch('http://localhost:3000/actors')
      .then(res => res.json())
      .then(data => {
        this.actors = data
        this.displayActors = this.actors.sort((a, b) => a.name.localeCompare(b.name))
      })
      .catch(err => console.log(err.message))
  },
  methods: {
    selectRemoveActor(actor) {
      this.actorToRemove = actor
    },
    removeActor(actor) {
      const index = this.actors.indexOf(actor)
      this.actors.splice(index, 1)
    },
    cancelRemove() {
        this.actorToRemove = null;
    },
    displayActorForm() {
      this.showActorForm = true;
    },
    cancelForm() {
      this.showActorForm = false;
      this.showError = false;
    },
    submitForm() {
      if (this.name === "" || this.year === "" || this.year === 0) {
        this.showError = true;
        return;
      }
      this.showActorForm = false;
      const newId = this.actors.length === 0 ? 1 : this.actors[this.actors.length - 1].id + 1;
      const newActor = {
        "id": newId,
        "name": this.name,
        "year": this.year,
        "films": []
      };
      this.title = "";
      this.year = "";
      this.actors.push(newActor);
      this.showError = false;
      this.sortActors();
    },
    sortActors() {
      this.displayActors.sort((a, b) => a.name.localeCompare(b.name));
    },
  }
}
</script>

<style>
.whole {
    margin-top: 2rem;
    background-color: lightgray;
    padding: 2rem;
    margin-right: 50rem;
  }

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

button,
.addActor {
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

li {
    margin: 1rem;
}

.container {
  display: flex;
}

.addActor {
    margin-left: 3.35rem;
}

  
</style>

