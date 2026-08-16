import React, { useState } from 'react';
import { Search, Filter, Sparkles, BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';
import { useData } from '../context/DataContext';
import { CourseCard } from './CourseCard';
import { Course } from '../types';

interface CoursesSectionProps {
  onOpenDetail: (courseId: string) => void;
  onQuickEnroll: (course: Course) => void;
  setActiveTab?: (tab: string, category?: string) => void;
  isStandalonePage?: boolean;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  onOpenDetail,
  onQuickEnroll,
  setActiveTab,
  isStandalonePage = false
}) => {
  const { courses, t } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [pricingFilter, setPricingFilter] = useState<'All' | 'Free' | 'Paid'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileExpanded, setMobileExpanded] = useState<boolean>(false);

  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = courses.filter(course => {
    if (!course.published) return false;

    // Category filter
    if (selectedCategory !== 'All' && course.category !== selectedCategory) {
      return false;
    }

    // Pricing filter
    if (pricingFilter === 'Free' && !course.isFree) return false;
    if (pricingFilter === 'Paid' && course.isFree) return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchInstructor = course.instructor.toLowerCase().includes(q);
      const matchTag = course.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchInstructor && !matchTag) return false;
    }

    return true;
  });

  return (
    <section className="py-8 sm:py-12 bg-white dark:bg-slate-900 min-h-screen font-bengali">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-6 md:px-10 lg:px-12 xl:px-16">
        
        {/* Title Header - Centered on Mobile, Left-Right Split on Desktop */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5 max-w-2xl">
            <span className="text-[#1DB954] font-bold text-xs uppercase tracking-widest bg-[#1DB954]/10 px-3 py-1 rounded-full border border-[#1DB954]/20 inline-flex items-center gap-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5" /> {t('এলএমএস ক্যারিয়ার একাডেমি', 'LMS Career Academy')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-bengali text-slate-900 dark:text-white leading-tight">
              {t('আমাদের কোর্সসমূহ', 'Our Courses')}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-bengali">
              {t('দক্ষতা অর্জন করুন এবং ক্যারিয়ার গড়ুন।', 'Build skills and advance your career.')}
            </p>
          </div>

          {!isStandalonePage && (
            <div className="flex items-center gap-2">
              {/* Mobile View Toggle or Navigation */}
              {mobileExpanded ? (
                <button
                  type="button"
                  onClick={() => setMobileExpanded(false)}
                  className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:text-[#1DB954] font-bold text-xs transition-colors cursor-pointer font-bengali shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('ফিরে যান', 'Back')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMobileExpanded(true)}
                  className="sm:hidden inline-flex items-center gap-1 text-[#1DB954] hover:text-emerald-400 font-bold text-xs transition-all cursor-pointer font-bengali shrink-0 group"
                >
                  <span>{t('সবগুলো দেখুন →', 'See All →')}</span>
                </button>
              )}

              {/* Desktop View Navigation */}
              {setActiveTab && (
                <button
                  type="button"
                  onClick={() => setActiveTab('courses')}
                  className="hidden sm:inline-flex items-center gap-1 text-[#1DB954] hover:text-emerald-400 font-bold text-sm hover:underline transition-all cursor-pointer font-bengali shrink-0 group"
                >
                  <span>{t('সবগুলো দেখুন →', 'See All →')}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Filter Controls Bar (Visible only when isStandalonePage or expanded / when user clicks see all) */}
        {(isStandalonePage || mobileExpanded) && (
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-sm mb-8 space-y-4 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Search Input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder={t("কোর্স বা স্কিল লিখে সার্চ...", "Search courses or skills...")}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              {/* Free vs Paid Filter */}
              <div className="flex items-center gap-2 w-full md:w-auto bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                <button
                  onClick={() => setPricingFilter('All')}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    pricingFilter === 'All'
                      ? 'bg-[#1DB954] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-white'
                  }`}
                >
                  {t('সব কোর্স', 'All Courses')}
                </button>
                <button
                  onClick={() => setPricingFilter('Paid')}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    pricingFilter === 'Paid'
                      ? 'bg-[#1DB954] text-[#ffffff] shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-white'
                  }`}
                >
                  {t('প্রিমিয়াম কোর্স', 'Premium Courses')}
                </button>
                <button
                  onClick={() => setPricingFilter('Free')}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    pricingFilter === 'Free'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-white'
                  }`}
                >
                  {t('ফ্রি কোর্স', 'Free Courses')}
                </button>
              </div>

            </div>

            {/* Categories Horizontal Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-100 dark:border-slate-700/60 no-scrollbar">
              <span className="text-xs font-bold text-slate-400 uppercase mr-2 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" /> ক্যাটাগরি:
              </span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer font-bengali ${
                    selectedCategory === cat
                      ? 'bg-[#142B4D] text-[#1DB954] border border-[#1DB954]/50'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'All' ? 'সকল ক্যাটাগরি' : cat}
                </button>
              ))}
            </div>

          </div>
        )}

        {/* Courses Grid: 5 Columns on PC, 2 Columns on Phone (Max 4 on mobile initial) */}
        {filteredCourses.length > 0 ? (
          <div className="space-y-8">
            {/* DESKTOP GRID (Hidden on mobile): Shows 5 on Home, all on Standalone */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4 lg:gap-5">
              {(!isStandalonePage ? filteredCourses.slice(0, 5) : filteredCourses).map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onOpenDetail={onOpenDetail}
                  onQuickEnroll={onQuickEnroll}
                />
              ))}
            </div>

            {/* MOBILE GRID (Visible only on mobile): Shows max 4 unless mobileExpanded is true or isStandalonePage */}
            <div className="grid grid-cols-2 gap-2.5 sm:hidden">
              {(isStandalonePage || mobileExpanded ? filteredCourses : filteredCourses.slice(0, 4)).map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onOpenDetail={onOpenDetail}
                  onQuickEnroll={onQuickEnroll}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 space-y-4">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white font-bengali">
              কোনো কোর্স পাওয়া যায়নি
            </h3>
            <p className="text-xs text-slate-500 font-bengali">
              আপনার ফিল্টার বা সার্চ কিওয়ার্ড পরিবর্তন করে দেখুন।
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setPricingFilter('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#1DB954] text-white text-xs font-bold rounded-xl"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
