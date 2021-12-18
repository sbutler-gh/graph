// import supabase from '$lib/db';

import { createClient } from '@supabase/supabase-js'
// import crypto from "crypto";

const supabase = createClient( import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY, { fetch: (...args) => fetch(...args)  })

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post(request) {

    // console.log(request.body);

    // let uuid = crypto.randomUUID();
    // console.log(uuid);
    console.log(request.body.get('uuid_parent'));
    console.log(request.body.get('uuid_child'));

    let user_id;

    request.body.get('user_id').value ? user_id = request.body.get('user_id') : user_id = null;

    const { data, error } = await supabase
    .from('wants_wants')
    .insert([
    { want_id: request.body.get('uuid_child'), in_order_to_parent_id: request.body.get('uuid_parent'), creator_id: user_id}
    ])

    if (error) {
      return {
        status: 500,
        body: {
          data,
          error
        }
      }
    }

    else {
      return {
          status: 200,
          body: {
            data
          }
        }
      }
	}