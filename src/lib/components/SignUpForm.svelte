<script>
  import {user_store} from "$lib/stores.js";

  async function signUp(e) {

    document.getElementById('signUpButton').disabled = true;
    document.getElementById('logInButton').disabled = true;

      var formData = new FormData(e.target);

    let auth_endpoint;

    e.submitter.id == "logInButton" ? auth_endpoint = "signin" : auth_endpoint = "signup";

      const response = await fetch(`/${auth_endpoint}`, {
          method: 'post',
          body: formData
      })

  if (response.ok) {
    let data = await response.json();
    console.log(data);
    document.getElementById('signUpButton').disabled = false;
    document.getElementById('logInButton').disabled = false;
    $user_store = data.user;
    console.log(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
  //   return createNewPage(e);
  }

  else {
    console.log(error);
    signup_error = error;
    document.getElementById('signUpButton').disabled = false;
    document.getElementById('logInButton').disabled = false;
  }
  }

  async function LogIn(e) {
    console.log(e.target);
  }
</script>
<details><summary>Sign In</summary>
  <form on:submit|preventDefault={signUp}>
    <h5>Sign in to store activity and get notifications about what you're trying to do.</h5>
    <br>
    <label for="email">Email</label>
    <input type="email" name="email">
    <label for="password">Password</label>
    <input name="password">
    <button type="submit" id="signUpButton">Sign Up</button> or <button type="submit" id="logInButton">Log In</button>
  </form>
</details>

<style>
label, input, button {
  display: block;
}

input {
  margin-bottom: 10px;
}

form {
  width: 200px;
  background: rgb(245, 245, 245);
  border: solid 1px #dedede;
  z-index: 10;
  padding: 5px;
}
</style>