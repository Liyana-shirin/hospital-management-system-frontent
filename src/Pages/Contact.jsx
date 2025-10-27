import React from "react";

const Contact = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="px-6 mx-auto max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">Contact Us</h2>
        <p className="mb-6 text-center text-gray-600">
        "Experiencing a medical issue? Have feedback about our healthcare services?  
        Let us know."</p>
        <form action="#" className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-gray-700 font-medium">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              placeholder="Let us know how we can help you"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-gray-700 font-medium">
              Your Message
            </label>
            <textarea
              rows="5"
              id="message"
              placeholder="Leave a comment..."
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="text-center">
            <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition">
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
