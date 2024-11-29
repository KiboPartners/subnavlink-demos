import crypto from 'crypto'

//This should match the `appId` configured in your subnavlink
const APP_SECRET = process.env.KIBO_SHARED_SECRET || ''

export const verifyHash = (receivedHash: string, receivedDateTime: string, rawContent: string): boolean => {
  const concatenated1 = APP_SECRET + APP_SECRET
  //  Generate a SHA 256 hash of the starting key.
  const hash1 = crypto.createHash("sha256").update(concatenated1)
  // Concatenate the Base64-encoded hash, event date from the request header, and request body.
  const concatenated2 = hash1.digest("base64") + receivedDateTime + rawContent
  // Generate a second SHA 256 hash.
  const hash2 = crypto.createHash("sha256").update(concatenated2)
  //  Encode the second SHA 256 hash using the Base64 encoding scheme.
  const generatedHash = hash2.digest('base64')
  // Compare the SHA 256 hash in the request header (x-vol-hmac-sha256";) with the hash your application generated. Matching hashes confirms event authenticity.

  return generatedHash == receivedHash
}