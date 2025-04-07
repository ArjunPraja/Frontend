import React, { useState } from "react";
import axios from "axios";
import { Phone, Mail, MapPin, Send, User, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

function PContact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post("http://localhost:5000/api/contact", form);
      setSubmitSuccess(true);
      setForm({ name: "", email: "", number: "", message: "" });
      
      // Reset success state after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-24 bg-gradient-to-br from-gray-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Animated Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-lime-400">Connect</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or need assistance? Our team is ready to help you with anything you need.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row justify-center items-center gap-10">
          {/* Form Container - Glass Morphism Effect */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full max-w-2xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20"
          >
            <div className="p-1 bg-gradient-to-r from-green-400 to-lime-300">
              <div className="bg-white/95 p-8 sm:p-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <MessageSquare className="text-green-500" />
                  Send us a message
                </h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <InputField 
                    label="Your Name" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    type="text" 
                    placeholder="John Doe" 
                    icon={<User size={18} className="text-green-500" />}
                  />
                  
                  <InputField 
                    label="Email Address" 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    type="email" 
                    placeholder="your@email.com" 
                    icon={<Mail size={18} className="text-green-500" />}
                  />
                  
                  <InputField 
                    label="Phone Number" 
                    name="number" 
                    value={form.number} 
                    onChange={handleChange} 
                    type="tel" 
                    placeholder="+1 (123) 456-7890" 
                    icon={<Phone size={18} className="text-green-500" />}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <MessageSquare size={16} className="text-green-500" />
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      placeholder="How can we help you?"
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 resize-none bg-white/50"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex justify-center items-center gap-2 py-4 px-6 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 ${
                        isSubmitting 
                          ? 'bg-gray-400' 
                          : 'bg-gradient-to-r from-green-500 to-lime-400 hover:shadow-xl'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </div>

                  {submitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-green-100 text-green-800 rounded-lg text-center"
                    >
                      ✅ Your message has been sent successfully!
                    </motion.div>
                  )}
                </form>
              </div>
            </div>
          </motion.div>

          {/* Contact Info Panel - 3D Card Effect */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-lime-300 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
              <div className="relative bg-white rounded-3xl p-8 h-full border border-white/20 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                  Contact Information
                </h2>
                
                <div className="space-y-6">
                  <ContactItem 
                    icon={<Phone className="text-green-500" />} 
                    label="Phone Number" 
                    value="+1 (123) 456-7890" 
                    description="Available 24/7 for emergencies"
                  />
                  
                  <ContactItem 
                    icon={<Mail className="text-green-500" />} 
                    label="Email Address" 
                    value="support@homeshifting.com" 
                    description="Typically respond within 1 business day"
                  />
                  
                  <ContactItem 
                    icon={<MapPin className="text-green-500" />} 
                    label="Office Location" 
                    value="123 Moving St, Suite 100" 
                    description="Ahmedabad, Gujarat, India"
                  />
                </div>

                <div className="mt-10 pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Hours</h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-medium">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

const InputField = ({ label, name, value, onChange, type, placeholder, icon }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
      {icon}
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 bg-white/50"
      />
      <div className="absolute left-3 top-3.5 text-gray-400">
        {icon}
      </div>
    </div>
  </div>
);

const ContactItem = ({ icon, label, value, description }) => (
  <div className="flex items-start gap-4 p-3 hover:bg-green-50 rounded-lg transition-all duration-200">
    <div className="p-2 bg-green-100 rounded-lg text-green-600 flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-gray-800">{label}</h3>
      <p className="text-gray-900 font-medium">{value}</p>
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
    </div>
  </div>
);

export default PContact;