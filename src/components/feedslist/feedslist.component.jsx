import React, { useState, useEffect, useRef } from "react";
import { db } from "../../utils/firebase/firebase.utilities"; // Firestore utils
import { collection, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";
import "./feedslist.style.scss"; // Add your styles
import UserFeeds from "../userfeeds/usersfeeds.components";

const FeedList = () => {
    const [feeds, setFeeds] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [lastVisible, setLastVisible] = useState(null); 
    const [currentIndex, setCurrentIndex] = useState(0); 
    const fetchFeeds = async () => {
        if (loading) return; // Prevent multiple requests while loading
        setLoading(true); // Set loading to true

        let q = query(collection(db, "feeds"), orderBy("timestamp", "desc"), limit(5)); // Query to fetch feeds with pagination

        // If there's a last visible document, fetch more from that point
        if (lastVisible) {
            q = query(q, startAfter(lastVisible));
        }

        try {
            const querySnapshot = await getDocs(q);
            const newFeeds = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            console.log(newFeeds);

            setFeeds((prevFeeds) => {
                const feedIds = newFeeds.map(feed => feed.id);
                const uniqueFeeds = prevFeeds.filter(feed => !feedIds.includes(feed.id));
                return [...uniqueFeeds, ...newFeeds]; // Append only non-duplicate feeds
            });

           
        } catch (error) {
            console.error("Error fetching feeds:", error);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

   

    useEffect(() => {
        fetchFeeds(); // Fetch initial feeds when the component mounts
    }, []);

    
    // fetchFeeds();
    return (
        <div className="feed-container">
            {feeds.map(totalFeeds => (
                <UserFeeds key={totalFeeds.id} userFeeds={totalFeeds} />
            ))}
        </div>
    );
};

export default FeedList;
