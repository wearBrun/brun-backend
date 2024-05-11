import Razorpay from 'razorpay';
import  env  from '../env.js';

export const razorpay_instance = new Razorpay({
    key_id: env.RAZORPAY_API_KEY,
    key_secret: env.RAZORPAY_KEY_SECRET,
});

