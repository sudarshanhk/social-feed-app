import { createContext, useState, useEffect } from "react";
import { onAuthStateChangedListener, createUserDocumentFromAuth } from "../utils/firebase/firebase.utilities";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext({
    currentUser: null,
    SetCurrentUser : () => null
})

export const UserProvider = ({ children }) => {
    const [ currentUser, setCurrentUser ] = useState(null);
    const value = { currentUser, setCurrentUser };
    const navigate = useNavigate()
    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener((user) => {
            console.log(user);
            if (user) {
                createUserDocumentFromAuth(user);
                navigate('/feed')
            }
            setCurrentUser(user);
        });
        return unsubscribe;
    }, [])
    return <UserContext.Provider value={
    value}>{children}</UserContext.Provider>
}
