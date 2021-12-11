// import supabase from '$lib/db';

import { createClient } from '@supabase/supabase-js'

const supabase = createClient( import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY, { fetch: (...args) => fetch(...args)  })

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post(request) {

    console.log(request.body);

    const { data, error } = await supabase
    .from('comments')
    .insert([
      { content: request.body.get('content'), user_id: request.body.get('user_id'), parent_id: request.body?.get('parent_id'), page_id: request.body.get('page_id')}
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