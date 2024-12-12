import React, { useState, useEffect  , useRef} from "react";
import "./usersfeeds.style.scss";
import { toast } from 'react-toastify'; // To show success/failure messages
import { db } from "../../utils/firebase/firebase.utilities"; // Firestore import
import { updateDoc, doc } from "firebase/firestore"; // Firestore methods for updating data
import { FaFacebook, FaTwitter, FaInstagram, FaSnapchat, FaLink } from 'react-icons/fa'; // FontAwesome icons
import WelcomeUser from "../user/welcomeuser/welcomeuser.component";
import defaultImg from '../../assets/profileDefaule.png'
const UserFeeds = ({ userFeeds }) => {
    console.log(userFeeds)
    const [currentIndex, setCurrentIndex] = useState(0); // To track the current index of the carousel item
    const [isLiked, setIsLiked] = useState(false); // To track if the current user liked the feed
    const [likesCount, setLikesCount] = useState(userFeeds.likes); // Local state for likes count
    const [showSharePopup, setShowSharePopup] = useState(false); // To show share popup
    const [copySuccess, setCopySuccess] = useState(false); // To track if copy was successful

    const targetRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const targetElement = targetRef.current;
            if (targetElement) {
                const rect = targetElement.getBoundingClientRect();
                if (rect.bottom <= window.innerHeight) {
                    console.log('Page scroll ended');
                    // Add your desired actions here, e.g., fetching more data, triggering animations, etc.
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [targetRef]);
    // Function to handle dot click
    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };
    const formatTimeAgo = (timestamp) => {
        console.log(timestamp)
        const currentTime = new Date();
        const createdTime = new Date(timestamp.seconds * 1000); // Firebase timestamp to JS date
        const timeDifference = currentTime - createdTime; // Difference in milliseconds

        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
        if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    };
    // Function to toggle the like/dislike button
    const handleLikeClick = async () => {
        try {
            let newLikesCount;

            if (isLiked) {
                // If already liked, decrease the like count
                newLikesCount = likesCount - 1 >= 0 ? likesCount - 1 : 0; // Prevent likes count from going below 0
                setLikesCount(newLikesCount);  // Update local state for likes count
                setIsLiked(false);  // Set the like state to false (disliked)
                toast.success("You disliked this feed");
            } else {
                // If not liked, increase the like count
                newLikesCount = likesCount + 1;
                setLikesCount(newLikesCount);  // Update local state for likes count
                setIsLiked(true);  // Set the like state to true (liked)
                toast.success("You liked this feed");
            }

            // Update likes count in Firestore
            const feedRef = doc(db, "feeds", userFeeds.id);
            await updateDoc(feedRef, { likes: newLikesCount });  // Update Firestore with the new likes count

        } catch (error) {
            console.error(error);  // Log the error for debugging
            toast.error("Error updating like status");
        }
    };


    // Function to handle the copy link functionality
    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        setTimeout(() => {
            setCopySuccess(false); // Reset after 2 seconds
        }, 2000);
    };

    // Function to open share popup
    const handleShareClick = () => {
        setShowSharePopup(true);
    };

    // Function to close the share popup
    const closeSharePopup = () => {
        setShowSharePopup(false);
    };

    // Prevent background scrolling when the share popup is open
    useEffect(() => {
        if (showSharePopup) {
            document.body.style.overflow = 'hidden'; // Disable scrolling
        } else {
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }

        return () => {
            document.body.style.overflow = 'auto'; // Clean up when component unmounts
        };
    }, [showSharePopup]);

    return (
        <div className="feed-card" ref={targetRef}>
            <div className="feed-content">
                {/* Carousel Container */}
                {userFeeds.fileUrls && userFeeds.fileUrls.length > 0 && (
                    <div className="carousel-container">
                        <div className="carousel-header">
                           
                            <div className="user-details-container" >
                                <div className="user-box">
                                    <span className="user-image">
                                        <img
                                            src={userFeeds.photoURL}

                                            onError={(e) => e.target.src = `${defaultImg}`} // Fallback if image fails to load
                                        />
                                    </span>
                                    <div className="other-user-box">
                                        <span className="welcome-text">{userFeeds.displayName}</span>
                                        <div className="userName">{formatTimeAgo(userFeeds.timestamp)} Ago</div>
                                    </div>
                                </div>
                                <div className="post-title">{userFeeds.title}</div>
                            </div>
                        </div>
                        <div className="carousel">
                            <div className="carousel-content">
                                {/* Display only the current carousel item */}
                                {userFeeds.fileUrls.map((fileUrl, index) => (
                                    <div
                                        key={index}
                                        className={`carousel-item ${index === currentIndex ? "active" : ""}`}
                                    >
                                        {/* If it's an image */}
                                        {fileUrl.includes("image") ? (
                                            <img src={fileUrl} alt={`Feed Media ${index + 1}`} className="feed-image" />
                                        ) : (
                                            <video controls src={fileUrl} className="feed-media" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                      
                        <div className="carousel-dots">
                            {userFeeds.fileUrls.map((_, index) => (
                                <span
                                    key={index}
                                    className={`dot ${index === currentIndex ? "active" : ""}`}
                                    onClick={() => handleDotClick(index)}
                                ></span>
                            ))}
                        </div>
                    </div>
                )}

             
                <div className="feed-info">
                  
                    <div className="feed-actions">
                        <span
                            className={`like-btn ${isLiked ? "liked" : ""}`}
                            onClick={handleLikeClick}
                        >
                            ❤️ {likesCount}
                        </span>
                        <span className="share-btn" onClick={handleShareClick}>
                            🔗 Share
                        </span>
                    </div>
                </div>
            </div>

          
            {showSharePopup && (
                <div className="share-popup">
                    <div className="popup-content">
                        <div className="popup-header">
                            <h3>Share this feed</h3>
                            <button className="close-popup" onClick={closeSharePopup}>
                                &times;
                            </button>
                        </div>
                        <div className="share-options">
                            {/* Social media share options */}
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer">
                                <button className="share-btn"><FaFacebook /> Facebook</button>
                            </a>
                            <a href={`https://twitter.com/intent/tweet?url=${window.location.href}`} target="_blank" rel="noopener noreferrer">
                                <button className="share-btn"><FaTwitter /> Twitter</button>
                            </a>
                            <a href={`https://www.instagram.com/share?url=${window.location.href}`} target="_blank" rel="noopener noreferrer">
                                <button className="share-btn"><FaInstagram /> Instagram</button>
                            </a>
                            <a href={`https://www.snapchat.com/scan?attachmentUrl=${window.location.href}`} target="_blank" rel="noopener noreferrer">
                                <button className="share-btn"><FaSnapchat /> Snapchat</button>
                            </a>
                        </div>

                        <div className="copy-link">
                            <button className="copy-link-btn" onClick={handleCopyLink}>
                                <FaLink /> Copy Link
                            </button>
                            {copySuccess && <span className="copy-message">Link copied!</span>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserFeeds;
