// This can be reused with any paginated data like comments or profiles.
// A function to pass our next prop for infinite scrolling
// Export an async function which will accept two arguments: resource and setResource so that we can

import { axiosReq } from "../api/axiosDefaults"

// render and update different types of data for our infinite scroll component
export const fetchMoreData = async (resource, setResource) => {
    try {
        // Make a network request to resource.next which is a url to the next page of results 
        // If there's no error, we'll call setResource and pass it a callback function with 
        // prevResource as the argument. The callback function will return an Object, inside of which
        // we'll spread prevResource. Well update the next attribute with the url to the next page of results as well
        const {data} = await axiosReq.get(resource.next)
        setResource(prevResource => ({
            ...prevResource,
            next:data.next, 
            // Use teh reduce method to add our new posts to the prevResource.results array
            results: data.results.reduce((acc, cur) => {
                // Use the some method to check whether the callback passed to it returns true for at least one element 
                // in the array adn it stops running as soon as it does. So we can use it to check if any of our post ids 
                // in the newly fetched data matches an id that already exists in our previous results. If teh some method 
                // finds a matchMedia, we'll just return the existing accumulator to the reduce method but if it doesn't find a 
                // match we know this is a new post, so we can return our spread accumulator with the new post at the end

                // A review of what's going on here: 
                // We used the reduce method to loop through the new page of results that we got from our API.
                // We then appended our new results to the existing posts in our posts.results array in the state.
                // Then we used teh some() method to leep through the array of posts in the accumulator.
                // Inside, we compared each accumulator item id to the current post id from teh new fetched posts array.
                // If the some() method returned true, this means it found a match and we are displaying that post already.
                // So in this case we return the accumulator without adding the post to it and if the some() method does not find a match, we return an array containing our 
                // spread accumulator with teh new post added to it
                return acc.some(accResult => accResult.id === cur.id) 
                    ? acc 
                    : [...acc, cur];
            }, prevResource.results)
        }));
    } catch(err) {

    }
};