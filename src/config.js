import dotenv from 'dotenv'
dotenv.config()

export const port = process.env.PORT
export const key_id=process.env.KEY_ID
export const key_secret=process.env.KEY_SECRET
export const mongo_url=process.env.MONGO_URL
export const jwt_secret = process.env.JWT_SECRET