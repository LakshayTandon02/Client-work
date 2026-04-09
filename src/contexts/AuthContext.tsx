import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, loginWithGoogle, logout, db, doc, setDoc, getDoc, serverTimestamp } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: () => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("AuthContext: onAuthStateChanged - user =", user?.email, "uid =", user?.uid);
      setUser(user);
      if (user) {
        // Sync user data to Firestore
        const userRef = doc(db, "users", user.uid);
        try {
          const userSnap = await getDoc(userRef);
          console.log("AuthContext: user document exists =", userSnap.exists());
          
          if (!userSnap.exists()) {
            console.log("AuthContext: Creating new user document...");
            await setDoc(userRef, {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              role: user.email === "lakshaytandon125@gmail.com" ? "admin" : "patient",
              createdAt: serverTimestamp(),
            });
          }
          
          // Simple admin check based on email or role
          const userData = userSnap.exists() ? userSnap.data() : null;
          const isUserAdmin = user.email === "lakshaytandon125@gmail.com" || userData?.role === "admin";
          console.log("AuthContext: isAdmin =", isUserAdmin);
          setIsAdmin(isUserAdmin);
        } catch (error) {
          console.error("AuthContext: Error fetching user document", error);
          // Fallback to email check if DB fails
          setIsAdmin(user.email === "lakshaytandon125@gmail.com");
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    isAdmin,
    login: loginWithGoogle,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
