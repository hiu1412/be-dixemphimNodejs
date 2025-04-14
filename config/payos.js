import env from '../common/env.js';

export const PAYOS_CONFIG = {
    CLIENT_ID: env.PAYOS_CLIENT_ID,
    API_KEY: env.PAYOS_API_KEY,
    CHECKSUM_KEY: env.PAYOS_CHECKSUM_KEY,
    API_ENDPOINT: "https://api-merchant.payos.vn",
    IS_SANDBOX: true // true cho môi trường test, false cho production
};

export default PAYOS_CONFIG;