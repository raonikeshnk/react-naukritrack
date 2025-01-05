import { db } from "../Firebase/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";

// Reference to blogs collection
const blogsRef = collection(db, "blogs");

export const addBlog = async (blogData) => {
  return await addDoc(blogsRef, blogData);
};

export const updateBlog = async (blogId, updatedData) => {
  const blogDoc = doc(db, "blogs", blogId);
  return await updateDoc(blogDoc, updatedData);
};

export const deleteBlog = async (blogId) => {
  const blogDoc = doc(db, "blogs", blogId);
  return await deleteDoc(blogDoc);
};

export const getAllBlogs = async () => {
  const snapshot = await getDocs(blogsRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
