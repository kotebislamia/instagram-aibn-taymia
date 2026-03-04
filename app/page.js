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

  // تسجيل البيانات في قاعدة البيانات
  await supabase.from('visitor_logs').insert([{
    ip_address: ip,
    user_agent: ua,
    browser_name: `${browser.name || 'Unknown'}`,
    operating_system: `${os.name || 'Unknown'}`,
    device_type: device.type || 'Desktop',
    isp: ispData.isp,
    local_time: jordanTime,
    is_vpn: ispData.is_vpn,
    notes: 'Instagram Project' // ميزنا المشروع هنا
  }])

  // توجيه الزائر بعد ثانية واحدة لضمان ظهور التصميم للحظة
  // يمكنك استخدام redirect مباشرة أو إضافة تأخير بسيط بالكود
  redirect('https://www.instagram.com/aibn.taymia?igsh=eGtoczg2ZnYydDds')

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      backgroundColor: '#fafafa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' 
    }}>
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" 
        alt="Instagram" 
        style={{ width: '80px', height: '80px', marginBottom: '20px' }} 
      />
      <p style={{ color: '#262626', fontSize: '18px', fontWeight: '500' }}>Redirecting to Instagram...</p>
      <div className="loader"></div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .loader {
          border: 3px solid #dbdbdb;
          border-top: 3px solid #3897f0;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 0.8s linear infinite;
          margin-top: 20px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  )
}
