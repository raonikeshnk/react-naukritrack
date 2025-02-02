import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import BlogItem from './BlogItem';
import AddBlog from './AddBlog';
import Profile from './Profile';
import EditBlog from './EditBlog';
import Modal from './Modal';
import { useAuth } from '../../context/AuthContext';
import { getFirestore, collection, getDoc, deleteDoc, query, where, orderBy, getDocs, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';

const UserDashboard = () => {
    const [userName, setUserName] = useState(null);
    const { currentUser } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [activeSection, setActiveSection] = useState("allBlogs");
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [sortOption, setSortOption] = useState('date');
    const [sortOrder, setSortOrder] = useState('asc'); // To track ascending or descending
    const [filterCategory, setFilterCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatedBlogId, setUpdatedBlogId] = useState(null);


    // Fetch notifications for the logged-in user
    useEffect(() => {
        const fetchNotifications = async () => {
            if (currentUser) {
                const db = getFirestore();
                const q = query(
                    collection(db, 'notifications'),
                    where('userId', '==', currentUser.uid),
                    orderBy('timestamp', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const notificationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setNotifications(notificationsData);
            }
        };
        fetchNotifications();
    }, [currentUser]);


    // Mark a notification as read
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

    // Add a comment and create a notification for the blog owner
    const addComment = async (blogId, ownerId, commenterName, commentText) => {
        const db = getFirestore();
        try {
            // Add comment to Firestore
            await addDoc(collection(db, 'comments'), {
                blogId,
                ownerId,
                commenterName,
                commentText,
                timestamp: serverTimestamp()
            });

            // Add notification for blog owner
            await addDoc(collection(db, 'notifications'), {
                userId: ownerId,
                message: `${commenterName} commented on your blog "${blogId}"`,
                partialComment: commentText.slice(0, 50) + '...',
                isRead: false,
                timestamp: serverTimestamp()
            });

            toast.success('Comment added successfully!');
        } catch (error) {
            toast.error('Failed to add comment. Please try again.');
            console.error("Error adding comment:", error);
        }
    };

    // Fetch user name based on the current user
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

    // Fetch blogs for the logged-in user
    useEffect(() => {
        const fetchBlogs = async () => {
            if (currentUser) {

                const db = getFirestore();
                const q = query(collection(db, 'ntblogs'), where('authorId', '==', currentUser.uid));
                const querySnapshot = await getDocs(q);
                const blogsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBlogs(blogsData);
                console.log('Blog Data:', blogsData);
                const uniqueCategories = Array.from(new Set(blogsData.map(blog => blog.category)));
                setCategories(uniqueCategories);
            };

        }
        fetchBlogs();
    }, [currentUser]);

    // Apply sorting and filtering logic
    useEffect(() => {
        const handleSortAndFilter = () => {
            let filtered = [...blogs];

            // Apply filtering by category and search query
            if (filterCategory) {
                filtered = filtered.filter(blog => blog.category === filterCategory);
            }
            if (searchQuery) {
                filtered = filtered.filter(blog =>
                    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    blog.content.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            // Apply sorting
            if (sortOption === 'date') {
                filtered.sort((a, b) =>
                    sortOrder === 'asc'
                        ? a.createdAt.seconds - b.createdAt.seconds
                        : b.createdAt.seconds - a.createdAt.seconds
                );
            } else if (sortOption === 'publish') {
                filtered.sort((a, b) =>
                    sortOrder === 'asc'
                        ? (a.isPublished === b.isPublished ? 0 : a.isPublished ? -1 : 1)
                        : (a.isPublished === b.isPublished ? 0 : a.isPublished ? 1 : -1)
                );
            } else if (sortOption === 'title') {
                filtered.sort((a, b) =>
                    sortOrder === 'asc'
                        ? a.title.localeCompare(b.title)
                        : b.title.localeCompare(a.title)
                );
            } else if (sortOption === 'category') {
                filtered.sort((a, b) =>
                    sortOrder === 'asc'
                        ? a.category.localeCompare(b.category)
                        : b.category.localeCompare(a.category)
                );
            }

            setFilteredBlogs(filtered); // Update filtered blogs
        };

        // Run sort and filter whenever relevant state changes
        handleSortAndFilter();
    }, [blogs, filterCategory, searchQuery, sortOption, sortOrder]);

    const handleUpdateSuccess = (updatedBlog) => {
        setBlogs((prevBlogs) =>
            prevBlogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
        );
        setActiveSection("allBlogs"); // All blogs view pe wapas jane ke liye
    };


    // Handle sorting changes
    const handleSort = (option) => {
        const newOrder = (sortOption === option && sortOrder === 'asc') ? 'desc' : 'asc';
        setSortOption(option);
        setSortOrder(newOrder); // Trigger sorting effect
    };

    const handleCancel = () => {
        setSelectedBlog(null);
        setActiveSection("allBlogs");
    };

    const togglePublishStatus = async (blog) => {
        const { id, isPublished } = blog;

        // Optimistically update the UI
        const updatedBlogs = blogs.map(b =>
            b.id === id ? { ...b, isPublished: !isPublished } : b
        );
        setBlogs(updatedBlogs); // Update state immediately

        try {
            const db = getFirestore();
            const blogRef = doc(db, 'ntblogs', id);
            await updateDoc(blogRef, {
                isPublished: !isPublished // Toggle the publish status in Firestore
            });
            toast.success(`Blog ${isPublished ? 'Unpublished' : 'Published'} successfully!`);
        } catch (error) {
            toast.error(`Failed to ${isPublished ? 'unpublish' : 'publish'} blog. Please try again.`);
            console.error("Error toggling blog publish status:", error);
        }
    };

    const openPreview = (blog) => {
        setSelectedBlog(blog);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBlog(null);
    };


    const deleteBlog = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const db = getFirestore();
                    await deleteDoc(doc(db, 'ntblogs', id));
                    setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== id));
                    toast.success('Blog deleted successfully!');
                    // fetchBlogs();
                } catch (error) {
                    toast.error('Failed to delete blog.');
                    console.error("Error deleting blog:", error);
                }
            }
        });
    };


    const editBlog = (blog) => {
        setSelectedBlog(blog);
        setActiveSection("editBlog");
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
                    </div>
                </div>

                <div className="col-md-10">
                    {activeSection === "notifications" && (
                        <div className="notifications">
                        <h4>Notifications</h4>
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div key={notification.id} className={`notification ${notification.isRead ? 'read' : 'unread'}`}>
                                    <p>{notification.message}</p>
                                    <small>{new Date(notification.timestamp.seconds * 1000).toLocaleString()}</small>
                                    <button onClick={() => markAsRead(notification.id)}>Mark as Read</button>
                                </div>
                            ))
                        ) : (
                            <p>No notifications.</p>
                        )}
                    </div>
                    )}

                    {activeSection === "profile" && <Profile />}

                    {activeSection === "allBlogs" && (
                        <div>
                            <h4>Your Blogs</h4>
                            <div className="d-flex flex-wrap gap-3 mb-4">
                                <input
                                    type="text"
                                    className="form-control w-25"
                                    placeholder="Search blogs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <select
                                    className="form-control w-25"
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>

                                <div className="d-flex">
                                    {/* Date Sort Button */}
                                    <button
                                        className=" btn-secondary me-2"
                                        onClick={() => handleSort('date')}
                                    >
                                        Date {sortOption === 'date' && sortOrder === 'asc' ? '↑' : '↓'}
                                    </button>

                                    {/* Published Sort Button */}
                                    <button
                                        className=" btn-secondary me-2"
                                        onClick={() => handleSort('publish')}
                                    >
                                        Published {sortOption === 'publish' && sortOrder === 'asc' ? '↑' : '↓'}
                                    </button>

                                    {/* Title Sort Button */}
                                    <button
                                        className=" btn-secondary me-2"
                                        onClick={() => handleSort('title')}
                                    >
                                        Title {sortOption === 'title' && sortOrder === 'asc' ? '↑' : '↓'}
                                    </button>

                                    {/* Category Sort Button */}
                                    <button
                                        className=" btn-secondary"
                                        onClick={() => handleSort('category')}
                                    >
                                        Category {sortOption === 'category' && sortOrder === 'asc' ? '↑' : '↓'}
                                    </button>
                                </div>
                            </div>


                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Serial No.</th>
                                        <th>Image</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Tag</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBlogs.map((blog, index) => (

                                        <BlogItem
                                            key={blog.id}
                                            blog={blog}
                                            index={index}
                                            description={blog.description}
                                            onDelete={() => deleteBlog(blog.id)}
                                            onEdit={() => editBlog(blog)}
                                            onPublish={() => togglePublishStatus(blog)}
                                            onUnpublish={() => togglePublishStatus(blog)}
                                            onPreview={() => openPreview(blog)}
                                        />

                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeSection === "addBlog" && <AddBlog />}
                    {/* {activeSection === "editBlog" && selectedBlog && (
                        <EditBlog blog={selectedBlog} onCancel={handleCancel} />
                    )} */}
                    {activeSection === "editBlog" && selectedBlog && (
                        <EditBlog blog={selectedBlog} onCancel={handleCancel} onUpdateSuccess={handleUpdateSuccess} />
                    )}


                    {selectedBlog && (
                        <Modal
                            isOpen={isModalOpen}
                            onClose={closeModal}
                            blog={selectedBlog}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
