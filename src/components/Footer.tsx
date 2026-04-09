import { Link } from "react-router-dom";
import { hospitalDetails, departments } from "@/data";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-200">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Hospital Info */}
          <div className="space-y-4">
            <Logo 
              textClassName="[&_span:first-child]:text-white [&_span:last-child]:text-slate-400" 
            />
            <p className="text-sm text-slate-400 leading-relaxed">
              Providing world-class healthcare with compassion and excellence. Our mission is to improve the health and well-being of the communities we serve.
            </p>
            <div className="flex space-x-4">
              <a href={hospitalDetails.socials.facebook} className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={hospitalDetails.socials.twitter} className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href={hospitalDetails.socials.linkedin} className="hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href={hospitalDetails.socials.instagram} className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/departments" className="hover:text-white transition-colors">Departments</Link></li>
              <li><Link to="/doctors" className="hover:text-white transition-colors">Our Doctors</Link></li>
              <li><Link to="/appointment" className="hover:text-white transition-colors">Book Appointment</Link></li>
            </ul>
          </div>

          {/* Departments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Departments</h3>
            <ul className="space-y-2 text-sm">
              {departments.slice(0, 5).map((dept) => (
                <li key={dept.id}>
                  <Link to="/departments" className="hover:text-white transition-colors">{dept.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="mr-3 h-5 w-5 text-primary shrink-0" />
                <span>{hospitalDetails.address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-primary shrink-0" />
                <span>{hospitalDetails.phone}</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-primary shrink-0" />
                <span>{hospitalDetails.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Kalyani Hospital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
