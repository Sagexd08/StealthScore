import React, { useEffect, useRef } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { Shield, Sparkles, Lock, Zap, ArrowRight, Play, Github, ExternalLink,
         Eye, Brain, Users, Star, CheckCircle, Target, Layers, Globe,
         TrendingUp, Award, MessageSquare, Heart, Upload, Cpu, Network,
         Database, Code, Rocket, Lightning, Fingerprint } from 'lucide-react'
import TrueFocus from './TrueFocus'
import ScrollReveal from './ScrollReveal'
import Squares from './Squares'
import CountUp from './CountUp'
import AnimatedLogo from './AnimatedLogo'
import AnimatedChart from './AnimatedChart'
import AnimatedStats from './AnimatedStats'
import PerformanceMonitor from './PerformanceMonitor'
import ClickSpark from './ClickSpark'
import AdvancedLoader from './AdvancedLoader'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface LandingPageProps {
  onGetStarted: () => void
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const featuresRef = useRef<HTMLDivElement>(null)
  const stealthScoreRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  useEffect(() => {
    // Advanced GSAP animations for enhanced visual effects
    const tl = gsap.timeline({ repeat: -1, yoyo: true })

    // Floating animation for feature cards
    if (featuresRef.current) {
      gsap.set(featuresRef.current.children, { y: 0 })
      tl.to(featuresRef.current.children, {
        y: -15,
        duration: 3,
        stagger: 0.3,
        ease: "power2.inOut"
      })
    }

    // Advanced SplitText animation for hero title
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll('.char')
      gsap.fromTo(chars,
        {
          opacity: 0,
          y: 50,
          rotationX: -90,
          transformOrigin: "50% 50% -50px"
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 1.2,
          stagger: 0.05,
          ease: "back.out(1.7)",
          delay: 0.5
        }
      )
    }

    // Parallax scrolling effects
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress
        if (heroRef.current) {
          gsap.set(heroRef.current, {
            y: progress * 100,
            opacity: 1 - progress * 0.5
          })
        }
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <ClickSpark sparkColor="#3b82f6" sparkCount={8} sparkRadius={30}>
      <div className="min-h-screen relative overflow-hidden">
        {/* Enhanced Squares Background */}
        <Squares
          direction="diagonal"
          speed={0.3}
          borderColor="rgba(59, 130, 246, 0.15)"
          squareSize={80}
          hoverFillColor="rgba(59, 130, 246, 0.08)"
        />

        {/* Hero Section */}
        <section ref={heroRef} className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="max-w-7xl mx-auto text-center">
            {/* Enhanced Animated Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3, rotateY: 180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, ease: "back.out(1.7)" }}
              className="mb-12"
            >
              <ClickSpark sparkColor="#8b5cf6" sparkCount={12} sparkRadius={40}>
                <AnimatedLogo
                  size={120}
                  variant="custom"
                  color="#3b82f6"
                  animated={true}
                  glowEffect={true}
                  className="mx-auto hover:scale-110 transition-transform duration-500"
                />
              </ClickSpark>
            </motion.div>

            {/* Advanced SplitText Title */}
            <motion.div
              ref={titleRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-12"
            >
              <h1 className="text-6xl md:text-8xl font-black mb-6">
                <span className="inline-block">
                  {"StealthScore".split('').map((char, index) => (
                    <span
                      key={index}
                      className="char inline-block text-gradient bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300 cursor-pointer"
                      style={{ transformOrigin: "50% 50% -50px" }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </h1>
            </motion.div>

            {/* Enhanced Subtitle with ClickSpark */}
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={3}
              blurStrength={8}
              delay={0.8}
              className="mb-16"
            >
              <h2 className="text-2xl md:text-4xl text-white/95 max-w-5xl mx-auto leading-relaxed font-light">
                Privacy-preserving AI pitch analysis with{' '}
                <ClickSpark sparkColor="#10b981" sparkCount={6} sparkRadius={25}>
                  <span className="text-green-400 font-semibold cursor-pointer hover:text-green-300 transition-colors duration-300 hover:scale-105 inline-block">
                    military-grade encryption
                  </span>
                </ClickSpark>
                ,{' '}
                <ClickSpark sparkColor="#8b5cf6" sparkCount={6} sparkRadius={25}>
                  <span className="text-purple-400 font-semibold cursor-pointer hover:text-purple-300 transition-colors duration-300 hover:scale-105 inline-block">
                    zero data storage
                  </span>
                </ClickSpark>
                , and{' '}
                <ClickSpark sparkColor="#f59e0b" sparkCount={6} sparkRadius={25}>
                  <span className="text-yellow-400 font-semibold cursor-pointer hover:text-yellow-300 transition-colors duration-300 hover:scale-105 inline-block">
                    instant results
                  </span>
                </ClickSpark>
              </h2>
            </ScrollReveal>

            {/* Enhanced Feature Pills with ClickSpark */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-6 mb-16"
            >
              {[
                { icon: Lock, text: "Military-Grade Encryption", color: "bg-green-500/20 text-green-300", sparkColor: "#10b981" },
                { icon: Zap, text: "Real-Time AI Analysis", color: "bg-blue-500/20 text-blue-300", sparkColor: "#3b82f6" },
                { icon: Shield, text: "Zero Data Storage", color: "bg-purple-500/20 text-purple-300", sparkColor: "#8b5cf6" },
                { icon: Sparkles, text: "Advanced Animations", color: "bg-yellow-500/20 text-yellow-300", sparkColor: "#f59e0b" },
                { icon: Cpu, text: "TEE Processing", color: "bg-red-500/20 text-red-300", sparkColor: "#ef4444" },
                { icon: Network, text: "Federated Learning", color: "bg-indigo-500/20 text-indigo-300", sparkColor: "#6366f1" },
              ].map((feature, index) => (
                <ClickSpark key={feature.text} sparkColor={feature.sparkColor} sparkCount={8} sparkRadius={30}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6, rotateY: 180 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ delay: 1.4 + index * 0.15, duration: 0.6, ease: "back.out(1.7)" }}
                    whileHover={{ scale: 1.08, y: -5, rotateX: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`glass-card px-8 py-4 flex items-center gap-4 ${feature.color} border border-white/30 cursor-pointer group hover:border-white/50 transition-all duration-300`}
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="w-6 h-6 group-hover:drop-shadow-lg" />
                    </motion.div>
                    <span className="font-semibold text-lg group-hover:text-white transition-colors duration-300">
                      {feature.text}
                    </span>
                  </motion.div>
                </ClickSpark>
              ))}
            </motion.div>

            {/* Enhanced CTA Buttons with ClickSpark */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <ClickSpark sparkColor="#3b82f6" sparkCount={12} sparkRadius={40}>
                <motion.button
                  onClick={onGetStarted}
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-5 px-10 rounded-2xl flex items-center gap-4 neon-glow text-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Rocket className="w-7 h-7" />
                  </motion.div>
                  Start Analysis
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </motion.button>
              </ClickSpark>

              <ClickSpark sparkColor="#6b7280" sparkCount={8} sparkRadius={30}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-5 px-10 rounded-2xl flex items-center gap-4 border border-gray-600 hover:border-gray-500 text-xl transition-all duration-300 shadow-xl hover:shadow-gray-500/20"
                  onClick={() => window.open('https://github.com/Sagexd08/StealthScore', '_blank')}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Github className="w-6 h-6" />
                  </motion.div>
                  View on GitHub
                  <ExternalLink className="w-5 h-5" />
                </motion.button>
              </ClickSpark>

              <ClickSpark sparkColor="#8b5cf6" sparkCount={6} sparkRadius={25}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-button px-10 py-5 text-white hover:text-white flex items-center gap-4 text-xl hover:bg-white/20 transition-all duration-300 shadow-lg"
                  onClick={() => window.open('https://github.com/Sagexd08/StealthScore#readme', '_blank')}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Shield className="w-6 h-6" />
                  </motion.div>
                  Learn More
                </motion.button>
              </ClickSpark>
            </motion.div>

          {/* Stealth Score Section */}
          <motion.div
            ref={stealthScoreRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="mt-16"
          >
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 0.6 }}
              className="text-2xl font-bold text-center text-white mb-8"
            >
              <span className="text-gradient">Stealth Score</span> - Your Privacy Metrics
            </motion.h3>

            <AnimatedStats
              stats={[
                {
                  value: 256,
                  label: "AES-256 Encryption",
                  icon: <Lock className="w-8 h-8" />,
                  suffix: "-bit",
                  color: "green-400",
                  description: "Military-grade encryption"
                },
                {
                  value: 1.2,
                  label: "Analysis Time",
                  icon: <Zap className="w-8 h-8" />,
                  suffix: "s",
                  decimals: 1,
                  prefix: "< ",
                  color: "blue-400",
                  description: "Lightning-fast processing"
                },
                {
                  value: 100,
                  label: "Privacy Guaranteed",
                  icon: <Shield className="w-8 h-8" />,
                  suffix: "%",
                  color: "purple-400",
                  description: "Complete data protection"
                },
              ]}
              layout="grid"
              animated={true}
              cardVariant="glass"
              className="max-w-4xl mx-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal delay={0.2} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose <span className="text-gradient">StealthScore</span>?
            </h2>
          </ScrollReveal>

          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Eye,
                title: "Privacy-First Analysis",
                description: "Your pitch data never leaves your device. All processing happens locally with zero data storage.",
                color: "from-green-400 to-emerald-600",
                stats: { value: "0 bytes", label: "Data Stored", isText: true }
              },
              {
                icon: Brain,
                title: "AI-Powered Insights",
                description: "Advanced machine learning algorithms analyze your pitch structure, content, and delivery.",
                color: "from-blue-400 to-cyan-600",
                stats: { value: 95, label: "Accuracy Rate", suffix: "%" }
              },
              {
                icon: Shield,
                title: "Military-Grade Security",
                description: "256-bit AES encryption ensures your sensitive business information stays protected.",
                color: "from-purple-400 to-violet-600",
                stats: { value: "AES-256", label: "Encryption Standard", isText: true }
              },
              {
                icon: Zap,
                title: "Real-Time Feedback",
                description: "Get instant analysis and suggestions to improve your pitch effectiveness.",
                color: "from-yellow-400 to-orange-600",
                stats: { value: 1.8, label: "Second Analysis", prefix: "< ", suffix: "s", decimals: 1 }
              },
              {
                icon: Target,
                title: "Precision Scoring",
                description: "Detailed scoring system evaluates clarity, impact, and persuasiveness.",
                color: "from-red-400 to-pink-600",
                stats: { value: "8+", label: "Key Metrics", isText: true }
              },
              {
                icon: Globe,
                title: "Universal Compatibility",
                description: "Works with any pitch format - text, audio, or video presentations.",
                color: "from-indigo-400 to-blue-600",
                stats: { value: 100, label: "Format Support", suffix: "%" }
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-card p-8 group cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:shadow-2xl transition-all duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gradient transition-all duration-300">
                  {feature.title}
                </h3>

                <p className="text-white/70 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="text-center">
                    <div className={`text-2xl font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                      {feature.stats.isText ? (
                        feature.stats.value
                      ) : (
                        <CountUp
                          to={feature.stats.value as number}
                          duration={2}
                          delay={0.5 + index * 0.1}
                          suffix={feature.stats.suffix || ""}
                          prefix={feature.stats.prefix || ""}
                          decimals={feature.stats.decimals || 0}
                        />
                      )}
                    </div>
                    <div className="text-sm text-white/60">{feature.stats.label}</div>
                  </div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="text-white/40 group-hover:text-white/80 transition-colors duration-300"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-20 px-4 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal delay={0.2} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How <span className="text-gradient">StealthScore</span> Works
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Simple, secure, and powerful pitch analysis in just three steps
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-y-1/2 z-0"></div>
            <div className="hidden md:block absolute top-1/2 right-1/3 w-1/3 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform -translate-y-1/2 z-0"></div>

            {[
              {
                step: 1,
                icon: Upload,
                title: "Upload Your Pitch",
                description: "Securely upload your pitch deck, script, or record your presentation directly in the browser.",
                color: "from-blue-400 to-cyan-600",
                features: ["Text Analysis", "Audio Processing", "Video Support"]
              },
              {
                step: 2,
                icon: Brain,
                title: "AI Analysis",
                description: "Our advanced AI analyzes structure, content, delivery, and provides detailed insights.",
                color: "from-purple-400 to-violet-600",
                features: ["Content Analysis", "Structure Review", "Delivery Assessment"]
              },
              {
                step: 3,
                icon: TrendingUp,
                title: "Get Results",
                description: "Receive comprehensive feedback, scoring, and actionable recommendations for improvement.",
                color: "from-green-400 to-emerald-600",
                features: ["Detailed Scoring", "Improvement Tips", "Export Reports"]
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="relative z-10"
              >
                <div className="glass-card p-8 text-center group hover:scale-105 transition-all duration-300">
                  {/* Step Number */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-2xl`}
                  >
                    {step.step}
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="mb-6"
                  >
                    <step.icon className={`w-12 h-12 mx-auto bg-gradient-to-r ${step.color} bg-clip-text text-transparent`} />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gradient transition-all duration-300">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/70 mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {step.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.2) + (featureIndex * 0.1), duration: 0.4 }}
                        className="flex items-center justify-center gap-2 text-sm text-white/60"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {feature}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center mt-16"
          >
            <motion.button
              onClick={onGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl flex items-center gap-3 neon-glow text-lg mx-auto"
            >
              <Play className="w-6 h-6" />
              Try StealthScore Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials/Social Proof Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal delay={0.2} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by <span className="text-gradient">Innovators</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Join thousands of entrepreneurs who've improved their pitches with StealthScore
            </p>
          </ScrollReveal>

          {/* Trust Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {[
              { number: 10000, label: "Pitches Analyzed", suffix: "+", icon: TrendingUp },
              { number: 95, label: "Success Rate", suffix: "%", icon: Award },
              { number: 4.9, label: "User Rating", decimals: 1, icon: Star },
              { number: 50, label: "Countries", suffix: "+", icon: Globe }
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="inline-block mb-4"
                >
                  <metric.icon className="w-8 h-8 text-blue-400 mx-auto" />
                </motion.div>
                <div className="text-3xl font-bold text-white mb-2">
                  <CountUp
                    to={metric.number}
                    duration={2.5}
                    delay={0.5 + index * 0.2}
                    suffix={metric.suffix || ""}
                    decimals={metric.decimals || 0}
                    separator=","
                    className="text-gradient"
                  />
                </div>
                <div className="text-white/70 text-sm">{metric.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Founder, TechStart",
                avatar: "SC",
                content: "StealthScore helped me refine my pitch and secure $2M in Series A funding. The AI insights were incredibly valuable and the privacy protection gave me complete confidence.",
                rating: 5,
                color: "from-pink-400 to-rose-600"
              },
              {
                name: "Marcus Rodriguez",
                role: "CEO, InnovateLab",
                avatar: "MR",
                content: "The privacy-first approach of StealthScore gave me confidence to analyze sensitive business information. The military-grade encryption is exactly what we needed!",
                rating: 5,
                color: "from-blue-400 to-cyan-600"
              },
              {
                name: "Emily Watson",
                role: "Startup Mentor",
                avatar: "EW",
                content: "I recommend StealthScore to all my mentees. It's like having a pitch expert available 24/7 with complete privacy protection.",
                rating: 5,
                color: "from-green-400 to-emerald-600"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card p-8 group"
              >
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (index * 0.2) + (i * 0.1), duration: 0.3 }}
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>

                {/* Content */}
                <p className="text-white/80 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${testimonial.color} flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {testimonial.avatar}
                  </motion.div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-white/60 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Enhanced Final Call-to-Action Section */}
      <section className="relative z-10 py-32 px-4 bg-gradient-to-b from-transparent via-slate-900/90 to-slate-900">
        <div className="max-w-5xl mx-auto text-center">
          <ScrollReveal delay={0.2}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/20 rounded-3xl p-16 relative overflow-hidden"
            >
              {/* Enhanced Background Animation */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.3, 1]
                }}
                transition={{
                  rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                  scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute inset-0 bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-pink-500/15 blur-3xl"
              />

              {/* Floating particles effect */}
              <motion.div
                animate={{
                  y: [-20, 20, -20],
                  x: [-10, 10, -10]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-10 left-10 w-4 h-4 bg-blue-400/30 rounded-full blur-sm"
              />
              <motion.div
                animate={{
                  y: [20, -20, 20],
                  x: [10, -10, 10]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute bottom-10 right-10 w-6 h-6 bg-purple-400/30 rounded-full blur-sm"
              />

              <div className="relative z-10">
                {/* Enhanced Icon Animation */}
                <motion.div
                  animate={{
                    y: [-8, 8, -8],
                    rotateY: [0, 360, 0]
                  }}
                  transition={{
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="mb-10"
                >
                  <div className="relative">
                    <Shield className="w-24 h-24 text-blue-400 mx-auto mb-6" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 w-24 h-24 mx-auto border-2 border-blue-400/30 rounded-full"
                    />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight"
                >
                  Ready to <span className="text-gradient bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Transform</span> Your Pitch?
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                  Join the revolution of privacy-preserving AI. Analyze your pitch with confidence,
                  knowing your data stays <span className="text-green-400 font-semibold">100% secure</span> and <span className="text-blue-400 font-semibold">completely private</span>.
                </motion.p>

                {/* Enhanced Feature Highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
                >
                  {[
                    {
                      icon: Lock,
                      text: "100% Private",
                      color: "text-green-400",
                      bgColor: "bg-green-500/20",
                      description: "Zero data storage"
                    },
                    {
                      icon: Zap,
                      text: "Instant Results",
                      color: "text-blue-400",
                      bgColor: "bg-blue-500/20",
                      description: "< 2 second analysis"
                    },
                    {
                      icon: Heart,
                      text: "Free to Use",
                      color: "text-pink-400",
                      bgColor: "bg-pink-500/20",
                      description: "No signup required"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.text}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className={`${feature.bgColor} backdrop-blur-sm border border-white/20 rounded-2xl p-6 transition-all duration-300`}
                    >
                      <feature.icon className={`w-8 h-8 ${feature.color} mx-auto mb-3`} />
                      <h3 className="text-white font-bold text-lg mb-2">{feature.text}</h3>
                      <p className="text-white/70 text-sm">{feature.description}</p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Enhanced CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="mb-10"
                >
                  <motion.button
                    onClick={onGetStarted}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-6 px-12 rounded-2xl flex items-center gap-4 text-xl mx-auto transition-all duration-300 border border-white/20"
                  >
                    <Play className="w-7 h-7" />
                    Start Your Analysis Now
                    <ArrowRight className="w-6 h-6" />
                  </motion.button>

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="text-white/60 text-lg mt-4"
                  >
                    No signup required • Completely free • Takes less than 30 seconds
                  </motion.p>
                </motion.div>

                {/* Enhanced Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="pt-8 border-t border-white/20"
                >
                  <div className="flex flex-wrap items-center justify-center gap-8 text-white/50">
                    <motion.div
                      whileHover={{ scale: 1.1, color: "#10b981" }}
                      className="flex items-center gap-3 transition-colors duration-300"
                    >
                      <Shield className="w-5 h-5" />
                      <span className="text-sm font-medium">AES-256 Encryption</span>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1, color: "#3b82f6" }}
                      className="flex items-center gap-3 transition-colors duration-300"
                    >
                      <Eye className="w-5 h-5" />
                      <span className="text-sm font-medium">Zero Data Collection</span>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1, color: "#f59e0b" }}
                      className="flex items-center gap-3 transition-colors duration-300"
                    >
                      <Zap className="w-5 h-5" />
                      <span className="text-sm font-medium">Lightning Fast</span>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>
    </div>
    </ClickSpark>
  )
}

export default LandingPage
