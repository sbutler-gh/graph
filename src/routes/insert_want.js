// import supabase from '$lib/db';

import { createClient } from '@supabase/supabase-js'
// import crypto from "crypto";

const supabase = createClient( import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY, { fetch: (...args) => fetch(...args)  })

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post(request) {

  // let user_id;
  
  // console.log('logging id');

  // console.log(request.body.get('user_id').value);
  // console.log(request.body.get('user_id'));

  // !request.body.get('user_id') ? user_id = null : user_id = request.body.get('user_id');

  // console.log(user_id);

    const { data, error } = await supabase
    .from('wants')
    .insert([
    { name: request.body.get('want_name'), creator_id: request.body?.get('user_id')}
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