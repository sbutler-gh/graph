<script>
  import "../app.css";
</script>
<script context="module">
  import {wants_many_to_many_store, wants_store} from "$lib/stores"
  export async function load({ page, fetch}) {

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
  <slot />
</div>
<style>
.main {
  max-width: 650px;
  margin: auto
}
</style>