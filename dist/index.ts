import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './middlware/errorHandler/error.middleware';

import userRouter from './user/user.router';

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

router.get('/', (req, res) => {
    res.json('Wellcome UMCignal');
});

app.use('/', router);
app.use('/user', userRouter);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});