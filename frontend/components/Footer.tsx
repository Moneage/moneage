import Link from 'next/link';
import { Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-navy text-white mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Moneage</h3>
                        <p className="text-blue-100 text-sm leading-relaxed">
                            Your trusted source for expert financial analysis, market trends, and personal finance tips.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3 mt-4">
                            <a href="#" className="bg-blue-800 p-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="bg-blue-800 p-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="bg-blue-800 p-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-blue-100 text-sm">
                            <li>
                                <Link href="/" className="hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="font-semibold mb-4">Categories</h4>
                        <ul className="space-y-2 text-blue-100 text-sm">
                            <li>
                                <Link href="/category/investing" className="hover:text-white transition-colors">
                                    Investing
                                </Link>
                            </li>
                            <li>
                                <Link href="/category/personal-finance" className="hover:text-white transition-colors">
                                    Personal Finance
                                </Link>
                            </li>
                            <li>
                                <Link href="/category/economy" className="hover:text-white transition-colors">
                                    Economy
                                </Link>
                            </li>
                            <li>
                                <Link href="/category/money" className="hover:text-white transition-colors">
                                    Money
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-blue-100 text-sm">
                            <li>
                                <Link href="/privacy" className="hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-white transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-100 text-sm">
                    <p>&copy; {new Date().getFullYear()} Moneage. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
