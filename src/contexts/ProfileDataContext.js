import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { useCurrentUser } from "../contexts/CurrentUserContext";

const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
    const [profileData, setProfileData] = useState({
        // we will use the pageProfile later
        pageProfile: { results: [] },
        // set the popularProfiles to an object with an empty results array inside
        popularProfiles: { results: [] },
    });

    // When do we run useEffect?  Every user has to make different requests to follow and unfollow people, so we'll need to re-fetch popularProfiles depending on the state of the current user
    // we can then add it to the useEffect's dependency array
    const currentUser = useCurrentUser();

    // Next we need to fetch our popularProfiles data on mount
    useEffect(() => {
        const handleMount = async () => {
            try {
                // Make a request with the axiosReq instance to the profiles endpoint and getch them in descending order of how many followers they have so the most followed profile will be at the top
                const {data} = await axiosReq.get('/profiles/?ordering=-followers_count');

                // If everything goes well, we'll call the setProfileData function
                // Inside, we'll spread the previous state, which will eventually include the pageProfile data as well as our popularProfiles
                // Then, we can update only the popular profiles with the data returned from the API request
                setProfileData(prevState => ({
                    ...prevState,
                    popularProfiles: data,
                }));
            } catch(err) {
                console.log(err)
            }
        };

        handleMount();
    }, [currentUser]);

    return (
        <ProfileDataContext.Provider value={profileData}>
          <SetProfileDataContext.Provider value={setProfileData}>
            {children}
          </SetProfileDataContext.Provider>
        </ProfileDataContext.Provider>
      );
    };