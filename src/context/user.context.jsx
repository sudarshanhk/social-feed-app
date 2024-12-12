import { createContext, useState, useEffect } from "react";
import { onAuthStateChangedListener, createUserDocumentFromAuth } from "../utils/firebase/firebase.utilities";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";


const db = getFirestore()
export const UserContext = createContext({
    currentUser: null,
    SetCurrentUser: () => null,
    userDetails: {}
})

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userDetails, setUserDetails] = useState({}); // Default to 
    const value = { currentUser, setCurrentUser, userDetails, setUserDetails };
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener(async (user) => {
            console.log(user);
           
            const currentPath = location.pathname; 
            console.log(currentPath)
            if (!user) {
                navigate('/');
            }
            if (user) {
                createUserDocumentFromAuth(user);
                const userDocRef = doc(db, "users", user.uid);
                const userSnapshot = await getDoc(userDocRef);
                if (userSnapshot.exists()) {
                    // Set user details in context
                    console.log(userSnapshot.data())
                    setUserDetails(userSnapshot.data());
                }

                // Navigate to feed page
                if (currentPath == '/') {
                    navigate('/feed');

                }else{
                    navigate(`${currentPath}`);
                }
               
            }
            setCurrentUser(user);
        });
        return unsubscribe;
    }, [])
    return <UserContext.Provider value={
    value}>{children}</UserContext.Provider>
}
