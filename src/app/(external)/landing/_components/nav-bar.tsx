'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight, Menu, X } from 'lucide-react';
import { featuredProjects } from '../_lib/featured-projects-data';
import { listServices, ServiceItem } from '../_lib/services-data';
import { sectorData, Sector } from '../_lib/sectors-data';
import { ThemeSwitcher } from "./theme-switcher";
import { users } from "../../../../data/users";
import { UserMenu } from "./user-menu";

const aboutData = {
    'Our Company': {
        leftImg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600',
        rightImg: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80&w=600'
    },
    'Our Team': {
        leftImg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
        rightImg: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600'
    },
    'Careers': {
        leftImg: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=600',
        rightImg: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600'
    }
};

const serviceMenuMedia: Record<string, { leftImg: string; rightImg: string }> = {
    'inspection-condition-assessment': {
        leftImg: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600',
        rightImg: 'https://images.unsplash.com/photo-1541888087625-f8148faa5c17?auto=format&fit=crop&q=80&w=600'
    },
    'structural-analysis-design': {
        leftImg: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600',
        rightImg: 'https://images.unsplash.com/photo-1536895058696-a69b1c7ba34d?auto=format&fit=crop&q=80&w=600'
    },
    'project-management': {
        leftImg: 'https://images.unsplash.com/photo-1504307651254-35680f356f12?auto=format&fit=crop&q=80&w=600',
        rightImg: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600'
    },
    'laboratory-testing': {
        leftImg: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=600',
        rightImg: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600'
    },
    'manufacturing-surveillance': {
        leftImg: 'https://images.unsplash.com/photo-1509391366360-1e97d5259d81?auto=format&fit=crop&q=80&w=600',
        rightImg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600'
    },
    'specification-development': {
        leftImg: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600',
        rightImg: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=600'
    },
    'drafting-services': {
        leftImg: 'https://images.unsplash.com/photo-1541888087625-f8148faa5c17?auto=format&fit=crop&q=80&w=600',
        rightImg: 'https://images.unsplash.com/photo-1504307651254-35680f356f12?auto=format&fit=crop&q=80&w=600'
    },
    'technical-training': {
        leftImg: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600',
        rightImg: 'https://images.unsplash.com/photo-1536895058696-a69b1c7ba34d?auto=format&fit=crop&q=80&w=600'
    }
};

const sectorMenuMedia: Record<string, { leftImg: string; rightImg: string }> = {
    'oil-and-gas': {
        leftImg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600',
        rightImg: 'https://images.unsplash.com/photo-1574689049757-0a25227d81cc?auto=format&fit=crop&q=80&w=600'
    },
    'mining-and-resources': {
        leftImg: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=600',
        rightImg: 'https://images.unsplash.com/photo-1509391366360-1e97d5259d81?auto=format&fit=crop&q=80&w=600'
    },
    'water-and-wastewater': {
        leftImg: 'https://images.unsplash.com/photo-1541888087625-f8148faa5c17?auto=format&fit=crop&q=80&w=600',
        rightImg: 'https://images.unsplash.com/photo-1504307651254-35680f356f12?auto=format&fit=crop&q=80&w=600'
    },
    'industrial': {
        leftImg: 'https://images.unsplash.com/photo-1504307651254-35680f356f12?auto=format&fit=crop&q=80&w=600',
        rightImg: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=600'
    },
    'infrastructure': {
        leftImg: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600',
        rightImg: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600'
    }
};

const projectMenuMedia: Record<string, { leftImg: string; rightImg: string }> = {
    'pln-ip': {
        leftImg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600',
        rightImg: 'https://images.unsplash.com/photo-1574689049757-0a25227d81cc?auto=format&fit=crop&q=80&w=600'
    },
    'ipal': {
        leftImg: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=600',
        rightImg: 'https://images.unsplash.com/photo-1509391366360-1e97d5259d81?auto=format&fit=crop&q=80&w=600'
    },
    'vending-machine': {
        leftImg: 'https://images.unsplash.com/photo-1541888087625-f8148faa5c17?auto=format&fit=crop&q=80&w=600',
        rightImg: 'https://images.unsplash.com/photo-1504307651254-35680f356f12?auto=format&fit=crop&q=80&w=600'
    },
    'edu-bot': {
        leftImg: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600',
        rightImg: 'https://images.unsplash.com/photo-1536895058696-a69b1c7ba34d?auto=format&fit=crop&q=80&w=600'
    }
};

const getMenuImages = (menu: MenuCategory, slug: string) => {
    if (menu === 'services') return serviceMenuMedia[slug] ?? serviceMenuMedia['inspection-condition-assessment'];
    if (menu === 'sectors') return sectorMenuMedia[slug] ?? sectorMenuMedia['oil-and-gas'];
    if (menu === 'project') return projectMenuMedia[slug] ?? projectMenuMedia['pln-ip'];
    return aboutData[slug as AboutKeys] ?? aboutData['Our Company'];
};

type MenuCategory = 'services' | 'sectors' | 'project' | 'about';
type AboutKeys = keyof typeof aboutData;

const getPageHref = (menu: MenuCategory, slug?: string) => {
    if (menu === 'services') return slug ? `/landing/services/${slug}` : '/landing/services';
    if (menu === 'sectors') return slug ? `/landing/sector/${slug}` : '/landing/sector';
    if (menu === 'project') return slug ? `/landing/project/${slug}` : '/landing/project';
    return '/landing';
};

const formatMenuLabel = (item: any) => item.title ?? item.name ?? item.slug ?? '';

const getMenuItems = (menu: MenuCategory) => {
    if (menu === 'services') return listServices;
    if (menu === 'sectors') return sectorData;
    if (menu === 'project') return featuredProjects;
    return Object.keys(aboutData).map((name) => ({ slug: name, title: name, desc: '' }));
};

const getInitialHoverSlug = (menu: MenuCategory) => {
    if (menu === 'services') return listServices[0]?.slug ?? '';
    if (menu === 'sectors') return sectorData[0]?.slug ?? '';
    if (menu === 'project') return featuredProjects[0]?.slug ?? '';
    return Object.keys(aboutData)[0];
};

export const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [activeMenu, setActiveMenu] = useState<MenuCategory | null>(null);
    const [hoveredServiceSlug, setHoveredServiceSlug] = useState<string>(getInitialHoverSlug('services'));
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
    const toggleMobileAccordion = (menu: 'services' | 'sectors' | 'project' | 'about') => {
        setMobileExpandedMenu(mobileExpandedMenu === menu ? null : menu);
    };

    const renderMegaMenuContent = () => {
        if (!activeMenu) return null;

        const items = getMenuItems(activeMenu);
        const selectedSlug = activeMenu === 'services'
            ? hoveredServiceSlug
            : activeMenu === 'sectors'
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
                                    if (activeMenu === 'services') setHoveredServiceSlug(item.slug);
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

    const textStyle = 'cursor-pointer text-foreground hover:bg-card/10 hover:text-white/85 dark:hover:bg-card/10';

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
                    {/* Menambahkan drop-shadow putih/cyan agar dipaksa glowing di semua halaman */}
                    <span className="font-extrabold text-xl sm:text-2xl tracking-tighter leading-none bg-chart-2 bg-clip-text text-transparent">
                        JaPaTek
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-semibold tracking-[0.2em] uppercase leading-none mt-1 bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]">
                        Engineering Consulting
                    </span>
                </a>

                {/* 1. DESKTOP NAVIGATION LINKS */}
                <div className="hidden md:flex items-center gap-0.5">
                    <Link
                        href="/landing/services"
                        onMouseEnter={() => setActiveMenu('services')}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white font-medium transition-all duration-200 ${activeMenu === 'services' ? 'bg-card/10 text-foreground' : textStyle}`}
                    >
                        Services
                        <ChevronDown className={`w-3.5 h-3.5 opacity-65 transition-transform duration-200 ${activeMenu === 'services' ? 'rotate-180' : ''}`} />
                    </Link>

                    <Link
                        href="/landing/sector"
                        onMouseEnter={() => setActiveMenu('sectors')}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white/85 font-medium transition-all duration-200 ${activeMenu === 'sectors' ? 'bg-card/10 text-foreground' : textStyle}`}
                    >
                        Sectors
                        <ChevronDown className={`w-3.5 h-3.5 opacity-65 transition-transform duration-200 ${activeMenu === 'sectors' ? 'rotate-180' : ''}`} />
                    </Link>

                    <Link
                        href="/landing/project"
                        onMouseEnter={() => setActiveMenu('project')}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white/85 font-medium transition-all duration-200 ${activeMenu === 'project' ? 'bg-card/10 text-foreground' : textStyle}`}
                    >
                        Projects
                        <ChevronDown className={`w-3.5 h-3.5 opacity-65 transition-transform duration-200 ${activeMenu === 'project' ? 'rotate-180' : ''}`} />
                    </Link>

                    <Link
                        href="/landing/about"
                        onMouseEnter={() => setActiveMenu('about')}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white/85 font-medium transition-all duration-200 ${activeMenu === 'about' ? 'bg-card/10 text-foreground' : textStyle}`}
                    >
                        About
                        <ChevronDown className={`w-3.5 h-3.5 opacity-65 transition-transform duration-200 ${activeMenu === 'about' ? 'rotate-180' : ''}`} />
                    </Link>
                </div>

                {/* DESKTOP PHONE & CTA BUTTON */}
                <div className="hidden md:flex items-center gap-4">
                    {/* <a href="tel:+61812345678" className="flex items-center gap-1.5 text-[13px] font-medium text-white/85 hover:text-white transition-colors z-10">
                        <Phone className="w-3.5 h-3.5" />
                        +61 8 1234 5678
                    </a> */}
                    <a href="mailto:contact@JaPaTek.com?cc=riefkyiqbalm@gmail.com&bcc=riefky.iqbal19@gmail.com&subject=Hello%20JaPa" className="inline-flex items-center gap-1.5 bg-primary text-white border-none rounded-lg px-[18px] py-[9px] text-sm font-semibold cursor-pointer transition-all hover:bg-vertex-primary-hover hover:-translate-y-0.5 z-10">
                        Contact Us
                        <ArrowRight className="w-3.5 h-3.5" />
                    </a>
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
                        {/* <UserMenu user={loggedInUser} /> */}
                    </div>

                </div>


                {/* 2. MOBILE HAMBURGER BUTTON (Hanya muncul di HP) */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors z-50"
                    aria-label="Toggle Menu"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* --- DESKTOP MEGA MENU PANEL (Full Width & bg-card) --- */}
            <div
                className={`hidden md:block absolute top-full left-0 w-full bg-card  shadow-xl transition-all duration-300 origin-top overflow-hidden ${activeMenu ? 'opacity-100 max-h-[500px] pointer-events-auto' : 'opacity-0 max-h-0 pointer-events-none'
                    }`}
            >
                <div className="max-w-full">
                    {renderMegaMenuContent()}
                </div>
            </div>

            {/* --- MOBILE ACCORDION DRAWER (Full Width, Scrollable & bg-card) --- */}
            <div
                className={`md:hidden absolute top-full left-0 w-full bg-card shadow-2xl transition-all duration-300 ease-in-out origin-top overflow-y-auto max-h-[80vh] ${isMobileMenuOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-0 pointer-events-none'
                    }`}
            >
                <div className="px-6 py-6 flex flex-col gap-4 text-foreground">

                    {/* Mobile Accordion: Services */}
                    <div>
                        <button
                            onClick={() => toggleMobileAccordion('services')}
                            className="flex items-center justify-between w-full py-2.5 font-semibold border-b border-border/20 text-left"
                        >
                            Services
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpandedMenu === 'services' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`flex flex-col gap-1 pl-4 overflow-hidden transition-all duration-300 ${mobileExpandedMenu === 'services' ? 'max-h-[300px] mt-2' : 'max-h-0'}`}>
                            {listServices.map((service: ServiceItem) => (
                                <Link
                                    key={service.slug}
                                    href={`/landing/services/${service.slug}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="py-2 text-sm text-foreground/75 hover:text-vertex-primary"
                                >
                                    {service.title}
                                </Link>
                            ))}
                        </div>
                    </div>

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
                        {/* <a href="tel:+61812345678" className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                            <Phone className="w-4 h-4" />
                            +61 8 1234 5678
                        </a> */}
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