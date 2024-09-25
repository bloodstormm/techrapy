import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/utils/server';

const supabase = createClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Request received at /api/addNote'); // Adicione este log para depuração

  if (req.method === 'POST') {
    const { patientID, note } = req.body;

    const { data, error } = await supabase
      .from('patient_summariesœß')
      .insert([
        {
          patient_id: patientID,
          session_date: new Date(),
          session_notes: note
        }
      ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
