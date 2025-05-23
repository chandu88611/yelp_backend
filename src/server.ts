import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as cors from 'cors'
import * as express from 'express'
import { Request, Response } from 'express'
import helmet from 'helmet'
import httpStatus from 'http-status'
import * as morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import * as cookieParser from 'cookie-parser'
import * as xss from 'xss-clean'
import * as hpp from 'hpp' 
import config from '~/config'
import { handleErrors } from '~/packages/api/middlewares/error'

import { MainRouter } from './app/routes'
// import session from 'express-session'
// import authPassport from './config/passport'
 




const app = express()

app.enable('trust proxy')

// Set Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// Set Cookie parser
app.use(cookieParser())

// Set security HTTP headers
app.use(helmet())

// Limit requests from the same API
const limiter = rateLimit({
  max: 100,
  message: 'Too many requests from this IP, Please try again in an hour!',
  windowMs: 60 * 60 * 1000,
})

app.use('/users', limiter)

// Data sanitization against XSS
app.use(xss());

// Prevent http param pollution
app.use(hpp());

// Implement CORS
app.use(cors());

app.options('*', cors());
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "secret",
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// app.use(authPassport.initialize());
// app.use(authPassport.session());
app.use(compression());

app.disable('x-powered-by');

app.use(morgan('combined'));

// app.use(
//   morgan('combined', {
//     skip: (req: Request, res: Response) => res.statusCode < httpStatus.BAD_REQUEST,
//     stream: process.stderr,
//   }),
// );

// app.use(
//   morgan('combined', {
//     skip: (req: Request, res: Response) => res.statusCode >= httpStatus.BAD_GATEWAY,
//     stream: process.stdout,
//   }),
// );

app.use(bodyParser.json())
 
const mainRouter = new MainRouter();
app.use("/api/v1", mainRouter.router);

app.use(handleErrors)

export default app
 