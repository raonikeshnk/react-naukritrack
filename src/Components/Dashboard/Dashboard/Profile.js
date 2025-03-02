import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Profile = () => {
    const { currentUser } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [about, setAbout] = useState('');
    const [socialLinks, setSocialLinks] = useState({
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: ''
    });
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                const db = getFirestore();
                const userDoc = await getDoc(doc(db, "ntusers", currentUser.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setName(data.name);
                    setEmail(currentUser.email);
                    setProfilePicture(data.profilePicture || '');
                    setAbout(data.about || '');
                    setSocialLinks(data.socialLinks || { facebook: '', twitter: '', linkedin: '', instagram: '' });
                }
            }
        };

        fetchUserData();
    }, [currentUser]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const db = getFirestore();
            const userRef = doc(db, "ntusers", currentUser.uid);
            await updateDoc(userRef, { name, about, socialLinks });
            setEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const storage = getStorage();
            const storageRef = ref(storage, `profilePictures/${currentUser.uid}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setProfilePicture(url);

            const db = getFirestore();
            const userRef = doc(db, "ntusers", currentUser.uid);
            await updateDoc(userRef, { profilePicture: url });
        }
    };

    return (
        <div>
            <h4>Profile</h4>
            {editing ? (
                <form onSubmit={handleUpdateProfile}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            disabled
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="profilePicture" className="form-label">Profile Picture</label>
                        <input
                            type="file"
                            className="form-control"
                            id="profilePicture"
                            onChange={handleProfilePictureChange}
                        />
                        {profilePicture && <img src={profilePicture} alt="Profile" className="img-fluid rounded-circle mt-3" style={{ width: '150px', height: '150px' }} />}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="about" className="form-label">About</label>
                        <textarea
                            className="form-control"
                            id="about"
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            rows="3"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Social Links</label>
                        <div className="input-group mb-2">
                            <span className="input-group-text"><FaFacebook /></span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Facebook Username"
                                value={socialLinks.facebook}
                                onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                            />
                        </div>
                        <div className="input-group mb-2">
                            <span className="input-group-text"><FaTwitter /></span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Twitter Username"
                                value={socialLinks.twitter}
                                onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                            />
                        </div>
                        <div className="input-group mb-2">
                            <span className="input-group-text"><FaLinkedin /></span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="LinkedIn Username"
                                value={socialLinks.linkedin}
                                onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                            />
                        </div>
                        <div className="input-group mb-2">
                            <span className="input-group-text"><FaInstagram /></span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Instagram Username"
                                value={socialLinks.instagram}
                                onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditing(false)}>
                        Cancel
                    </button>
                </form>
            ) : (
                <div>
                    <div className="mb-3">
                        <img src={profilePicture || "/assets/img/default-profile.png"} alt="Profile" className="img-fluid rounded-circle" style={{ width: '150px', height: '150px' }} />
                    </div>
                    <div className="mb-3">
                        <h5>Name: {name}</h5>
                    </div>
                    <div className="mb-3">
                        <h5>Email: {email}</h5>
                    </div>
                    <div className="mb-3">
                        <h5>About:</h5>
                        <p>{about || 'Add someting about you'}</p>
                    </div>
                    <div className="mb-3">
                        <h5>Social Links:</h5>
                        <ul className="list-unstyled">
                            {(socialLinks.facebook && (
                                <li>
                                    <a className='text-dark' href={`https://facebook.com/${socialLinks.facebook}`} target="_blank" rel="noopener noreferrer">
                                        <FaFacebook /> Facebook
                                    </a>
                                </li>
                            )) || 'Add your Facebook link'} <br />
                            {(socialLinks.twitter && (
                                <li>
                                    <a className='text-dark' href={`https://twitter.com/${socialLinks.twitter}`} target="_blank" rel="noopener noreferrer">
                                        <FaTwitter /> Twitter
                                    </a>
                                </li>
                            )) || 'Add your Twitter link'} <br />
                            {(socialLinks.linkedin && (
                                <li>
                                    <a className='text-dark' href={`https://linkedin.com/in/${socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer">
                                        <FaLinkedin /> LinkedIn
                                    </a>
                                </li>
                            )) || 'Add your LinkedIn link'} <br />
                            {(socialLinks.instagram && (
                                <li>
                                    <a className='text-dark' href={`https://instagram.com/${socialLinks.instagram}`} target="_blank" rel="noopener noreferrer">
                                        <FaInstagram /> Instagram
                                    </a>
                                </li>
                            )) || 'Add your Instagram link'}
                        </ul>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={() => setEditing(true)}>
                        Edit Profile
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;