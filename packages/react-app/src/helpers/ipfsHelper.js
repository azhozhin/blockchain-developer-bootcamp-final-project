const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

export const createBlob = (obj) => {
    const jsonBody = JSON.stringify(obj);
    const blob = new Blob([jsonBody], { type: 'application/json' });
    const file = new File([blob], filename);
    return file;
}

// const file = fs.createReadStream(filename);
export const pinFileToIpfs = async (file, name, pinataApiKey, pinataSecretApiKey) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    let data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({
        name: name
    });
    data.append('pinataMetadata', metadata);

    const result = await axios
        .post(url, data, {
            maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey
            }
        });
    return result.data;
};

export const pinJsonToIpfs = async (jsonBody, name, pinataApiKey, pinataSecretApiKey) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    const payload = {
        pinataMetadata: {
            name: name
        },
        
        pinataContent: jsonBody
    };
    const result = await axios
        .post(url, payload, {
            headers: {
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey
            }
        });
    return result.data;
};
