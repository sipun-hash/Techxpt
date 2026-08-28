import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import IntroAnimation from './components/IntroAnimation';
import ErrorBoundary from './components/ErrorBoundary';
import ContactSidebar from './components/ContactSidebar';

// Pages
import Home from './pages/Home';
import WorkPage from './pages/WorkPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ContactPage from './pages/ContactPage';
import FeedbackPage from './pages/FeedbackPage';
import InternshipPage from './pages/InternshipPage';

// Data
import { PROJECTS } from './data/content';

// Helper to resolve route and entity from URL
const parseInitialStateFromUrl = () => {
  if (typeof window === 'undefined') return { route: 'home', project: null };
  const path = window.location.pathname.replace(/^\/|\/$/g, '').toLowerCase();

  if (path === 'contact') {
    return { route: 'contact', project: null };
  }

  if (path === 'feedback') {
    return { route: 'feedback', project: null };
  }

  if (path.startsWith('work/')) {
    const projId = path.split('/')[1];
    const foundProject = PROJECTS.find(p => p.id.toLowerCase() === projId);
    if (foundProject) {
      return { route: 'project-detail', project: foundProject };
    }
  }

  const validRoutes = ['home', 'work', 'services', 'about', 'faq', 'contact', 'feedback', 'internship'];
  if (validRoutes.includes(path)) {
    return { route: path, project: null };
  }

  const hash = window.location.hash.replace('#', '').toLowerCase();
  if (validRoutes.includes(hash)) {
    return { route: hash, project: null };
  }

  return { route: 'home', project: null };
};

export default function App() {
  const [initialData] = useState(() => parseInitialStateFromUrl());
  const [currentRoute, setCurrentRoute] = useState(initialData.route);
  const [activeProject, setActiveProject] = useState(initialData.project);
  const [selectedService, setSelectedService] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [isContactSidebarOpen, setIsContactSidebarOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('techxpt-theme') || 'light';
  });

  // Custom cursor modes
  const [cursorMode, setCursorMode] = useState('default');
  const [cursorText, setCursorText] = useState('');

  // 1. Dynamic Page Titles & SEO
  useEffect(() => {
    const titles = {
      home: 'TECHXPT — Digital Product Engineering Studio',
      work: 'Selected Work & Portfolio — TECHXPT',
      services: 'Capabilities & Architecture — TECHXPT',
      about: 'About & Studio Manifesto — TECHXPT',
      faq: 'FAQ — Frequently Asked Questions // TECHXPT',
      contact: 'Start a Project // Direct Line — TECHXPT',
      feedback: 'Client Feedback & Satisfaction Portal — TECHXPT',
      internship: 'Industry Internship Program & Training // TECHXPT',
      'project-detail': activeProject ? `${activeProject.title} — Case Study // TECHXPT` : 'Case Study — TECHXPT'
    };
    document.title = titles[currentRoute] || titles.home;
  }, [currentRoute, activeProject]);

  // 2. HTML5 History API: Forward / Backward Navigation & Popstate Listener
  useEffect(() => {
    // Replace initial state on mount
    if (!window.history.state) {
      const stateObj = {
        route: currentRoute,
        projectId: activeProject?.id || null
      };
      let targetPath = '/';
      if (currentRoute === 'project-detail' && activeProject) {
        targetPath = `/work/${activeProject.id}`;
      } else if (currentRoute !== 'home') {
        targetPath = `/${currentRoute}`;
      }
      window.history.replaceState(stateObj, '', targetPath);
    }

    const handlePopState = (event) => {
      const state = event.state;
      if (state?.route) {
        if (state.route === 'project-detail' && state.projectId) {
          const proj = PROJECTS.find(p => p.id === state.projectId);
          setActiveProject(proj || null);
          setCurrentRoute('project-detail');
        } else {
          setCurrentRoute(state.route);
        }
      } else {
        const parsed = parseInitialStateFromUrl();
        setCurrentRoute(parsed.route);
        setActiveProject(parsed.project);
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Apply theme attribute to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('techxpt-theme', theme);
  }, [theme]);

  const toggleTheme = (e) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    if (document.startViewTransition) {
      let x = window.innerWidth - 80;
      let y = 38;
      if (e && e.clientX) {
        x = e.clientX;
        y = e.clientY;
      }

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(() => {
        setTheme(nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`
        ];
        document.documentElement.animate(
          {
            clipPath: clipPath
          },
          {
            duration: 500,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        );
      });
    } else {
      setTheme(nextTheme);
    }
  };

  // 3. Navigation handler
  const handleNavigate = (route, { replace = false } = {}) => {
    if (currentRoute === route && !activeProject) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetPath = route === 'home' ? '/' : `/${route}`;
    const stateObj = { route, projectId: null };

    if (replace) {
      window.history.replaceState(stateObj, '', targetPath);
    } else {
      window.history.pushState(stateObj, '', targetPath);
    }

    setActiveProject(null);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Professional Back Navigation Handler (History-aware with safe fallback)
  const handleGoBack = (fallbackRoute = 'home') => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      handleNavigate(fallbackRoute);
    }
  };

  const handleOpenContact = () => {
    setIsContactSidebarOpen(true);
  };

  const handleCloseContact = () => {
    setIsContactSidebarOpen(false);
  };

  const handleOpenProject = (project) => {
    setActiveProject(project);
    setCurrentRoute('project-detail');
    window.history.pushState(
      { route: 'project-detail', projectId: project.id },
      '',
      `/work/${project.id}`
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      className="relative min-h-screen selection:bg-[#FF2424] selection:text-white"
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--text-primary)',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}
    >
      {/* Cinematic Center-to-Header Intro Logo Animation */}
      {showIntro && (
        <IntroAnimation onComplete={() => setShowIntro(false)} />
      )}

      {/* Dynamic Context Custom Cursor (Desktop Only) */}
      <CustomCursor cursorMode={cursorMode} cursorText={cursorText} />

      {/* Sticky Minimal Navbar with Home, Work, Services, About, FAQ, Theme Toggle & Let's Talk */}
      <Navbar 
        currentRoute={currentRoute}
        setCurrentRoute={handleNavigate}
        onOpenContact={handleOpenContact}
        theme={theme}
        onToggleTheme={toggleTheme}
        isIntroRunning={showIntro}
      />

      {/* Main Content Router - 100% Full-Screen Dedicated Pages */}
      <main className="min-h-screen">
        <ErrorBoundary onReset={() => handleNavigate('home')}>
          {currentRoute === 'home' && (
            <Home 
              onStartProject={handleOpenContact}
              onNavigate={handleNavigate}
              onSelectProject={handleOpenProject}
              onSelectService={(srv) => {
                setSelectedService(srv);
                handleNavigate('services');
              }}
              theme={theme}
              setCursorMode={setCursorMode}
              setCursorText={setCursorText}
            />
          )}

          {currentRoute === 'work' && (
            <WorkPage 
              onSelectProject={handleOpenProject}
              onStartProject={handleOpenContact}
              setCursorMode={setCursorMode}
              setCursorText={setCursorText}
            />
          )}

          {currentRoute === 'project-detail' && (
            <ProjectDetailPage 
              project={activeProject}
              onBack={() => handleGoBack('work')}
              onStartProject={handleOpenContact}
              onSelectOtherProject={handleOpenProject}
            />
          )}

          {currentRoute === 'services' && (
            <ServicesPage 
              onStartProject={handleOpenContact}
              selectedService={selectedService}
            />
          )}

          {currentRoute === 'about' && (
            <AboutPage 
              onStartProject={handleOpenContact}
            />
          )}

          {currentRoute === 'faq' && (
            <FAQPage 
              onStartProject={handleOpenContact}
            />
          )}

          {currentRoute === 'contact' && (
            <ContactPage 
              onBack={() => handleGoBack('home')}
            />
          )}

          {currentRoute === 'feedback' && (
            <FeedbackPage 
              onNavigate={handleNavigate}
              theme={theme}
              setCursorMode={setCursorMode}
              setCursorText={setCursorText}
            />
          )}

          {currentRoute === 'internship' && (
            <InternshipPage 
              onStartProject={handleOpenContact}
              onBack={() => handleGoBack('home')}
            />
          )}
        </ErrorBoundary>
      </main>

      {/* Minimal Footer */}
      <Footer 
        onNavigate={handleNavigate}
        onOpenContact={handleOpenContact}
      />

      {/* Slide-over Contact & Project Initiation Sidebar Drawer */}
      <ContactSidebar 
        isOpen={isContactSidebarOpen} 
        onClose={handleCloseContact} 
      />

    </div>
  );
}


