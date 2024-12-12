import React, { useState, useEffect, useRef } from "react";
import "./usersfeeds.style.scss";
import { toast } from 'react-toastify';
import { db } from "../../utils/firebase/firebase.utilities";
import { updateDoc, doc } from "firebase/firestore";
import { FaFacebook, FaTwitter, FaInstagram, FaSnapchat, FaLink } from 'react-icons/fa';
import defaultImg from '../../assets/profileDefaule.png';
import SnapChatLogo from '../../assets/snapchat.png';
import WhatsAppLogo from '../../assets/whatsapp.png';
import FaceBookLogo from '../../assets/facebook.png';
import InstaGramsLogo from '../../assets/instagram.png';
import copyIcon from '../..//assets/copy.png'
// import ShareIcon from '../../assets/


const UserFeeds = ({ userFeeds }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(userFeeds.likes);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const targetRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const targetElement = targetRef.current;
            if (targetElement) {
                const rect = targetElement.getBoundingClientRect();
                if (rect.bottom <= window.innerHeight) {
                    console.log('Page scroll ended');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [targetRef]);

    useEffect(() => {
        if (showSharePopup) {
            document.body.style.overflow = 'hidden'; // Disable background scrolling when popup is open
        } else {
            document.body.style.overflow = 'auto'; // Enable background scrolling when popup is closed
        }

        return () => {
            document.body.style.overflow = 'auto'; // Cleanup and ensure scrolling is enabled when component unmounts
        };
    }, [showSharePopup]); // Effect runs whenever showSharePopup changes

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    const formatTimeAgo = (timestamp) => {
        const currentTime = new Date();
        const createdTime = new Date(timestamp.seconds * 1000);
        const timeDifference = currentTime - createdTime;

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

    const handleLikeClick = async () => {
        try {
            let newLikesCount;

            if (isLiked) {
                newLikesCount = likesCount - 1 >= 0 ? likesCount - 1 : 0;
                setLikesCount(newLikesCount);
                setIsLiked(false);
                toast.success("You disliked this feed");
            } else {
                newLikesCount = likesCount + 1;
                setLikesCount(newLikesCount);
                setIsLiked(true);
                toast.success("You liked this feed");
            }

            const feedRef = doc(db, "feeds", userFeeds.id);
            await updateDoc(feedRef, { likes: newLikesCount });

        } catch (error) {
            console.error(error);
            toast.error("Error updating like status");
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        setTimeout(() => {
            setCopySuccess(false);
        }, 2000);
    };

    const handleShareClick = () => {
        setShowSharePopup(true);
    };

    const closeSharePopup = () => {
        setShowSharePopup(false);
    };

    return (
        <div className="feed-card" ref={targetRef}>
            <div className="feed-content">
                {userFeeds.fileUrls && userFeeds.fileUrls.length > 0 && (
                    <div className="carousel-container">
                        <div className="carousel-header">
                            <div className="user-details-container">
                                <div className="user-box">
                                    <span className="user-image">
                                        <img
                                            src={userFeeds.photoURL}
                                            onError={(e) => e.target.src = `${defaultImg}`}
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
                                {userFeeds.fileUrls.map((fileUrl, index) => (
                                    <div
                                        key={index}
                                        className={`carousel-item ${index === currentIndex ? "active" : ""}`}
                                    >
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
                            <h2>Share Post</h2>
                            <button className="close-popup" onClick={closeSharePopup}>
                                &times;
                            </button>
                        </div>
                        <div className="share-options">
                            <div className="share-container">
                              
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer">
                                    <img src={FaceBookLogo} alt="" />
                                    <div className="share-btn">Facebook</div>
                                </a>
                            </div>
                            <div className="share-container">
                               
                                <a href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">
                                    <img src={WhatsAppLogo} alt="" />
                                <div className="share-btn"> WhatsApp</div>
                                </a>
                            </div>
                            <div className="share-container">
                               
                                <a href={`https://www.instagram.com/share?url=${window.location.href}`} target="_blank" rel="noopener noreferrer">
                                    <img src={InstaGramsLogo} alt="" />
                                <div className="share-btn">Instagram</div>
                                </a>
                            </div>
                            <div className="share-container">
                              
                                <a href={`https://www.snapchat.com/scan?attachmentUrl=${window.location.href}`} target="_blank" rel="noopener noreferrer">
                                    <img src={SnapChatLogo} alt="" />
                                <div className="share-btn"> Snapchat</div>
                                </a>
                            </div>
                        </div>

                        <div className="copy-link">
                            <button className="copy-link-btn" onClick={handleCopyLink}>
                                Copy Link   <FaLink /> 
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
