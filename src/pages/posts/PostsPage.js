import React, { useEffect, useState } from "react";
import Post from './Post';
import Asset from '../../components/Asset';

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { useLocation } from "react-router";
import {axiosReq} from '../../api/axiosDefaults';
import NoResults from "../../assets/no-results.png";

// Destructure the message and filter props in place, setting the filter to an empty string
function PostsPage({ message, filter="" }) {
    // We need to store posts in an object, inside a results array that will originally be empty
    const [posts, setPosts] = useState({ results: []});

    // As it will take moment for posts to load, it makes sense to keep track of whether or not all
    // the data has been fetched and we can use this to show a loading spinner to our users as they wait
    // for posts to load
    const [hasLoaded, setHasLoaded] = useState(false);

    // We will also have to re-fetch posts against when the user clicks between hom and likes pages. To 
    // detect teh url change, we'll auto import the useLocation react router hook. The useLocation hook
    // comes from teh react router library and returns an object with data about the current URL that teh user
    // is on. We need to know this to detect if the user has flicked between home, feed and likes pages
    const {pathname} = useLocation();

    // We now need to take care of the API request to fetch our opsts, we'll only show posts relevant to that filter
    // or show a loading icon when necessary.
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // The request string will contain our filter parameter which comes from the filter prop we set in our
                // routes. It will tell the API if we want to see all the posts, just posts by the profiles our user has 
                // following, or just the posts they have liked. If there's no error, we'll setPOsts to the newly fetch data
                // and set teh hasLoaded variable to true, so that the spinner is no longer displayed
                const {data} = await axiosReq.get(`/posts/?${filter}`);
                setPosts(data);
                setHasLoaded(true);
            } catch(err){
                console.log(err);
            }
        };

        setHasLoaded(false);
        fetchPosts();
        // We should run this code every time the filter or pathname change, so we need to put these inside teh useEffect's dependancy array
        // As teh code will run every time either of these two values change, we'll also have to setHasLoaded to false before we fetch the posts, so that
        // our loading spinner will be displayed to users.
    }, [filter, pathname]);

    return (
        <Row className="h-100">
        <Col className="py-2 p-0 p-lg-2" lg={8}>
            <p>Popular profiles mobile</p>
            {/* A nested ternary to display our posts once we have loaded them */}
            {/* First check if the data has been loaded, if it hasn't we will show our loading spinner */}
            {hasLoaded ? (
                // Then, if our data has loaded, inside a fragment, we'll create a second ternary to either display our posts or show a message
                <>
                    {/* Check if the results array in our state has a length, if so, show our posts here by mapping over the posts. If not, we'll show no results message */}
                    {/* Map over the posts.results array, return the Post component, give it a key, spread the post object and pass the setPOsts function so that the users can like and unlike posts */}
                    {posts.results.length
                        ? posts.results.map((post) => (
                            <Post key={post.id} {...post} setPosts={setPosts} />
                        ))
                        : <Container className={appStyles.Content}>
                            <Asset src={NoResults} message={message} />
                        </Container>
                    }
                </>
            ) : (
                <Container className={appStyles.Content}>
                    <Asset spinner />
                </Container>
            )}
        </Col>
        <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
            <p>Popular profiles for desktop</p>
        </Col>
        </Row>
    );
}

export default PostsPage;