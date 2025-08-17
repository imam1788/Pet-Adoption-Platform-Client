import React from "react";
import { Link as ScrollLink } from "react-scroll";
import { Linkedin, Github, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300 py-12 px-6 transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto grid md:grid-cols-3 gap-10">
        {/* Brand + Mission */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            <span className="text-gray-900 dark:text-white">Pet</span>
            <span className="text-amber-500">Haven</span>
          </h2>
          <p className="text-sm">
            Giving every animal a second chance. Join us in creating a world where every pet has a home.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-amber-500">Home</a></li>
            <li><a href="/pets" className="hover:text-amber-500">Adopt</a></li>
            <li><a href="/donations" className="hover:text-amber-500">Donate</a></li>
            {/* Smooth Scroll Links */}
            <li>
              <ScrollLink
                to="volunteer"
                smooth={true}
                duration={500}
                offset={-80}
                className="hover:text-amber-500 cursor-pointer"
              >
                Volunteer
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                to="faq"
                smooth={true}
                duration={500}
                offset={-50}
                className="hover:text-amber-500 cursor-pointer"
              >
                FAQ
              </ScrollLink>
            </li>
          </ul>
        </div>

        {/* Contact + Social */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Contact</h3>
          <p>Email: imamhossain1788@gmail.com</p>
          <p>Phone: +8801518-631788</p>
          <div className="flex gap-4 mt-4">
            <a
              href="https://linkedin.com/in/imam-hossain1788"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-white transition"
            >
              <Linkedin size={22} />
            </a>
            <a
              href="https://github.com/imam1788"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
            >
              <Github size={22} />
            </a>
            <a
              href="https://imam-portfolio-fawn.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-white transition"
            >
              <Globe size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center text-sm mt-10 border-t border-gray-300 dark:border-gray-700 pt-6">
        © {new Date().getFullYear()} PetHaven. All rights reserved.
      </div>
    </footer>
  );
}
