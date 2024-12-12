import "./myfeed.style.scss"

import React, { useState, useEffect, useContext } from "react";
import { db } from "../../utils/firebase/firebase.utilities"; // Firestore import
import { collection, query, where, getDocs } from "firebase/firestore"; // Firestore methods
 // Import UserContext to get current user
// Import styles for the component
 import { UserContext } from "../../context/user.context";

const MyFeeds = () => {
    // Get the current user from UserContext
    const { currentUser } = useContext(UserContext);

    // State to hold the user's feeds
    const [myFeeds, setMyFeeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch the user's feeds on component mount
    useEffect(() => {
        const fetchUserFeeds = async () => {
            if (!currentUser) {
                console.log("No user logged in");
                return;
            }

            try {
                // Create a query to fetch feeds created by the current user
                const q = query(
                    collection(db, "feeds"),
                    where("createdBy", "==", currentUser.uid)
                );

                // Get the documents from the query
                const querySnapshot = await getDocs(q);

                // Map through the documents and get the data
                const userFeeds = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setMyFeeds(userFeeds); // Set the fetched feeds in state
            } catch (error) {
                console.error("Error fetching user feeds: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserFeeds();
    }, [currentUser]); // Fetch feeds whenever currentUser changes

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="my-feeds-container">
            <div className="my-feeds-header">
                <h2>Your Feeds</h2>
            </div>

            {loading ? (
                <p>Loading your feeds...</p>
            ) : (
                <div className="feeds-list">
                    {myFeeds.length === 0 ? (
                        <p>You have not uploaded any feeds yet.</p>
                    ) : (
                        myFeeds.map((feed) => (
                            <div key={feed.id} className="feed-card">
                                <div className="feed-title">
                                    <h3>{feed.title}</h3>
                                </div>

                                {/* Carousel for each feed's media */}
                                <div className="feed-carousel-container">
                                    <div className="file-preview-card">
                                        {feed.fileUrls && feed.fileUrls.length > 0 && (
                                            <div>
                                                {feed.fileUrls[currentIndex].includes("video") ? (
                                                    <video controls src={feed.fileUrls[currentIndex]} className="preview-video" />
                                                ) : (
                                                    <img
                                                        src={feed.fileUrls[currentIndex]}
                                                        alt={`Feed media ${currentIndex + 1}`}
                                                        className="preview-image"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Carousel Dots */}
                                    <div className="carousel-dots">
                                        {feed.fileUrls.map((_, index) => (
                                            <span
                                                key={index}
                                                className={`dot ${currentIndex === index ? "active" : ""}`}
                                                onClick={() => handleDotClick(index)}
                                            ></span>
                                        ))}
                                    </div>

                                    {/* Carousel Info */}
                                    <div className="carousel-info">
                                        <span>{`${currentIndex + 1} / ${feed.fileUrls.length}`}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default MyFeeds;
