import { SignIn } from '@clerk/nextjs'

export function generateStaticParams() {
  return [
    { 'sign-in': [] },
    { 'sign-in': ['sign-in'] },
    { 'sign-in': ['verify'] },
    { 'sign-in': ['factor-one'] },
    { 'sign-in': ['factor-two'] }
  ]
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
      <SignIn
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
