<template>
  <router-view/>
</template>

<script>

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

  
</style>
