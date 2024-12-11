import React, { useState, useEffect, useRef } from "react";
import { db } from "../../utils/firebase/firebase.utilities"; // Firestore utils
import { collection, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";
import "./feedslist.style.scss"; // Add your styles

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

            setFeeds(prev => [...prev, ...newFeeds]); 
           
        } catch (error) {
            console.error("Error fetching feeds:", error);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

   

    useEffect(() => {
        fetchFeeds(); // Fetch initial feeds when the component mounts
    }, []);

    // Carousel slide functions
    const handleNext = (index, length) => {
        if (index < length - 1) {
            setCurrentIndex(index + 1);
        }
    };

    const handlePrev = (index) => {
        if (index > 0) {
            setCurrentIndex(index - 1);
        }
    };
    // fetchFeeds();
    return (
        <div className="feed-container">
          
            {
                feeds.map(totalFeeds => {
                   
                    return totalFeeds.fileUrls.map(fileUrls => {
                       
                        console.log(fileUrls); // Replace 123 with your 
                        return 123;  
                    });
                })
            }
            
          
        </div>
    );
};

export default FeedList;
