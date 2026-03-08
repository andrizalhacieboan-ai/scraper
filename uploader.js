/*
• Sumber : https://whatsapp.com/channel/0029VbBW0L5AYlUPmohzsS0Y
*

/*
• Author : Andri Store

• Nama fitur : uploader catbox.moe,Qu.ax dan termai.cc
*/

const axios = require('axios');
const FormData = require('form-data');
const path = require('path');a

/**
 * Mime Type 
 */
function getMimeType(ext) {
    const mimes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.mp4': 'video/mp4',
        '.mp3': 'audio/mpeg',
        '.pdf': 'application/pdf',
        '.txt': 'text/plain',
        '.webp': 'image/webp'
    };
    return mimes[ext.toLowerCase()] || 'application/octet-stream';
}

/**
 * Upload ke Catbox.moe
 */
async function uploadCatbox(buffer, ext) {
    try {
        const mime = getMimeType(ext);
        const form = new FormData();
        form.append("reqtype", "fileupload");
        form.append("fileToUpload", buffer, {
            filename: `file${ext}`,
            contentType: mime
        });

        const res = await axios.post("https://catbox.moe/user/api.php", form, {
            headers: {
                ...form.getHeaders(),
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
            },
            timeout: 120000 // Extended timeout
        });

        const url = res.data.trim();
        return url.startsWith('http') ? url : null;
    } catch (e) {
        console.error("Catbox Error Detail:", e.response?.data || e.message);
        return null;
    }
}

/**
 * Upload ke Qu.ax
 */
async function uploadQuax(buffer, ext) {
    try {
        const mime = getMimeType(ext);
        const form = new FormData();
        form.append("files[]", buffer, { 
            filename: `file${ext}`,
            contentType: mime
        });
        const res = await axios.post("https://qu.ax/upload.php", form, { 
            headers: form.getHeaders(),
            timeout: 60000 
        });
        return res.data?.success ? res.data.files[0].url : null;
    } catch (e) {
        return null;
    }
}

/**
 * Upload ke Termai.cc
 */
async function uploadTermai(buffer, ext) {
    try {
        const termaiKey = "AIzaBj7z2z3xBjsk";
        const form = new FormData();
        form.append('file', buffer, { filename: `file${ext}` });
        const res = await axios.post(`https://c.termai.cc/api/upload?key=${termaiKey}`, form, { 
            headers: form.getHeaders(),
            timeout: 60000 
        });
        return res.data?.status ? res.data.path : null;
    } catch (e) {
        return null;
    }
}

/**
 * Fungsi Utama
 */
async function tourl(buffer, ext) {
    
    const [catbox, quax, termai] = await Promise.all([
        uploadCatbox(buffer, ext),
        uploadQuax(buffer, ext),
        uploadTermai(buffer, ext)
    ]);

    return { catbox, quax, termai };
}

module.exports = { tourl, uploadCatbox, uploadQuax, uploadTermai };
