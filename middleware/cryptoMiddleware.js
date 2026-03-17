import CryptoJS from 'crypto-js';

// Decrypt request payload middleware
export const decryptPayload = (req, res, next) => {
    if (req.body && req.body.payload) {
        try {
            const bytes = CryptoJS.AES.decrypt(req.body.payload, process.env.AES_SECRET);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            req.body = decryptedData;
        } catch (error) {
            console.error('Decryption error:', error);
            res.status(400);
            return next(new Error('Invalid encrypted payload'));
        }
    }
    next();
};

// Intercept response to encrypt payload
export const encryptResponse = (req, res, next) => {
    const oldJson = res.json;
    res.json = function (data) {
        // If data is an error or already encrypted, don't encrypt
        if (data && data.message && res.statusCode >= 400) {
            return oldJson.call(this, data);
        }
        
        try {
            const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.AES_SECRET).toString();
            return oldJson.call(this, { payload: encryptedData });
        } catch (error) {
            console.error('Encryption error:', error);
            return oldJson.call(this, { message: 'Server error encrypting response' });
        }
    };
    next();
};
