import "./createfeed.style.scss";
import Buttons from "../../components/buttons/buttons.component";
import Upload_png from "../../assets/upload-image.png";
import { useRef, useState } from "react";
import { db } from "../../utils/firebase/firebase.utilities"; // Firebase Firestore import
import { collection, addDoc, Timestamp } from "firebase/firestore"; // Firestore methods for adding data

const CreateFeed = () => {
    const fileInputRef = useRef(null);
    const [filePreviews, setFilePreviews] = useState([]);
    const [title, setTitle] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showUpload, setShowUpload] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

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
        setCurrentIndex(0); 
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

                const response = await fetch("https://api.cloudinary.com/v1_1/dlgulcrz2/image/upload", {
                    method: "POST",
                    body: formData,
                });
                const data = await response.json();
                fileUrls.push(data.secure_url); 
            }
        }

        return fileUrls;
    };

    // Function to save feed to Firestore
    const saveFeedToFirestore = async () => {
        const fileUrls = await uploadFilesToCloudinary();

        // Create a new feed object
        const feedData = {
            title: title,
            fileUrls: fileUrls,
            likes: 0,
            timestamp: Timestamp.fromDate(new Date()), // Store timestamp
        };

        try {
            // Add the new feed data to Firestore
            const feedRef = await addDoc(collection(db, "feeds"), feedData);
            console.log("Feed successfully uploaded:", feedRef.id);
            setTitle(""); // Clear the title input after saving
            setFilePreviews([]); // Clear the file previews
            setShowUpload(true); // Show the upload section again
        } catch (error) {
            console.error("Error saving feed to Firestore:", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="create-feed-container">
            <div className="create-post-navigation-header">
                <span className="left-arrow"></span>
                <div>New Post</div>
            </div>

            <div className="create-feed-box">
             
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

                      
                        <div className="carousel-dots">
                            {filePreviews.map((_, index) => (
                                <span
                                    key={index}
                                    className={`dot ${currentIndex === index ? "active" : ""}`}
                                    onClick={() => handleDotClick(index)}
                                ></span>
                            ))}
                        </div>

                        <div className="carousel-info">
                            <span>{`${currentIndex + 1} / ${filePreviews.length}`}</span>
                        </div>
                    </div>
                )}

             
                <div className="title-input">
                    
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Add Caption"
                        className="form-input" required
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
