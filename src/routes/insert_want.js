// import supabase from '$lib/db';

import { createClient } from '@supabase/supabase-js'
// import crypto from "crypto";

const supabase = createClient( import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY, { fetch: (...args) => fetch(...args)  })

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post(request) {

    const { data, error } = await supabase
    .from('wants')
    .insert([
    { name: request.body.get('want_name')}
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