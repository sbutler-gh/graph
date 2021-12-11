<script>
    export let want;
    export let parents;
    export let children;
</script>
<script context="module">

      import {wants_many_to_many_store, wants_store, want_store} from "$lib/stores"

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

            // Now we return this values as props for the page.

			return {
				props: {
                    want: this_want,
                    parents: parents,
                    children: children
				}
			};
	}
</script>

<h3>What are you trying to do?</h3>

<p>{want?.name}</p>
<br>
<h5>In order to ...</h5>
{#if parents?.length > 0}
{#each parents as parent}
<p>{parent.name}</p>
{/each}
{/if}
<button style="margin-left: auto; display: block;">Add additional</button>
<h5>How can we accomplish {want?.name}?</h5>
{#if children?.length > 0}
{#each children as child}
<p>{child.name}</p>
{/each}
{/if}
<button style="margin-left: auto; display: block;">Add additional</button>
