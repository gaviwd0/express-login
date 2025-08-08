import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import authRouter from './routes/auth.routes.js';
import { swaggerDocs } from './swagger.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser())



app.use('/api/v1/auth', authRouter);


//endpoint para testear
app.get('/api/v1/test', (_req, res) => {
    res.send('funcionando');
});


// endpoint para probar como funciona el auth
import { authRequired} from './middlewares/auth.middleware.js';
app.get('/api/v1/testauth', authRequired, (_req, res) => {
    res.send('funcionando');
});

export { app, swaggerDocs };