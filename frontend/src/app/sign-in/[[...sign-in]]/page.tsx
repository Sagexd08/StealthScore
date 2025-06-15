import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full flex justify-center",
              card: "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl w-full max-w-md",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
              formFieldInput: "bg-white/20 border-white/30 text-white placeholder:text-white/70",
              identityPreviewText: "text-white",
              identityPreviewEditButton: "text-blue-400 hover:text-blue-300",
              formFieldLabel: "text-white",
              headerTitle: "text-white",
              headerSubtitle: "text-white/80",
              socialButtonsBlockButton: "bg-white/10 border-white/20 text-white hover:bg-white/20",
              dividerLine: "bg-white/20",
              dividerText: "text-white/60",
              footerActionLink: "text-blue-400 hover:text-blue-300",
              footerActionText: "text-white/80",
              formResendCodeLink: "text-blue-400 hover:text-blue-300",
              otpCodeFieldInput: "bg-white/20 border-white/30 text-white",
              formFieldSuccessText: "text-green-400",
              formFieldErrorText: "text-red-400",
              alertText: "text-white",
              formFieldHintText: "text-white/60"
            }
          }}
        />
      </div>
    </div>
  )
}
