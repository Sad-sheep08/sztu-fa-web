import { useState, useEffect } from 'react';
import './Header.css';

interface HeaderProps {
  currentPage?: string;
}

const Header: React.FC<HeaderProps> = ({ currentPage = 'home' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: '首页', href: '#home' },
    { id: 'about', label: '协会简介', href: '#about' },
    { id: 'activities', label: '活动动态', href: '#activities' },
    { id: 'teams', label: '球队信息', href: '#teams' },
    { id: 'matches', label: '赛事公告', href: '#matches' },
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="headerContainer">
        <a href="#home" className="logo">
          <img className="logoIcon" src="/logo.jpg" alt="SZTU足球协会" />
          <div className="logoText">
            <span className="logoTitle">SZTU足球协会</span>
            <span className="logoSubtitle">Shenzhen Tech University FA</span>
          </div>
        </a>

        <nav className="nav">
          <ul className="navList">
            {navItems.map((item) => (
              <li key={item.id} className="navItem">
                <a
                  href={item.href}
                  className={`navLink ${currentPage === item.id ? 'active' : ''}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className={`menuButton ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="菜单"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <nav className={`mobileNav ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobileNavList">
          {navItems.map((item) => (
            <li key={item.id} className="mobileNavItem">
              <a
                href={item.href}
                className={`mobileNavLink ${currentPage === item.id ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;