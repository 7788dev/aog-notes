import { ImageResponse } from 'next/og'
import siteConfig from '../../site.config'

export const runtime = 'nodejs'
export const alt = siteConfig.title
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '8px',
              height: '100px',
              background: 'linear-gradient(180deg, #16b777 0%, #10b981 100%)',
              borderRadius: '4px',
              marginRight: '30px',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '72px',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.2,
              }}
            >
              {siteConfig.name}
            </span>
            <span
              style={{
                fontSize: '28px',
                color: '#94a3b8',
                marginTop: '10px',
              }}
            >
              {siteConfig.description}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
          <div
            style={{
              padding: '8px 24px',
              borderRadius: '18px',
              background: 'rgba(22, 183, 119, 0.1)',
              border: '1px solid #16b777',
              color: '#16b777',
              fontSize: '14px',
            }}
          >
            Next.js 16
          </div>
          <div
            style={{
              padding: '8px 24px',
              borderRadius: '18px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid #3b82f6',
              color: '#3b82f6',
              fontSize: '14px',
            }}
          >
            TypeScript
          </div>
          <div
            style={{
              padding: '8px 24px',
              borderRadius: '18px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid #38bdf8',
              color: '#38bdf8',
              fontSize: '14px',
            }}
          >
            Tailwind CSS
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
