import {
	GoogleAuthProvider,
	type User,
	onAuthStateChanged,
	sendEmailVerification,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from 'firebase/auth'

import { auth } from './firebaseService'

export async function login(email: string, pass: string) {
	return signInWithEmailAndPassword(auth, email, pass)
}

export async function logout() {
	return signOut(auth)
}

export function onAuthChanged(callback: (user: User | null) => void) {
	return onAuthStateChanged(auth, callback)
}

export function emailVerification(user: User) {
	return sendEmailVerification(user)
}

export function googleLogin() {
	const provider = new GoogleAuthProvider()
	return signInWithPopup(auth, provider)
}
