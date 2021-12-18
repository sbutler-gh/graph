<script>
import SignUpForm from "$lib/components/SignUpForm.svelte";
import UserDisplay from "$lib/components/UserDisplay.svelte";

  import "../app.css";
</script>
<script context="module">
  import {wants_many_to_many_store, wants_store, user_store} from "$lib/stores"
  import { browser } from '$app/env';
  export async function load({ page, fetch}) {

    if (browser) {
    
    if (localStorage.getItem('user')) {
        user_store.set(JSON.parse(localStorage.getItem('user')));
    }

    }

    let response = await fetch('get_wants', {
            method: 'post'
            })

            if (response.ok) {
            let wants = await response.json();
            // console.log('logging wants');
            wants_store.set(wants.data);
            }

            else {
            console.log(error);
            }

      let wants_many_to_many = await fetch('get_wants_many_to_many', {
      method: 'post'
      })

      if (wants_many_to_many.ok) {
      let data = await wants_many_to_many.json();
      // console.log('logging wants');
      wants_many_to_many_store.set(data.data);
      }

      else {
      console.log(error);
      }

    return {
      props: {
          
      }
    };
}
</script>

<div class="main">
  <UserDisplay></UserDisplay>
  <slot />
</div>
<style>
.main {
  max-width: 650px;
  margin: auto;
  margin-top: 15px;
}
</style>