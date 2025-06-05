import React, { useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Shield, Sparkles, Lock, Zap, ArrowRight, Play, Github, ExternalLink,
         Eye, Brain, Users, Star, CheckCircle, Target, Layers, Globe,
         TrendingUp, Award, MessageSquare, Heart, Upload } from 'lucide-react'
import TrueFocus from './TrueFocus'
import ScrollReveal from './ScrollReveal'
import Squares from './Squares'
import CountUp from './CountUp'
import AnimatedLogo from './AnimatedLogo'
import AnimatedChart from './AnimatedChart'
import AnimatedStats from './AnimatedStats'
import PerformanceMonitor from './PerformanceMonitor'
import { gsap } from 'gsap'

interface LandingPageProps {
  onGetStarted: () => void
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const featuresRef = useRef<HTMLDivElement>(null)
  const stealthScoreRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  useEffect(() => {
    // GSAP animations for enhanced visual effects
    const tl = gsap.timeline({ repeat: -1, yoyo: true })

    // Floating animation for feature cards
    if (featuresRef.current) {
      gsap.set(featuresRef.current.children, { y: 0 })
      tl.to(featuresRef.current.children, {
        y: -10,
        duration: 2,
        stagger: 0.2,
        ease: "power2.inOut"
      })
    }
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Squares Background */}
      <Squares 
        direction="diagonal"
        speed={0.5}
        borderColor="rgba(59, 130, 246, 0.2)"
        squareSize={60}
        hoverFillColor="rgba(59, 130, 246, 0.1)"
      />
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Animated Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <AnimatedLogo
              size={96}
              variant="custom"
              color="#3b82f6"
              animated={true}
              glowEffect={true}
              className="mx-auto"
            />
          </motion.div>

          {/* Main Title with TrueFocus */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-8"
          >
            <TrueFocus 
              sentence="PitchGuard Lite"
              manualMode={false}
              blurAmount={5}
              borderColor="#3b82f6"
              animationDuration={2}
              pauseBetweenAnimations={3}
              className="mb-4"
            />
          </motion.div>

          {/* Subtitle with ScrollReveal */}
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={5}
            blurStrength={10}
            delay={0.5}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              When does a startup die? When it runs out of funding? No! When the market shifts? 
              No! When the team gives up? No! A startup dies when its pitch is forgotten! 
              <span className="text-gradient font-semibold"> Transform your pitch with AI-powered analysis.</span>
            </h2>
          </ScrollReveal>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {[
              { icon: Lock, text: "Military-Grade Encryption", color: "bg-green-500/20 text-green-300" },
              { icon: Zap, text: "Real-Time AI Analysis", color: "bg-blue-500/20 text-blue-300" },
              { icon: Shield, text: "Zero Data Storage", color: "bg-purple-500/20 text-purple-300" },
              { icon: Sparkles, text: "Advanced Animations", color: "bg-yellow-500/20 text-yellow-300" },
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`glass-card px-6 py-3 flex items-center gap-3 ${feature.color} border border-white/20`}
              >
                <feature.icon className="w-5 h-5" />
                <span className="font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              onClick={onGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl flex items-center gap-3 neon-glow text-lg"
            >
              <Play className="w-6 h-6" />
              Start Analysis
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-4 px-8 rounded-2xl flex items-center gap-3 border border-gray-600 hover:border-gray-500 text-lg transition-all duration-300"
              onClick={() => window.open('https://github.com/Sagexd08/PitchGuard', '_blank')}
            >
              <Github className="w-5 h-5" />
              View on GitHub
              <ExternalLink className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button px-8 py-4 text-white hover:text-white flex items-center gap-3 text-lg"
              onClick={() => window.open('https://github.com/Sagexd08/PitchGuard#readme', '_blank')}
            >
              <Shield className="w-5 h-5" />
              Learn More
            </motion.button>
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
                  label: "AES Encryption Bits",
                  icon: <Lock className="w-8 h-8" />,
                  suffix: "-bit",
                  color: "green-400",
                  description: "Military-grade encryption"
                },
                {
                  value: 1.8,
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
              Why Choose <span className="text-gradient">PitchGuard</span>?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Advanced AI-powered pitch analysis with military-grade privacy protection
            </p>
          </ScrollReveal>

          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Eye,
                title: "Privacy-First Analysis",
                description: "Your pitch data never leaves your device. All processing happens locally with zero data storage.",
                color: "from-green-400 to-emerald-600",
                stats: { value: 0, label: "Data Stored" }
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
                stats: { value: 256, label: "Bit Encryption" }
              },
              {
                icon: Zap,
                title: "Real-Time Feedback",
                description: "Get instant analysis and suggestions to improve your pitch effectiveness.",
                color: "from-yellow-400 to-orange-600",
                stats: { value: 2, label: "Second Analysis", prefix: "< ", decimals: 1 }
              },
              {
                icon: Target,
                title: "Precision Scoring",
                description: "Detailed scoring system evaluates clarity, impact, and persuasiveness.",
                color: "from-red-400 to-pink-600",
                stats: { value: 12, label: "Metrics Analyzed" }
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
                      <CountUp
                        to={feature.stats.value}
                        duration={2}
                        delay={0.5 + index * 0.1}
                        suffix={feature.stats.suffix || ""}
                        prefix={feature.stats.prefix || ""}
                        decimals={feature.stats.decimals || 0}
                      />
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
              How <span className="text-gradient">PitchGuard</span> Works
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
              Try PitchGuard Now
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
              Join thousands of entrepreneurs who've improved their pitches with PitchGuard
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
                content: "PitchGuard helped me refine my pitch and secure $2M in Series A funding. The AI insights were incredibly valuable.",
                rating: 5,
                color: "from-pink-400 to-rose-600"
              },
              {
                name: "Marcus Rodriguez",
                role: "CEO, InnovateLab",
                avatar: "MR",
                content: "The privacy-first approach gave me confidence to analyze sensitive business information. Highly recommended!",
                rating: 5,
                color: "from-blue-400 to-cyan-600"
              },
              {
                name: "Emily Watson",
                role: "Startup Mentor",
                avatar: "EW",
                content: "I recommend PitchGuard to all my mentees. It's like having a pitch expert available 24/7.",
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

      {/* Analytics Dashboard Preview */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal delay={0.2} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Real-Time <span className="text-gradient">Analytics</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Visualize your pitch performance with interactive charts and detailed insights
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Pitch Performance</h3>
              <AnimatedChart
                data={[85, 92, 78, 96, 88]}
                labels={['Clarity', 'Impact', 'Structure', 'Delivery', 'Overall']}
                type="bar"
                color="#3b82f6"
                height={200}
                width={280}
                animated={true}
              />
            </motion.div>

            {/* Success Rate Chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Success Trends</h3>
              <AnimatedChart
                data={[65, 72, 78, 85, 92]}
                labels={['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']}
                type="line"
                color="#10b981"
                height={200}
                width={280}
                animated={true}
              />
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Score Distribution</h3>
              <AnimatedChart
                data={[30, 25, 20, 15, 10]}
                labels={['Excellent', 'Good', 'Average', 'Fair', 'Poor']}
                type="pie"
                color="#8b5cf6"
                height={200}
                width={280}
                animated={true}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final Call-to-Action Section */}
      <section className="relative z-10 py-20 px-4 bg-gradient-to-b from-transparent via-slate-900/80 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal delay={0.2}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-card p-12 relative overflow-hidden"
            >
              {/* Background Animation */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"
              />

              <div className="relative z-10">
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-8"
                >
                  <Shield className="w-20 h-20 text-blue-400 mx-auto mb-6" />
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to <span className="text-gradient">Transform</span> Your Pitch?
                </h2>

                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                  Join the revolution of privacy-preserving AI. Analyze your pitch with confidence,
                  knowing your data stays secure and private.
                </p>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  {[
                    { icon: Lock, text: "100% Private", color: "text-green-400" },
                    { icon: Zap, text: "Instant Results", color: "text-blue-400" },
                    { icon: Heart, text: "Free to Use", color: "text-pink-400" }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.text}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="flex items-center justify-center gap-3"
                    >
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                      <span className="text-white font-medium">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <motion.button
                    onClick={onGetStarted}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-10 rounded-2xl flex items-center gap-3 neon-glow text-lg shadow-2xl"
                  >
                    <Play className="w-6 h-6" />
                    Start Your Analysis
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-white/60 text-sm"
                  >
                    No signup required • Completely free
                  </motion.div>
                </div>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="mt-12 pt-8 border-t border-white/10"
                >
                  <div className="flex items-center justify-center gap-8 text-white/40">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Military-Grade Security</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">Zero Data Collection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm">Instant Processing</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
