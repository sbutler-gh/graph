import { writable } from "svelte/store";

let user_store = writable([]);
let wants_store = writable([]);
let wants_many_to_many_store = writable([]);
let want_store = writable([]);

export { user_store, wants_store, wants_many_to_many_store, want_store };
