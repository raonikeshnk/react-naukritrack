import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import BlogItem from './BlogItem';
import AddBlog from './AddBlog';
import Profile from './Profile';
import EditBlog from './EditBlog'; // New EditBlog component
import { useAuth } from '../../context/AuthContext';
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    getDoc,
} from 'firebase/firestore';

const UserDashboard = () => {
    const [userName, setUserName] = useState(null);
    const { currentUser } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [activeSection, setActiveSection] = useState("allBlogs");
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [selectedBlogPreview, setSelectedBlogPreview] = useState(null);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [sortOption, setSortOption] = useState('title');
    const [filterCategory, setFilterCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [isPreviewMode, setIsPreviewMode] = useState(false);


    useEffect(() => {
        const fetchUserName = async () => {
            if (currentUser) {
                const db = getFirestore();
                const userDoc = await getDoc(doc(db, "ntusers", currentUser.uid));
                if (userDoc.exists()) {
                    setUserName(userDoc.data().name);
                } else {
                    console.error("No such document!");
                }
            }
        };

        fetchUserName();
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            const fetchBlogs = async () => {
                const db = getFirestore();
                const q = query(collection(db, 'ntblogs'), where('authorId', '==', currentUser.uid));
                const querySnapshot = await getDocs(q);
                const blogsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBlogs(blogsData);

                // Extract categories dynamically from the blogs
                const uniqueCategories = Array.from(new Set(blogsData.map(blog => blog.category)));
                setCategories(uniqueCategories);
            };

            fetchBlogs();
        }
    }, [currentUser]);

    useEffect(() => {
        handleFilter();
    }, [filterCategory, searchQuery]);

    useEffect(() => {
        // Sort blogs by latest first when blogs are fetched
        const sortedBlogs = [...blogs].sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
        setFilteredBlogs(sortedBlogs);
    }, [blogs]);

    const handlePreview = (blog) => {
        setSelectedBlogPreview(blog); // Set the blog to be previewed
    };

    const handleDelete = async (id) => {
        try {
            const db = getFirestore();
            await deleteDoc(doc(db, 'ntblogs', id));
            setBlogs(blogs.filter(blog => blog.id !== id));
            toast.success('Blog deleted successfully!', { toastId: 'delete-success-toast' }); // Success toast
        } catch (error) {
            toast.error('Failed to delete blog. Please try again.', { toastId: 'delete-error-toast' }); // Error toast
        }
    };

    const handleDeleteWithConfirmation = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(id);
            }
        });
    };

    const handleEdit = (blog) => {
        setSelectedBlog(blog); // Set the blog to be edited
        setActiveSection("editBlog"); // Switch to the edit section
    };

    const handlePublish = async (id) => {
        try {
            const db = getFirestore();
            await updateDoc(doc(db, 'ntblogs', id), { isPublished: true });
            setBlogs((prevBlogs) =>
                prevBlogs.map((blog) =>
                    blog.id === id ? { ...blog, isPublished: true } : blog
                )
            );
            toast.success('Blog published successfully!', { toastId: 'publish-success-toast' }); // Success toast
        } catch (error) {
            toast.error('Failed to publish blog. Please try again.', { toastId: 'publish-error-toast' }); // Error toast
        }
    };

    const handleUnpublish = async (id) => {
        try {
            const db = getFirestore();
            await updateDoc(doc(db, 'ntblogs', id), { isPublished: false });
            setBlogs((prevBlogs) =>
                prevBlogs.map((blog) =>
                    blog.id === id ? { ...blog, isPublished: false } : blog
                )
            );
            toast.success('Blog unpublished successfully!', { toastId: 'unpublish-success-toast' }); // Success toast
        } catch (error) {
            toast.error('Failed to unpublish blog. Please try again.', { toastId: 'unpublish-error-toast' }); // Error toast
        }
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            const db = getFirestore();
            await updateDoc(doc(db, 'ntblogs', id), updatedData);
            setBlogs((prevBlogs) =>
                prevBlogs.map((blog) =>
                    blog.id === id ? { ...blog, ...updatedData } : blog
                )
            );
            setSelectedBlog(null);
            setActiveSection("allBlogs");
            toast.success('Blog updated successfully!', { toastId: 'update-success-toast' }); // Success toast
        } catch (error) {
            toast.error('Failed to update blog. Please try again.', { toastId: 'update-error-toast' }); // Error toast
        }
    };

    const handleCancel = () => {
        setSelectedBlog(null); // Clear selected blog
        setActiveSection("allBlogs"); // Reset section
    };

    const handleAddBlog = () => {
        setActiveSection("addBlog");
    };

    const handleSort = (option) => {
        setSortOption(option);
        const sortedBlogs = [...filteredBlogs];
        sortedBlogs.sort((a, b) => {
            if (option === 'date') {
                return b.createdAt.seconds - a.createdAt.seconds; // Sort by date (newest first)
            } else if (option === 'title') {
                return a.title.localeCompare(b.title); // Sort by title
            } else if (option === 'category') {
                return a.category.localeCompare(b.category); // Sort by category
            } else {
                return a.isPublished === b.isPublished ? 0 : a.isPublished ? -1 : 1; // Sort by status (published first)
            }
        });
        setFilteredBlogs(sortedBlogs);
    };

    const handleFilter = () => {
        let filtered = blogs;
        if (filterCategory) {
            filtered = filtered.filter(blog => blog.category === filterCategory);
        }
        if (searchQuery) {
            filtered = filtered.filter(blog =>
                blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                blog.content.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setFilteredBlogs(filtered);
    };

    const togglePreviewMode = () => {
        setIsPreviewMode(prevState => !prevState);
    };


    if (!currentUser) {
        return <div>Please log in to view your blogs.</div>;
    }

    return (
        <div className="container-fluid my-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>{userName || 'User'}'s Dashboard</h3>
            </div>
            <div className="row">
                <div className="col-md-2 p-0 border-right min-vh-100">
                    <div className="list-group">
                        <button
                            className={`list-group-item list-group-item-action border-0 ${activeSection === "profile" ? "active" : ""}`}
                            onClick={() => setActiveSection("profile")}
                        >
                            Profile
                        </button>
                        <button
                            className={`list-group-item list-group-item-action border-0 ${activeSection === "allBlogs" ? "active" : ""}`}
                            onClick={() => setActiveSection("allBlogs")}
                        >
                            All Blogs
                        </button>
                        <button
                            className={`list-group-item list-group-item-action border-0 ${activeSection === "addBlog" ? "active" : ""}`}
                            onClick={() => setActiveSection("addBlog")}
                        >
                            Add Blog
                        </button>
                    </div>
                </div>

                <div className="col-md-10">
                    {activeSection === "allBlogs" && (
                        <div>
                            {/* Filters and Sort options */}
                            <div className="mb-3">
                                <div className="d-flex align-items-center">
                                    <input
                                        type="text"
                                        className="form-control me-2"
                                        placeholder="Search blogs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onBlur={handleFilter}
                                    />
                                    <select
                                        className="form-select me-2"
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                        onBlur={handleFilter}
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>

                                    <select
                                        className="form-select ms-2"
                                        onChange={(e) => handleSort(e.target.value)}
                                    >
                                        <option value="title">Title</option>
                                        <option value="category">Category</option>
                                        <option value="date">Publish Date</option>
                                        <option value="status">Status</option>
                                    </select>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>S. No.</th>
                                            <th>Image</th>
                                            <th>Title</th>
                                            <th>Category</th>
                                            <th>Tags</th>
                                            {/* <th>Content</th> */}
                                            <th>Publish Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBlogs.map((blog, index) => (
                                            <BlogItem
                                                key={blog.id}
                                                index={index}
                                                blog={blog}
                                                onDelete={handleDeleteWithConfirmation}
                                                onEdit={() => handleEdit(blog)}
                                                onPublish={handlePublish}
                                                onUnpublish={handleUnpublish}
                                                onPreview={handlePreview}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {activeSection === "addBlog" && <AddBlog onAdd={handleAddBlog} />}
                    {activeSection === "editBlog" && selectedBlog && (
                        <EditBlog
                            blog={selectedBlog}
                            onUpdate={handleUpdate}
                            onCancel={handleCancel}
                        />
                    )}
                    {activeSection === "profile" && <Profile />}
                </div>
            </div>
            {selectedBlogPreview && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedBlogPreview.title}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setSelectedBlogPreview(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <h6><strong>Category:</strong> {selectedBlogPreview.category || 'Uncategorized'}</h6>
                                <h6><strong>Tags:</strong></h6>
                                <div>
                                    {selectedBlogPreview.tags && selectedBlogPreview.tags.length > 0 ? (
                                        selectedBlogPreview.tags.map((tag, idx) => (
                                            <span key={idx} className="badge bg-primary me-1">
                                                {tag}
                                            </span>
                                        ))
                                    ) : (
                                        <span>No Tags</span>
                                    )}
                                </div>
                                <h6 className="mt-3"><strong>Date:</strong> {selectedBlogPreview.createdAt ?
                                    new Date(selectedBlogPreview.createdAt.seconds * 1000).toLocaleString('en-US', { hour12: true }) :
                                    'Unknown'}</h6>
                                <h6 className="mt-3"><strong>Status:</strong>
                                    <span className={`badge ${selectedBlogPreview.isPublished ? 'bg-success' : 'bg-secondary'} ms-2`}>
                                        {selectedBlogPreview.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </h6>
                                <hr />
                                <div>
                                    <h6><strong>Content:</strong></h6>
                                    <p>{selectedBlogPreview.content || 'No content available.'}</p>
                                </div>
                                {selectedBlogPreview.imageUrl && (
                                    <div className="mt-3">
                                        <h6><strong>Image:</strong></h6>
                                        <img
                                            src={selectedBlogPreview.imageUrl}
                                            alt={selectedBlogPreview.title}
                                            className="img-fluid"
                                            style={{ maxHeight: '300px' }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedBlogPreview(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserDashboard;
