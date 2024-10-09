// pages/api/appointments.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { sendSMS } from '../../lib/twilio';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { phoneNumber, message } = req.body;

      // Send SMS using the Twilio helper function
      await sendSMS(phoneNumber, message);

      return res.status(200).json({ message: 'SMS sent successfully' });
    } catch (error) {
      console.error('Error sending SMS:', error);
      return res.status(500).json({ error: 'Failed to send SMS' });
    }
  }

  // Handle other HTTP methods
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
