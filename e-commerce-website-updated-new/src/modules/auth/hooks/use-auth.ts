import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { firebaseConfig } from '../../../shared/config/firebase.config';
import { initializeApp } from 'firebase/app';
import { useAuthStore } from '../store/auth-store';
import { useEffect, useState } from 'react';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const useAuth = () => {
    const { setUser, setPhoneAddress, logout,setOpenModal,isOpenModal, user } = useAuthStore();
   // const [isModalOpen, setIsModalOpen] = useState(false);
   // const [userLoggedIn, setUserLoggedIn] = useState(false); // New state
    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
           // setUserLoggedIn(true); // Mark user as logged in

            // Ensure the popup closes safely
        // if (window.opener) {
        //     window.close();
        // }

             const phone = localStorage.getItem('phone');
             const address = localStorage.getItem('address');
             console.log('Auth Phone and Address ', phone, address);
             if (!phone || !address) {
                 console.log('Set Modal State True');
                 setOpenModal(true);
                // setIsModalOpen(true);
        //         setTimeout(() => setIsModalOpen(true), 50); // Ensure state updates properly
             }
         }
         catch (error) {
             console.error("Google Sign-In Error: ", error);
         }
    };

    return { loginWithGoogle, logout,  setPhoneAddress, isOpenModal ,setOpenModal, user};
};
