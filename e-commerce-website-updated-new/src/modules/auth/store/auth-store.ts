import { FlashSessionData } from 'react-router-dom';
import { create } from 'zustand';

interface AuthState {
    user: any;
    phone: string;
    address: string;
    isAuthenticated: boolean;
    isOpenModal:boolean,
    setOpenModal:(isOpen:boolean)=>void;
    setUser: (user: any) => void;
    setPhoneAddress: (phone: string, address: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isOpenModal:false,
    phone: localStorage.getItem('phone') || '',
    address: localStorage.getItem('address') || '',
    isAuthenticated: !!localStorage.getItem('phone') && !!localStorage.getItem('address'),
    setOpenModal:(isOpen)=>set({isOpenModal:isOpen}),
    setUser: (user) => set({ user }),
    setPhoneAddress: (phone, address) => {
        localStorage.setItem('phone', phone);
        localStorage.setItem('address', address);
        set({ phone, address, isAuthenticated: true });
    },
    logout: () => {
        localStorage.removeItem('phone');
        localStorage.removeItem('address');
        set({ user: null, phone: '', address: '', isAuthenticated: false });
    }
}));