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
<div class="comments" style="box-shadow: 0 0 20px rgb(0 0 0 / 15%); border-radius: 5px; margin-top: 24px; width: 80%; padding: 10px; text-align: left;">
    <!-- <p class="author">{comment?.user_id?.username}</p> -->
    <p class="datetime">{Date(comment?.created_at).substring(0,33)}</p>
    <p class="body">{comment?.content}</p>
    </div>
{/each}
{/if}
<style>
    * {
        font-family: Arial, Helvetica, sans-serif;
    }
    .author {
        font-size: 14px;
        font-weight: 600;
    }
    .datetime {
        font-size: 12px;
        color: lightgrey;
    }
    .body {
        font-size: 16px;
    }
    .comments p {
        margin-bottom: 10px;
    }
</style>