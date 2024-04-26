<template>
    {{ film.title }} ({{ film.year }})
</template>

<script>
  export default {
    data() {
        return {
            showActorForm: false,
        }
    },
    props: ['film'],
    methods: {
        closeFilm() {
            this.$emit('close')
        },
        submitForm() {
            if (this.name.length === 0) {
                this.showError = true;
                return;
            }
            this.film.actors.push(this.name)
            this.showActorForm = false
            this.name = ""
            this.numActors += 1
            this.showError = false;
        }
    },
}
</script>



<style scoped>
    button {
        padding: 0.5rem;
        background-color: white;
        border-color: rgb(101, 141, 155);
        border-style: solid;
    }
    li {
        margin: 1rem 0.25rem;
    }

    .submit {
    padding: 1rem;
  }

  .submit button {
    padding: 10px 20px;
    margin-right: 10px;
    cursor: pointer;
  }
  ul {
    list-style-type: none;
}

</style>