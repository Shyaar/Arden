"use client"

import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnimatedSection } from "@/components/animated-section"
import { Rocket, Quote, ArrowRight } from "lucide-react"

export default function Home() {
  const router = useRouter()

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Founder",
      quote: "Arden helped us get our first 100 users in just 2 weeks.",
    },
    {
      name: "Sarah Williams",
      role: "Product Manager",
      quote: "The most efficient way to find real early adopters.",
    },
    {
      name: "Mike Johnson",
      role: "Developer",
      quote: "Transparent, fair, and actually works.",
    },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute z-10 w-full h-screen object-cover"
          >
            <source src="/backgroung_video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute z-20 inset-0 bg-black/95"></div>
          <AnimatedSection className="relative z-30 text-center text-white px-6 py-20 md:py-32">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/30 mb-6">
              <Rocket size={16} className="text-accent" />
              <span className="text-sm font-semibold text-accent">Launch Your Product</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">Find Your First Users</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Connect with real users who want to help. Run incentivized campaigns to gather feedback, build community,
              and scale sustainably.
            </p>
            <button
              onClick={() => {
                router.push("/dashboard")
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started
              <ArrowRight size={20} />
            </button>
          </AnimatedSection>
        </section>

        {/* Testimonials Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <AnimatedSection className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Quote size={24} className="text-accent" />
              <h2 className="text-3xl font-bold">Loved by builders worldwide</h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <AnimatedSection key={idx} delay={idx * 0.1}>
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-accent">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <AnimatedSection className="bg-card border border-border rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of builders and users already using Arden to grow their products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <Rocket size={20} />
                Create Campaign
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-colors"
              >
                Browse Campaigns
                <ArrowRight size={20} />
              </button>
            </div>
          </AnimatedSection>
        </section>
      </main>
      <Footer />
    </>
  )
}
