"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnimatedSection } from "@/components/animated-section"
import { AlertBox } from "@/components/alert-box"
import { Mail, AlertCircle, CheckCircle } from "lucide-react"
import { validateEmail, validateRequired, validateMinLength } from "@/lib/validation"

interface ContactFormData {
  name: string
  email: string
  message: string
}

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState({ isVisible: false, message: "", variant: "success" as "success" | "error" })

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    const nameError = validateRequired(formData.name, "Name")
    if (nameError) newErrors[nameError.field] = nameError.message

    const emailError = validateEmail(formData.email)
    if (emailError) newErrors[emailError.field] = emailError.message

    const msgError = validateMinLength(formData.message, "Message", 10)
    if (msgError) newErrors[msgError.field] = msgError.message

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
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)

    setAlert({
      isVisible: true,
      message: "Thank you! We'll get back to you soon.",
      variant: "success",
    })

    setFormData({ name: "", email: "", message: "" })
    setErrors({})
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen max-w-7xl mx-auto px-6 py-12">
        <AnimatedSection className="max-w-2xl mx-auto">
          <div className="mb-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-accent/10 rounded-lg text-accent">
                <Mail size={32} />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Have questions or feedback? We&apos;d love to hear from you. Fill out the form below and we&apos;ll get back to you
              as soon as possible.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8 space-y-6">
            {/* Name Field */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
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
            <div>
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

            {/* Message Field */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us what&apos;s on your mind (min. 10 characters)"
                rows={5}
                className={`w-full px-3 py-2.5 bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors resize-none ${
                  errors.message ? "border-red-500" : "border-border focus:border-accent"
                }`}
              />
              {errors.message && (
                <div className="flex items-center gap-2 mt-1.5 text-red-400 text-sm">
                  <AlertCircle size={14} />
                  {errors.message}
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
                  Sending...
                </>
              ) : (
                <>
                  <Mail size={18} />
                  Send Message
                </>
              )}
            </button>
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
