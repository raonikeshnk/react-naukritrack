import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../Components/Firebase/firebase';
import { doc, getDoc } from "firebase/firestore";

function Header() {
    const [userName, setUserName] = useState(null); // To store user's name
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null); // To store user's role
    const navigate = useNavigate();

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                // Fetch user details from Firestore
                const userDoc = await getDoc(doc(db, "ntusers", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserName(userData.name); // Set user's name
                    setUserRole(userData.role); // Set user's role (e.g., 'user' or 'superuser')
                } else {
                    console.error("No such document!");
                }
            } else {
                setCurrentUser(null);
                setUserName(null);
                setUserRole(null);
            }
        });

        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, []);

    const handleDashboardRedirect = () => {
        if (userRole === 'superuser') {
            navigate('/dashboard/superuser'); // Correct route for superuser dashboard
        } else if (userRole === 'user') {
            navigate('/dashboard/user'); // Correct route for user dashboard
        } else {
            console.error('Unknown role or userRole is null.');
        }
    };


    const logout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Logout error: ', error);
        }
    };

    return (
        <header>
            <div className="header-area header-transparrent shadow-sm">
                <div className="headder-top header-sticky">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-3 col-md-2">
                                <div className="logo">
                                    <a href="/"><img src="assets/img/logo/naukri-track.png" alt="" /></a>
                                </div>
                            </div>
                            <div className="col-lg-9 col-md-9">
                                <div className="menu-wrapper">
                                    <div className="main-menu">
                                        <nav className="d-none d-lg-block">
                                            <ul id="navigation">
                                                <li><Link to="/">Home</Link></li>
                                                <li><Link to="/joblist">Find Jobs</Link></li>
                                                <li><Link to="/about">About</Link></li>
                                                <li><Link to="/">Page</Link>
                                                    <ul className="submenu">
                                                        <li><Link to="/blogs">Blog</Link></li>
                                                        <li><Link to="/singleblog">Blog Details</Link></li>
                                                        <li><Link to="/elements">Elements</Link></li>
                                                        <li><Link to="/job_details">Job Details</Link></li>
                                                    </ul>
                                                </li>
                                                <li><Link to="/contact">Contact</Link></li>
                                            </ul>
                                        </nav>
                                    </div>
                                    <div className="header-btn d-none f-right d-lg-block">
                                        {currentUser && currentUser.emailVerified ? (
                                            <div className="dropdown profile">
                                                <button
                                                    className="btn head-btn1 dropdown-toggle"
                                                    type="button"
                                                    id="profileDropdown"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                >
                                                    Hello, {userName || "User"}
                                                </button>
                                                <ul
                                                    className="dropdown-menu"
                                                    aria-labelledby="profileDropdown"
                                                >
                                                    <li>
                                                        <button
                                                            className="dropdown-item"
                                                            onClick={handleDashboardRedirect}
                                                        >
                                                            Dashboard
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="dropdown-item"
                                                            onClick={logout}
                                                        >
                                                            Logout
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        ) : (
                                            <>
                                                <a href="/register" className="btn head-btn1">Register</a>
                                                <a href="/login" className="btn head-btn2">Login</a>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
