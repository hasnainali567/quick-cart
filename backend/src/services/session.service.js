import { fromNodeHeaders } from 'better-auth/node'
import { auth } from '../lib/auth.js'

export const getCurrentSession = async (headers) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(headers),
    })

    return session
}
