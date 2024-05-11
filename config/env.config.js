import dotenv from 'dotenv'
import { ApiError } from '../utils/ApiError.js';
process.env.NODE_ENV == "prod" ? dotenv.config({ path: "./.env" }) : dotenv.config({ path: "./.env" })
import Joi from 'joi'

const envVarsSchema = Joi.object().keys({
    NODE_ENV: Joi.string().valid('prod', 'dev').required(),
    PORT: Joi.number().default(8080),
    DATABASE_URL: Joi.string().required().description('DB url'),
    REFRESH_TOKEN_SECRET: Joi.string().required().description('JWT refresh secret key'),
    ACCESS_TOKEN_SECRET: Joi.string().required().description('JWT access secret key'),
    PASSWORD_RESET_SECRET: Joi.string().default('10day').description('password reset screct key'),
    ACCESS_TOKEN_TTL: Joi.string().default('1day').description('minutes after which access tokens expire'),
    REFRESH_TOKEN_TTL: Joi.string().default('10day').description('days after which refresh tokens expire'),
    NODE_MAILER_EMAIL: Joi.string().required().description('username for node mailer server'),
    NODE_MAILER_PASSWORD: Joi.string().required().description('password for node mailer server'),
    SALT_ROUND:Joi.number().default(10).description('password hassing level'),
    RESET_TOKEN_TTL: Joi.string().default("2m").description('minutes after Reset Token Expires'),
    cloudinary_cloud_name: Joi.string().required().description('cloudinary cloud name'),
    cloudinary_api_key: Joi.string().required().description('cloudinary cloud api key'),
    cloudinary_api_secret: Joi.string().required().description('cloudinary cloud key secret'),
    FRONTEND_BASEURL:Joi.string().required().description('Frontend url To redirect to frontend'),
    RAZORPAY_API_KEY:Joi.string().required().description('razorpay api key'),
    RAZORPAY_KEY_SECRET:Joi.string().required().description('razorpay key secret'),
    imagekit_publicKey:Joi.string().required().description('image kit public key'),
    imagekit_privateKey:Joi.string().required().description('image kit private key'),
    imagekit_urlEndpoint:Joi.string().required().description('image url end point'),
    DELIVERY_CHARGES:Joi.number().default(0).description("default delivery charge")
})
  .unknown();

const { value: envVars, error:error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new ApiError(404,'setup .env file first',error.message)
}

const config = {
    DATABASE_URL: envVars.DATABASE_URL,
    PORT: envVars.PORT,
    ACCESS_TOKEN_SECRET: envVars.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: envVars.REFRESH_TOKEN_SECRET,
    PASSWORD_RESET_SECRET:envVars.PASSWORD_RESET_SECRET,
    ACCESS_TOKEN_TTL: envVars.ACCESS_TOKEN_TTL,
    REFRESH_TOKEN_TTL: envVars.REFRESH_TOKEN_TTL,
    RESET_TOKEN_TTL:envVars.RESET_TOKEN_TTL,
    NODE_ENV: envVars.NODE_ENV,
    NODE_MAILER_EMAIL: envVars.NODE_MAILER_EMAIL,
    NODE_MAILER_PASSWORD: envVars.NODE_MAILER_PASSWORD,
    cloudinary_cloud_name: envVars.cloudinary_cloud_name,
    cloudinary_api_key: envVars.cloudinary_api_key,
    cloudinary_api_secret: envVars.cloudinary_api_secret,
    SALT_ROUND: envVars.SALT_ROUND,
    FRONTEND_BASEURL:envVars.FRONTEND_BASEURL,
    RAZORPAY_API_KEY:envVars.RAZORPAY_API_KEY,
    RAZORPAY_KEY_SECRET:envVars.RAZORPAY_KEY_SECRET,
    imagekit_publicKey:envVars.imagekit_publicKey,
    imagekit_privateKey:envVars.imagekit_privateKey,
    imagekit_urlEndpoint:envVars.imagekit_urlEndpoint,
    DELIVERY_CHARGES:envVars.DELIVERY_CHARGES
}

export default config