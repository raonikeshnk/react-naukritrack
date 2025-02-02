import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import ReactQuill from 'react-quill'; // Import Quill editor
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const EditBlog = ({ blog, onCancel, onUpdateSuccess }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null); // For storing the uploaded image file

    // Fetch the existing blog data to pre-fill the form
    useEffect(() => {
        if (blog) {
            const fetchBlogDetails = async () => {
                const db = getFirestore();
                const blogRef = doc(db, 'ntblogs', blog.id);
                try {
                    const blogSnap = await getDoc(blogRef);
                    if (blogSnap.exists()) {
                        const data = blogSnap.data();
                        setTitle(data.title || '');
                        setContent(data.content || ''); // Set the HTML content
                        setCategory(data.category || '');
                        setTags(data.tags ? data.tags.join(', ') : '');
                        setImageUrl(data.imageUrl || ''); // Set the image URL
                        setIsPublished(data.isPublished || false);
                    } else {
                        toast.error('Blog not found.');
                    }
                } catch (error) {
                    console.error('Error fetching blog details:', error);
                    toast.error('Error fetching blog details.');
                }
            };

            fetchBlogDetails();
        }
    }, [blog]);

    // Handle image file selection and upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);

            // Show image preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result); // Show the selected image preview
            };
            reader.readAsDataURL(file); // Convert file to base64 to show preview
        }
    };

    // Handle image upload to Firebase Storage
    const uploadImage = async (file) => {
        const storage = getStorage();
        const storageRef = ref(storage, 'images/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Optionally, show progress here if needed
                },
                (error) => {
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL); // Return the image URL after successful upload
                }
            );
        });
    };

    // Handle form submission and update the blog in Firestore
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const db = getFirestore();
            const blogRef = doc(db, 'ntblogs', blog.id);

            // Fetch the current blog data (including createdAt)
            const blogSnap = await getDoc(blogRef);
            const existingBlogData = blogSnap.exists() ? blogSnap.data() : {};

            // Ensure that 'tags' is a string before calling split() - handle null or undefined
            const tagsArray = (tags && typeof tags === 'string') ? tags.split(',').map(tag => tag.trim()) : [];

            const updatedBlogData = {
                title,
                content, // Store HTML content as is
                category,
                tags: tagsArray,
                imageUrl, // Existing or new image URL
                isPublished,
                updatedAt: new Date(), // Update time
                createdAt: existingBlogData.createdAt || new Date(), // Preserve 'createdAt' if it exists
            };

            // If a new image is selected, upload it to Firebase Storage and get the URL
            if (imageFile) {
                const uploadedImageUrl = await uploadImage(imageFile);
                updatedBlogData.imageUrl = uploadedImageUrl; // Update the image URL
            }

            await updateDoc(blogRef, updatedBlogData);

            toast.success('Blog updated successfully!');

            // Update the blog list in the parent component
            onUpdateSuccess({ id: blog.id, ...updatedBlogData });

          
        } catch (error) {
            console.error('Error updating blog:', error);
            toast.error('Failed to update blog. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="container mt-4">
            <h3>Edit Blog</h3>
            <form onSubmit={handleUpdate}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Content</label>
                    <ReactQuill
                        value={content} // Set the initial content (HTML)
                        onChange={setContent} // Update content when changed
                        theme="snow"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <input
                        type="text"
                        className="form-control"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Tags (comma separated)</label>
                    <input
                        type="text"
                        className="form-control"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Image Upload</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {imageUrl && (
                        <div className="mt-2">
                            <img
                                src={imageUrl}
                                alt="Selected"
                                style={{ maxWidth: '200px', maxHeight: '200px' }}
                            />
                        </div>
                    )}
                </div>

                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        checked={isPublished}
                        onChange={() => setIsPublished(!isPublished)}
                    />
                    <label className="form-check-label">Published</label>
                </div>

                <div className="d-flex gap-3">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Blog'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditBlog;
