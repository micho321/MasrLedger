import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Wallet, PieChart, Shield, TrendingUp, ArrowRight, CheckCircle,
    Menu, X, Clock, User, Facebook, Twitter, Linkedin, Star,
    Smartphone, BarChart3, Lock
} from 'lucide-react';

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* 1. Navbar (Sticky) */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
                <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2 font-bold text-xl text-primary cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-primary" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">MasrLedger</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                        <button onClick={() => scrollToSection('features')} className="hover:text-primary transition-colors">Features</button>
                        <button onClick={() => scrollToSection('how-it-works')} className="hover:text-primary transition-colors">How It Works</button>
                        <button onClick={() => scrollToSection('benefits')} className="hover:text-primary transition-colors">Why Us</button>
                        <button onClick={() => scrollToSection('testimonials')} className="hover:text-primary transition-colors">Testimonials</button>
                    </div>

                    {/* Desktop Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                            Log In
                        </Link>
                        <Link to="/register" className="btn btn-primary px-5 py-2.5 shadow-lg shadow-indigo-200/50 hover:shadow-indigo-200 transition-all transform hover:-translate-y-0.5">
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 p-4 flex flex-col gap-4 shadow-lg animate-fade-in">
                        <button onClick={() => scrollToSection('features')} className="text-left p-2 hover:bg-gray-50 rounded-lg">Features</button>
                        <button onClick={() => scrollToSection('how-it-works')} className="text-left p-2 hover:bg-gray-50 rounded-lg">How It Works</button>
                        <button onClick={() => scrollToSection('benefits')} className="text-left p-2 hover:bg-gray-50 rounded-lg">Why Us</button>
                        <hr className="border-gray-100" />
                        <Link to="/login" className="text-center p-2 text-primary font-medium">Log In</Link>
                        <Link to="/register" className="btn btn-primary w-full justify-center">Get Started</Link>
                    </div>
                )}
            </nav>

            {/* 2. Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-white">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-primary text-sm font-semibold mb-8 animate-fade-in">
                        <CheckCircle size={16} className="text-secondary" />
                        <span>Trusted by 500+ Egyptian Freelancers</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-gray-900 mx-auto max-w-4xl leading-tight">
                        Financial clarity for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">independent Egyptians</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Manage your freelance income, track expenses, and prepare for tax season without the headache. Built specifically for the Egyptian gig economy.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                        <Link to="/register" className="btn btn-primary text-lg px-8 py-4 h-auto shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30">
                            Start for Free <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                        <button onClick={() => scrollToSection('features')} className="btn btn-secondary text-lg px-8 py-4 h-auto bg-white hover:bg-gray-50 text-gray-700 border border-gray-200">
                            Learn More
                        </button>
                    </div>

                    {/* Dashboard Preview Abstract */}
                    <div className="relative max-w-5xl mx-auto mt-8">
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-20 h-full bottom-0"></div>
                        <div className="border border-gray-200/60 rounded-2xl shadow-2xl bg-white/50 backdrop-blur-sm p-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                            <div className="bg-gray-100 rounded-xl aspect-[16/9] flex items-center justify-center text-gray-300 relative overflow-hidden">
                                <div className="absolute inset-0 grid grid-cols-12 gap-4 p-6">
                                    {/* Sidebar */}
                                    <div className="col-span-2 bg-white rounded-lg opacity-60"></div>
                                    {/* Main Content */}
                                    <div className="col-span-10 flex flex-col gap-4">
                                        <div className="h-20 bg-white rounded-lg opacity-80 animate-pulse"></div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="h-32 bg-indigo-50 rounded-lg"></div>
                                            <div className="h-32 bg-emerald-50 rounded-lg"></div>
                                            <div className="h-32 bg-purple-50 rounded-lg"></div>
                                        </div>
                                        <div className="flex-1 bg-white rounded-lg"></div>
                                    </div>
                                </div>
                                <span className="absolute text-sm font-medium text-gray-400 bottom-4">Dashboard Preview</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Feature Cards (Features) */}
            <section id="features" className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to grow</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Powerful tools designed to replace your messy spreadsheets.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:border-indigo-100 transition-all group">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Track Income</h3>
                            <p className="text-gray-600 leading-relaxed">Record every gig and project payment. Categorize sources and visualize your revenue growth over time with intuitive charts.</p>
                        </div>

                        <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:border-emerald-100 transition-all group">
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                                <PieChart className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Manage Expenses</h3>
                            <p className="text-gray-600 leading-relaxed">Keep track of every business cost. Effortlessly separate personal expenses from work deductions to maximize your savings.</p>
                        </div>

                        <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:border-orange-100 transition-all group">
                            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-warning mb-6 group-hover:scale-110 transition-transform">
                                <Shield className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Tax Estimator</h3>
                            <p className="text-gray-600 leading-relaxed">Never be surprised by tax season. Get real-time estimates based on current Egyptian tax brackets and regulations.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. How It Works */}
            <section id="how-it-works" className="py-24 bg-gray-50 border-y border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Simple Process</span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How MasrLedger Works</h2>
                        <p className="text-xl text-gray-600">Get up and running in minutes, not days.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto relative">
                        {/* Connecting Line (Desktop Only) */}
                        <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gray-200 -z-0 transform translate-y-4"></div>

                        {[
                            {
                                icon: User,
                                title: "1. Sign Up Free",
                                desc: "Create your account in 2 minutes. No credit card required."
                            },
                            {
                                icon: Wallet,
                                title: "2. Add Transactions",
                                desc: "Log your income and expenses as they happen on the go."
                            },
                            {
                                icon: BarChart3,
                                title: "3. View Insights",
                                desc: "See your monthly summary, profit margins, and tax estimates."
                            },
                            {
                                icon: CheckCircle,
                                title: "4. Get Help",
                                desc: "Connect with certified accountants when you need complex advice."
                            }
                        ].map((step, index) => (
                            <div key={index} className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-white border-4 border-gray-50 rounded-full flex items-center justify-center text-primary shadow-sm mb-6">
                                    <step.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                <p className="text-gray-600 text-sm">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Benefits */}
            <section id="benefits" className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-16 max-w-6xl mx-auto">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Egyptian freelancers choose MasrLedger</h2>
                            <p className="text-xl text-gray-600 mb-8">
                                We understand the unique challenges of the Egyptian market. Our platform is tailored to help you succeed locally.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    { icon: Smartphone, label: "Simple Dashboard", text: "No accounting degree required." },
                                    { icon: Wallet, label: "Built for Egypt", text: "Aligned with local market needs." },
                                    { icon: Lock, label: "Tax Ready", text: "Automatic estimations." },
                                    { icon: User, label: "Accountant Access", text: "Expert help on demand." },
                                    { icon: Clock, label: "Always Available", text: "Access anywhere, anytime." },
                                    { icon: Shield, label: "Secure & Private", text: "Bank-level data security." }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-indigo-50/50 transition-colors">
                                        <div className="shrink-0 mt-1">
                                            <item.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{item.label}</h4>
                                            <p className="text-sm text-gray-600">{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-3xl transform rotate-3 blur-3xl"></div>
                            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-2xl">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                                        <div>
                                            <p className="text-gray-400 text-sm">Total Revenue (Oct)</p>
                                            <p className="text-3xl font-bold">EGP 45,200</p>
                                        </div>
                                        <TrendingUp className="text-emerald-400 w-8 h-8" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">🎨</div>
                                                <div>
                                                    <p className="font-medium">Logo Project</p>
                                                    <p className="text-xs text-gray-400">Freelance</p>
                                                </div>
                                            </div>
                                            <span className="text-emerald-400 font-bold">+ EGP 8,500</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">💻</div>
                                                <div>
                                                    <p className="font-medium">Software License</p>
                                                    <p className="text-xs text-gray-400">Expense</p>
                                                </div>
                                            </div>
                                            <span className="text-white font-bold">- EGP 450</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 mt-4 bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                        <div className="flex items-center gap-2 text-orange-400 text-sm font-medium mb-1">
                                            <Shield className="w-4 h-4" /> Tax Estimate Update
                                        </div>
                                        <p className="text-gray-300 text-sm">You've entered the 2.5% bracket based on recent income.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Testimonials */}
            <section id="testimonials" className="py-24 bg-indigo-900 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Egyptian independent workers</h2>
                        <div className="flex justify-center gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />)}
                        </div>
                        <p className="text-indigo-200">Join the community transforming their financial future.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                name: "Ahmed M.",
                                role: "Graphic Designer",
                                quote: "Finally, an app that understands how we work. The tax estimator alone saved me hours of research."
                            },
                            {
                                name: "Sara K.",
                                role: "E-commerce Owner",
                                quote: "I used to track everything in a notebook. switching to MasrLedger made my business feel professional and organized."
                            },
                            {
                                name: "Mohamed R.",
                                role: "Software Consultant",
                                quote: "Clean, simple, and effective. The ability to request accountant help directly from the dashboard is a game changer."
                            }
                        ].map((t, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-indigo-800/50 backdrop-blur-sm border border-indigo-700/50 hover:bg-indigo-800 transition-colors">
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />)}
                                </div>
                                <p className="text-indigo-100 text-lg mb-6 leading-relaxed">"{t.quote}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold">{t.name}</p>
                                        <p className="text-sm text-indigo-300">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Pricing (Simple) */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12">Simple Pricing</h2>
                    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-primary relative">
                        <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wide">
                            Most Popular
                        </div>
                        <div className="p-8">
                            <h3 className="text-2xl font-bold mb-2">Free Forever</h3>
                            <p className="text-gray-600 mb-6">For individuals just starting out</p>
                            <div className="text-5xl font-bold text-gray-900 mb-6">EGP 0<span className="text-lg text-gray-500 font-normal">/mo</span></div>

                            <ul className="space-y-4 mb-8 text-left max-w-xs mx-auto">
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                                    <span>Unlimited Income Tracking</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                                    <span>Basic Expense Management</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                                    <span>Basic Tax Estimator</span>
                                </li>
                            </ul>

                            <Link to="/register" className="btn btn-primary w-full py-4 text-lg justify-center">
                                Start Free Now
                            </Link>
                            <p className="mt-4 text-xs text-gray-500">No credit card required</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. CTA Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-indigo-600 rounded-3xl p-12 md:p-20 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to take control?</h2>
                            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                                Join 500+ Egyptian freelancers managing their money smarter with MasrLedger.
                            </p>
                            <Link to="/register" className="btn bg-white text-primary text-lg px-10 py-4 h-auto hover:bg-indigo-50 shadow-xl border-none">
                                Get Started Free <ArrowRight className="ml-2" />
                            </Link>
                            <p className="mt-6 text-sm text-indigo-200 opacity-80">Takes less than 2 minutes to set up.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 9. Footer */}
            <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 font-bold text-xl text-primary mb-4">
                                <Wallet className="w-6 h-6" />
                                <span>MasrLedger</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                                Financial clarity for independent Egyptians. Built for the local gig economy.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="text-gray-400 hover:text-primary"><Twitter className="w-5 h-5" /></a>
                                <a href="#" className="text-gray-400 hover:text-primary"><Facebook className="w-5 h-5" /></a>
                                <a href="#" className="text-gray-400 hover:text-primary"><Linkedin className="w-5 h-5" /></a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4 text-gray-900">Product</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><button onClick={() => scrollToSection('features')} className="hover:text-primary">Features</button></li>
                                <li><a href="#" className="hover:text-primary">Pricing</a></li>
                                <li><a href="#" className="hover:text-primary">Accountants</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4 text-gray-900">Company</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-primary">About Us</a></li>
                                <li><a href="#" className="hover:text-primary">Blog</a></li>
                                <li><a href="#" className="hover:text-primary">Careers</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4 text-gray-900">Support</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
                        <p>© 2025 MasrLedger. Tailored for the Egyptian market.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
