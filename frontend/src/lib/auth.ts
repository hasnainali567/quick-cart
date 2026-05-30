import {createAuthClient} from 'better-auth/react'

const auth = createAuthClient({
    baseURL : import.meta.env.VITE_BASE_URL,
    fetchOptions : {
        credentials : 'include'
    }
})

export const {
    useSession,
    signIn,
    signUp,
    signOut,
} = auth;