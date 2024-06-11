'ues client'

import type { User } from 'firebase/auth'
import { createContext, useContext } from 'react'

interface AuthContextType {
	userAuth: User | null
	logout: () => void
}
export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const userAuthContext = () => useContext(AuthContext)
