import React from "react";

export default function Footer() {
  return (
    <footer
      className="bg-gray-900 text-gray-300 py-12 px-6"
      data-aos="fade-up"
    >
      <div className="max-w-screen-xl mx-auto grid md:grid-cols-3 gap-10">
        {/* Brand + Mission */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            <span className="text-white">Pet</span>
            <span className="text-amber-400">Haven</span>
          </h2>
          <p className="text-sm">
            Giving every animal a second chance. Join us in creating a world where every pet has a home.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/adopt" className="hover:text-white">Adopt</a></li>
            <li><a href="/donate" className="hover:text-white">Donate</a></li>
            <li><a href="/volunteer" className="hover:text-white">Volunteer</a></li>
          </ul>
        </div>

        {/* Contact + Social */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact</h3>
          <p>Email: hello@pethaven.org</p>
          <p>Phone: +880-1234-567890</p>
          <div className="flex gap-4 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f hover:text-white"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram hover:text-white"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter hover:text-white"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm mt-10 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} PetHaven. All rights reserved.
      </div>
    </footer>
  );
}
