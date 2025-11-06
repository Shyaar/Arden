"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AlertBox } from "@/components/alert-box"
import { AnimatedSection } from "@/components/animated-section"
import { UserPlus, AlertCircle, CheckCircle } from "lucide-react"
import { validateEmail, validateRequired, validateMinLength } from "@/lib/validation"
import { useLocalStorage } from "@/hooks/use-localStorage"

interface FormData {
  name: string
  email: string
  role: "builder" | "user"
  description: string
}

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    role: "user",
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [alert, setAlert] = useState({ isVisible: false, message: "", variant: "success" as "success" | "error" })
  const [, setUserName] = useLocalStorage<string | null>("userName", null)
  const [, setUserData] = useLocalStorage<FormData | null>("userData", null)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    const nameError = validateRequired(formData.name, "name")
    if (nameError) newErrors[nameError.field] = nameError.message

    const emailError = validateEmail(formData.email)
    if (emailError) newErrors[emailError.field] = emailError.message

    const roleError = validateRequired(formData.role, "role")
    if (roleError) newErrors["role"] = roleError.message

    const descError = validateMinLength(formData.description, "description", 10)
    if (descError) newErrors[descError.field] = descError.message

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setAlert({
        isVisible: true,
        message: "Please fix the errors below",
        variant: "error",
      })
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Save to localStorage
    setUserName(formData.name)
    setUserData(formData)

    setAlert({
      isVisible: true,
      message: "Account created successfully! Redirecting to dashboard...",
      variant: "success",
    })

    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen max-w-7xl mx-auto px-6 py-12">
        <AnimatedSection className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-accent/10 rounded-lg text-accent">
                <UserPlus size={32} />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Join Arden</h1>
            <p className="text-muted-foreground">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border rounded-lg p-6">
            {/* Name Field */}
            <div className={isShaking && errors.name ? 'shake' : ''}>
              <label className="text-sm font-semibold text-foreground block mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full px-3 py-2.5 bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
                  errors.name ? "border-red-500" : "border-border focus:border-accent"
                }`}
              />
              {errors.name && (
                <div className="flex items-center gap-2 mt-1.5 text-red-400 text-sm">
                  <AlertCircle size={14} />
                  {errors.name}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className={isShaking && errors.email ? 'shake' : ''}>
              <label className="text-sm font-semibold text-foreground block mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`w-full px-3 py-2.5 bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
                  errors.email ? "border-red-500" : "border-border focus:border-accent"
                }`}
              />
              {errors.email && (
                <div className="flex items-center gap-2 mt-1.5 text-red-400 text-sm">
                  <AlertCircle size={14} />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Role Field */}
            <div className={isShaking && errors.role ? 'shake' : ''}>
              <label className="text-sm font-semibold text-foreground block mb-2">I am a</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 bg-background border rounded-lg text-foreground focus:outline-none focus:border-accent ${
                  errors.role ? "border-red-500" : "border-border focus:border-accent"
                }`}
              >
                <option value="user">User (Looking to earn rewards)</option>
                <option value="builder">Builder (Looking to launch campaigns)</option>
              </select>
              {errors.role && (
                <div className="flex items-center gap-2 mt-1.5 text-red-400 text-sm">
                  <AlertCircle size={14} />
                  {errors.role}
                </div>
              )}
            </div>

            {/* Description Field */}
            <div className={isShaking && errors.description ? 'shake' : ''}>
              <label className="text-sm font-semibold text-foreground block mb-2">About You</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell us about yourself (min. 10 characters)"
                rows={3}
                className={`w-full px-3 py-2.5 bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors resize-none ${
                  errors.description ? "border-red-500" : "border-border focus:border-accent"
                }`}
              />
              {errors.description && (
                <div className="flex items-center gap-2 mt-1.5 text-red-400 text-sm">
                  <AlertCircle size={14} />
                  {errors.description}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Create Account
                </>
              )}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/dashboard" className="text-accent hover:underline font-semibold">
                Go to dashboard
              </a>
            </p>
          </form>
        </AnimatedSection>
      </main>

      <AlertBox
        isVisible={alert.isVisible}
        icon={alert.variant === "error" ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
        title={alert.variant === "error" ? "Error" : "Success"}
        message={alert.message}
        onClose={() => setAlert({ ...alert, isVisible: false })}
        variant={alert.variant}
      />

      <Footer />
    </>
  )
}
