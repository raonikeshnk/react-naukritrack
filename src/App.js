import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./Components/context/AuthContext";
import Preloader from "./partials/Preloader";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import BlogList from "./Components/Dashboard/Dashboard/BlogList";

// Lazy loading components
const HomePage = lazy(() => import("./Components/HomePage"));
const AboutPage = lazy(() => import("./Components/AboutPage"));
const ContactPage = lazy(() => import("./Components/ContactPage"));
const BlogPage = lazy(() => import("./Components/BlogPage"));
const JobDetails = lazy(() => import("./Components/JobDetails"));
const JobListing = lazy(() => import("./Components/JobListing"));
const SingleBlog = lazy(() => import("./Components/SingleBlog"));
const Register = lazy(() => import("./Components/Register"));
const Login = lazy(() => import("./Components/Login"));
const SuperuserDashboard = lazy(() => import("./Components/Dashboard/Dashboard/SuperuserDashboard"));
const UserDashboard = lazy(() => import("./Components/Dashboard/Dashboard/UserDashboard"));

// ProtectedRoute wrapper
const ProtectedRoute = ({ element, allowedRole }) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Replace with your preloader or spinner
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return element;
};

const App = () => {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect only when user first logs in or navigates directly to the app
    if (currentUser && userRole && location.pathname === "/") {
      if (userRole === "superuser") {
        navigate("/dashboard/superuser");
      } else if (userRole === "user") {
        navigate("/dashboard/user");
      }
    }
  }, [currentUser, userRole, navigate, location.pathname]);

  return (
    <>
      <Preloader />
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/allblogs" element={<BlogList />} />
          <Route path="/jobdetails" element={<JobDetails />} />
          <Route path="/joblist" element={<JobListing />} />
          <Route path="/singleblog" element={<SingleBlog />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" replace />} />

          {/* Role-Specific Protected Routes */}
          <Route
            path="/dashboard/superuser"
            element={<ProtectedRoute element={<SuperuserDashboard />} allowedRole="superuser" />}
          />
          <Route
            path="/dashboard/user"
            element={<ProtectedRoute element={<UserDashboard />} allowedRole="user" />}
          />

          {/* Catch-All Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
};

export default App;
