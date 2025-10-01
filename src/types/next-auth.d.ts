import 'next-auth'
import { DefaultSession } from 'next-auth'
// this file is for adding custom fields to the next-auth session and jwt token

declare module 'next-auth' {
    interface User{
        _id?: string
        isVerified?: boolean
        isAcceptingMessages?: boolean
        username?: string
    }
    interface Session{
        user: {
            _id?: string
            isVerified?: boolean
            isAcceptingMessages?: boolean
            username?: string
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string
        isVerified?: boolean
        isAcceptingMessages?: boolean
        username?: string
    }
}