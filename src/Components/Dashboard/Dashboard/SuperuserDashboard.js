import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import AddBlog from './AddBlog';
import Profile from './Profile';
import EditBlog from './EditBlog';
import JobPostForm from './JobPostForm';
import JobList from './JobList';
import Modal from './Modal';
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
    onSnapshot,
    addDoc,
} from 'firebase/firestore';

const SuperuserDashboard = () => {
    const [userName, setUserName] = useState(null);
    const { currentUser } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [activeSection, setActiveSection] = useState("allBlogs");
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [sortOption, setSortOption] = useState('title');
    const [filterCategory, setFilterCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [filterAuthor, setFilterAuthor] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchBlogs = async () => {
            const db = getFirestore();
            const q = query(collection(db, 'ntblogs'));
            const querySnapshot = await getDocs(q);
            const blogsData = [];

            const authorSet = new Set(); // To store unique authors

            for (const docSnapshot of querySnapshot.docs) {
                const blog = docSnapshot.data();
                const authorDoc = await getDoc(doc(db, "ntusers", blog.authorId));
                const authorName = authorDoc.exists() ? authorDoc.data().name : "Unknown";

                blogsData.push({
                    id: docSnapshot.id,
                    ...blog,
                    authorName,
                });

                authorSet.add(authorName); // Collect authors
            }

            setBlogs(blogsData);
            setCategories([...new Set(blogsData.map(blog => blog.category))]); // Extract categories
            setAuthors([...authorSet]); // Extract unique authors
        };

        fetchBlogs();
    }, [currentUser]);

    const markAsRead = async (notificationId) => {
        try {
            const db = getFirestore();
            await updateDoc(doc(db, 'notifications', notificationId), { isRead: true });
            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    // Fetch username
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
        const fetchNotifications = () => {
            const db = getFirestore();
            const notificationsRef = query(
                collection(db, 'ntnotifications'),
                where('authorId', '==', currentUser.uid) // Filter notifications for the logged-in author
            );

            const unsubscribe = onSnapshot(notificationsRef, (snapshot) => {
                const newNotifications = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setNotifications(newNotifications);
            });

            return unsubscribe; // Cleanup listener on unmount
        };

        if (currentUser) {
            fetchNotifications();
        }
    }, [currentUser]);

    // Real-time notifications listener
    useEffect(() => {
        const db = getFirestore();
        const notificationsRef = collection(db, 'ntnotifications');
        const unsubscribe = onSnapshot(notificationsRef, (snapshot) => {
            const notificationsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNotifications(notificationsData);
        });

        return () => unsubscribe(); // Cleanup subscription
    }, []);

    
    useEffect(() => {
        const sortedBlogs = [...blogs].sort((a, b) => {
            const aCreatedAt = a.createdAt?.seconds ?? 0;
            const bCreatedAt = b.createdAt?.seconds ?? 0;
            return bCreatedAt - aCreatedAt;
        });
        setFilteredBlogs(sortedBlogs);
    }, [blogs]);

    const handleDelete = async (id) => {
        try {
            const db = getFirestore();
            await deleteDoc(doc(db, 'ntblogs', id));
            setBlogs(blogs.filter(blog => blog.id !== id));
            toast.success('Blog deleted successfully!', { toastId: 'delete-success-toast' });
        } catch (error) {
            toast.error('Failed to delete blog. Please try again.', { toastId: 'delete-error-toast' });
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

    const openPreview = (blog) => {
        setSelectedBlog(blog);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBlog(null);
    };

    const handleEdit = (blog) => {
        const authorName = blog.authorName;
        setSelectedBlog({
            ...blog,
            authorName, // Keep author name constant
        });
        setActiveSection("editBlog");
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
            toast.success('Blog published successfully!', { toastId: 'publish-success-toast' });
        } catch (error) {
            toast.error('Failed to publish blog. Please try again.', { toastId: 'publish-error-toast' });
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
            toast.success('Blog unpublished successfully!', { toastId: 'unpublish-success-toast' });
        } catch (error) {
            toast.error('Failed to unpublish blog. Please try again.', { toastId: 'unpublish-error-toast' });
        }
    };

    const handleUpdateSuccess = (updatedBlog) => {
        setBlogs((prevBlogs) =>
            prevBlogs.map((blog) =>
                blog.id === updatedBlog.id ? { ...blog, author: updatedBlog.author, ...updatedBlog } : blog
            )
        );
        setActiveSection("allBlogs"); // All blogs view pe wapas jane ke liye
    };

    const handleCancel = () => {
        setSelectedBlog(null);
        setActiveSection("allBlogs");
    };

    const handleAddBlog = () => setActiveSection("addBlog");

    const handleSort = (option) => {
        setSortOption(option);
        const sortedBlogs = [...filteredBlogs].sort((a, b) => {
            const aCreatedAt = a.timestamp?.seconds ?? 0;
            const bCreatedAt = b.timestamp?.seconds ?? 0;

            if (option === 'date') {
                return bCreatedAt - aCreatedAt;
            } else if (option === 'title') {
                return a.title.localeCompare(b.title);
            } else if (option === 'category') {
                return a.category.localeCompare(b.category);
            } else if (option === 'author') {
                return a.authorName.localeCompare(b.authorName); // Sort by author name
            } else {
                return a.isPublished === b.isPublished ? 0 : a.isPublished ? -1 : 1;
            }
        });
        setFilteredBlogs(sortedBlogs);
    };

    const handleFilter = () => {
        let filtered = blogs;

        if (filterCategory) {
            filtered = filtered.filter(blog => blog.category === filterCategory);
        }
        if (filterAuthor) {
            filtered = filtered.filter(blog => blog.authorName === filterAuthor);
        }
        if (searchQuery) {
            filtered = filtered.filter(blog =>
                blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                blog.content.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredBlogs(filtered);
    };

    useEffect(() => {
        handleFilter();
    }, [filterAuthor, filterCategory, searchQuery, handleFilter]);


    if (!currentUser) {
        return <div>Please log in to view your blogs.</div>;
    }

    return (
        <div className="container-fluid my-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>{userName || 'Superuser'}'s Dashboard</h3>
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
                            className={`list-group-item list-group-item-action border-0 ${activeSection === "notifications" ? "active" : ""}`}
                            onClick={() => setActiveSection("notifications")}
                        >
                            Notifications
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
                        <button
                            className={`list-group-item list-group-item-action border-0 ${activeSection === "addJobPost" ? "active" : ""}`}
                            onClick={() => setActiveSection("addJobPost")}
                        >
                            Add Job Post
                        </button>
                        <button
                            className={`list-group-item list-group-item-action border-0 ${activeSection === "manageJobs" ? "active" : ""}`}
                            onClick={() => setActiveSection("manageJobs")}
                        >
                            Manage Jobs
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
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            handleFilter(); // Trigger filter on change
                                        }}
                                    />
                                    <select
                                        className="form-select me-2"
                                        value={filterCategory}
                                        onChange={(e) => { setFilterCategory(e.target.value); handleFilter() }}
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                    <select
                                        className="form-select me-2"
                                        value={filterAuthor}
                                        onChange={(e) => { setFilterAuthor(e.target.value); handleFilter() }}
                                    >
                                        <option value="">All Authors</option>
                                        {authors.map(author => (
                                            <option key={author} value={author}>{author}</option>
                                        ))}
                                    </select>
                                    <select
                                        className="form-select"
                                        value={sortOption}
                                        onChange={(e) => handleSort(e.target.value)}
                                    >
                                        <option value="title">Sort by Title</option>
                                        <option value="date">Sort by Date</option>
                                        <option value="category">Sort by Category</option>
                                        <option value="author">Sort by Author</option>
                                        <option value="status">Sort by Status</option>
                                    </select>
                                </div>

                            </div>

                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Sr. No</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Author</th> {/* Author column */}
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBlogs.length === 0 ? (
                                        <tr><td colSpan="6">No blogs found.</td></tr>
                                    ) : (
                                        filteredBlogs.map(blog => (
                                            <tr key={blog.id}>
                                                <td>{filteredBlogs.indexOf(blog) + 1}</td>
                                                <td>
                                                    {blog.title.split(' ').length > 5
                                                        ? blog.title.split(' ').slice(0, 5).join(' ') + '...'
                                                        : blog.title}
                                                </td>

                                                <td>{blog.category}</td>
                                                <td>{blog.authorName}</td> {/* Show the author's name */}
                                                <td>{new Date(blog.createdAt?.seconds * 1000).toLocaleDateString() || 'N/A'}</td>
                                                <td>{blog.isPublished ? 'Published' : 'Unpublished'}</td>
                                                <td>
                                                    <button className="btn-sm btn-info" onClick={() => openPreview(blog)}>Preview</button>
                                                    <button onClick={() => handleEdit(blog)} className=" btn-warning btn-sm">Edit</button>
                                                    <button onClick={() => handleDeleteWithConfirmation(blog.id)} className=" btn-danger btn-sm ml-2">Delete</button>
                                                    {!blog.isPublished ? (
                                                        <button onClick={() => handlePublish(blog.id)} className="btn-success btn-sm ms-2">Publish</button>
                                                    ) : (
                                                        <button onClick={() => handleUnpublish(blog.id)} className="btn-secondary btn-sm ms-2">Unpublish</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeSection === "addBlog" && (
                        <AddBlog onBlogAdded={() => setActiveSection("allBlogs")} />
                    )}

                    {activeSection === "editBlog" && selectedBlog && (
                        <EditBlog blog={selectedBlog} onUpdateSuccess={handleUpdateSuccess} />
                    )}

                    {activeSection === "profile" && (
                        <Profile />
                    )}

                    {activeSection === "notifications" && (
                        <div>
                            <h4>Notifications</h4>
                            <ul>
                                {notifications.map(notification => (
                                    <li key={notification.id}>
                                        <div className={notification.isRead ? 'read' : 'unread'}>
                                            {notification.message}
                                            <button onClick={() => markAsRead(notification.id)} className="btn btn-sm btn-primary ms-2">
                                                Mark as Read
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {activeSection === "addJobPost" && (
                        <JobPostForm />
                    )}

                    {activeSection === "manageJobs" && (
                        <JobList />
                    )}

                    {/* Blog Preview Modal */}
                    {isModalOpen && selectedBlog && (
                        <Modal
                            isOpen={isModalOpen}
                            blog={selectedBlog}
                            onClose={closeModal}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SuperuserDashboard;