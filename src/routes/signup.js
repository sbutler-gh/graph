// import supabase from '$lib/db';

import { createClient } from '@supabase/supabase-js'

const supabase = createClient( import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY, { fetch: (...args) => fetch(...args)  })

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post(request) {

    console.log(request);

    let { user, error } = await supabase.auth.signUp({
      email: request.body.get("email"),
      password: request.body.get("password")
    })

    // let { user, error } = await supabase.auth.signUp({
    //   email: request.body.get("email"),
    //   password: request.body.get("password")
    // },
    // {
    // data: {
    //   username: request.body.get("email").substring(0, request.body.get("email").lastIndexOf("@"))
    // }
    // })
    
    if (error) {
      return {
        status: 500,
        body: {
          user,
          error
        }
      }
    }

    else {

      return {
          status: 200,
          body: {
            user
          }
        }
      }
	}