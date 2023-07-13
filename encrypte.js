const crypto = require("crypto");
const Const = require("./constant");

// this is the function for encrypt data using crypto library
function encryptData(data, key, iv) {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encryptedData = cipher.update(data, "utf8", "hex");
  encryptedData += cipher.final("hex");

  return encryptedData;
}
// this is the function for de____ data usinf crypto library
function decryptData(encryptedData, key, iv) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  let decryptedData = decipher.update(encryptedData, "hex", "utf8");
  decryptedData += decipher.final("utf8");

  return decryptedData;
}

// 256-bit key
// const initializationVector = crypto.randomBytes(16); // 16-byte IV
const initializationVector = Buffer.from(
  "0123456789abcdef0123456789abcdef",
  "hex"
);

module.exports = {
  encryptData,
  decryptData,
  initializationVector,
};
