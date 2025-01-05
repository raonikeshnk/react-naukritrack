import React, { useState, useEffect } from "react";
import { auth, db } from "./Firebase/firebase";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export function Login({ setUserRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [canResend, setCanResend] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      // If the user is already logged in, redirect to the dashboard
      navigate("/dashboard/user"); // Or redirect based on their role
    }
  }, [navigate]);

const handleLogin = async (e) => {
  e.preventDefault();
  setMessage("");
  setLoading(true);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      setMessage("Please verify your email before logging in.");
      setLoading(false);
      return;
    }

    const userRef = doc(db, "ntusers", user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userRole = userDoc.data().role;
      setUserRole(userRole);

      navigate(userRole === "superuser" ? "/dashboard/superuser" : "/dashboard/user");
    } else {
      setMessage("User role not found.");
    }
  } catch (error) {
    switch (error.code) {
      case "auth/user-not-found":
        setMessage("No user found with this email.");
        break;
      case "auth/wrong-password":
        setMessage("Incorrect password. Please try again.");
        break;
      default:
        setMessage(`Error: ${error.message}`);
    }
  } finally {
    setLoading(false);
  }
};


  const handleResendVerification = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        setMessage("Verification email sent. Please check your inbox.");
        setCanResend(false);

        // Reset resend permission after 1 hour
        setTimeout(() => setCanResend(true), 60 * 60 * 1000);
      } else {
        setMessage("Error: No user found. Please try logging in again.");
      }
    } catch (error) {
      setMessage(`Error sending verification email: ${error.message}`);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center">
              <h4>Login</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control w-100"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control w-100"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary w-100">Login</button>
                </div>
              </form>
              {message && (
                <div className="alert alert-info mt-3">
                  {message}
                  {!canResend ? (
                    <small className="text-muted d-block mt-2">
                      You can resend the verification email after 1 hour.
                    </small>
                  ) : (
                    message === "Please verify your email before logging in." && (
                      <button
                        className="btn btn-link mt-2"
                        onClick={handleResendVerification}
                        disabled={!canResend}
                      >
                        Resend Verification Email
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
