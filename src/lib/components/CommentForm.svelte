<script>
    export let want;
    import {comments_store, user_store} from "$lib/stores"
    let content;

    async function submitComment(e) {
        document.getElementById('submitCommentButton').disabled = true;
        var formData = new FormData(e.target);
        formData.append('want_id', want.id)
        $user_store?.id ? formData.append('user_id', $user_store?.id) : null;

        let response = await fetch('insert_comment_on_want', {
            method: 'post',
            body: formData
        })

        if (response.ok) {
            let data = await response.json();
            $comments_store.unshift(data.data[0]);
            $comments_store = $comments_store;
            content = "";
        }
        else {
            console.log(error);
        }
        document.getElementById('submitCommentButton').disabled = false;
    }
</script>
<form on:submit|preventDefault={submitComment}>
    <h5>Add a Comment</h5>
    <br>
    <textarea bind:value={content} name="content" style="display: block; width: 50%; margin-bottom: 5px;"></textarea>
    <button id="submitCommentButton" style="display: block;">Submit Comment</button>
</form>