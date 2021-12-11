// import supabase from '$lib/db';

import { createClient } from '@supabase/supabase-js'

const supabase = createClient( import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY, { fetch: (...args) => fetch(...args)  })

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post(request) {

    // let request_parsed = JSON.parse(request);

    console.log(request);
    // let formData = await request.body.formData();
    // console.log(request_parsed);

    let res = await supabase.auth.signOut()
    
    if (res.error) {
      return {
        status: 500,
        body: {
        }
      }
    }

    else {

      return {
          status: 200,
          body: {
            res
          }
        }
      }
	}