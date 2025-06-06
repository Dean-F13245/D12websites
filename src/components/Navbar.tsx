import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { profile, loading } = useAuth();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Portfolio', path: '/portfolio' }
  ];

  const isActive = (path: string) => location.pathname === path;

  const isAdmin = !loading && profile && profile.role === 'admin';

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title/Slogan */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/images/logo.png"
              alt="D12 Websites Logo" 
              className="h-12 w-auto"
            />
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-800">D12 Websites</span>
              <span className="text-xs text-gray-600 mt-0.5">Affordable yet quality</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-base font-medium transition-colors duration-200 px-2 py-1 rounded-md ${
                  isActive(item.path)
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-gray-700 hover:text-brand-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link to="/contact">
              <Button variant="default" size="sm" className="bg-brand-600 hover:bg-brand-700 text-white">
                Contact
              </Button>
            </Link>
            {isAdmin && (
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-brand-600 hover:bg-gray-50">
                  Admin Dashboard
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-brand-600 transition-colors p-1 rounded-md hover:bg-gray-50"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-md ${
                  isActive(item.path)
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-gray-700 hover:text-brand-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link 
              to="/contact" 
              className="block px-3 py-2 text-base font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-md transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            {isAdmin && (
              <Link to="/admin" className="block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-md text-gray-700 hover:text-brand-600 hover:bg-gray-50" onClick={() => setIsOpen(false)}>
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
