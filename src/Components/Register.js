import React, { useState, useEffect } from "react";
import { auth, db } from "./Firebase/firebase";
import { signOut } from 'firebase/auth';
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [captchaValue, setCaptchaValue] = useState(null);
    const [captchaInput, setCaptchaInput] = useState("");
    const [captchaValid, setCaptchaValid] = useState(true);
    const [message, setMessage] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(false);

    // States for password strength
    const [showPasswordStrength, setShowPasswordStrength] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Generate a new captcha
    const generateCaptcha = () => {
        const a = Math.floor(Math.random() * 10);
        const b = Math.floor(Math.random() * 10);
        setCaptchaValue({ a, b });
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === "password" || name === "confirmPassword") {
            const otherField = name === "password" ? formData.confirmPassword : formData.password;
            setPasswordMatch(value === otherField);
        }

        if (name === "password") {
            setShowPasswordStrength(value.length > 0);
            updatePasswordStrength(value);
        }
    };

    // Helper function to calculate password strength
    const updatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/\d|[^A-Za-z0-9]/.test(password)) strength += 25;
        setPasswordStrength(strength);
    };

    // Handle captcha input changes
    const handleCaptchaChange = (e) => {
        setCaptchaInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        // Validate captcha
        if (parseInt(captchaInput) !== captchaValue.a + captchaValue.b) {
          setCaptchaValid(false);
          return;
        }
        setCaptchaValid(true);
      
        // Validate passwords
        if (formData.password !== formData.confirmPassword) {
          setMessage("Passwords do not match.");
          return;
        }
      
        try {
          // Create user
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );
          const user = userCredential.user;
      
          // Send verification email
          await sendEmailVerification(user);
      
          // Set the user role (you can change this role based on the logic you want)
          const userRole = "user"; // Default role, you can modify based on your requirements

          // Add user to Firestore with user role
          await setDoc(doc(db, "ntusers", user.uid), {
            name: formData.name,
            email: formData.email,
            createdAt: new Date().toISOString(),
            role: userRole, // Set the role here
          });
      
          // Reset form and show success message
          setFormData({ name: "", email: "", password: "", confirmPassword: "" });
          setCaptchaInput("");
          setIsSubmitted(true);
          setMessage(
            "Registration successful! A verification email has been sent to your email address. Please verify and log in."
          );
      
          // Log the user out until they verify email
          await signOut(auth); // This logs out the user after registration to prevent them from accessing the app before email verification.
      
        } catch (error) {
          if (error.code === "auth/email-already-in-use") {
            setMessage(
              "The email address is already in use. Please log in or use another email."
            );
          } else {
            setMessage(error.message);
          }
        }
    };

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    {isSubmitted ? (
                        <div className="alert alert-success text-center">
                            {message}
                            <div className="my-5">
                                <a href="/login" className="btn btn-primary">
                                    Go to Login
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="card">
                            <div className="card-header text-center">
                                <h4>Register</h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                            required
                                        />
                                        {showPasswordStrength && (
                                            <div className="mt-2">
                                                <div className="progress">
                                                    <div
                                                        className={`progress-bar ${passwordStrength < 50
                                                                ? "bg-danger"
                                                                : passwordStrength < 75
                                                                    ? "bg-warning"
                                                                    : "bg-success"
                                                            }`}
                                                        role="progressbar"
                                                        style={{ width: `${passwordStrength}%` }}
                                                        aria-valuenow={passwordStrength}
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                    ></div>
                                                </div>
                                                <small>
                                                    Password strength:{" "}
                                                    {passwordStrength < 50
                                                        ? "Weak"
                                                        : passwordStrength < 75
                                                            ? "Moderate"
                                                            : "Strong"}
                                                </small>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm your password"
                                            required
                                        />
                                        {formData.confirmPassword && (
                                            <small
                                                className={passwordMatch ? "text-success" : "text-danger"}
                                            >
                                                {passwordMatch ? "Passwords match." : "Passwords do not match."}
                                            </small>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Captcha</label>
                                        <div className="d-flex align-items-center mb-2">
                                            <span
                                                className="badge bg-secondary me-2"
                                                style={{ fontSize: "1.2rem" }}
                                            >
                                                {captchaValue
                                                    ? `${captchaValue.a} + ${captchaValue.b} = ?`
                                                    : ""}
                                            </span>
                                            <button
                                                type="button"
                                                className="btn btn-link p-0"
                                                onClick={generateCaptcha}
                                            >
                                                Refresh
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter captcha"
                                            value={captchaInput}
                                            onChange={handleCaptchaChange}
                                            required
                                        />
                                        {!captchaValid && (
                                            <small className="text-danger">
                                                Invalid captcha. Please try again.
                                            </small>
                                        )}
                                    </div>
                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-primary w-100">
                                            Register
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;
