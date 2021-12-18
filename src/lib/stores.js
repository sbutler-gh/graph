import { writable } from "svelte/store";

let user_store = writable([]);
let wants_store = writable([]);
let wants_many_to_many_store = writable([]);
let want_store = writable([]);
let in_order_to_draft_store = writable([]);
let comments_store = writable([]);
let comments_table_store = writable([]);

export { user_store, wants_store, wants_many_to_many_store, want_store, in_order_to_draft_store, comments_table_store, comments_store };
