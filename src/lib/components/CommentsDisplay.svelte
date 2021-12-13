<script>
import { onMount } from "svelte";
import {comments_store} from "$lib/stores"

export let want;
// let comments;

onMount(() => {
    getComments();
})

async function getComments() {

let response = await fetch('get_comments', {
            method: 'post',
            body: want.id
        })

        if (response.ok) {
            let data = await response.json();
            console.log(data);
            $comments_store = data.data.reverse();
            $comments_store = $comments_store
        }
        else {
            console.log(error);
        }
    }
</script>
{#if $comments_store}
{#each $comments_store as comment}
<p>{comment.content}</p>
{/each}
{/if}