// import supabase from '$lib/db';

import { createClient } from '@supabase/supabase-js'
// import crypto from "crypto";

const supabase = createClient( import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY, { fetch: (...args) => fetch(...args)  })

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post(request) {

  let user_id;

  request.body.get('user_id').value ? user_id = request.body.get('user_id') : user_id = null;

    const { data, error } = await supabase
    .from('comments_on_wants')
    .insert([
    { content: request.body.get('content'), want_id: request.body.get('want_id'), creator_id: user_id}
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