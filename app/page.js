import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import UAParser from 'ua-parser-js'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const headerList = headers()
  const ua = headerList.get('user-agent') || ''
  const ip = headerList.get('x-forwarded-for')?.split(',')[0] || 'Unknown'
  
  let ispData = { isp: 'Unknown', is_vpn: false }

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,isp,proxy`, {
        next: { revalidate: 0 } 
    })
    const data = await res.json()
    if (data.status === 'success') {
      ispData.isp = data.isp
      ispData.is_vpn = data.proxy
    }
  } catch (error) {
    console.log("ISP lookup skipped")
  }

  const jordanTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Amman",
    hour12: true,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })

  const parser = new UAParser(ua)
  const browser = parser.getBrowser()
  const os = parser.getOS()
  const device = parser.getDevice()

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

  // تسجيل البيانات مع إضافة ملاحظة أنها من رابط الإنستقرام
  await supabase.from('visitor_logs').insert([{
    ip_address: ip,
    user_agent: ua,
    browser_name: `${browser.name || 'Unknown'}`,
    operating_system: `${os.name || 'Unknown'}`,
    device_type: device.type || 'Desktop',
    isp: ispData.isp,
    local_time: jordanTime,
    is_vpn: ispData.is_vpn,
    notes: 'Instagram Project' // لتمييز هذا المشروع عن الأول
  }])

  // الرابط الوجهة الخاص بك
  redirect('https://www.instagram.com/aibn.taymia?igsh=eGtoczg2ZnYydDds')
}
