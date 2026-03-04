import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const headerList = headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0] || 'Unknown'
  const ua = headerList.get('user-agent') || ''

  const supabase = createClient(
    process.env.SUPABASE_URL || '', 
    process.env.SUPABASE_ANON_KEY || ''
  )

  await supabase.from('visitor_logs').insert([{
    ip_address: ip,
    user_agent: ua,
    notes: 'Instagram Project'
  }])

  redirect('https://www.instagram.com/aibn.taymia?igsh=eGtoczg2ZnYydDds')
}
