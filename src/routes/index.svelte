<script>
import { goto } from "$app/navigation";

    import SignUpForm from "$lib/components/SignUpForm.svelte";
    import {wants_many_to_many_store, wants_store, want_store, in_order_to_draft_store} from "$lib/stores"

    async function submitForm(e) {
        console.log(e.target);
        

        // We're checking to see if a want with the same name already exists.  If so, instead of creating a new object in the database (which could lead to sprawl, of multiple wants having the same name and being different objects), we'll instead route to that same-named want.
        if ($wants_store.some(element => element.name == document.getElementById('trying-to').value)) {

            // In case people we're already typing values for the "in-order-to" section, instead of that data being lost, we'll save it in a store.  When we go to the currently existing page for this want, then this in_order_to draft will be pre-loaded in a textarea, so the user can submit it and create the relationship on that page.
            $in_order_to_draft_store = document.getElementById('in-order-to').value
            goto(`/${document.getElementById('trying-to').value}`);
        }

        else {
        
        var formData = new FormData(e.target)

        formData.append('uuid_parent', crypto.randomUUID())
        formData.append('uuid_child', crypto.randomUUID())
       
        const response = await fetch(`insert_wants`, {
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
<textarea required id="trying-to" name="trying-to" placeholder="..." onkeypress="return event.charCode != 47 && event.charCode != 92"></textarea>
</div>
<br>
<br>
<br>
<div style="display: flex">
<label>In order to</label>
<textarea required id="in-order-to" name="in-order-to" placeholder="..." onkeypress="return event.charCode != 47 && event.charCode != 92"></textarea>
</div>
<br>
<button class="submit">Submit</button>
</form>

<h3>Newest entries</h3>
{#each $wants_store.slice().reverse() as want}
<button><a sveltekit:prefetch href={want.name}>{want.name}</a></button>
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
    button a {
        text-decoration: none;
        color: black;
    }
    button {
        display: block;
        margin-top: 10px;
    }
</style>