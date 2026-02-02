import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET_TOKEN;

export const jwtConstants = {
    secret: jwtSecret,
};
