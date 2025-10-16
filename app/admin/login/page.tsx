import { LoginForm } from "@/components/admin/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Admin Login</h1>
          <p className="text-muted-foreground">Entre para gerenciar os devocionais</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
