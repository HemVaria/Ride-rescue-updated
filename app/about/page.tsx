"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { Tilt } from "@/components/ui/tilt"
import { Users, Wrench, Clock, Shield, Trophy, Target, ArrowRight } from "lucide-react"
import Link from "next/link"
import { TextPressure } from "@/components/ui/interactive-text-pressure"

export default function AboutPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    }

    const stats = [
        { label: "Happy Customers", value: "5,000+", icon: Users, color: "text-blue-400", bg: "bg-blue-500/20" },
        { label: "Expert Mechanics", value: "50+", icon: Wrench, color: "text-emerald-400", bg: "bg-emerald-500/20" },
        { label: "Years of Service", value: "10+", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/20" },
        { label: "Successful Rescues", value: "12k+", icon: Trophy, color: "text-purple-400", bg: "bg-purple-500/20" },
    ]

    const values = [
        {
            title: "Reliability First",
            description: "We understand that when you're stranded, you need someone you can count on. Our team is committed to showing up on time, every time.",
            icon: Shield,
        },
        {
            title: "Expert Care",
            description: "Your vehicle is in safe hands. Our mechanics are certified professionals with years of experience in handling all types of automotive issues.",
            icon: Wrench,
        },
        {
            title: "Customer Focus",
            description: "We're not just fixing cars; we're helping people. Our service is built around providing a stress-free and transparent experience for every customer.",
            icon: Users,
        },
    ]

    return (
        <div className="min-h-screen text-slate-100 pt-24 pb-12">
            {/* Hero Section */}
            <section className="relative px-6 mb-24">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-6"
                    >
                        <Badge className="bg-emerald-500/20 text-emerald-400 mb-4 px-4 py-1 text-sm border-emerald-500/30">
                            Our Story
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            Driving Peace of Mind
                        </h1>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            Ride Rescue was born from a simple mission: to make roadside assistance accessible, reliable, and transparent for everyone in Gujarat.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Grid */}
            <section className="px-6 mb-24">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6"
                    >
                        {stats.map((stat, index) => (
                            <motion.div key={index} variants={itemVariants}>
                                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:bg-slate-800/50 transition-colors text-center h-full">
                                    <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                                        <div className={`p-3 rounded-full ${stat.bg} mb-4`}>
                                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                                        <p className="text-slate-400 text-sm">{stat.label}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="px-6 mb-24 bg-slate-900/30 py-20 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                                More Than Just a <span className="text-emerald-400">Towing Service</span>
                            </h2>
                            <div className="space-y-6 text-slate-300 leading-relaxed">
                                <p>
                                    Founded in 2024, Ride Rescue started with a single tow truck and a vision to revolutionize the roadside assistance industry. We noticed that drivers often faced long wait times, hidden costs, and unprofessional service during emergencies.
                                </p>
                                <p>
                                    Today, we have grown into a comprehensive network of certified mechanics and service providers, leveraging technology to connect stranded drivers with the nearest help in minutes.
                                </p>
                                <div className="flex items-center gap-4 pt-4">
                                    <Link href="/services">
                                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                            Explore Services
                                        </Button>
                                    </Link>
                                    <Link href="/contact">
                                        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                                            Contact Us
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            {values.map((value, index) => (
                                <motion.div key={index} variants={itemVariants}>
                                    <Tilt rotationFactor={5} isRevese>
                                        <Card className="bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 transition-colors">
                                            <CardContent className="p-6 flex gap-4">
                                                <div className="shrink-0">
                                                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
                                                        <value.icon className="w-6 h-6 text-emerald-400" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                                                    <p className="text-slate-400 text-sm leading-relaxed">{value.description}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Tilt>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-br from-emerald-900/40 via-slate-900 to-slate-900 p-12 rounded-3xl border border-emerald-500/20 shadow-2xl"
                    >
                        <Target className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-white mb-4">Ready to Ride with Confidence?</h2>
                        <p className="text-slate-300 mb-8">
                            Join our community of drivers who trust Ride Rescue for their automotive needs.
                        </p>
                        <Link href="/dashboard">
                            <ShimmerButton className="mx-auto shadow-2xl [--bg:linear-gradient(90deg,#10b981,#06b6d4)]">
                                <span className="flex items-center justify-center gap-2 text-lg font-medium tracking-tight text-white">
                                    Get Started Now
                                    <ArrowRight className="w-5 h-5" />
                                </span>
                            </ShimmerButton>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
