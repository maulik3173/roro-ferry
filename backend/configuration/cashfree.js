import { Cashfree } from 'cashfree-pg';
import dotenv from 'dotenv';

dotenv.config();

Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
Cashfree.XEnvironment = process.env.CASHFREE_ENVIRONMENT === 'sandbox' ? Cashfree.Environment.SANDBOX : Cashfree.Environment.PRODUCTION;

console.log('Cashfree methods:', Object.keys(Cashfree));

export default Cashfree;