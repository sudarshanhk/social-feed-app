import React, { useState, useEffect, useRef } from "react";
import { db } from "../../utils/firebase/firebase.utilities"; // Firestore utils
import { collection, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";
import "./feedslist.style.scss"; // Add your styles
import UserFeeds from "../userfeeds/usersfeeds.components";

const FeedList = () => {
    const [feeds, setFeeds] = useState([]); // Array to store feeds data
    const [loading, setLoading] = useState(false); // Loading state to prevent multiple requests
    const [lastVisible, setLastVisible] = useState(null); // Reference to the last document in the current page
    const feedContainerRef = useRef(null); // Reference to the feed container for detecting scroll
    const [hasMoreFeeds, setHasMoreFeeds] = useState(true); // State to check if there are more feeds to fetch

    // Function to fetch feeds data from Firestore
    const fetchFeeds = async () => {
        if (loading || !hasMoreFeeds) return; // Prevent multiple requests or fetching if no more data

        setLoading(true); // Set loading to true to indicate a fetch is in progress

        let q = query(collection(db, "feeds"), orderBy("timestamp", "desc"), limit(5)); // Query to fetch the first set of feeds

        // If there's a last visible document, fetch more from that point
        if (lastVisible) {
            console.log("Fetching next page after:", lastVisible);
            q = query(q, startAfter(lastVisible)); // Start after the last visible document from the previous query
        }

        try {
            const querySnapshot = await getDocs(q);
            const newFeeds = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            console.log("New feeds fetched:", newFeeds);

            // If there are no new feeds, stop fetching
            if (newFeeds.length === 0) {
                setHasMoreFeeds(false);
                console.log("No more feeds available.");
            }

            // Set the last visible document to continue pagination
            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

            // Update the state with the new feeds, avoiding duplicates
            setFeeds((prevFeeds) => {
                const feedIds = newFeeds.map(feed => feed.id);
                const uniqueFeeds = prevFeeds.filter(feed => !feedIds.includes(feed.id));
                return [...prevFeeds, ...newFeeds]; // Append new feeds to the previous feeds
            });
        } catch (error) {
            console.error("Error fetching feeds:", error);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    // Function to handle scroll event and trigger fetch when reaching the bottom
    const handleScroll = () => {
        const container = feedContainerRef.current;

        // Check if the user is near the bottom of the container
        if (container.scrollTop + container.clientHeight >= container.scrollHeight - 100) {
            console.log("Near the bottom, loading more feeds...");
            fetchFeeds(); // Trigger fetchFeeds when scrolled near the bottom
        }
    };

    // UseEffect for initial data loading and adding scroll listener
    useEffect(() => {
        fetchFeeds(); // Fetch initial feeds when the component mounts

        // Add event listener for scrolling
        const container = feedContainerRef.current;
        container.addEventListener("scroll", handleScroll);

        // Cleanup on component unmount
        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, []); // Empty dependency array ensures this effect runs only once on mount

    return (
        <div className="feed-container" ref={feedContainerRef} style={{ overflowY: "scroll", height: "100vh" }}>
            {/* Render each feed */}
            {feeds.map(totalFeeds => (
                <UserFeeds key={totalFeeds.id} userFeeds={totalFeeds} />
            ))}

            {/* Loading indicator */}
            {loading && <div className="loading-spinner">Loading more feeds...</div>}

            {/* Message when no more feeds are available */}
            {!hasMoreFeeds && <div className="no-more-feeds">No more feeds available</div>}
        </div>
    );
};

export default FeedList;
