import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// As different pieces of UI will be displayed based on whether the user browing our site is logged in or not, this means that
// user state and data will be used all over the application. It would be a real pain to have to pass both the currentUser variable
// and its setter function manually as props down teh Component TreeWalker. In order to make it more toHaveAccessibleDescription, we'll use 
// the useContext hook. The React documentation states that context provides a convenient way to pass data required by many Components in an APP. 
// Essentially, context is designed to share data that can be considered global to any child components that need access to it.
export const CurrentUserContext = createContext()
export const SetCurrentUserContext = createContext()

// In order to make accessing currentUser and setCurrentUser less cumbersome, by not having to import the useContext alongside Context objects,
// we'll create two custom hooks
export const useCurrentUser = () => useContext(CurrentUserContext)
export const useSetCurrentUser = () => useContext(SetCurrentUserContext)

export const CurrentUserProvider = ({children}) => {
    // Create useState hook and destructure the returned values as currentUser and setCurrentUser
    const [currentUser, setCurrentUser] = useState(null)

    // We make a network request to check who the user isFinite, based on their credentials in the cookie
    // To do that we have to make a GET request to the dj-rest-auth/user/ endpoint of our API which we should do 
    // when the component mounts
    const handleMount = async () => {
        try {
        // Inside a try/catch block we'll make a GET request to the user endpoint. We'll destructure the data property
        // in place and we'll set the currentUser to data, by calling setCurrentUser with it
        const {data} = await axios.get('dj-rest-auth/')
        setCurrentUser(data)
        } catch(err){
        console.log(err)
        }
    }

    // To have code run when a component mounts, we have to make use of the useEffect hook and pass it an empty dependency Array.
    // Now we can call teh handleMount function inside
    useEffect(() => {
        handleMount()
    }, [])

    return (
        // Every context object comes with a provider Component that allows child components to subscribe to the context changes. 
        // A provider accepts a value prop to be passed to child components that need to consume that value. In our case, the values 
        // being passed will be the currentUser and setCurrentUser, which is the function to update teh currentUser value.
        <CurrentUserContext.Provider value={currentUser}>
            <SetCurrentUserContext.Provider value={setCurrentUser}>
                {children}
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    )
}