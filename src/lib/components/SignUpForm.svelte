<script>
    import {user_store} from "$lib/stores.js";

    async function signUp(e) {
        var formData = new FormData(e.target)

        const response = await fetch(`/signup`, {
            method: 'post',
            body: formData
        })

    if (response.ok) {
      let data = await response.json();
      console.log(data);
      $user_store = data.user;
      console.log(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    //   return createNewPage(e);
    }

    else {
      console.log(error);
      signup_error = error;
    }
    }
</script>
<form on:submit|preventDefault={signUp}>
    <label for="email">Email</label>
    <input type="email" name="email">
    <label for="password">Password</label>
    <input name="password">
    <button>Submit</button>
</form>