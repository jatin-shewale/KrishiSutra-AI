import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa'
import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-16">
          <h1 className="text-5xl font-bold gradient-text mb-4">Contact Us</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">Have questions? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
          >
            {[
              { icon: FaMapMarkerAlt, title: 'Address', text: 'Nashik, Maharashtra, India' },
              { icon: FaPhone, title: 'Phone', text: '+91 98765 43210' },
              { icon: FaEnvelope, title: 'Email', text: 'contact@krishisutra.ai' },
            ].map(({icon: Icon, title, text}) => (
              <div key={title} className="glass p-5 rounded-2xl">
                <Icon className="text-emerald-400 text-xl mb-3" />
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-gray-400">{text}</p>
              </div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
          >
            <div className="glass p-8 rounded-2xl">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-xl font-semibold text-emerald-400 mb-2">Message Sent!</h3>
                  <p className="text-gray-400">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Name</label>
                      <input
                        type="text" required
                        className="w-full px-4 py-3 glass rounded-xl bg-transparent border border-white/10 focus:border-emerald-500/50 outline-none text-sm"
                        placeholder="Your name"
                        value={form.name} onChange={e => setForm({...form,name:e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Email</label>
                      <input
                        type="email" required
                        className="w-full px-4 py-3 glass rounded-xl bg-transparent border border-white/10 focus:border-emerald-500/50 outline-none text-sm"
                        placeholder="your@email.com"
                        value={form.email} onChange={e => setForm({...form,email:e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Subject</label>
                    <input
                      type="text" required
                      className="w-full px-4 py-3 glass rounded-xl bg-transparent border border-white/10 focus:border-emerald-500/50 outline-none text-sm"
                      placeholder="How can we help?"
                      value={form.subject} onChange={e => setForm({...form,subject:e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Message</label>
                    <textarea
                      required rows={5}
                      className="w-full px-4 py-3 glass rounded-xl bg-transparent border border-white/10 focus:border-emerald-500/50 outline-none text-sm resize-none"
                      placeholder="Tell us more..."
                      value={form.message} onChange={e => setForm({...form,message:e.target.value})}
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition flex items-center gap-2"
                  >
                    <FaPaperPlane /> Send Message
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
