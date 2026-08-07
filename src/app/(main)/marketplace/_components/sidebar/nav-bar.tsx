'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight, Menu, X } from 'lucide-react';
import { featuredProjects } from '../../../../(external)/landing/_lib/featured-projects-data';
// import { listServices, ServiceItem } from '../../../../(external)/landing/_lib/services-data';
import { sectorData, Sector } from '../../../../(external)/landing/_lib/services-data';
import { SearchDialog } from './search-dialog';

import { UserMenu } from "./user-menu";
import { ThemeSwitcher } from "./theme-switcher";

import { users } from "../../../../../data/users";
import { LanguageSelector } from '@/components/ui/language-selector';


const aboutData = {
    'Our Company': { leftImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/logo/logo.png', rightImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/logo/pic2.jpg' },
    'Our Team': { leftImg: 'https://d2tbt8ofproiin.cloudfront.net/about-us/002.jpg', rightImg: 'https://d2tbt8ofproiin.cloudfront.net/about-us/001.jpg' },
}

const sectorMenuMedia: Record<string, { leftImg: string; rightImg: string }> = {
    'heavy-machinery': { leftImg:'https://d2tbt8ofproiin.cloudfront.net/megadropdown/pln-2.jpg', rightImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/root-blower.jpg' },
    'robotics': { leftImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/vending-1.jpg', rightImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/edu-bot-2.jpg' },
    'structural': { leftImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/sectors/struktural-beam.jpg', rightImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/sectors/sheet-metal.jpg' },
    'others': { leftImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/sectors/pc-1.jpg', rightImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/sectors/3dp-1.jpg' }
};

const projectMenuMedia: Record<string, { leftImg: string; rightImg: string }> = {
    'pln-ip': { leftImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/pln-1.jpg', rightImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/pln-2.jpg' },
    'ipal': { leftImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/ipal-1.jpg', rightImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/ipal-2.jpg' },
    'vending-machine': { leftImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/vending-1.jpg', rightImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/vending-2.jpg' },
    'edu-bot': { leftImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/edu-bot-1.jpg', rightImg: 'https://d2tbt8ofproiin.cloudfront.net/megadropdown/edu-bot-2.jpg' }
};

const getMenuImages = (menu: MenuCategory, slug: string) => {
    // if (menu === 'services') return serviceMenuMedia[slug] ?? serviceMenuMedia['inspection-condition-assessment'];
    if (menu === 'sectors') return sectorMenuMedia[slug] ?? sectorMenuMedia['oil-gas'];
    if (menu === 'project') return projectMenuMedia[slug] ?? projectMenuMedia['pln-ip'];
    return aboutData[slug as AboutKeys] ?? aboutData['Our Company'];
};

type MenuCategory = /* 'services' | */ 'sectors' | 'project' | 'about';
type AboutKeys = keyof typeof aboutData;

const getPageHref = (menu: MenuCategory, slug?: string) => {
    // if (menu === 'services') return slug ? `/landing/services/${slug}` : '/landing/services';
    if (menu === 'sectors') return slug ? `/landing/sector/${slug}` : '/landing/sector';
    if (menu === 'project') return slug ? `/landing/project/${slug}` : '/landing/project';
    return '/landing';
};

const formatMenuLabel = (item: any) => item.title ?? item.name ?? item.slug ?? '';

const getMenuItems = (menu: MenuCategory) => {
    // if (menu === 'services') return listServices;
    if (menu === 'sectors') return sectorData;
    if (menu === 'project') return featuredProjects;
    return Object.keys(aboutData).map((name) => ({ slug: name, title: name, desc: '' }));
};

const getInitialHoverSlug = (menu: MenuCategory) => {
    // if (menu === 'services') return listServices[0]?.slug ?? '';
    if (menu === 'sectors') return sectorData[0]?.slug ?? '';
    if (menu === 'project') return featuredProjects[0]?.slug ?? '';
    return Object.keys(aboutData)[0];
};

export const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [activeMenu, setActiveMenu] = useState<MenuCategory | null>(null);
    // const [hoveredServiceSlug, setHoveredServiceSlug] = useState<string>(getInitialHoverSlug('services'));
    const [hoveredSectorSlug, setHoveredSectorSlug] = useState<string>(getInitialHoverSlug('sectors'));
    const [hoveredProjectSlug, setHoveredProjectSlug] = useState<string>(getInitialHoverSlug('project'));
    const [hoveredAbout, setHoveredAbout] = useState<AboutKeys>('Our Company');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [mobileExpandedMenu, setMobileExpandedMenu] = useState<MenuCategory | null>(null);
    const loggedInUser = users[0];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 60);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fungsi Toggle Accordion di Mobile
    const toggleMobileAccordion = (menu: /* 'services' | */ 'sectors' | 'project' | 'about') => {
        setMobileExpandedMenu(mobileExpandedMenu === menu ? null : menu);
    };

    const renderMegaMenuContent = () => {
        if (!activeMenu) return null;

        const items = getMenuItems(activeMenu);
        const selectedSlug = /* activeMenu === 'services'
            ? hoveredServiceSlug
            : */ activeMenu === 'sectors'
                ? hoveredSectorSlug
                : activeMenu === 'project'
                    ? hoveredProjectSlug
                    : hoveredAbout;

        const selectedItem = items.find((item: any) => item.slug === selectedSlug) ?? items[0];
        const menuImages = getMenuImages(activeMenu, selectedItem.slug);

        return (
            <div className="grid grid-cols-3 gap-8 items-center h-full p-8">
                <div className="h-[400px] overflow-hidden bg-muted rounded-[32px]">
                    <img
                        src={menuImages.leftImg}
                        alt={`${formatMenuLabel(selectedItem)} left`}
                        className="w-full h-full object-cover transition-opacity duration-300"
                    />
                </div>

                <div className="flex flex-col gap-1.5 justify-center py-4">
                    {items.map((item: any) => {
                        const label = formatMenuLabel(item);
                        const href = activeMenu === 'about' ? '/landing/about' : getPageHref(activeMenu, item.slug);
                        const isSelected = item.slug === selectedItem.slug;

                        return (
                            <Link
                                key={item.slug}
                                href={href}
                                onMouseEnter={() => {
                                    // if (activeMenu === 'services') setHoveredServiceSlug(item.slug);
                                    if (activeMenu === 'sectors') setHoveredSectorSlug(item.slug);
                                    if (activeMenu === 'project') setHoveredProjectSlug(item.slug);
                                    if (activeMenu === 'about') setHoveredAbout(item.slug as AboutKeys);
                                }}
                                className={`text-left px-5 py-3 rounded-lg text-[14px] transition-all duration-200 ${isSelected
                                    ? 'bg-[oklch(0.488_0.243_264.376_/_0.05)] text-vertex-primary font-semibold translate-x-1'
                                    : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                                    }`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </div>

                <div className="h-[400px] overflow-hidden bg-muted rounded-[32px]">
                    <img
                        src={menuImages.rightImg}
                        alt={`${formatMenuLabel(selectedItem)} right`}
                        className="w-full h-full object-cover transition-opacity duration-300"
                    />
                </div>
            </div>
        );
    };

    const textStyle = 'cursor-pointer text-foreground hover:bg-muted/80 hover:text-foreground';

    return (
        <nav
            onMouseLeave={() => setActiveMenu(null)}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
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
                        Engineering Consulting
                    </span>
                </a>

                <div className="flex items-center gap-1 lg:gap-2">
                    <SearchDialog />
                </div>

                {/* 1. DESKTOP NAVIGATION LINKS */}
                <div className="hidden md:flex items-center gap-0.5">
                    {/* <Link
                        href="/landing/services"
                        onMouseEnter={() => setActiveMenu('services')}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeMenu === 'services' ? 'bg-muted text-foreground' : textStyle}`}
                    >
                        Services
                        <ChevronDown className={`w-3.5 h-3.5 opacity-65 transition-transform duration-200 ${activeMenu === 'services' ? 'rotate-180' : ''}`} />
                    </Link> */}

                    <Link
                        href="/landing/sector"
                        onMouseEnter={() => setActiveMenu('sectors')}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeMenu === 'sectors' ? 'bg-muted text-foreground' : textStyle}`}
                    >
                        Sectors
                        <ChevronDown className={`w-3.5 h-3.5 opacity-65 transition-transform duration-200 ${activeMenu === 'sectors' ? 'rotate-180' : ''}`} />
                    </Link>

                    <Link
                        href="/landing/project"
                        onMouseEnter={() => setActiveMenu('project')}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeMenu === 'project' ? 'bg-muted text-foreground' : textStyle}`}
                    >
                        Projects
                        <ChevronDown className={`w-3.5 h-3.5 opacity-65 transition-transform duration-200 ${activeMenu === 'project' ? 'rotate-180' : ''}`} />
                    </Link>

                    <Link
                        href="/landing/about"
                        onMouseEnter={() => setActiveMenu('about')}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeMenu === 'about' ? 'bg-muted text-foreground' : textStyle}`}
                    >
                        About
                        <ChevronDown className={`w-3.5 h-3.5 opacity-65 transition-transform duration-200 ${activeMenu === 'about' ? 'rotate-180' : ''}`} />
                    </Link>
                </div>

                {/* DESKTOP PHONE & CTA BUTTON */}
                <div className="hidden md:flex items-center gap-4">
                    <a href="mailto:contact@JaPaTek.com?cc=riefkyiqbalm@gmail.com&bcc=riefky.iqbal19@gmail.com&subject=Hello%20JaPa" className="inline-flex items-center gap-1.5 bg-primary text-white border-none rounded-lg px-[18px] py-[9px] text-sm font-semibold cursor-pointer transition-all hover:bg-vertex-primary-hover hover:-translate-y-0.5 z-10">
                        Contact Us
                        <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                </div>

                <div className="flex items-center gap-2">
                    {/* <LayoutControls /> */}
                    <ThemeSwitcher />
                    {/* <Button asChild size="icon">
                        <Link
                            prefetch={false}
                            href="https://github.com/arhamkhnz/next-shadcn-admin-dashboard"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Open GitHub repository"
                        >
                            <SimpleIcon icon={siGithub} className="fill-primary-foreground" />
                        </Link>
                    </Button> */}
                     <LanguageSelector />
                    <UserMenu user={loggedInUser} />
                </div>

                {/* 2. MOBILE HAMBURGER BUTTON */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-colors z-50"
                    aria-label="Toggle Menu"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* --- DESKTOP MEGA MENU PANEL --- */}
            <div
                className={`hidden md:block absolute top-full left-0 w-full bg-card shadow-xl transition-all duration-300 origin-top overflow-hidden ${activeMenu ? 'opacity-100 max-h-[500px] pointer-events-auto' : 'opacity-0 max-h-0 pointer-events-none'
                    }`}
            >
                <div className="max-w-full">
                    {renderMegaMenuContent()}
                </div>
            </div>

            {/* --- MOBILE ACCORDION DRAWER --- */}
            <div
                className={`md:hidden absolute top-full left-0 w-full bg-card shadow-2xl transition-all duration-300 ease-in-out origin-top overflow-y-auto max-h-[80vh] ${isMobileMenuOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-0 pointer-events-none'
                    }`}
            >
                <div className="px-6 py-6 flex flex-col gap-4 text-foreground">


                    <div>
                        <button
                            onClick={() => toggleMobileAccordion('sectors')}
                            className="flex items-center justify-between w-full py-2.5 font-semibold border-b border-border/20 text-left"
                        >
                            Sectors
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpandedMenu === 'sectors' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`flex flex-col gap-1 pl-4 overflow-hidden transition-all duration-300 ${mobileExpandedMenu === 'sectors' ? 'max-h-[300px] mt-2' : 'max-h-0'}`}>
                            {sectorData.map((sector: Sector) => (
                                <Link
                                    key={sector.slug}
                                    href={`/landing/sector/${sector.slug}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="py-2 text-sm text-foreground/75 hover:text-vertex-primary"
                                >
                                    {sector.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Link
                            href="/landing/project"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="py-2.5 font-semibold border-b border-border/20"
                        >
                            Projects
                        </Link>
                    </div>

                    <div>
                        <button
                            onClick={() => toggleMobileAccordion('about')}
                            className="flex items-center justify-between w-full py-2.5 font-semibold border-b border-border/20 text-left"
                        >
                            About
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpandedMenu === 'about' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`flex flex-col gap-1 pl-4 overflow-hidden transition-all duration-300 ${mobileExpandedMenu === 'about' ? 'max-h-[300px] mt-2' : 'max-h-0'}`}>
                            {Object.keys(aboutData).map((name) => (
                                <Link
                                    key={name}
                                    href="/landing/about"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="py-2 text-sm text-foreground/75 hover:text-vertex-primary"
                                >
                                    {name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Phone & Contact Button */}
                    <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-border/40">
                        <a href="mailto:contact@JaPaTek.com?cc=riefkyiqbalm@gmail.com&bcc=riefky.iqbal19@gmail.com&subject=Hello%20JaPa" onClick={() => setIsMobileMenuOpen(false)} className="inline-flex items-center justify-center gap-2 bg-vertex-primary text-white rounded-lg py-3 text-sm font-semibold shadow-md">
                            Contact Us
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>

                </div>
            </div>
        </nav>
    );
};