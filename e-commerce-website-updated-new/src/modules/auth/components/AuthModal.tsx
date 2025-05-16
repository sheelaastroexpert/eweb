
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/use-auth';
import { useEffect } from 'react';

const userSchema = z.object({
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.string().min(5, "Address must be at least 5 characters"),
});

const AuthModal = () => {
  
    const {  setPhoneAddress ,isOpenModal, setOpenModal } = useAuth();
    const { register, handleSubmit, formState: { errors } , reset} = useForm({
        resolver: zodResolver(userSchema)
    });
   
    console.log('Auth Modal Call ',isOpenModal);
    const onSubmit = (data: any) => {
        setPhoneAddress(data.phone, data.address);
        localStorage.setItem('phone', data.phone);
        localStorage.setItem('address', data.address);
        setOpenModal(false);
        reset();
    };
    console.log('Auth Modal Call ', isOpenModal);
    return (
        <Dialog open={isOpenModal} onOpenChange={setOpenModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enter Your Details</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">Phone</label>
                    <input placeholder='Type Phone Number Here' {...register('phone')} />
                    {errors.phone && errors.phone?.message && <p>{String(errors.phone.message)}</p>}
                    </div>
                    <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">Address</label>
                    <textarea placeholder='Type Address Here' {...register('address')} className="border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none resize-none" />
                    {errors.address && errors.address?.message  && <p className="text-red-500 text-sm mt-1">{String(errors.address.message)}</p>}
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-200" type="submit">Save</button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;