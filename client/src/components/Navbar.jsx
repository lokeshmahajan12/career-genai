import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  const authed = !!localStorage.getItem("token");

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-black text-xl text-gray-900 dark:text-white tracking-tight hover:text-blue-600 transition"
        >
          Career<span className="text-blue-500">AI</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center font-medium text-gray-700 dark:text-gray-200">
          <Link to="/courses" className="hover:text-blue-500 transition">
            📚 Courses
          </Link>
          <Link to="/advisor" className="hover:text-blue-500 transition">
            🧠 Advisor
          </Link>
          <Link to="/upload-resume" className="hover:text-blue-500 transition">
            📄 Resume Upload
          </Link>
          {authed && (
            <Link to="/dashboard" className="hover:text-blue-500 transition">
              📊 Dashboard
            </Link>
          )}

          {authed ? (
            <div className="relative">
              {/* Avatar Button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                👤 <span className="hidden sm:inline">Account</span>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                  <Link
                    to="/user-profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white rounded-b-lg transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-blue-500 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl text-gray-700 dark:text-gray-200"
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-3 space-y-3">
          <Link to="/courses" onClick={() => setMenuOpen(false)}>
            📚 Courses
          </Link>
          <Link to="/advisor" onClick={() => setMenuOpen(false)}>
            🧠 Advisor
          </Link>
          <Link to="/profile" onClick={() => setMenuOpen(false)}>
            📊 Career Profile
          </Link>
          <Link to="/upload-resume" onClick={() => setMenuOpen(false)}>
            📄 Resume Upload
          </Link>
          {authed && (
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
              📊 Dashboard
            </Link>
          )}
          {authed ? (
            <>
              <Link to="/user-profile" onClick={() => setMenuOpen(false)}>
                👤 My Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-red-500 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-blue-500 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-1.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
