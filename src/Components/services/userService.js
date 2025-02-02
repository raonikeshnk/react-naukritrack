import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

export const getUserRoleFromDatabase = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data().role; // Ensure the "role" field exists in your database
    }
    return null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
};
