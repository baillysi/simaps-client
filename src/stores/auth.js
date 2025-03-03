import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useFirebaseAuth } from 'vuefire'
import { onAuthStateChanged } from 'firebase/auth'
import { signInAnonymously, signOut, signInWithRedirect, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'

import router from '../router'

export const useAuthStore = defineStore('store', () => {

    const auth = useFirebaseAuth()
    const isLoggedIn = ref(false)
    const isAdmin = ref(false)
    const isAuthLoading = ref(true)
    const googleProvider = new GoogleAuthProvider()
    const githubProvider = new GithubAuthProvider()

    async function signOutAll() {
        await signOut(auth)
            .then(() => {
                router.push({ name: 'Home'})
                console.log('Logged out !')
            })
            .catch(error => {
                alert(error.message)
            });
    }

    async function signInAsGuest() {
        isAuthLoading.value = true
        await signInAnonymously(auth)
            .then(() => {
                console.log('Logged in as guest !')
                isAuthLoading.value = false
            })
            .catch((error) => {
                alert(error.message)
                isAuthLoading.value = false
            });
    }

    // handle results & errors with getRedirectResult()
    async function signInWithGoogle() {
        isAuthLoading.value = true
        await signInWithRedirect(auth, googleProvider)

        // After returning from the redirect when your app initializes you can obtain the result
        await getRedirectResult(auth)
            .then(() => {
                console.log('Logged in with Google !')
            })
            .catch((error) => {
                alert(error.message)
            });
    }
    
    async function signInWithGithub() {
        isAuthLoading.value = true
        await signInWithRedirect(auth, githubProvider)
    }

    // native vuefire watcher to check whether user logged or not
    onAuthStateChanged(auth, (user) => {
        isAuthLoading.value = false
        if (user) {
            isLoggedIn.value = true
            if (auth.currentUser.uid == 'iREE0Ruwi8gskaW6511J2ceYMdE3') {
                isAdmin.value = true
            } 
        } 
        else {
            isLoggedIn.value = false
        }
    });

    return { auth, isLoggedIn, isAdmin, isAuthLoading, signInWithGoogle, signInWithGithub, signInAsGuest, signOutAll }
    
})