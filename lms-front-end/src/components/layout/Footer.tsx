import { Link } from 'react-router-dom';
import { Zap, Globe, MessageSquare, ExternalLink } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-alabaster">
      {/* Main Footer */}
      <div className="max-w-400 mx-auto px-6 md:px-12 lg:px-16 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 bg-gold flex items-center justify-center">
                <Zap size={16} strokeWidth={2} className="text-charcoal" />
              </div>
              <span className="font-body font-bold text-sm tracking-[0.25em] uppercase text-alabaster">
                Techify
              </span>
            </div>
            <p className="text-sm text-alabaster/60 leading-relaxed max-w-xs mb-8">
              A premium learning platform designed for engineers, designers, and technology professionals who demand excellence.
            </p>
            <div className="flex items-center gap-4">
              {[
                { Icon: Globe, label: 'Website' },
                { Icon: MessageSquare, label: 'Community' },
                { Icon: ExternalLink, label: 'Follow Us' }
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  className="w-9 h-9 border border-alabaster/20 flex items-center justify-center text-alabaster/40 hover:text-gold hover:border-gold transition-colors duration-500 cursor-pointer"
                  aria-label={label}
                >
                  <Icon size={15} strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-label text-gold mb-6">Navigation</p>
            <ul className="space-y-4">
              {[
                { to: '/', label: 'Home' },
                { to: '/courses', label: 'Courses' },
                { to: '/about', label: 'About' },
                { to: '/login', label: 'Sign In' },
                { to: '/register', label: 'Register' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-alabaster/60 hover:text-alabaster transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-label text-gold mb-6">Contact</p>
            <ul className="space-y-4">
              <li className="text-sm text-alabaster/60">support@techify.dev</li>
              <li className="text-sm text-alabaster/60">careers@techify.dev</li>
            </ul>
            <div className="mt-8">
              <p className="text-label text-alabaster/40 mb-3">Newsletter</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-transparent border border-alabaster/20 border-r-0 px-4 py-2.5 text-sm text-alabaster placeholder:text-alabaster/30 focus:border-gold focus:outline-none transition-colors duration-300"
                />
                <button className="px-4 py-2.5 bg-gold text-charcoal text-label hover:bg-white transition-colors duration-300 cursor-pointer">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-alabaster/10">
        <div className="max-w-400 mx-auto px-6 md:px-12 lg:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-alabaster/30 uppercase tracking-widest">
            © {year} Techify. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <button
                key={item}
                type="button"
                className="text-xs text-alabaster/30 hover:text-alabaster/60 transition-colors duration-300 cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
