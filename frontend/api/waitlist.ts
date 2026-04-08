import { neon } from '@neondatabase/serverless'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' })
  }

  const sql = neon(process.env.DATABASE_URL!)

  await sql`
    CREATE TABLE IF NOT EXISTS waitlist (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `

  await sql`
    INSERT INTO waitlist (email)
    VALUES (${email})
    ON CONFLICT (email) DO NOTHING
  `

  return res.status(200).json({ success: true })
}
