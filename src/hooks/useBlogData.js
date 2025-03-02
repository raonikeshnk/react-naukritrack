import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, orderBy, limit, where, doc, getDoc, addDoc } from 'firebase/firestore';
import { app } from '../Components/Firebase/firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useBlogData = (blogId) => {
  const [blogs, setBlogs] = useState([]);
  const [blog, setBlog] = useState(null);
  const [categories, setCategories] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [author, setAuthor] = useState(null);
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  const db = getFirestore(app);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userRef = doc(db, "ntusers", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserDetails(userSnap.data());
        }
      } else {
        setUser(null);
        setUserDetails(null);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const fetchComments = async () => {
    if (!blogId) return;
    try {
      const commentsQuery = query(collection(db, "comments"), where("blogId", "==", blogId), orderBy("createdAt", "asc"));
      const querySnapshot = await getDocs(commentsQuery);
      const commentsData = [];
      querySnapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() });
      });
      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return;

      try {
        const blogRef = doc(db, "ntblogs", blogId);
        const blogSnap = await getDoc(blogRef);

        if (blogSnap.exists()) {
          const blogData = blogSnap.data();
          setBlog({ id: blogSnap.id, ...blogData });

          if (blogData.authorId) {
            const authorRef = doc(db, "ntusers", blogData.authorId);
            const authorSnap = await getDoc(authorRef);
            if (authorSnap.exists()) {
              setAuthor(authorSnap.data());
            }
          }

          const blogsQuery = query(collection(db, "ntblogs"), orderBy("createdAt", "desc"));
          const querySnapshot = await getDocs(blogsQuery);
          const blogsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          const currentIndex = blogsList.findIndex(blog => blog.id === blogId);

          if (currentIndex > 0) {
            setPrevPost(blogsList[currentIndex - 1]);
          }

          if (currentIndex < blogsList.length - 1) {
            setNextPost(blogsList[currentIndex + 1]);
          }
        } else {
          console.error("No such blog found!");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBlogs = async () => {
      try {
        const blogsQuery = query(collection(db, "ntblogs"));
        const querySnapshot = await getDocs(blogsQuery);
        const blogsData = [];
        querySnapshot.forEach((doc) => {
          blogsData.push({ id: doc.id, ...doc.data() });
        });
        setBlogs(blogsData);
        setAllBlogs(blogsData);
        setFilteredBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const blogsQuery = query(collection(db, "ntblogs"));
        const querySnapshot = await getDocs(blogsQuery);
        const categoriesData = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.category) {
            if (categoriesData[data.category]) {
              categoriesData[data.category]++;
            } else {
              categoriesData[data.category] = 1;
            }
          }
        });
        setCategories(Object.entries(categoriesData));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchRecentPosts = async () => {
      try {
        const blogsQuery = query(collection(db, "ntblogs"), orderBy("createdAt", "desc"), limit(5));
        const querySnapshot = await getDocs(blogsQuery);
        const postsData = [];
        querySnapshot.forEach((doc) => {
          postsData.push({ id: doc.id, ...doc.data() });
        });
        setRecentPosts(postsData);
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      }
    };

    fetchBlog();
    fetchBlogs();
    fetchCategories();
    fetchRecentPosts();
    fetchComments();
  }, [blogId, db, fetchComments]);

  const handleSearch = (event) => {
    const input = event.target.value;
    setSearchTerm(input);

    if (input === '') {
      setSearchResults([]);
      return;
    }

    const filteredBlogs = allBlogs.filter(blog =>
      blog.title.toLowerCase().includes(input.toLowerCase())
    );
    setSearchResults(filteredBlogs);
  };

  const handleCategoryClick = (category) => {
    const filtered = allBlogs.filter(blog => blog.category === category);
    setFilteredBlogs(filtered);
    setCurrentPage(1);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "newsletter"), {
        email: email,
        timestamp: new Date()
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setEmail('');
  };

  const addComment = async (commentText) => {
    if (!user || !userDetails) return;
    try {
      const newComment = {
        blogId,
        text: commentText,
        createdAt: new Date(),
        userId: user.uid,
        userName: userDetails.name || "Anonymous",
        userProfilePic: userDetails.profilePicture || "/assets/img/comment/comment_1.png"
      };
      await addDoc(collection(db, "comments"), newComment);
      fetchComments(); // Fetch comments again after adding a new comment
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  return {
    blogs,
    blog,
    categories,
    recentPosts,
    searchTerm,
    searchResults,
    allBlogs,
    author,
    prevPost,
    nextPost,
    comments,
    loading,
    handleSearch,
    handleCategoryClick,
    formatDate,
    email,
    handleEmailChange,
    handleNewsletterSubmit,
    filteredBlogs,
    currentPage,
    setCurrentPage,
    blogsPerPage,
    addComment,
    user,
    userDetails
  };
};

export default useBlogData;