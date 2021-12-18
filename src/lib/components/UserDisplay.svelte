<script>
    import { user_store } from "$lib/stores";

    let login_form = false;
    let display_user_menu = false;

    async function logOut() {

    const response = await fetch(`/logout`, {
    method: 'post'
    })

    if (response.ok) {
    let data = await response.json();
    console.log(data);
    $user_store = [];
    localStorage.removeItem('user');
    }

    else {
    console.log(error);
    // console.log(data);
    // $user_store = [];
    // localStorage.removeItem('user');
    }
}


</script>
<div class="menu">
<div on:mouseleave={() => { console.log(display_user_menu); display_user_menu = false }} on:mouseenter={() => { console.log(display_user_menu); display_user_menu = true }}>
<p>{$user_store.email}</p>
{#if display_user_menu}
<div>
<button type="button" style="display: block;" on:click|preventDefault={logOut}>Log Out</button>
</div>
{/if}
</div>
</div>
<style>
    .menu {
        /* margin-left: auto;  */
        display: block; 
        /* margin-right: %;
        width: 150px; */
        position: absolute;
        top: 0;
        right: 1%;
    }
</style>