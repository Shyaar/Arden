"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnimatedSection } from "@/components/animated-section"
import { Rocket, Users, TrendingUp, Heart } from "lucide-react"

export default function About() {
  const values = [
    {
      icon: <Users size={24} />,
      title: "Community First",
      description: "We believe in the power of community. Real users, real feedback, real growth.",
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Transparent Growth",
      description: "Fair rewards, transparent metrics, and honest partnerships between builders and users.",
    },
    {
      icon: <Heart size={24} />,
      title: "User Empowerment",
      description: "Every user's voice matters. We reward participation and value genuine engagement.",
    },
    {
      icon: <Rocket size={24} />,
      title: "Innovation",
      description: "Pushing boundaries with Account Abstraction to make crypto accessible and usable.",
    },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/30 mb-6">
            <Rocket size={16} className="text-accent" />
            <span className="text-sm font-semibold text-accent">About Arden</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Our Mission</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Arden is building the bridge between product creators and their ideal users. We empower builders to find
            their first users and gather authentic feedback, while rewarding users who help shape the future of
            innovative products.
          </p>
        </AnimatedSection>

        {/* Values Section */}
        <AnimatedSection className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, idx) => (
              <AnimatedSection key={idx} delay={idx * 0.1}>
                <div className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors">
                  <div className="p-3 bg-accent/10 rounded-lg text-accent w-fit mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection className="bg-card border border-border rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to join the community?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you&apos;re a builder looking to launch or a user ready to earn, Arden is the perfect place to grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <Rocket size={20} />
              Get Started Today
            </a>
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-colors"
            >
              Explore Campaigns
            </a>
          </div>
        </AnimatedSection>
      </main>
      <Footer />
    </>
  )
}
