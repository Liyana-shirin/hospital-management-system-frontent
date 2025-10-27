import React from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation hook
import logo from "../../assets/images/logo.png";
import { RiLinkedinFill } from "react-icons/ri";
import { AiFillYoutube, AiFillGithub, AiOutlineInstagram } from "react-icons/ai";

// Social Media Links
const socialLinks = [
  { path: "", icon: <AiFillYoutube className="group-hover:text-white w-5 h-5" /> },
  { path: "", icon: <AiFillGithub className="group-hover:text-white w-5 h-5" /> },
  { path: "", icon: <AiOutlineInstagram className="group-hover:text-white w-5 h-5" /> },
  { path: "", icon: <RiLinkedinFill className="group-hover:text-white w-5 h-5" /> },
];

// Quick Links Sections
const quickLinks01 = [{ path: "/home", display: "Home" }, { path: "/about", display: "About Us" }, { path: "/services", display: "Services" }, { path: "/contact", display: "Contact Us" }];
const quickLink02 = [{ path: "/doctors/find", display: "Find a Doctor" }, { path: "/", display: "Request an Appointment" }, { path: "/", display: "Find a Location" }, { path: "/", display: "Get an Opinion" }];
const quickLink03 = [{ path: "/", display: "Donate" }, { path: "/contact", display: "Contact Us" }];

const Footer = () => {
  const year = new Date().getFullYear();
  const location = useLocation(); // Get current route

  // Define pages that need a smaller footer
  const smallFooterPages = ["/login", "/register", "/sidebar", "/profile"];

  // Conditional Footer Styling
  const footerClass = smallFooterPages.includes(location.pathname)
    ? "py-4 text-sm"
    : "pb-16 pt-10"; // Reduce padding for small pages

  return (
    <footer className={`bg-gray-100 ${footerClass}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between flex-col md:flex-row flex-wrap gap-10">
          {/* Logo Section */}
          <div className="text-center md:text-left">
            <img src={logo} alt="Medicare Logo" className="w-32 mx-auto md:mx-0" />
            <p className="text-sm text-textColor mt-4">Copyright © {year} developed by lifecare.</p>
            {/* Social Media Icons */}
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              {socialLinks.map((link, index) => (
                <a key={index} href={link.path} target="_blank" rel="noopener noreferrer" className="hover:bg-blue-500 p-2 rounded-full transition duration-300">
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h2 className="text-lg font-bold mb-4 text-headingColor">Quick Links</h2>
            <ul>
              {quickLinks01.map((item, index) => (
                <li key={index} className="mb-2">
                  <Link to={item.path} className="text-textColor hover:text-blue-500">{item.display}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* I want to Section */}
          <div>
            <h2 className="text-lg font-bold mb-4 text-headingColor">I want to:</h2>
            <ul>
              {quickLink02.map((item, index) => (
                <li key={index} className="mb-2">
                  <Link to={item.path} className="text-textColor hover:text-blue-500">{item.display}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h2 className="text-lg font-bold mb-4 text-headingColor">Support</h2>
            <ul>
              {quickLink03.map((item, index) => (
                <li key={index} className="mb-2">
                  <Link to={item.path} className="text-textColor hover:text-blue-500">{item.display}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
