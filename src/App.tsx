import React, { useState, useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { StatsCounter } from './components/StatsCounter';
import { PromotionalOfferBanner } from './components/PromotionalOfferBanner';
import { ServicesSection } from './components/ServicesSection';
import { CourseCard } from './components/CourseCard';
import { CoursesSection } from './components/CoursesSection';
import { CourseDetailModal } from './components/CourseDetailModal';
import { StudentDashboard } from './components/StudentDashboard';
import { CourseLearningPage } from './components/CourseLearningPage';
import { CertificateModal } from './components/CertificateModal';
import { CertificateVerifyPage } from './components/CertificateVerifyPage';
import { AboutSection } from './components/AboutSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { OfficeLocation } from './components/OfficeLocation';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';
import { TeacherDashboard } from './components/TeacherDashboard';
import { CustomerDashboard } from './components/CustomerDashboard';
import { QuickRoleSwitcher } from './components/QuickRoleSwitcher';
import { MarketplaceSection } from './components/MarketplaceSection';
import { FloatingAiChatbot } from './components/FloatingAiChatbot';
import { FloatingMessengerWindows } from './components/FloatingMessengerWindows';
import { Course } from './types';

const MainAppContent: React.FC = () => {
  const { currentUser, courses, siteSettings } = useData();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [marketplaceCategory, setMarketplaceCategory] = useState<string>('All');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const handleSetActiveTab = (tab: string, category?: string) => {
    if (tab === 'marketplace') {
      setMarketplaceCategory(category || 'All');
    }
    setActiveTab(tab);
  };
  const [learningCourseId, setLearningCourseId] = useState<string | null>(null);
  const [activeCertificateCode, setActiveCertificateCode] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  // Quick enroll trigger
  const handleQuickEnroll = (course: Course) => {
    setSelectedCourseId(course.id);
  };

  const handleStartLearning = (courseId: string) => {
    setLearningCourseId(courseId);
    setActiveTab('learning');
  };

  // If in learning classroom mode, render full-screen LMS
  if (activeTab === 'learning' && learningCourseId) {
    return (
      <CourseLearningPage
        courseId={learningCourseId}
        onBack={() => setActiveTab('customer-dashboard')}
        onViewCertificate={(code) => setActiveCertificateCode(code)}
      />
    );
  }

  const isDashboardView = ['admin', 'teacher-dashboard', 'student-dashboard', 'customer-dashboard', 'learning', 'dashboard', 'marketplace'].includes(activeTab);

  return (
    <div
      style={siteSettings?.customScalePercent && siteSettings.customScalePercent !== 100 ? { zoom: `${siteSettings.customScalePercent}%` } : undefined}
      className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-[#1DB954] selection:text-white max-w-full overflow-x-hidden"
    >
      
      {/* Top Main Navbar (Only shown on public website pages) */}
      {!isDashboardView && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          openAuthModal={() => setAuthModalOpen(true)}
          openCourseDetail={(courseId) => setSelectedCourseId(courseId)}
        />
      )}

      {/* Page Routing Views */}
      <main className="flex-1 max-w-full overflow-x-hidden">
        
        {/* VIEW 1: HOME PAGE */}
        {activeTab === 'home' && (
          <>
            <Hero setActiveTab={handleSetActiveTab} />
            <PromotionalOfferBanner setActiveTab={handleSetActiveTab} />
            <StatsCounter />
            <ServicesSection setActiveTab={handleSetActiveTab} isStandalonePage={false} />
            <CoursesSection
              onOpenDetail={(id) => setSelectedCourseId(id)}
              onQuickEnroll={handleQuickEnroll}
              setActiveTab={handleSetActiveTab}
              isStandalonePage={false}
            />
            <WhyChooseUs />
            <TestimonialsSection />
            <GallerySection />
            <OfficeLocation />
          </>
        )}

        {/* VIEW 2: COURSES PAGE */}
        {activeTab === 'courses' && (
          <CoursesSection
            onOpenDetail={(id) => setSelectedCourseId(id)}
            onQuickEnroll={handleQuickEnroll}
            setActiveTab={handleSetActiveTab}
            isStandalonePage={true}
          />
        )}

        {/* VIEW 3: SERVICES PAGE */}
        {activeTab === 'services' && (
          <ServicesSection setActiveTab={handleSetActiveTab} isStandalonePage={true} />
        )}

        {/* VIEW 3.5: MARKETPLACE PAGE */}
        {activeTab === 'marketplace' && (
          <MarketplaceSection
            setActiveTab={handleSetActiveTab}
            openAuthModal={() => setAuthModalOpen(true)}
            initialCategory={marketplaceCategory}
            onStartLearning={handleStartLearning}
          />
        )}

        {/* VIEW 4: ABOUT PAGE */}
        {activeTab === 'about' && (
          <>
            <AboutSection />
            <WhyChooseUs />
          </>
        )}

        {/* VIEW 5: GALLERY PAGE */}
        {activeTab === 'gallery' && (
          <GallerySection />
        )}

        {/* VIEW 6: CERTIFICATE VERIFICATION PORTAL */}
        {(activeTab === 'verify' || activeTab === 'verify-cert') && (
          <CertificateVerifyPage />
        )}

        {/* VIEW 7: ROLE-SPECIFIC DASHBOARDS */}
        {activeTab === 'teacher-dashboard' && (
          <MarketplaceSection
            setActiveTab={handleSetActiveTab}
            openAuthModal={() => setAuthModalOpen(true)}
            initialCategory="selling"
            onStartLearning={handleStartLearning}
          />
        )}

        {activeTab === 'customer-dashboard' && (
          <MarketplaceSection
            setActiveTab={handleSetActiveTab}
            openAuthModal={() => setAuthModalOpen(true)}
            initialCategory="buying"
            onStartLearning={handleStartLearning}
          />
        )}

        {activeTab === 'student-dashboard' && (
          <MarketplaceSection
            setActiveTab={handleSetActiveTab}
            openAuthModal={() => setAuthModalOpen(true)}
            initialCategory="buying"
            onStartLearning={handleStartLearning}
          />
        )}

        {activeTab === 'dashboard' && (
          <>
            {currentUser?.role === 'admin' ? (
              <AdminPanel setActiveTab={handleSetActiveTab} />
            ) : currentUser?.role === 'instructor' ? (
              <MarketplaceSection
                setActiveTab={handleSetActiveTab}
                openAuthModal={() => setAuthModalOpen(true)}
                initialCategory="selling"
                onStartLearning={handleStartLearning}
              />
            ) : (
              <MarketplaceSection
                setActiveTab={handleSetActiveTab}
                openAuthModal={() => setAuthModalOpen(true)}
                initialCategory="buying"
                onStartLearning={handleStartLearning}
              />
            )}
          </>
        )}

        {/* VIEW 8: ADMIN CONTROL PANEL */}
        {activeTab === 'admin' && (
          <AdminPanel setActiveTab={handleSetActiveTab} />
        )}

        {/* VIEW 9: CONTACT PAGE */}
        {activeTab === 'contact' && (
          <OfficeLocation />
        )}

      </main>

      {/* Main Footer (Only on public website pages) */}
      {!isDashboardView && (
        <Footer setActiveTab={setActiveTab} />
      )}

      {/* Modals Container */}
      <CourseDetailModal
        courseId={selectedCourseId}
        onClose={() => setSelectedCourseId(null)}
        openAuthModal={() => setAuthModalOpen(true)}
        onStartLearning={handleStartLearning}
      />

      <CertificateModal
        certificateCode={activeCertificateCode}
        onClose={() => setActiveCertificateCode(null)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setActiveTab('home');
        }}
      />

      {/* Temporary Floating Quick Role Tester for Dashboards */}
      <QuickRoleSwitcher activeTab={activeTab} setActiveTab={handleSetActiveTab} />

      {/* Facebook-style Messenger Floating Chat Windows */}
      <FloatingMessengerWindows />

      {/* Gemini AI Platform Floating Assistant */}
      <FloatingAiChatbot
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCourseDetail={(courseId) => setSelectedCourseId(courseId)}
        openAuthModal={() => setAuthModalOpen(true)}
      />

    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <MainAppContent />
    </DataProvider>
  );
}
