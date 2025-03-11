import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { errorHandler } from './middlware/errorHandler/error.middleware';

const app = express();
const router = express.Router();
dotenv.config();

app.use(cors());
app.use(express.json());

router.get('/', (req, res) => {
    res.json({ message: 'Wellcome UMCignal' });
});

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});