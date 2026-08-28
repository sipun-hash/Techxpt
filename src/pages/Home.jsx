import React from 'react';
import Hero from '../sections/Hero';
import Statement from '../sections/Statement';
import Services from '../sections/Services';
import Projects from '../sections/Projects';
import Process from '../sections/Process';
import About from '../sections/About';
import Internship from '../sections/Internship';
import FAQ from '../sections/FAQ';
import Branches from '../sections/Branches';
import Feedback from '../sections/Feedback';
import CTA from '../sections/CTA';

export default function Home({
  onStartProject,
  onNavigate,
  onSelectProject,
  onSelectService,
  theme,
  setCursorMode,
  setCursorText
}) {
  const scrollToProjects = () => {
    const el = document.getElementById('selected-work-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('work');
    }
  };

  return (
    <div className="w-full">
      {/* 1. Hero */}
      <Hero 
        onStartProject={onStartProject} 
        onExploreWork={scrollToProjects} 
      />

      {/* 2. Scrolling Statement & Marquee */}
      <Statement />

      {/* 3. Services with Floating Image Hover */}
      <Services 
        onSelectService={(service) => {
          onSelectService(service);
          onNavigate('services');
        }} 
      />

      {/* 4. Selected Work */}
      <div id="selected-work-section">
        <Projects 
          onSelectProject={onSelectProject} 
          onViewAll={() => onNavigate('work')}
          setCursorMode={setCursorMode}
          setCursorText={setCursorText}
        />
      </div>

      {/* 5. Process */}
      <Process />

      {/* 6. About */}
      <About onLearnMore={() => onNavigate('about')} />

      {/* 7. Industry Internship Program */}
      <Internship 
        onApply={onStartProject} 
        onViewDetails={() => onNavigate('internship')} 
      />

      {/* 8. FAQ */}
      <FAQ 
        onStartProject={onStartProject}
        onViewAll={() => onNavigate('faq')} 
      />

      {/* 9. Branches - Explore Our Office Locations */}
      <Branches onContactLocation={onStartProject} />

      {/* 10. Feedback & Live Sharable QR */}
      <Feedback 
        onNavigate={onNavigate}
        theme={theme}
      />

      {/* 11. CTA */}
      <CTA onStartProject={onStartProject} />
    </div>
  );
}
