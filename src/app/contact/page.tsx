"use client";

import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <div className="bg-gray-50 py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">Get in Touch</h1>
        <p className="text-gray-500 mt-4 max-w-2xl mx-auto font-medium text-lg">
          {/* We're වෙනුවට We&apos;re භාවිතා කර ඇත */}
          Have a question about our slippers or an order? We&apos;re here to help you walk in comfort.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-wider mb-6">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Call Us</p>
                    <p className="text-lg font-bold text-gray-800">+94 77 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Email Us</p>
                    <p className="text-lg font-bold text-gray-800">hello@reinastore.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Visit Store</p>
                    <p className="text-lg font-bold text-gray-800 leading-relaxed">
                      123 Reina Street, <br />
                      Colombo 03, Sri Lanka.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof/Working Hours */}
            <div className="p-8 bg-blue-600 rounded-4xl text-white">
              <h3 className="font-black uppercase tracking-widest mb-2">Working Hours</h3>
              <p className="opacity-90 font-medium">Monday - Saturday: 9:00 AM - 7:00 PM</p>
              <p className="opacity-90 font-medium mt-1">Sunday: Closed</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-100 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <MessageSquare className="text-blue-600" />
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-wide">Send a Message</h3>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Your Name</label>
                  <input type="text" placeholder="John Doe" className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Email</label>
                  <input type="email" placeholder="john@example.com" className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-800" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Subject</label>
                <input type="text" placeholder="How can we help?" className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-800" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Message</label>
                <textarea rows={4} placeholder="Type your message here..." className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-800 resize-none"></textarea>
              </div>

              <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                SEND MESSAGE <Send size={20} />
              </button>
            </form>
          </div>

        </div>
      </div>
      
      {/* Simple Map Placeholder */}
      <div className="w-full h-100 bg-gray-100 relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58290458315!2d79.78616403222224!3d6.92183352733979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a70ad%3A0x2db3513fa168c16d!2sColombo!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk" 
            width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
      </div>
    </div>
  );
}