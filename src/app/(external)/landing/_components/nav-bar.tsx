'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from "js-cookie";
import { ChevronDown, ArrowRight, Menu, X } from 'lucide-react';

import { featuredProjects } from '../_lib/featured-projects-data';
import { servicesData, Services } from '../_lib/services-data';
import { getArticles } from '../_lib/article-data'; // Import dari file action yang baru

import { ThemeSwitcher } from "./theme-switcher";
import { LanguageSelector } from "@/components/ui/language-selector";
import { translations, Language } from "@/translate/language-data"; 
import { ContactDialog } from './contact-dialog';

const defaultMedia = { 
    leftImg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600', 
    rightImg: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80&w=600' 
};

const aboutData = {
    'Our Company': { leftImg: 'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/about/logo.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzQ4NzgzMjQ4LCJpYXQiOjE3OTAzMDU1ODMzODN9.JXvNWR9t9_uiztz-xwz7OsCvinNCpvn6cxydaPe18t4&vercel-blob-signature=PzCmAWdymLPIIDytimRHEgZAycWAFaDw-RoiePtSYQQ', rightImg: 'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/about/002.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzQ4ODgzMzUxLCJpYXQiOjE3OTAzMDU2ODM0OTV9.NXuGbjNz7bcyCwR2SYFsJiDqxX2zZz9ZZGww_wpZub4&vercel-blob-signature=98HFZPYMh1BRxCiTGmNeNMMRhNgE6d-DOfWNmy2U_mo' },
    'Our Team': { leftImg: 'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/about/003.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzQ4ODI3Mjc5LCJpYXQiOjE3OTAzMDU2Mjc0MjB9.ilv3zoiN6lvsebzGEpO69C4JyG74Sh1vWUWp6NIBJr0&vercel-blob-signature=mnVkdME1tCPwYg34kQXdZRBX9pGh8W6gu0OrXGtiMp0', rightImg: 'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/about/001.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzQ4ODUwMjIzLCJpYXQiOjE3OTAzMDU2NTAzNjd9.r0B90qtCbcDNnF4LrNdS3DVz1RbrUBCLc6zPHGHhi6Y&vercel-blob-signature=5lNP4bB0Msw1JwL6Q0H1UIG5Cf3Z5kLGf1qm5KmpAtQ' },
};

const serviceMenuMedia: Record<string, { leftImg: string; rightImg: string }> = {
    'heavy-machinery': { leftImg:'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/featured-projects/pln-ip-2.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzUwMTYxNTE2LCJpYXQiOjE3OTAzMDY5NjE3MTR9.643qPwzZR0zd8iaRGMY7b8Wayp3vpQJuAQiAEhvXu9c&vercel-blob-signature=2VsUy3aOznW8uljZjzGCyrGj8jQlwcjcOM12N41_4KY', rightImg: 'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/featured-projects/root-blower.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzUwMTg5NDQ1LCJpYXQiOjE3OTAzMDY5ODk1NzV9.YVoXTsTfC7_ZEz3ozzQL1NHHL9xJ-NBwRfBW92dZd9Q&vercel-blob-signature=dQJZLKaGZSCZWodepTRtNbNwBbs41Zl99pzHw6DrWLs' },
    'robotics': { leftImg: 'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/featured-projects/robotics-2.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzUwMjE3NzM4LCJpYXQiOjE3OTAzMDcwMTc4NzB9.pH6A9CmbjsEdI7xCd_vUx8Ps5EUb4KhaYPU7t_V1vKk&vercel-blob-signature=ai_rLv9K67tFeWkRD4QEnDIRgez0-DWaA6YA2bUGci4', rightImg: 'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/featured-projects/robotics-1.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzUwMjM0ODQwLCJpYXQiOjE3OTAzMDcwMzQ5NzZ9.Jzbuc1gQJRSNe43nJOuM1GESrygxKR9817T2U2RSso8&vercel-blob-signature=KwQ-llq1ruegZffHc9tOsynXbYDAD6t7tI-F876hCSI' },
    'structural': { leftImg: 'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/featured-projects/edu-bot-2.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzUwNjUyNTMyLCJpYXQiOjE3OTAzMDc0NTI2NTl9.An2aFaZ8mO04pj7mLfRzIPSPDLKO6bLf5mmDWYTiDT0&vercel-blob-signature=WYyESgdsAJ57s-epvobvyPSjp7Ow676p0RAW2MUNPB4', rightImg: 'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/featured-projects/pipe-drawing.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzYzNTAxMzMwLCJpYXQiOjE3OTAzMjAzMDE0ODB9.e9l6XPXzZ0UHKHodf8gLjoLanckBoZD41yrM3ksvcIU&vercel-blob-signature=kMr-bSeCrRhm_h82UBTelRjv6Ez928O3B3QS6QHrx2U' },
    'others': { leftImg: 'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/featured-projects/pc-1.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzUwMzEyNDcwLCJpYXQiOjE3OTAzMDcxMTI2MDN9.IRu7-7DHXHPjWvBscQhbAHbX0JJV3o6DsKO7fXMozxo&vercel-blob-signature=40ymtAiUbxUl_3faYHaUzZwjolo6DRcYZJCFDKOggaQ', rightImg: 'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/featured-projects/3dp.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzUwMzg4MjgwLCJpYXQiOjE3OTAzMDcxODg0MTN9.Itl3P4RGZyyCtqQb-w_pxsw623lh3v-kI62XNfB70Gg&vercel-blob-signature=-MF8JL-XjU_f8wrb4wtG05UPv6ThIMaWZsXefxzG4F8' }
};

const projectMenuMedia: Record<string, { leftImg: string; rightImg: string }> = {
    'pln-ip': { leftImg: 'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/featured-projects/pln-ip-1.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzUwNDIwOTg0LCJpYXQiOjE3OTAzMDcyMjExMTV9.-7WnJgPizwg5vBmcMytACoCWK6o-D1IYr_NsGJAKz1M&vercel-blob-signature=8DTD0ZUzLbXLvnhkaJUNp8QXxRXvRihsIIC-WdSuSec', rightImg: 'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/featured-projects/pln-ip-2.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzUwNTM2OTc1LCJpYXQiOjE3OTAzMDczMzcxMTJ9.jXzcH-sJCC_g86mzvoAKtGqfbQUaYuZMiRuW9LbTEwI&vercel-blob-signature=LSXYNuBfbp3JNbvXEbU-wDOFEvn4hpqPSZH-U7iUCWw' },
    'ipal': { leftImg: 'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/featured-projects/ipal-1.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzUwNDgzODgyLCJpYXQiOjE3OTAzMDcyODQwMDh9.N9AQeqdrcTnevvShnbOoEOeHnOuuyZMGyTAClhCRMTo&vercel-blob-signature=taSHZffVxkRq3cHh3ipKOz2X52ykxJhROhgEIn9NXzY', rightImg: 'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/featured-projects/ipal-2.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzUwNTc1ODQyLCJpYXQiOjE3OTAzMDczNzYwMjh9.TD2ckTeV0C3IMImrWJ2BbztyBxIfLRD3dwHWVxk4cm8&vercel-blob-signature=6Wpb_qv_x9V5DXocilJNwHic_OKwn1Gr2C0xiH2iLTg' },
    'vending-machine': { leftImg: 'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/featured-projects/robotics-2.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzUwNTAwNDM1LCJpYXQiOjE3OTAzMDczMDA1NjV9.ZSZ1DP4pVtKdYKCnuUdR25urFLIr02SUIvZRnDcMiGg&vercel-blob-signature=g9ijJErIdtb7j-G7CG-qd_5YGMTcN8nDqEkDIJCO7z8', rightImg: 'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/featured-projects/robotics-3.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzUwNjA3MDY5LCJpYXQiOjE3OTAzMDc0MDcyMzN9.LDEuip-L5hOKgS_y6a0bii02ZOx5Ol8VoYihQhkT6iE&vercel-blob-signature=5oVRD3pxRVhZaguVKxU6HUu5uj3vH3E3DZbeq9ABQkY' },
    'edu-bot': { leftImg: 'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/featured-projects/robotics-1.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzUwNTE2MDg5LCJpYXQiOjE3OTAzMDczMTYyMjN9.Scwc57-DAmo_tNKq7TbSSAj78WWE_Rxflh9V7GWqsyg&vercel-blob-signature=Z8GROLX5ozduEW13_3hn7hU2PRjdpqNNJxPucAMiM7o', rightImg: 'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/featured-projects/edu-bot-2.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzUwNjUyNTMyLCJpYXQiOjE3OTAzMDc0NTI2NTl9.An2aFaZ8mO04pj7mLfRzIPSPDLKO6bLf5mmDWYTiDT0&vercel-blob-signature=WYyESgdsAJ57s-epvobvyPSjp7Ow676p0RAW2MUNPB4' },
    'joglo-house': { leftImg: 'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/featured-projects/rumah-joglo.jpeg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzYzODMzMTIxLCJpYXQiOjE3OTAzMjA2MzMyNzh9.eMbEbLq4Lhv6X-B1QIfap2SHQsX26dLGz4oggly4ZdY&vercel-blob-signature=T33bMlFnLBDJyK2rXxQv93DkJ61pcGMpLYs-16f1Wi0', rightImg:'https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/featured-projects/pengukuran.jpeg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzYzNzExMzA5LCJpYXQiOjE3OTAzMjA1MTE0ODN9.AulMOTKGVDwYQRUDK2liTyVXEUikcH1IgmS2owqlLjc&vercel-blob-signature=q1oNdiYIJA0rqWZBKyuuKjLFOh3qyPh5RkI7t1fmTG0'}
};

type MenuCategory = 'services' | 'project' | 'about' | 'article';

const getMenuImages = (menu: MenuCategory, slug: string) => {
    if (menu === 'services') return serviceMenuMedia[slug] || serviceMenuMedia['piping-system'] || defaultMedia;
    if (menu === 'project') return projectMenuMedia[slug] || projectMenuMedia['pln-ip'] || defaultMedia;
    return aboutData[slug as AboutKeys] || aboutData['Our Company'] || defaultMedia;
};

type AboutKeys = keyof typeof aboutData;

const getPageHref = (menu: MenuCategory, slug?: string) => {
    if (menu === 'services') return slug ? `/landing/services/${slug}` : '/landing/services';
    if (menu === 'project') return slug ? `/landing/project/${slug}` : '/landing/project';
    if (menu === 'article') return slug ? `/landing/article/${slug}` : '/landing/article'; 
    if (menu === 'about') return slug === 'Our Team' ? '/landing/team' : '/landing/about';
    return '/';
};

const formatMenuLabel = (item: any, lang: Language) => {
    if (lang === 'id') {
        if (item.id_title) return item.id_title;
        if (item.id_name) return item.id_name;
        if (item.slug === 'Our Company') return 'Perusahaan Kami';
        if (item.slug === 'Our Team') return 'Tim Kami';
    }
    return item.title ?? item.name ?? item.slug ?? '';
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
    
    // State Hover untuk Menu Statis
    const [hoveredSectorSlug, setHoveredSectorSlug] = useState<string>(getInitialHoverSlug('services'));
    const [hoveredProjectSlug, setHoveredProjectSlug] = useState<string>(getInitialHoverSlug('project'));
    const [hoveredAbout, setHoveredAbout] = useState<AboutKeys>('Our Company');
    
    // State untuk Artikel dari Database
    const [dbArticles, setDbArticles] = useState<any[]>([]);
    const [hoveredArticleSlug, setHoveredArticleSlug] = useState<string>(''); 

    // State Mobile Menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [mobileExpandedMenu, setMobileExpandedMenu] = useState<MenuCategory | null>(null);

    useEffect(() => {
        const currentLang = (Cookies.get("language") as Language) || 'en';
        setLang(currentLang);

        const handleLangChange = (e: any) => {
            if (e.detail) setLang(e.detail as Language);
        };
        window.addEventListener('languageChange', handleLangChange);

        const handleScroll = () => setIsScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Ambil data artikel dari Database saat komponen dimuat
        async function fetchArticles() {
            const data = await getArticles();
            setDbArticles(data);
            if (data && data.length > 0) {
                setHoveredArticleSlug(data[0].slug); // Set hover default ke artikel pertama
            }
        }
        fetchArticles();

        return () => {
            window.removeEventListener('languageChange', handleLangChange);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const t = translations[lang];

    const getMenuItems = (menu: MenuCategory) => {
        if (menu === 'services') return servicesData;
        if (menu === 'project') return featuredProjects;
        if (menu === 'article') return dbArticles; // Kembalikan state dari database
        return Object.keys(aboutData).map((name) => ({ slug: name, title: name, desc: '' }));
    };

    const toggleMobileAccordion = (menu: MenuCategory) => {
        setMobileExpandedMenu(mobileExpandedMenu === menu ? null : menu);
    };

    const renderMegaMenuContent = () => {
        if (!activeMenu) return null;
        const items = getMenuItems(activeMenu);
        if (!items || items.length === 0) return null; 

        const selectedSlug = 
            activeMenu === 'services' ? hoveredSectorSlug : 
            activeMenu === 'project' ? hoveredProjectSlug : 
            activeMenu === 'article' ? hoveredArticleSlug : 
            hoveredAbout;
            
        const selectedItem = items.find((item: any) => item.slug === selectedSlug) || items[0];
        
        // Logika dinamis untuk gambar. Jika menu article dan punya imageUrl, gunakan. Jika tidak, gunakan default.
        const menuImages = activeMenu === 'article' && selectedItem?.imageUrl 
            ? { leftImg: selectedItem.imageUrl, rightImg: selectedItem.imageUrl } 
            : getMenuImages(activeMenu, selectedItem?.slug) || defaultMedia;

        return (
            <div className="grid grid-cols-3 gap-8 items-center h-full p-8">
                <div className="h-[400px] overflow-hidden bg-muted rounded-[32px]">
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
                                    if (activeMenu === 'services') setHoveredSectorSlug(item.slug);
                                    if (activeMenu === 'project') setHoveredProjectSlug(item.slug);
                                    if (activeMenu === 'article') setHoveredArticleSlug(item.slug); 
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
                
                <a href="/" className="flex flex-col no-underline z-10 group">
                    <span className="font-extrabold text-xl sm:text-2xl tracking-tighter leading-none bg-chart-2 bg-clip-text text-transparent">
                        JaPaTek
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-semibold tracking-[0.2em] uppercase leading-none mt-1 bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]">
                        {t.engineering}
                    </span>
                </a>

                <div className="hidden md:flex items-center gap-0.5">
                    <Link href="/landing/services" onMouseEnter={() => setActiveMenu('services')} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white/85 font-medium transition-all duration-200 ${activeMenu === 'services' ? 'bg-card/10 text-foreground' : textStyle}`}>
                        {t.services} <ChevronDown className={`w-3.5 h-3.5 opacity-65 transition-transform duration-200 ${activeMenu === 'services' ? 'rotate-180' : ''}`} />
                    </Link>
                    <Link href="/landing/project" onMouseEnter={() => setActiveMenu('project')} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white/85 font-medium transition-all duration-200 ${activeMenu === 'project' ? 'bg-card/10 text-foreground' : textStyle}`}>
                        {t.projects} <ChevronDown className={`w-3.5 h-3.5 opacity-65 transition-transform duration-200 ${activeMenu === 'project' ? 'rotate-180' : ''}`} />
                    </Link>
                    
                    {/* Menu Artikel Dinamis */}
                    <Link href="/landing/article" onMouseEnter={() => setActiveMenu('article')} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white/85 font-medium transition-all duration-200 ${activeMenu === 'article' ? 'bg-card/10 text-foreground' : textStyle}`}>
                        {lang === 'id' ? 'Artikel' : 'Articles'} <ChevronDown className={`w-3.5 h-3.5 opacity-65 transition-transform duration-200 ${activeMenu === 'article' ? 'rotate-180' : ''}`} />
                    </Link>

                    <Link href="/landing/about" onMouseEnter={() => setActiveMenu('about')} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white/85 font-medium transition-all duration-200 ${activeMenu === 'about' ? 'bg-card/10 text-foreground' : textStyle}`}>
                        {t.about} <ChevronDown className={`w-3.5 h-3.5 opacity-65 transition-transform duration-200 ${activeMenu === 'about' ? 'rotate-180' : ''}`} />
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <ContactDialog>
                        <button className="inline-flex items-center gap-1.5 bg-primary text-white border-none rounded-lg px-[18px] py-[9px] text-sm font-semibold cursor-pointer transition-all hover:bg-vertex-primary-hover hover:-translate-y-0.5 z-10">
                            {t.contact}
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </ContactDialog>

                    <div className="flex items-center gap-2">
                        <ThemeSwitcher />
                        <LanguageSelector />
                    </div>
                </div>

                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden relative p-2 rounded-lg text-white hover:bg-white/10 transition-colors z-50"
                    aria-label="Toggle Menu"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            <div className={`hidden md:block absolute top-full left-0 w-full bg-card shadow-xl transition-all duration-300 origin-top overflow-hidden ${activeMenu ? 'opacity-100 max-h-[500px] pointer-events-auto' : 'opacity-0 max-h-0 pointer-events-none'}`}>
                <div className="max-w-full">
                    {renderMegaMenuContent()}
                </div>
            </div>

            <div className={`md:hidden absolute top-full left-0 w-full bg-card shadow-2xl transition-all duration-300 ease-in-out origin-top overflow-y-auto max-h-[80vh] ${isMobileMenuOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                <div className="px-6 py-6 flex flex-col gap-4 text-foreground">
                    <div>
                        <button onClick={() => toggleMobileAccordion('services')} className="flex items-center justify-between w-full py-2.5 font-semibold border-b border-border/20 text-left">
                            {t.services}
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpandedMenu === 'services' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`flex flex-col gap-1 pl-4 overflow-hidden transition-all duration-300 ${mobileExpandedMenu === 'services' ? 'max-h-[300px] mt-2' : 'max-h-0'}`}>
                            {servicesData.map((services: Services) => (
                                <Link key={services.slug} href={`/landing/services/${services.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm text-foreground/75 hover:text-vertex-primary">
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

                    {/* Accordion Artikel Dinamis untuk Mobile */}
                    <div>
                        <button onClick={() => toggleMobileAccordion('article')} className="flex items-center justify-between w-full py-2.5 font-semibold border-b border-border/20 text-left">
                            {lang === 'id' ? 'Artikel' : 'Articles'}
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpandedMenu === 'article' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`flex flex-col gap-1 pl-4 overflow-hidden transition-all duration-300 ${mobileExpandedMenu === 'article' ? 'max-h-[300px] mt-2' : 'max-h-0'}`}>
                            {dbArticles.length === 0 ? (
                                <span className="py-2 text-sm text-foreground/50 italic">
                                    {lang === 'id' ? 'Belum ada artikel' : 'No articles yet'}
                                </span>
                            ) : (
                                dbArticles.map((article: any) => (
                                    <Link key={article.slug} href={`/landing/article/${article.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm text-foreground/75 hover:text-vertex-primary line-clamp-1">
                                        {lang === 'id' && article.id_title ? article.id_title : article.title}
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    <div>
                        <button onClick={() => toggleMobileAccordion('about')} className="flex items-center justify-between w-full py-2.5 font-semibold border-b border-border/20 text-left">
                            {t.about}
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpandedMenu === 'about' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`flex flex-col gap-1 pl-4 overflow-hidden transition-all duration-300 ${mobileExpandedMenu === 'about' ? 'max-h-[300px] mt-2' : 'max-h-0'}`}>
                            {Object.keys(aboutData).map((name) => {
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
                        <ContactDialog>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="inline-flex items-center justify-center w-full gap-2 bg-vertex-primary text-white rounded-lg py-3 text-sm font-semibold shadow-md">
                                {t.contact}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </ContactDialog>
                        
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