import { generateMetadata as generateMeta } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMeta({
    title: 'Contact Us',
    description: 'Get in touch with the Moneage team. We\'d love to hear from you. Send us your questions, feedback, or collaboration inquiries.',
    keywords: ['contact finblog', 'get in touch', 'financial blog contact'],
});

export default function ContactPage() {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-navy mb-4">Contact Us</h1>
                <p className="text-lg text-slate-600">Get in touch with our team</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-8">
                <form className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">
                            Subject
                        </label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="What is this about?"
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows={6}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Your message..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                    >
                        Send Message
                    </button>
                </form>


            </div>
        </div>
    );
}
