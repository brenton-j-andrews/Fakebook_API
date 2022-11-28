const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '..', 'PRIVATE_KEY.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');


function generatePassword(password) {
    let salt = crypto.randomBytes(32).toString('hex');
    let generateHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return {
        salt : salt,
        hash : generateHash
    }
}

function validatePassword(password, hash, salt) {
    let hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

function issueJWT(user) {
    const _id = user._id;

    const expiresIn = 900 // 30 seconds for testing purposes.

    const payload = {
        sub: _id,
        iat: Math.floor(Date.now() / 1000)
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });
    console.log(signedToken);
    
    return {
        token: "Bearer " + signedToken,
        expires: expiresIn
    }
}

module.exports.generatePassword = generatePassword;
module.exports.validatePassword = validatePassword;
module.exports.issueJWT = issueJWT;