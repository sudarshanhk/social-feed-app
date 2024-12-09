import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

import {doc , getFirestore , Timestamp, getDoc, setDoc} from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA0O2uLIdmgaMiDyG5Fa93cjDIzo3YPn_Q",
    authDomain: "vibe-snap-82dc9.firebaseapp.com",
    projectId: "vibe-snap-82dc9",
    storageBucket: "vibe-snap-82dc9.appspot.com", // Corrected storageBucket URL
    messagingSenderId: "556165689410",
    appId: "1:556165689410:web:df2be148c5fa747da9bddb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Google Auth provider setup
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: "select_account",
});

// Initialize Firebase Auth
const auth = getAuth();

// Function to handle Google Sign-In popup
export const signInWithGooglePopup = () => {
    return signInWithPopup(auth, googleProvider);
};
const db = getFirestore()

export const createUserDocumentFromAuth = async (userAuth, additionalInformation={}) => {
    if (!userAuth) return
    const userDocRef = doc(db, "users", userAuth.uid);
    const userSnapshot = await getDoc(userDocRef)
    console.log(userDocRef);
    if (!userSnapshot.exists()) {
        const { displayName, email, photoURL } = userAuth;
        const createdAt = Timestamp.fromDate(new Date());

        try {
            await setDoc(userDocRef , {displayName , email , photoURL ,createdAt, ...additionalInformation})
        } catch (error) {
            console.log(`Some error occurred while creating user document: ${error.message}`);
        }
    }

    return userDocRef
}
   
export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback);