const crypto = require('crypto');
const fs = require('fs');

function genKeyPair() {
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    })

    // Write keys to respective pem files.
    fs.writeFileSync(__dirname + "/PRIVATE_KEY.pem", keyPair.privateKey);

    fs.writeFileSync(__dirname + "/PUBLIC_KEY.pem", keyPair.publicKey);
}

genKeyPair();