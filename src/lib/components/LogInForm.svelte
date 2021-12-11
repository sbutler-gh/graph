<script>
    import {user_store} from "$lib/stores";

    async function logIn(e) {

    var formData = new FormData(e.target);

    const response = await fetch(`/signin`, {
    method: 'post',
    body: formData
    })

    if (response.ok) {
    let data = await response.json();
    $user_store = data.user;
    console.log(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    // return addUserToPage();
    }

    else {
    console.log(error);
    // signup_error = error;
    }
}
</script>
<form on:submit|preventDefault={logIn}>
    <label>Email</label>
    <input type="email" name="email">
    <label>Password</label>
    <input name="password">
    <button>Submit</button>
</form>