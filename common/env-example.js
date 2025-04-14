export default {
    //jwt
    JWT_SETTINGS: {
        ACCESS_SECRET: 'your_access_secret_key',
        REFRESH_SECRET: 'your_refresh_secret_key',
        EXPIRES_IN: '1h',
        REFRESH_EXPIRES_IN: '7d',
    },

    //auth
    AUTH: {
        PRIVATE_KEY: 'your_auth_private_key',
        SALT_ROUNDS: 10
    },

    //mongodb
    MONGODB: {
        URI: 'mongodb://localhost:27017/your_database'
    },

    //redis
    REDIS: {
        HOST: 'localhost',
        PORT: 6379,
        PASSWORD: '',
    },

    //email
    EMAIL: {
        HOST: 'smtp.gmail.com',
        PORT: 587,
        SECURE: false,
        USER: 'your_email@gmail.com',
        PASS: 'your_app_specific_password'
    },
    

}