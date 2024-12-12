import "./createfeed.style.scss";
import Buttons from "../../components/buttons/buttons.component";
import Upload_png from "../../assets/upload-image.png";
import { useRef, useState  , useContext ,} from "react";
import { db, auth } from "../../utils/firebase/firebase.utilities"; // Firebase Firestore and Auth imports
import { collection, addDoc, Timestamp } from "firebase/firestore"; // Firestore methods for adding data
import { UserContext } from "../../context/user.context";
import { useNavigate } from "react-router-dom";


const CreateFeed = () => {
    const fileInputRef = useRef(null);
    const [filePreviews, setFilePreviews] = useState([]);
    const [title, setTitle] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showUpload, setShowUpload] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();
    const uploadFeedHandler = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        setShowUpload(false);
        const files = event.target.files;
        const previews = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const previewUrl = URL.createObjectURL(file);
            previews.push({ file, previewUrl });
        }

        setFilePreviews(previews);
        setCurrentIndex(0); // Set the currentIndex to 0 so the first image/video is shown
    };

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    const uploadFilesToCloudinary = async () => {
        setIsUploading(true);
        const fileUrls = [];

        for (let i = 0; i < filePreviews.length; i++) {
            const file = filePreviews[i].file;

            // Only upload if the file is valid
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "sudarshan_preset_upload");

                // If the file is a video, set the resource_type to 'video'
                const resourceType = file.type.startsWith("video/") ? "video" : "image";
                formData.append("resource_type", resourceType);

                try {
                    const response = await fetch("https://api.cloudinary.com/v1_1/dlgulcrz2/upload", {
                        method: "POST",
                        body: formData,
                    });
                    const data = await response.json();

                    // Push the URL of the uploaded file (image or video) to the fileUrls array
                    if (data.secure_url) {
                        fileUrls.push(data.secure_url);
                    } else {
                        console.error("Error uploading file: ", data);
                    }
                } catch (error) {
                    console.error("Upload failed:", error);
                }
            }
        }

        return fileUrls;
    };

    const { currentUser, userDetails } = useContext(UserContext);
  
    const { photoURL, displayName, email, bg, bio, uid } = userDetails;
    // Function to save feed to Firestore with user details
    const saveFeedToFirestore = async () => {
        const fileUrls = await uploadFilesToCloudinary();
       
        if (!currentUser) {
            console.error("User is not logged in.");
            return;
        }

        // const { uid, displayName, email } = user;
        if (!title) {
            console.log("no title found");
            setIsUploading(false)
            return
}
        // Create a new feed object with user details
        const feedData = {
            title: title,
            fileUrls: fileUrls,
            likes: 0,
            timestamp: Timestamp.fromDate(new Date()), // Store timestamp
            createdBy: currentUser.uid, // Store the user ID who created the feed
            displayName: displayName, // Store user's display name
            email: email, // Store user's email
            photoURL : photoURL, // Store user's photo URL
        };

        try {
            // Add the new feed data to Firestore and get the unique document ID
            const feedRef = await addDoc(collection(db, "feeds"), feedData);
            console.log("Feed successfully uploaded:", feedRef.id);
            


            setTitle(""); // Clear the title input after saving
            setFilePreviews([]); // Clear the file previews
            setShowUpload(true); // Show the upload section again
            navigate("/feed");
        } catch (error) {
            console.error("Error saving feed to Firestore:", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="create-feed-container">
            <div className="create-post-navigation-header">
               
                  Create New Post
            </div>

            <div className="create-feed-box">
                {/* Upload Section */}
                <div className="upload-section" style={{ display: showUpload ? "flex" : "none" }}>
                    <div className="upload-selection-box" onClick={uploadFeedHandler}>
                        <img src={Upload_png} alt="Upload" />
                        <span>Upload Your Feed</span>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                </div>

                {/* File Previews (Carousel) */}
                {filePreviews.length > 0 && (
                    <div className="file-carousel-container">
                        <div className="file-preview-card">
                            {filePreviews[currentIndex].file.type.startsWith("image/") ? (
                                <img
                                    src={filePreviews[currentIndex].previewUrl}
                                    alt={`Preview ${currentIndex + 1}`}
                                    className="preview-image"
                                />
                            ) : (
                                <video controls src={filePreviews[currentIndex].previewUrl} className="preview-video" />
                            )}
                        </div>

                        {/* Carousel Dots */}
                        <div className="carousel-dots">
                            {filePreviews.map((_, index) => (
                                <span
                                    key={index}
                                    className={`dot ${currentIndex === index ? "active" : ""}`}
                                    onClick={() => handleDotClick(index)}
                                ></span>
                            ))}
                        </div>

                        {/* Carousel Info */}
                        <div className="carousel-info">
                            <span>{`${currentIndex + 1} / ${filePreviews.length}`}</span>
                        </div>
                    </div>
                )}

                {/* Title Input */}
                <div className="title-input">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Add Caption"
                        className="form-input"
                        required
                    />
                </div>

                {/* Save Button */}
                <Buttons
                    buttonName={isUploading ? "Uploading..." : "SAVE"}
                    buttonType="primaryButton"
                    onClick={saveFeedToFirestore}
                    disabled={isUploading || !title || filePreviews.length === 0}
                />
            </div>
        </div>
    );
};

export default CreateFeed;
