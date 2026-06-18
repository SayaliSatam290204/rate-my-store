import { Link, useNavigate } from 'react-router-dom';
import { useAuth, getRoleHome } from '../hooks/useAuth';
import { Shield, Store as StoreIcon, Star, ArrowRight, UserCheck, Award } from 'lucide-react';
import { login as loginApi } from '../api/auth.api';

export const LandingPage = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleAccess = async (targetRole: 'user' | 'store_owner' | 'admin') => {
    if (isAuthenticated && user?.role === targetRole) {
      navigate(getRoleHome(targetRole));
      return;
    }

    let email = '';
    let password = '';
    if (targetRole === 'admin') {
      email = 'admin@ratemystore.com';
      password = 'Admin@123';
    } else if (targetRole === 'store_owner') {
      email = 'owner@ratemystore.com';
      password = 'Owner@123';
    } else {
      email = 'user1@ratemystore.com';
      password = 'User1@123';
    }

    try {
      const data = await loginApi(email, password);
      login(data.token);
      navigate(getRoleHome(targetRole));
    } catch (err) {
      console.error('Demo login failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-pink-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/75 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/30">
              <StoreIcon className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent">
              RateMyStore
            </span>
          </div>

          <nav className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-400 hidden sm:inline">
                  Welcome, <strong className="text-slate-200">{user.name}</strong>
                </span>
                <Link
                  to={getRoleHome(user.role)}
                  className="bg-indigo-600 hover:bg-indigo-500 transition-all text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1 shadow-md shadow-indigo-600/20"
                >
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-500 transition-all text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20"
                >
                  Create Account
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-6 border border-indigo-500/20">
            <Award className="h-4 w-4" /> Challenge Submission Ready
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Discover, Rate, and <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Elevate Local Stores
            </span>
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            RateMyStore is a production-hardened developer challenge implementation. An intuitive portal featuring role-based dashboards, full keyboard-accessible modals, input sanitization pipelines, and database search.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            {isAuthenticated && user ? (
              <Link
                to={getRoleHome(user.role)}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 transition-all text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                Access Dashboard <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 transition-all text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                >
                  Get Started <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 hover:text-white transition-all text-slate-300 px-8 py-3.5 rounded-xl font-semibold border border-slate-700 flex items-center justify-center"
                >
                  Explore Demo
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Hero Interactive Card Mock */}
        <div className="flex-1 w-full max-w-md lg:max-w-none">
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative shadow-2xl shadow-indigo-900/20">
            {/* Top Store Header */}
            <div className="flex items-start justify-between border-b border-slate-700/60 pb-6 mb-6">
              <div>
                <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase bg-indigo-500/10 px-2.5 py-1 rounded-md">
                  Sample Store
                </span>
                <h3 className="text-xl font-bold text-white mt-2">Premium Electronics Hub</h3>
                <p className="text-slate-400 text-sm mt-1">100 Tech Avenue, Silicon Valley</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-lg">
                  <Star className="h-4.5 w-4.5 fill-amber-400" />
                  <span>4.8</span>
                </div>
                <span className="text-xs text-slate-500 mt-1">12 ratings</span>
              </div>
            </div>

            {/* Simulated Reviews list */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">User Feedback Log</h4>
              
              <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex items-start gap-3">
                <div className="bg-emerald-500/15 text-emerald-400 p-2 rounded-lg text-sm font-bold">
                  AM
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white truncate">Alice Mercer</span>
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-3 w-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 truncate">alice.mercer@gmail.com</p>
                  <p className="text-xs text-slate-300 mt-1">Incredible products and top tier client support!</p>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex items-start gap-3 opacity-60">
                <div className="bg-purple-500/15 text-purple-400 p-2 rounded-lg text-sm font-bold">
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">John Doe</span>
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4].map((s) => (
                        <Star key={s} className="h-3 w-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">Reliable service, definitely coming back.</p>
                </div>
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="absolute -bottom-3 -right-3 w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-40 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-950/60 border-t border-slate-800 py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Role-Based Functional Gateways</h2>
            <p className="mt-4 text-slate-400">
              Each user group interacts with specialized interfaces customized for their specific usage requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* normal user features */}
            <div
              onClick={() => handleAccess('user')}
              className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all flex flex-col group cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="bg-indigo-600/10 text-indigo-400 p-3.5 rounded-xl w-fit mb-6 border border-indigo-600/20 group-hover:scale-110 transition-transform">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Store Rater Portal</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed flex-1">
                Browse stores with customized search criteria, view global overall feedback, submit your own score, or update past evaluations with immediate page caching invalidations.
              </p>
              <div className="mt-6 text-indigo-400 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Access Normal User <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            {/* store owner features */}
            <div
              onClick={() => handleAccess('store_owner')}
              className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl hover:border-purple-500/50 hover:bg-slate-900/60 transition-all flex flex-col group cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="bg-purple-600/10 text-purple-400 p-3.5 rounded-xl w-fit mb-6 border border-purple-600/20 group-hover:scale-110 transition-transform">
                <StoreIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Store Owner Dashboard</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed flex-1">
                Track metrics including store ratings average count and evaluate rater files. Sort reviews dynamically by client name or score to monitor store representation.
              </p>
              <div className="mt-6 text-purple-400 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Access Owner View <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            {/* admin features */}
            <div
              onClick={() => handleAccess('admin')}
              className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl hover:border-pink-500/50 hover:bg-slate-900/60 transition-all flex flex-col group cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="bg-pink-600/10 text-pink-400 p-3.5 rounded-xl w-fit mb-6 border border-pink-600/20 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Platform Administrator</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed flex-1">
                Maintain catalog data integrity. Search, sort, paginate, and create users and stores. Manage ownership linking to ensure the database stays synced.
              </p>
              <div className="mt-6 text-pink-400 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Access Admin View <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <StoreIcon className="h-5 w-5 text-indigo-500" />
            <span className="font-semibold text-slate-300">RateMyStore Challenge Portal</span>
          </div>
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Roxiler Systems Coding Challenge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
