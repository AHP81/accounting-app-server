// server.js
import express from 'express';
import customerRoutes from './routes/customer';
import balanceRoutes from './routes/balance';
import transactionRoutes from './routes/transaction';

const app = express();
app.use(express.json());

app.use('/api/customers', customerRoutes);
app.use('/api/balances', balanceRoutes);
app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});