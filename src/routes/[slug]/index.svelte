<script>
    import CommentForm from "$lib/components/CommentForm.svelte";
import CommentsDisplay from "$lib/components/CommentsDisplay.svelte";
import { page } from "$app/stores";
    export let want;
    export let parents;
    export let children;
    export let in_order_to;
    let selected_in_order_to;
    let to_accomplish;
    let trying_to;
    let new_trying_to_array = [];

    async function submitParent(e) {

        document.getElementById('submitParentButton').disabled = true;

        var formData = new FormData(e.target);
        formData.append('uuid_child', want.id);
        // We'll append the user id to show who created this.
        $user_store?.id ? formData.append('user_id', $user_store?.id) : null;

        // First, we want to check if the item being submitted exists already.  And if so, to prevent sprawl, we want to create the parent on the current want with that already existing item.
        if ($wants_store.find(element => element.name == in_order_to)) {
            let parent = $wants_store.find(element => element.name == in_order_to);

            // Now, we'll append the parent ID to the formData, so we can insert a relationship to the many_many table with want.id and the parent.id
            formData.append('uuid_parent', parent.id)

            // With that set, we'll insert the relationship into the many to many table.
            let response = await fetch ('/insert_want_many_to_many', {
            method: 'post',
            body: formData
            })

            if (response.ok) {
                let data = await response.json();

                // We'll add the new relationship to the local store of the many_to_many table.
                $wants_many_to_many_store.push(data.data[0]);

                // And we'll update the local parents array to include the new parent.
                parents.push(parent);
                in_order_to = "";
                document.getElementById('submitParentButton').disabled = false;
            
            }
            else {
                console.log(error);
            }
        }

        // If the item being submittted does not exist yet, we'll need to create a new want, and then create the relationship between the new parent and the currently existing want on this page.
  
        else {

            // We want to add the name of the new want to the formData, so it can be read in the insert_want endoint.
            formData.append('want_name', in_order_to);

            const response = await fetch(`insert_want`, {
            method: 'post',
            body: formData
            })

        if (response.ok) {
            let data = await response.json();

            // We add the newly created want to the overall want array.
            $wants_store.push(data.data[0]);
            $wants_store = $wants_store;

            // And we add the id of the newly created want to the formData object, which we'll be passing on:
            formData.append('uuid_parent', data.data[0].id);

            // And now we run the function to create the relationship between the current want and this newly created parent want.  We'll also be submitting the new parent object, so that can be added to the parents array when the relationship is created.
            insertManyToManyRelationship(formData, data.data[0]);
        }
        else {
            console.log(error);
         }
        }
    }

    async function submitChild(e) {

    document.getElementById('submitChildButton').disabled = true;

var formData = new FormData(e.target);
formData.append('uuid_parent', want.id);
// We'll append the user id to show who created this.
$user_store?.id ? formData.append('user_id', $user_store?.id) : null;

// First, we want to check if the item being submitted exists already.  And if so, to prevent sprawl, we want to create the child on the current want with that already existing item.
if ($wants_store.find(element => element.name == to_accomplish)) {
    let child = $wants_store.find(element => element.name == to_accomplish);

    // Now, we'll append the child ID to the formData, so we can insert a relationship to the many_many table with child.id (want_id) and the want.id (in_order_to_parent_id)
    formData.append('uuid_child', child.id)

    // With that set, we'll insert the relationship into the many to many table.
    let response = await fetch ('/insert_want_many_to_many', {
    method: 'post',
    body: formData
    })

    if (response.ok) {
        let data = await response.json();

        // We'll add the new relationship to the local store of the many_to_many table.
        $wants_many_to_many_store.push(data.data[0]);

        // And we'll update the local children array to include the new parent.
        children.push(child);
        to_accomplish = "";
        document.getElementById('submitChildButton').disabled = false;
    }
    else {
        console.log(error);
    }
}

// If the item being submittted does not exist yet, we'll need to create a new want, and then create the relationship between the new child and the currently existing want on this page.

else {

    // We want to add the name of the new want to the formData, so it can be read in the insert_want endoint.
    formData.append('want_name', to_accomplish);


    const response = await fetch(`insert_want`, {
    method: 'post',
    body: formData
    })

if (response.ok) {
    let data = await response.json();

    // We add the newly created want to the overall want array.
    $wants_store.push(data.data[0]);
    $wants_store = $wants_store;

    // And we add the id of the newly created want to the formData object, which we'll be passing on:
    formData.append('uuid_child', data.data[0].id);

    // And now we run the function to create the relationship between the current want and this newly created child want.  We'll also be submitting the new child object, so that can be added to the children array when the relationship is created.
    insertManyToManyRelationship(formData, data.data[0]);
}
else {
    console.log(error);
 }
}
}

// This function is if we see an "in order to" value on this page, and want to propose a different means to serve that end.
// For example, if we're trying trying to "get a bike", that could be in order to "get to work" and "get groceries from the store."
// But getting a bike isn't the only way to "get to work" or "get groceries from the store."
// "Finding a public transit route" could also help us "get to work."  "Signing up for a delivery service" could also help us "get groceries from the store."
// So with this function, and the corresponding form in the HTML, we enable users to select one of the ends (e.g. "in order to"s) present on the page — and offer alternative means to accomplishing them, besides the main want displayed at the top of the page.
async function submitTryingTo(e) {

document.getElementById('submitTryingToButton').disabled = true;

var formData = new FormData(e.target);
formData.append('uuid_parent', selected_in_order_to.id);

// We'll append the user id to show who created this.
$user_store?.id ? formData.append('user_id', $user_store?.id) : null;

// First, we want to check if the item being submitted exists already.  And if so, to prevent sprawl, we want to create the child on the current want with that already existing item.
if ($wants_store.find(element => element.name == trying_to)) {
let child = $wants_store.find(element => element.name == trying_to);

// Now, we'll append the child ID to the formData, so we can insert a relationship to the many_many table with child.id (want_id) and the want.id (in_order_to_parent_id)
formData.append('uuid_child', child.id)

// With that set, we'll insert the relationship into the many to many table.
let response = await fetch ('/insert_want_many_to_many', {
method: 'post',
body: formData
})

if (response.ok) {
    let data = await response.json();

    // We'll add the new relationship to the local store of the many_to_many table.
    $wants_many_to_many_store.push(data.data[0]);

    new_trying_to_array.push({
        "in_order_to": selected_in_order_to.name,
        "trying_to": trying_to
    });
    new_trying_to_array = new_trying_to_array;

    // We won't be able to see the updated data unless we navigate to that next page.
    // goto(`${selected_in_order_to.name}`);
    trying_to = "";
    document.getElementById('submitTryingToButton').disabled = false;
}
else {
    console.log(error);
}
}

// If the item being submittted does not exist yet, we'll need to create a new want, and then create the relationship between the new child and the currently existing want on this page.

else {

// We want to add the name of the new want to the formData, so it can be read in the insert_want endoint.
formData.append('want_name', trying_to);

const response = await fetch(`insert_want`, {
method: 'post',
body: formData
})

if (response.ok) {
let data = await response.json();

// We add the newly created want to the overall want array.
$wants_store.push(data.data[0]);
$wants_store = $wants_store;

// And we add the id of the newly created want to the formData object, which we'll be passing on:
formData.append('uuid_child', data.data[0].id);

// And now we run the function to create the relationship between the current want and this newly created child want.  We'll also be submitting the new child object, so that can be added to the children array when the relationship is created.
insertManyToManyRelationship(formData, data.data[0]);
}
else {
console.log(error);
}
}
}

    async function insertManyToManyRelationship(formData, new_want) {

        const response = await fetch(`insert_want_many_to_many`, {
            method: 'post',
            body: formData
            })

        if (response.ok) {
        let data = await response.json();
        console.log(data);
        
        // We'll add the new relationship to the wants many_to_many store
        $wants_many_to_many_store.push(data.data[0]);
        $wants_many_to_many_store = $wants_many_to_many_store;

            // If the in_order_to_parent_id of the new relationship equals the new_want.id passed into this function, that means that we need to add the new want to the parents array.
            if (data.data[0].in_order_to_parent_id == new_want.id) {
                parents.push(new_want);
                parents = parents;
                in_order_to = "";
                document.getElementById('submitParentButton').disabled = false;
            }

            // If the in_order_to_parent_id of the new relationship equals the id of the selected "in-order-to" (when creating new "trying-to"), that means that we don't want to add anything to the parents or child array.
            // This is because a child was added to the selected parent, but we should not see this because we are not currently on that selected parent page.
            // If we click on the selected parent, then we will see the newly created child as expected.
            // However, to show the user that this work as expected (and for context), we will add this data to a different array to be shown in that alternatives section.

            else if (data.data[0].in_order_to_parent_id == selected_in_order_to.id) {

                new_trying_to_array.push({
                    "in_order_to": selected_in_order_to.name,
                    "trying_to": trying_to
                })
                new_trying_to_array = new_trying_to_array;

                trying_to = "";
                document.getElementById('submitTryingToButton').disabled = false;
            }

            // Otherwise, that means we need to add the new want to the child array.
            else {
                children.push(new_want);
                children = children;
                to_accomplish = "";
                document.getElementById('submitChildButton').disabled = false;
            }
        }

        else {
            console.log(error);
        }

}

</script>
<script context="module">

import { goto } from "$app/navigation";
      import {comments_store, wants_many_to_many_store, wants_store, want_store, in_order_to_draft_store, user_store, comments_table_store} from "$lib/stores"

      import { get } from 'svelte/store'

    	export async function load({ page, fetch, session, stuff }) {

            let this_want = get(want_store);

            // The rest of this function is to define the objects that the have a relationship with this want.
            // If my want is "get a bike", in order to "go to work" and "exercise", then "go to work" and "exercise" are the parents of "get a bike."
            // If my want is "get a bike", and we can accomplish that by "buying a bike" and "borrowing a bike", then "buying a bike" and "borrowing a bike" are the children of "get a bike."
            let parents = [];
            let children = [];
            
        
            // First, if want_store is empty (like when loading a page for the first time), then we search for matching slug of the URL in the wants_store array.
            let wants_array = get(wants_store);
            if (!this_want?.name) {
               this_want = wants_array.find(element => element.name == page.params.slug);
            }

            // Now, we have the want specified by the current url and slug specified.


            // To search for the parents and children of the current want, we pull in the many-to-many table of wants.
            let wants_many_to_many_array = get(wants_many_to_many_store);
 

            // Now we search the many-to-many table for instances of the current want, which indicates the want has a parent in that same row.
            // The table structure is | want_id | in_order_to_parent_id |, so any time the current want.id shows up in the left column, the value in the right column will be a parent want.
            let parent_rows = wants_many_to_many_array.filter(element => element.want_id == this_want?.id);

            // If there are any matches from that search
            if (parent_rows) {

                // We will construct the parents array, by referencing the in_order_to_parent_id values of the matching rows with the overall wants_store array.

                // For every instance of a parent for the current want
                for (var i=0; i < parent_rows?.length; i++) {
                    // We search that parent in the overall wants arrray, and return the full object into the parents array.
                    parents[i] = wants_array.find(element => element.id == parent_rows[i].in_order_to_parent_id)
                }

                console.log(parents);
            }

            // Now we search the many-to-many table for instances where the current want is present in the "in_order_to_parent_id" column
            // The table structure is | want_id | in_order_to_parent_id |, so any time our current want.id shows up in the right column, the value in the left column will be a child want.
            let child_rows = wants_many_to_many_array.filter(element => element.in_order_to_parent_id == this_want?.id);

            // If there are any matches from that search
            if (child_rows) {

            // We will construct the children array, by referencing the want_id values of the matching rows with the overall wants_store array.

            // For every instance of a child for the current want

            for (var i=0; i < child_rows?.length; i++) {

                // We search that child in the overall wants arrray, and return the full object into the children array.
                children[i] = wants_array.find(element => element.id == child_rows[i].want_id)
            }

            console.log(children);
            }

            // fetching comments from comment_table_store for this page

            let comments_table_array = get(comments_table_store);
            let comments_array = comments_table_array.filter(element => element.want_id == this_want?.id);
            comments_store.set(comments_array.reverse());

			return {
				props: {
                    want: this_want,
                    parents: parents,
                    children: children,
                    in_order_to: get(in_order_to_draft_store)
				}
			};
	}
</script>
<svelte:head>
<title>Clarify</title>
<meta name="description" content="What are you/we trying to do? {want?.name}"/>

<meta property="og:title" content="{want?.name}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="{$page.path}" />
<meta property="og:description" content="What are you/we trying to do? {want?.name}"/>
<meta property="og:image" content="">

<!-- <meta name="twitter:card" content="summary_large_image"> -->
<meta property="twitter:domain" content="clarify.pages.dev">
<meta property="twitter:url" content="{$page.path}">
<meta name="twitter:title" content="{want?.name}">
<meta name="twitter:description" content="What are you/we trying to do? {want?.name}">
<meta name="twitter:image" content="">

</svelte:head>
<a href="/" style="margin: 10px 0; display: block;">Home</a>
<p style="font-weight: 700">What are you/we trying to do?</p>
<br>
<button disabled><a disabled>{want?.name}</a></button>
<br>
<div class="section">
<h5 style="margin-right: 10px;">In order to:</h5>
<br>
<ul>
{#if parents?.length > 0}
{#each parents as parent}
<li><button><a sveltekit:prefetch href={parent.name}>{parent.name}</a></button></li>
{/each}
{/if}
<li><form style="max-width: 300px;" on:submit|preventDefault={submitParent}>
    <textarea class="blank-line" name="in-order-to" bind:value={in_order_to} onkeypress="return event.charCode != 47 && event.charCode != 92" placeholder="..."></textarea>
    <button id="submitParentButton" style="display: block; margin-left: auto; margin-top: 10px;">Add purpose</button>
 </form></li>
</ul>
</div>
<br>
<div class="section">
<h5>How can we <span style="display: inline"><button style="display: inline" disabled><a disabled>{want?.name}</a></button></span>?</h5>
<ul>
{#if children?.length > 0}
<br>
{#each children as child}
<li><button><a sveltekit:prefetch href={child.name}>{child.name}</a></button></li>
{/each}
{/if}
<li><form style="max-width: 300px;" on:submit|preventDefault={submitChild}>
    <textarea class="blank-line" name="to-accomplish" bind:value={to_accomplish} onkeypress="return event.charCode != 47 && event.charCode != 92" placeholder="..."></textarea>
    <button id="submitChildButton" style="display: block; margin-left: auto; margin-top: 10px;">Add means</button>
    </form></li>
</ul>
</div>
<br>
<br>
<div class="section">
{#if parents?.length > 0}
<h5>What else can we do in order to <select style="" bind:value={selected_in_order_to}>
{#each parents as parent}
<option value={parent}>{parent.name}</option>
{/each}
</select>?</h5>
<br>
<ul>
{#each new_trying_to_array as new_trying_to}
<li><p style="margin-bottom: 10px;">In order to <button style="display: inline"><a href={new_trying_to['in_order_to']}>{new_trying_to['in_order_to']}</a></button>, we can <button style="display: inline"><a href={new_trying_to['trying_to']}>{new_trying_to['trying_to']}</a></button></p></li>
{/each}
<li><form style="max-width: 300px;" on:submit|preventDefault={submitTryingTo}>
    <textarea class="blank-line" name="trying-to" bind:value={trying_to} onkeypress="return event.charCode != 47 && event.charCode != 92" placeholder="..."></textarea>
    <button id="submitTryingToButton" style="display: block; margin-left: auto; margin-top: 10px;">Add new</button>
    </form></li>
</ul>
<br>
{/if}
</div>
<br>
<CommentForm want={want}></CommentForm>
{#if want?.id}
<CommentsDisplay want={want}></CommentsDisplay>
{/if}
<style>
    button a {
        text-decoration: none;
        color: black;
    }
    button {
        display: block;
        margin-bottom: 10px;
    }

    .blank-line {
        padding: 5px;
        font-size: 16px;
        width: 100%;
        height: 24px;
        border: none;
        border-bottom: solid 1px gray;
    }

    .section {
        background: #fdfdfd;
        border-radius: 10px;
        border: solid 1px lightgrey;
        padding: 20px;
        
    }
</style>