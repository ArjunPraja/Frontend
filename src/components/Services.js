import React, { useState } from 'react';
import { FaCreditCard, FaCar, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

function Services() {
    const navigate = useNavigate();

    const [faq, setFaq] = useState({});

    const toggleFaq = (index) => {
        setFaq((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const faqs = [
        {
            question: "What is Home Shifting?",
            answer: "Home shifting is the web-application to shift home from one location to other location.you just ragister yourself in web-application you want to shift your home so make booking and with the home shifting you will get verified driver and vehical in few easy steps."
        },
        {
            question: "How do I use Home Shifting Web-Application?",
            answer: "1. Open Home Shifting Website\n2. Register yourself\n3. Select vehicle type\n4. Choose pick-up and delivery locations\n5. Make a payment and confirm booking"
        },
        {
            question: "What does Home Shifting Shift?",
            answer: "From tiny pins to full household items — we shift anything, anywhere in Ahmedabad."
        }
    ];

    const features = [
        { icon: <FaCreditCard size={36} className='text-lime-500' />, title: 'Secured Payment' },
        { icon: <FaCar size={36} className='text-lime-500' />, title: 'Any Vehicle Class' },
        { icon: <FaMapMarkerAlt size={36} className='text-lime-500' />, title: 'Tracking Options' },
        { icon: <FaPhoneAlt size={36} className='text-lime-500' />, title: '24/7 Support' },
    ];

    return (
        <div className="container mx-auto px-6 py-20 min-h-screen font-sans bg-gradient-to-br from-white to-gray-100">
            {/* Hero Section */}
            <div className="pt-28 px-6 sm:px-12 md:px-32 lg:px-32 xl:px-48 2xl:px-48">
  <div className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
    <div className="md:w-1/2">
      <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-lime-500 to-green-400 text-transparent bg-clip-text leading-tight drop-shadow-md">
        Shift Smarter, Not Harder 🚚
      </h1>
    </div>
    <div className="md:w-1/2 text-gray-700 text-lg leading-relaxed">
      <p>
        Home Shifting is about providing services in which the system is used as a web-site. Home Shifting is a web-site. Using this web-site a user can shift home from one location to another without going anywhere, at any time, in Ahmedabad. Users can connect with vehicle drivers and book the vehicle for shifting as per their requirement.
      </p>
    </div>
  </div>
</div>




            {/* Features Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="bg-white/40 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform transition duration-300 hover:-translate-y-2 text-center"
                    >
                        <div className="flex justify-center mb-4">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                    </div>
                ))}
            </div>

            {/* FAQ Section */}
            <div className="mt-24">
                <h2 className="text-3xl font-bold text-center text-lime-600 mb-8">💡 We've Got Answers</h2>
                <div className="space-y-6 max-w-3xl mx-auto">
                    {faqs.map((faqItem, index) => (
                        <div
                            key={index}
                            className="bg-white border border-lime-200 shadow-lg rounded-xl transition-all duration-300"
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full flex justify-between items-center px-6 py-5 text-lg font-medium text-gray-800 hover:bg-lime-50 focus:outline-none"
                            >
                                <span>{faqItem.question}</span>
                                <span className="text-2xl text-lime-500">{faq[index] ? '-' : '+'}</span>
                            </button>
                            <div
                                className={`px-6 pb-4 text-gray-600 transition-all duration-300 ease-in-out ${
                                    faq[index] ? 'block' : 'hidden'
                                }`}
                            >
                                {faqItem.answer.split('\n').map((line, i) => (
                                    <p key={i} className="mb-2">{line}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="mt-20 text-center">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                    Ready to make your move?
                </h3>
                <button  onClick={() => navigate("/Booking")} className="px-8 py-3 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-full shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl">
                    Book Your Shift Now
                </button>
            </div>
        </div>
    );
}

export default Services;
