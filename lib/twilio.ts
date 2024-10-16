// lib/twilio.ts

import twilio from 'twilio';

const accountSid = process.env.TW_ACCOUNT_SID; // Your Account SID from .env.local
const authToken = process.env.AUTH_TOKEN; // Your Auth Token from .env.local
const client = twilio(accountSid, authToken);

/**
 * Sends an SMS via Twilio
 * @param to - The recipient phone number
 * @param message - The message to send
 */
export const sendSMS = async (to: string, message: string) => {
  try {
    const messageResponse = await client.messages.create({
      body: message,
      from: process.env.ADMIN_PHONE_NUMBER, // Twilio phone number
      to,                                    // Recipient's phone number
    });

    console.log('SMS sent:', messageResponse.sid);
    return messageResponse;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw new Error('Failed to send SMS');
  }
};
 