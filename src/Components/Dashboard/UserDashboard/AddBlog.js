import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddBlog = ({ onAdd }) => {
    const { currentUser } = useAuth();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [content, setContent] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [existingCategories, setExistingCategories] = useState([]);
    const [existingTags, setExistingTags] = useState([]);
    const [categorySuggestions, setCategorySuggestions] = useState([]);
    const [tagSuggestions, setTagSuggestions] = useState([]);
    const navigate = useNavigate();

    // Fetch existing categories and tags from Firestore
    useEffect(() => {
        const fetchCategoriesAndTags = async () => {
            const db = getFirestore();
            const categoriesSnapshot = await getDocs(collection(db, 'categories'));
            const tagsSnapshot = await getDocs(collection(db, 'tags'));
            
            const categories = categoriesSnapshot.docs.map(doc => doc.data().name);
            const tags = tagsSnapshot.docs.map(doc => doc.data().name);

            setExistingCategories(categories);
            setExistingTags(tags);
        };

        fetchCategoriesAndTags();
    }, []);

    const handleCategoryChange = async (e) => {
        const input = e.target.value;
        setCategory(input);

        // Suggest categories based on user input
        if (input) {
            const filteredSuggestions = existingCategories.filter(cat =>
                cat.toLowerCase().includes(input.toLowerCase())
            );
            setCategorySuggestions(filteredSuggestions);
        } else {
            setCategorySuggestions([]);
        }

        // Add new category if not in the list
        if (input && !existingCategories.includes(input)) {
            await addDoc(collection(getFirestore(), 'categories'), { name: input });
            setExistingCategories(prev => [...prev, input]);
        }
    };

    const handleTagChange = async (e) => {
        const input = e.target.value;
        setTags(input);

        // Suggest tags based on user input
        if (input) {
            const filteredSuggestions = existingTags.filter(tag =>
                tag.toLowerCase().includes(input.toLowerCase())
            );
            setTagSuggestions(filteredSuggestions);
        } else {
            setTagSuggestions([]);
        }

        // Add new tag if not in the list (after splitting by comma)
        if (input && !existingTags.includes(input.trim())) {
            await addDoc(collection(getFirestore(), 'tags'), { name: input.trim() });
            setExistingTags(prev => [...prev, input.trim()]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        try {
            let imageUrl = '';

            // Handle image upload
            if (image) {
                const storage = getStorage();
                const imageRef = ref(storage, `naukritrack/images/${Date.now()}-${image.name}`);
                const uploadTask = uploadBytesResumable(imageRef, image);

                await new Promise((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        null,
                        (error) => {
                            console.error('Error uploading image:', error);
                            reject(new Error('Image upload failed'));
                        },
                        async () => {
                            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve();
                        }
                    );
                });
            }

            // Handle blog addition
            const db = getFirestore();
            await addDoc(collection(db, 'ntblogs'), {
                title,
                category,
                tags: tags.split(',').map(tag => tag.trim()),
                content,
                isPublished,
                imageUrl,
                authorId: currentUser.uid,
                createdAt: new Date(),
            });

            toast.success('Blog added successfully! 🎉', {
                position: 'top-right',
                autoClose: 3000,
            });

            navigate('/all-blogs');
            if (onAdd) onAdd();
        } catch (error) {
            console.error('Error adding blog:', error);
            toast.error('Error adding blog. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h3>Add Blog</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input
                        type="text"
                        id="category"
                        className="form-control"
                        value={category}
                        onChange={handleCategoryChange}
                        required
                        list="category-suggestions"
                    />
                    <datalist id="category-suggestions">
                        {categorySuggestions.map((cat, index) => (
                            <option key={index} value={cat} />
                        ))}
                    </datalist>
                </div>
                <div className="form-group">
                    <label htmlFor="tags">Tags (comma-separated)</label>
                    <input
                        type="text"
                        id="tags"
                        className="form-control"
                        value={tags}
                        onChange={handleTagChange}
                        list="tag-suggestions"
                    />
                    <datalist id="tag-suggestions">
                        {tagSuggestions.map((tag, index) => (
                            <option key={index} value={tag} />
                        ))}
                    </datalist>
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Image</label>
                    <input
                        type="file"
                        id="image"
                        className="form-control-file"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <div className="form-check">
                    <input
                        type="checkbox"
                        id="isPublished"
                        className="form-check-input"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                    />
                    <label htmlFor="isPublished" className="form-check-label">
                        Publish
                    </label>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Blog'}
                </button>
            </form>
        </div>
    );
};

export default AddBlog;
