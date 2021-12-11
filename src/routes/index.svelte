<script>
import { goto } from "$app/navigation";

    import SignUpForm from "$lib/components/SignUpForm.svelte";
    import {wants_many_to_many_store, wants_store, want_store} from "$lib/stores"

    async function submitForm(e) {
        console.log(e.target);

        var formData = new FormData(e.target)
        formData.append('uuid_parent', crypto.randomUUID())
        formData.append('uuid_child', crypto.randomUUID())
       
        const response = await fetch(`insert_want`, {
            method: 'post',
            body: formData
            })
      
      if (response.ok) {
        let data = await response.json();
        console.log(data);
        $wants_store.push(data.data[0]);
        $wants_store.push(data.data[1]);
        $wants_store = $wants_store;
        $want_store = data.data[1];
        console.log($want_store);
        return insertManyToManyRelationship(formData);
      }
      else {
        let data = await response.json();
        console.log(data);
        console.log(error);
      }

    }

    async function insertManyToManyRelationship(formData) {

        const response = await fetch(`insert_want_many_to_many`, {
            method: 'post',
            body: formData
            })

      if (response.ok) {
        let data = await response.json();
        console.log(data);
        $wants_many_to_many_store.push(data.data[0]);
        $wants_many_to_many_store = $wants_many_to_many_store;
        goto(`/${$want_store.name}`);
      }
      else {
        let data = await response.json();
        console.log(data);
        console.log(error);
      }

    }
</script>
<br>
<br>
<form on:submit|preventDefault={submitForm}>
<h3 style="margin-bottom:30px; text-align: center;">What are you trying to do?</h3>
<!-- <label>What are you trying to do?</label> -->
<div style="display: flex">
<label>I/we are trying to</label>
<textarea name="trying-to" placeholder="..."></textarea>
</div>
<br>
<br>
<br>
<div style="display: flex">
<label>In order to</label>
<textarea name="in-order-to" placeholder="..."></textarea>
</div>
<br>
<button class="submit">Submit</button>
</form>
{#each $wants_many_to_many_store as want}
{JSON.stringify(want)}
{/each}
{#each $wants_store as want}
<p>{want?.name}</p>
{/each}
<style>
    form label, form textarea, form button, form input {
        display: block
    }
    textarea {
        padding: 5px;
        font-size: 16px;
        width: 100%;
        height: 24px;
        border: none;
        border-bottom: solid 1px gray;
    }
    .submit {
        margin-left: auto;
        display: block;
    }
    label {
        min-width: fit-content;
        margin-right: 10px;
    }
</style>