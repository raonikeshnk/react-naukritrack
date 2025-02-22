import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, orderBy, limit, where, doc, getDoc } from 'firebase/firestore';
import { app } from '../Components/Firebase/firebase';
import axios from 'axios';

const useBlogData = (blogId) => {
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
  const [instagramFeed, setInstagramFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return; // Ensure blogId exists
      try {
        const db = getFirestore(app);
        const blogRef = doc(db, "ntblogs", blogId);
        const blogSnap = await getDoc(blogRef);

        if (blogSnap.exists()) {
          const blogData = blogSnap.data();
          setBlog({ id: blogSnap.id, ...blogData });

          // Fetch author data
          if (blogData.authorId) {
            const authorRef = doc(db, "ntusers", blogData.authorId);
            const authorSnap = await getDoc(authorRef);
            if (authorSnap.exists()) {
              setAuthor(authorSnap.data());
            }
          }

          // Fetch previous and next posts
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
        const db = getFirestore(app);
        const blogsQuery = query(collection(db, "ntblogs"));
        const querySnapshot = await getDocs(blogsQuery);
        const blogsData = [];
        querySnapshot.forEach((doc) => {
          blogsData.push({ id: doc.id, ...doc.data() });
        });
        setBlogs(blogsData);
        setAllBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const db = getFirestore(app);
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
        const db = getFirestore(app);
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

    const fetchAdminInstagram = async () => {
      try {
        const db = getFirestore(app);
        const q = query(collection(db, "ntusers"), where("role", "==", "superuser"));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const adminData = querySnapshot.docs[0].data();
          const instagramLink = adminData.socialLinks?.instagram;
            console.log(instagramLink);
          if (instagramLink) {
            const response = await axios.get(`https://graph.instagram.com/2698274760383424/media?fields=id,caption,media_type,media_url,permalink&access_token=EAAQPZByfirsABO1EaZBtCfmOI5ZARPC1tSOMZA82HqCZAZC4J40HBBlmF2cnqzT9l81EZA1t9ixOqMEugdFCQbALQZCopJ2ZAemiGLGWHuAQrFNGuRq0hzUSnY3c6b9lyY0JuJfjfR4NZAZCBoAJo6csZC5Uydfx1bvvzJcT2BFbEqR4XuYvAXkFDCbcSPIjE2GWZAS6kHIZBw0roZCYcjV5ywmV0mr3khPDINawCEefwZDZD`);
            setInstagramFeed(response.data.data.ig_user.media.nodes);
          }
        } else {
          console.error("No admin user found!");
        }
      } catch (error) {
        console.error("Error fetching admin Instagram feed:", error);
      }
    };

    fetchBlog();
    fetchBlogs();
    fetchCategories();
    fetchRecentPosts();
    fetchAdminInstagram();
  }, [blogId]);

  const handleSearch = (event) => {
    const input = event.target.value;
    setSearchTerm(input);

    if (input === '') {
      setSearchResults([]);
      return;
    }

    // Suggest blogs based on user input
    const filteredBlogs = allBlogs.filter(blog =>
      blog.title.toLowerCase().includes(input.toLowerCase())
    );
    setSearchResults(filteredBlogs);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
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
    instagramFeed,
    loading,
    handleSearch,
    formatDate
  };
};

export default useBlogData;