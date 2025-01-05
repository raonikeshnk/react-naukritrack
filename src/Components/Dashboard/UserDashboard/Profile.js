import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const Profile = () => {
    const { currentUser } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                const db = getFirestore();
                const userDoc = await getDoc(doc(db, "ntusers", currentUser.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setName(data.name);
                    setEmail(currentUser.email);
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
            await updateDoc(userRef, { name });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h4>Update Profile</h4>
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
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

export default Profile;
