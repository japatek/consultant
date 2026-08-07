'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from "js-cookie";
import { ChevronDown, ArrowRight, Menu, X } from 'lucide-react';

import { featuredProjects } from '../_lib/featured-projects-data';
// import { listServices, ServiceItem } from '../_lib/services2-data';
import { servicesData, Services } from '../_lib/services-data';
import { ThemeSwitcher } from "./theme-switcher";
import { users } from "../../../../data/users";
import { LanguageSelector } from "@/components/ui/language-selector";
import { translations, Language } from "@/translate/language-data"; 

const defaultMedia = { 
    leftImg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600', 
    rightImg: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80&w=600' 
};

const aboutData = {
    'Our Company': { leftImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/logo/logo.png', rightImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/logo/pic2.jpg' },
    'Our Team': { leftImg: 'https://d2tbt8ofproiin.cloudfront.net/about-us/002.jpg', rightImg: 'https://d2tbt8ofproiin.cloudfront.net/about-us/001.jpg' },
    // 'Careers': { leftImg: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=600', rightImg: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600' }
};

// const serviceMenuMedia: Record<string, { leftImg: string; rightImg: string }> = {
//     'inspection-condition-assessment': { leftImg: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600', rightImg: 'https://images.unsplash.com/photo-1541888087625-f8148faa5c17?auto=format&fit=crop&q=80&w=600' },
//     'structural-analysis-design': { leftImg: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600', rightImg: 'https://images.unsplash.com/photo-1536895058696-a69b1c7ba34d?auto=format&fit=crop&q=80&w=600' },
//     'project-management': { leftImg: 'https://images.unsplash.com/photo-1504307651254-35680f356f12?auto=format&fit=crop&q=80&w=600', rightImg: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600' },
//     'laboratory-testing': { leftImg: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=600', rightImg: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600' },
//     // 'manufacturing-surveillance': { leftImg: 'https://images.unsplash.com/photo-1509391366360-1e97d5259d81?auto=format&fit=crop&q=80&w=600', rightImg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600' },
//     'specification-development': { leftImg: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600', rightImg: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=600' },
//     'drafting-services': { leftImg: 'https://images.unsplash.com/photo-1541888087625-f8148faa5c17?auto=format&fit=crop&q=80&w=600', rightImg: 'https://images.unsplash.com/photo-1504307651254-35680f356f12?auto=format&fit=crop&q=80&w=600' },
//     // 'technical-training': { leftImg: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600', rightImg: 'https://images.unsplash.com/photo-1536895058696-a69b1c7ba34d?auto=format&fit=crop&q=80&w=600' }
// };

const serviceMenuMedia: Record<string, { leftImg: string; rightImg: string }> = {
    'heavy-machinery': { leftImg:'https://d2tbt8ofproiin.cloudfront.net/megadropdown/pln-2.jpg', rightImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/root-blower.jpg' },
    // 'construction': { leftImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/services/piping-system.jpg', rightImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/services/piping-r.jpg' },
    'robotics': { leftImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/vending-1.jpg', rightImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/edu-bot-2.jpg' },
    'structural': { leftImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/services/struktural-beam.jpg', rightImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/services/sheet-metal.jpg' },
    'others': { leftImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/services/pc-1.jpg', rightImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/services/3dp-1.jpg' }
};

const projectMenuMedia: Record<string, { leftImg: string; rightImg: string }> = {
    'pln-ip': { leftImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/pln-1.jpg', rightImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/pln-2.jpg' },
    'ipal': { leftImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/ipal-1.jpg', rightImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/ipal-2.jpg' },
    'vending-machine': { leftImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/vending-1.jpg', rightImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/vending-2.jpg' },
    'edu-bot': { leftImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/edu-bot-1.jpg', rightImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/edu-bot-2.jpg' }
};

const getMenuImages = (menu: MenuCategory, slug: string) => {
    // if (menu === 'services') return serviceMenuMedia[slug] || serviceMenuMedia['inspection-condition-assessment'] || defaultMedia;
    if (menu === 'services') return serviceMenuMedia[slug] || serviceMenuMedia['piping-system'] || defaultMedia;
    if (menu === 'project') return projectMenuMedia[slug] || projectMenuMedia['pln-ip'] || defaultMedia;
    return aboutData[slug as AboutKeys] || aboutData['Our Company'] || defaultMedia;
};

type MenuCategory = /*'services'*/ | 'services' | 'project' | 'about';
type AboutKeys = keyof typeof aboutData;

const getPageHref = (menu: MenuCategory, slug?: string) => {
    // if (menu === 'services') return slug ? `/landing/services/${slug}` : '/landing/services';
    if (menu === 'services') return slug ? `/landing/services/${slug}` : '/landing/services';
    if (menu === 'project') return slug ? `/landing/project/${slug}` : '/landing/project';
    if (menu === 'about') return slug === 'Our Team' ? '/landing/team' : '/landing/about';
    return '/landing';
};

// ADDED: language-aware formatter function
const formatMenuLabel = (item: any, lang: Language) => {
    if (lang === 'id') {
        if (item.id_title) return item.id_title;
        if (item.id_name) return item.id_name;
        if (item.slug === 'Our Company') return 'Perusahaan Kami';
        if (item.slug === 'Our Team') return 'Tim Kami';
        // if (item.slug === 'Careers') return 'Karir';
    }
    return item.title ?? item.name ?? item.slug ?? '';
};

const getMenuItems = (menu: MenuCategory) => {
    // if (menu === 'services') return listServices;
    if (menu === 'services') return servicesData;
    if (menu === 'project') return featuredProjects;
    return Object.keys(aboutData).map((name) => ({ slug: name, title: name, desc: '' }));
};

const getInitialHoverSlug = (menu: MenuCategory) => {
    if (menu === 'services') return servicesData[0]?.slug ?? '';
    if (menu === 'project') return featuredProjects[0]?.slug ?? '';
    return Object.keys(aboutData)[0];
};

export const Navbar: React.FC = () => {
    const [lang, setLang] = useState<Language>('en'); 
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [activeMenu, setActiveMenu] = useState<MenuCategory | null>(null);
    const [hoveredSectorSlug, setHoveredSectorSlug] = useState<string>(getInitialHoverSlug('services'));
    const [hoveredProjectSlug, setHoveredProjectSlug] = useState<string>(getInitialHoverSlug('project'));
    const [hoveredAbout, setHoveredAbout] = useState<AboutKeys>('Our Company');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [mobileExpandedMenu, setMobileExpandedMenu] = useState<MenuCategory | null>(null);

    useEffect(() => {
        // Read cookie on load
        const currentLang = (Cookies.get("language") as Language) || 'en';
        setLang(currentLang);

        // Listen for immediate language changes from the Toggle
        const handleLangChange = (e: any) => {
            if (e.detail) setLang(e.detail as Language);
        };
        window.addEventListener('languageChange', handleLangChange);

        const handleScroll = () => setIsScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('languageChange', handleLangChange);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const t = translations[lang];

    const toggleMobileAccordion = (menu: /* 'services' | */ 'services' | 'project' | 'about') => {
        setMobileExpandedMenu(mobileExpandedMenu === menu ? null : menu);
    };

    const renderMegaMenuContent = () => {
        if (!activeMenu) return null;

        const items = getMenuItems(activeMenu);
        
        // ADDED: Safety check to prevent items[0] from returning undefined
        if (!items || items.length === 0) return null; 

        const selectedSlug = /* activeMenu === 'services' ? hoveredServiceSlug : */ activeMenu === 'services' ? hoveredSectorSlug : activeMenu === 'project' ? hoveredProjectSlug : hoveredAbout;
        
        // UPDATED: Use || items[0]
        const selectedItem = items.find((item: any) => item.slug === selectedSlug) || items[0];
        
        // UPDATED: Pass safe chaining and ultimate fallback
        const menuImages = getMenuImages(activeMenu, selectedItem?.slug) || defaultMedia;

        return (
            <div className="grid grid-cols-3 gap-8 items-center h-full p-8">
                <div className="h-[400px] overflow-hidden bg-muted rounded-[32px]">
                    {/* Safe to render now */}
                    <img src={menuImages.leftImg} alt={`${formatMenuLabel(selectedItem, lang)} left`} className="w-full h-full object-cover transition-opacity duration-300" />
                </div>
                <div className="flex flex-col gap-1.5 justify-center py-4">
                    {items.map((item: any) => {
                        const label = formatMenuLabel(item, lang);
                        const href = activeMenu === 'about' && item.slug === 'Our Team' ? '/landing/team' : getPageHref(activeMenu, item.slug);
                        const isSelected = item.slug === selectedItem?.slug;

                        return (
                            <Link
                                key={item.slug}
                                href={href}
                                onMouseEnter={() => {
                                    // if (activeMenu === 'services') setHoveredServiceSlug(item.slug);
                                    if (activeMenu === 'services') setHoveredSectorSlug(item.slug);
                                    if (activeMenu === 'project') setHoveredProjectSlug(item.slug);
                                    if (activeMenu === 'about') setHoveredAbout(item.slug as AboutKeys);
                                }}
                                className={`text-left px-5 py-3 rounded-lg text-[14px] transition-all duration-200 ${isSelected ? 'bg-[oklch(0.488_0.243_264.376_/_0.05)] text-vertex-primary font-semibold translate-x-1' : 'text-foreground/70 hover:text-foreground hover:bg-muted'}`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </div>
                <div className="h-[400px] overflow-hidden bg-muted rounded-[32px]">
                    {/* Safe to render now */}
                    <img src={menuImages.rightImg} alt={`${formatMenuLabel(selectedItem, lang)} right`} className="w-full h-full object-cover transition-opacity duration-300" />
                </div>
            </div>
        );
    };

    const textStyle = 'cursor-pointer text-foreground hover:bg-card/10 hover:text-white/85 dark:hover:bg-card/10';

    return (
        <nav
            onMouseLeave={() => setActiveMenu(null)}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? 'py-6 md:py-8 shadow-xl backdrop-blur-md bg-foreground/30'
                : 'py-6 md:py-8 shadow-xl backdrop-blur-md '
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-2">
                
                {/* LOGO */}
                <a href="/landing" className="flex flex-col no-underline z-10 group">
                    <span className="font-extrabold text-xl sm:text-2xl tracking-tighter leading-none bg-chart-2 bg-clip-text text-transparent">
                        JaPaTek
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-semibold tracking-[0.2em] uppercase leading-none mt-1 bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]">
                        {t.engineering}
                    </span>
                </a>

                {/* 1. DESKTOP NAVIGATION LINKS */}
                <div className="hidden md:flex items-center gap-0.5">
                    {/* <Link href="/landing/services" onMouseEnter={() => setActiveMenu('services')} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white font-medium transition-all duration-200 ${activeMenu === 'services' ? 'bg-card/10 text-foreground' : textStyle}`}>
                        {t.services} <ChevronDown className={`w-3.5 h-3.5 opacity-65 transition-transform duration-200 ${activeMenu === 'services' ? 'rotate-180' : ''}`} />
                    </Link> */}
                    <Link href="/landing/services" onMouseEnter={() => setActiveMenu('services')} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white/85 font-medium transition-all duration-200 ${activeMenu === 'services' ? 'bg-card/10 text-foreground' : textStyle}`}>
                        {t.services} <ChevronDown className={`w-3.5 h-3.5 opacity-65 transition-transform duration-200 ${activeMenu === 'services' ? 'rotate-180' : ''}`} />
                    </Link>
                    <Link href="/landing/project" onMouseEnter={() => setActiveMenu('project')} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white/85 font-medium transition-all duration-200 ${activeMenu === 'project' ? 'bg-card/10 text-foreground' : textStyle}`}>
                        {t.projects} <ChevronDown className={`w-3.5 h-3.5 opacity-65 transition-transform duration-200 ${activeMenu === 'project' ? 'rotate-180' : ''}`} />
                    </Link>
                    <Link href="/landing/about" onMouseEnter={() => setActiveMenu('about')} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white/85 font-medium transition-all duration-200 ${activeMenu === 'about' ? 'bg-card/10 text-foreground' : textStyle}`}>
                        {t.about} <ChevronDown className={`w-3.5 h-3.5 opacity-65 transition-transform duration-200 ${activeMenu === 'about' ? 'rotate-180' : ''}`} />
                    </Link>
                </div>

                {/* DESKTOP ACTIONS */}
                <div className="hidden md:flex items-center gap-4">
                    <a href="mailto:contact@JaPaTek.com" className="inline-flex items-center gap-1.5 bg-primary text-white border-none rounded-lg px-[18px] py-[9px] text-sm font-semibold cursor-pointer transition-all hover:bg-vertex-primary-hover hover:-translate-y-0.5 z-10">
                        {t.contact}
                        <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    <div className="flex items-center gap-2">
                        <ThemeSwitcher />
                        <LanguageSelector />
                    </div>
                </div>

                {/* 2. MOBILE HAMBURGER BUTTON */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden relative p-2 rounded-lg text-white hover:bg-white/10 transition-colors z-50"
                    aria-label="Toggle Menu"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* --- DESKTOP MEGA MENU PANEL --- */}
            <div className={`hidden md:block absolute top-full left-0 w-full bg-card shadow-xl transition-all duration-300 origin-top overflow-hidden ${activeMenu ? 'opacity-100 max-h-[500px] pointer-events-auto' : 'opacity-0 max-h-0 pointer-events-none'}`}>
                <div className="max-w-full">
                    {renderMegaMenuContent()}
                </div>
            </div>

            <div className={`md:hidden absolute top-full left-0 w-full bg-card shadow-2xl transition-all duration-300 ease-in-out origin-top overflow-y-auto max-h-[80vh] ${isMobileMenuOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                <div className="px-6 py-6 flex flex-col gap-4 text-foreground">

                    {/* <div>
                        <button onClick={() => toggleMobileAccordion('services')} className="flex items-center justify-between w-full py-2.5 font-semibold border-b border-border/20 text-left">
                            {t.services}
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpandedMenu === 'services' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`flex flex-col gap-1 pl-4 overflow-hidden transition-all duration-300 ${mobileExpandedMenu === 'services' ? 'max-h-[300px] mt-2' : 'max-h-0'}`}>
                            {listServices.map((service: ServiceItem) => (
                                <Link key={service.slug} href={`/landing/services/${service.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm text-foreground/75 hover:text-vertex-primary">
                                    {lang === 'id' && service.id_title ? service.id_title : service.title}
                                </Link>
                            ))}
                        </div> 
                    </div> */}

                    <div>
                        <button onClick={() => toggleMobileAccordion('services')} className="flex items-center justify-between w-full py-2.5 font-semibold border-b border-border/20 text-left">
                            {t.services}
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpandedMenu === 'services' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`flex flex-col gap-1 pl-4 overflow-hidden transition-all duration-300 ${mobileExpandedMenu === 'services' ? 'max-h-[300px] mt-2' : 'max-h-0'}`}>
                            {servicesData.map((services: Services) => (
                                <Link key={services.slug} href={`/landing/services/${services.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm text-foreground/75 hover:text-vertex-primary">
                                    {/* UPDATED: Dynamic Sector Label */}
                                    {lang === 'id' && services.id_name ? services.id_name : services.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Link href="/landing/project" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 font-semibold border-b border-border/20">
                            {t.projects}
                        </Link>
                    </div>

                    <div>
                        <button onClick={() => toggleMobileAccordion('about')} className="flex items-center justify-between w-full py-2.5 font-semibold border-b border-border/20 text-left">
                            {t.about}
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpandedMenu === 'about' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`flex flex-col gap-1 pl-4 overflow-hidden transition-all duration-300 ${mobileExpandedMenu === 'about' ? 'max-h-[300px] mt-2' : 'max-h-0'}`}>
                            {Object.keys(aboutData).map((name) => {
                                // UPDATED: Translate the About keys dynamically
                                const translatedName = lang === 'id' 
                                    ? (name === 'Our Company' ? 'Perusahaan Kami' 
                                        : name === 'Our Team' ? 'Tim Kami' 
                                        : 'Karir')
                                    : name;
                                    
                                const href = name === 'Our Team' ? '/landing/team' : '/landing/about';

                                return (
                                    <Link key={name} href={href} onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm text-foreground/75 hover:text-vertex-primary">
                                        {translatedName}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-border/40">
                        <a href="mailto:contact@JaPaTek.com" onClick={() => setIsMobileMenuOpen(false)} className="inline-flex items-center justify-center gap-2 bg-vertex-primary text-white rounded-lg py-3 text-sm font-semibold shadow-md">
                            {t.contact}
                            <ArrowRight className="w-4 h-4" />
                        </a>
                        <div className="flex justify-center gap-4 mt-2">
                            <ThemeSwitcher />
                            <LanguageSelector />
                        </div>
                    </div>

                </div>
            </div>
        </nav>
    );
};