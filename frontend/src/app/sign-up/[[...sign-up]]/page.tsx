import { SignUp } from '@clerk/nextjs'

export function generateStaticParams() {
  return [
    { 'sign-up': [] },
    { 'sign-up': ['sign-up'] },
    { 'sign-up': ['verify'] },
    { 'sign-up': ['continue'] }
  ]
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl",
          }
        }}
      />
    </div>
  )
}
