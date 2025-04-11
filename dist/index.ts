import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { swaggerSpec, swaggerUi } from './config/swagger';
import { errorHandler } from './middlware/errorHandler/error.middleware';

import userRouter from './user/user.router';
import referralRouter from './referralCode/referral.router';
import searchRouter from './search/search.router';
import idleRouter from './idelType/idelType.router';
import operatingRouter from './operating/operating.router';
import serialCodeRouter from './serialCode/serialCode.router';
import healthRouter from './healthCheck/health.router';
import rootRouter from './aroot/root.router';

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

router.get('/', (req, res) => {
    res.json('Wellcome UMCignal');
});

app.use('/', router);
app.use('/user', userRouter);
app.use('/referral', referralRouter);
app.use('/search', searchRouter);
app.use('/idleType', idleRouter);
app.use('/operating', operatingRouter);
app.use('/serialCode', serialCodeRouter);
app.use('/health', healthRouter);

app.use('/root', rootRouter);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});