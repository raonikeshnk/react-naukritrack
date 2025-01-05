import { db } from "../firebase/firebaseSetup";
import { getDoc, doc } from "firebase/firestore";

export const fetchUserRole = async (userId) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.exists() ? userDoc.data().role : null;
};
