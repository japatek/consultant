// translate/language-data.ts

export const translations = {
    en: {
        //Welcome Chat
        welcomeTitle:"Hello",
        welcomeDesc:"Start Chat With Me",
        // Nav-bar
        services: 'Services',
        sectors: 'Sectors',
        projects: 'Projects',
        about: 'About',
        contact: 'Contact Us',
        engineering: 'Engineering Consulting',
        
        tagline: 'Design & Engineering Specialists',
        title: 'AI-Driven Engineering.',
        subtitle: 'Instant Solutions.',
        desc: 'Unlock next-generation capabilities through our interactive web app. Experience JaPaTek’s advanced knowledge to analyze, simulate, and optimize complex industrial challenges in seconds, access expert consulting, or enroll in our dedicated course to master standard and complex 2D drawings.',
        explore: 'Explore Course',
        core: 'View Our Design',
        ourProjects: 'Our Projects',
        ourServices: 'Our Services',
        ourSectors: 'Our Sectors',
        ourTools: 'Our AI Tools',
        ourMaterial: 'Our Course',
        aboutUs: 'About Us',
        aboutDesc: 'Expert engineering solutions built on experience and precision.',
        exploreLink: 'Explore',
        
        taglineProjects: 'Featured Projects',
        titleProjects: 'Our work in the field',
        allProjects: 'All projects',
        readCaseStudy: 'Read case study',
        
        ctaTag: 'Get in Touch',
        ctaTitleLine1: 'Start your journey',
        ctaTitleLine2: 'with us?',
        ctaDesc: 'Talk to our engineering team about your next project. We provide obligation-free initial consultations to understand your requirements and explore the right approach.',
        
        secTag: 'Our Sectors',
        heading1: 'Expert support across',
        heading2: 'major industrial sectors',
        promotion: 'Clients from a wide range of industries engage JaPaTek for advanced engineering and testing services.',
        exploring: 'Explore',

        clientTag: 'Trusted By Industry Leaders',
        titlePrefix: 'Our ',
        titleHighlight: 'Partners',
        footerText: 'Delivering precision engineering.',

        // About Us Page
        aboutTagline: 'Why Engage JaPaTek',
        aboutTitleLine1: 'Engineering expertise',
        aboutTitleLine2: 'you can rely on',
        aboutDescText: 'JaPaTek Engineering Consulting specializes in structural, civil, and industrial design engineering. We deliver precise, standards-compliant engineering solutions built on modern computational modeling, rigorous simulation, and practical field knowledge.',
        aboutFeatures: [
            { title: 'Accredited & Certified', desc: 'Our team maintains professional standards across structural, civil, and mechanical design disciplines, ensuring full compliance on every engagement.' },
            { title: 'Modern Engineering Design', desc: 'Leveraging 3D CAD modeling, structural simulation (FEA), and advanced analysis to turn complex technical challenges into clear, buildable solutions.' },
            { title: 'End-to-End Delivery', desc: 'From initial feasibility studies and detailed design through to fabrication drawings and quality sign-off — JaPaTek sees every project through to completion.' }
        ],
        aboutStats: [
            { val: '100%', lbl: 'Standards Compliant' },
            { val: '80+', lbl: 'Component Created' },
            { val: '3D/FEA', lbl: 'Advanced Simulation' },
            { val: '100%', lbl: 'Client Satisfaction' }
        ],
        notReady: 'Soory Currently This Feature Not Ready.',
        notReadyDesc: 'We Will Put Maximum Effort to Delivered This Content.',
        yes: 'Confirm',
        bck: 'Back',

        // --- Navigation Menu ---
        navPlatform: 'Platform',
        navArticle: 'Article',
        navCertificate: 'Certification',
        navTraining: 'Task',
        navHome: 'Home',
        navChat: 'Chat',

        // ------------------------------------------------------------------
        // Quest Builder (admin) — Engineering Drawing quests & certification
        // ------------------------------------------------------------------
        questBuilderTitle: 'Build a Quest',
        questBuilderSubtitle: 'Create a new challenge for the Engineering Drawing course.',
        questFieldTitle: 'Title',
        questFieldDifficulty: 'Difficulty',
        questFieldCategory: 'Category',
        questFieldDescription: 'Description',
        questFieldInstructions: 'Instructions',
        questFieldPoints: 'Points',
        questFieldMedia: 'Reference Media',
        questMediaHint: 'Upload an image, video, or PDF for the learner to work from.',
        questFieldAnswerType: 'Answer Type',
        questAnswerMultipleChoice: 'Multiple Choice',
        questAnswerTextInput: 'Text Input',
        questAnswerFileUpload: '3D Model Upload',
        questOptionsLabel: 'Answer Options',
        questAddOption: 'Add Option',
        questRemoveOption: 'Remove',
        questCorrectAnswer: 'Correct Answer',
        questExpectedValue: 'Expected Value',
        questExpectedValueHint: 'e.g. a tolerance value or a force calculation result.',
        questCaseSensitive: 'Case sensitive',
        questTolerance: 'Tolerance (optional)',
        questAllowedFileTypes: 'Allowed File Types',
        questMaxFileSize: 'Max File Size (MB)',
        questUploadFile: 'Upload File',
        questUploading: 'Uploading...',
        questPublish: 'Publish Quest',
        questSaveDraft: 'Save as Draft',
        questSaving: 'Saving...',
        questSaved: 'Quest saved.',
        questSaveError: "Couldn't save the quest — check the form and try again.",

        // Questions within a quest
        questionsLabel: 'Questions',
        questionLabel: 'Question',
        questionPrompt: 'Question Prompt',
        questionAddQuestion: 'Add Question',
        questionRemoveQuestion: 'Remove Question',
        questFieldCertifications: 'Counts Toward Certification(s)',
        questNoCertifications: 'No certifications yet — create one first, or leave this quest as pure training.',

        // Certification dashboard
        dashTitle: 'My Progress',
        dashSubtitle: 'Track your quests and unlock certifications as you go.',
        dashPoints: 'Points',
        dashQuestsCompleted: 'Quests Completed',
        dashStreak: 'Day Streak',
        dashCertifications: 'Certifications',
        dashUnlocked: 'Unlocked',
        dashLocked: 'Locked',
        dashQuestsLeft: 'quests to go',
        dashViewCertificate: 'View Certificate',
        dashDownload: 'Download',
        dashVerificationCode: 'Verification Code',
        dashNoCertifications: 'Complete quests to unlock your first certification.',

        // Pricing / subscription
        pricingTitle: 'Choose Your Plan',
        pricingSubtitle: 'Full access to every quest, tool, and certification.',
        pricingPerWeek: '/ week',
        pricingPerMonth: '/ month',
        pricingPerQuarter: '/ 3 months',
        pricingSubscribe: 'Subscribe',
        pricingProcessing: 'Processing...',
        pricingHaveCode: 'Have a discount code?',
        pricingApply: 'Apply',
        pricingCurrentPlan: 'Current Plan',
        pricingMostPopular: 'Most Popular',
        pricingError: "Couldn't start checkout — please try again.",

        // Admin — marketing / pricing management
        adminPricingTitle: 'Pricing & Discounts',
        adminPricingSubtitle: 'Manage subscription plans and discount codes.',
        adminAddPlan: 'Add Plan',
        adminEditPlan: 'Edit Plan',
        adminAddDiscount: 'Add Discount',
        adminEditDiscount: 'Edit Discount',
        adminActive: 'Active',
        adminInactive: 'Inactive',
        adminRedemptions: 'Redemptions',
        adminSave: 'Save',
        adminCancel: 'Cancel',

        // Admin — certifications
        certAdminTitle: 'Certifications',
        certAdminSubtitle: 'Manage certifications and see which quests feed each one.',
        certAdminAdd: 'Add Certification',
        certAdminEdit: 'Edit Certification',
        certAdminLinkedQuests: 'Linked Quests',
        certAdminEarnedBy: 'Earned By',
        certAdminBadge: 'Badge Image',
    },
    id: {
        // Welcome
        welcomeTitle:"Hallo",
        welcomeDesc:"Ada yang bisa saya bantu?",
        // Navbar
        services: 'Layanan',
        sectors: 'Sektor',
        projects: 'Proyek',
        about: 'Tentang Kami',
        contact: 'Hubungi Kami',
        engineering: 'Konsultan Teknik',

        // Hero
        tagline: 'Spesialis Desain & Konsultan Teknik',
        title: 'Rekayasa Berbasis AI.',
        subtitle: 'Solusi Instan.',
        desc: 'Buka kapabilitas generasi masa depan melalui aplikasi web interaktif kami. Rasakan keandalan kami untuk menganalisis, mensimulasikan, dan mengoptimalkan tantangan industri yang kompleks dalam hitungan detik, akses layanan konsultasi ahli, atau ikuti kursus khusus kami untuk menguasai gambar teknik 2D standar maupun kompleks.',
        explore: 'Jelajahi Kursus Singkat',
        core: 'Lihat Hasil Desain Kami',
        ourProjects: 'Proyek Kami',
        ourServices: 'Layanan Kami',
        ourSectors: 'Sektor Kami',
        ourTools: 'Alat AI kami',
        ourMaterial: 'Materi Pembelajaran Kami',
        aboutUs: 'Tentang Kami',
        aboutDesc: 'Solusi teknik ahli yang dibangun berdasarkan pengalaman dan presisi.',
        exploreLink: 'Jelajahi',

        // Featured-proyek
        taglineProjects: 'Proyek Unggulan',
        titleProjects: 'Karya kami di lapangan',
        allProjects: 'Lihat Semua',
        readCaseStudy: 'Baca studi kasus',

        // CTA
        ctaTag: 'Hubungi Kami',
        ctaTitleLine1: 'Mulai perjalanan anda',
        ctaTitleLine2: 'dengan kami?',
        ctaDesc: 'Diskusikan proyek Anda selanjutnya dengan tim teknik kami. Kami menyediakan konsultasi awal tanpa komitmen untuk memahami kebutuhan Anda dan mengeksplorasi pendekatan yang tepat.',

        // Sektor Page
        secTag: 'Sektor Kami',
        heading1: 'Dukungan ahli di seluruh',
        heading2: 'sektor industri utama',
        promotion: 'Klien dari berbagai industri mempercayai JaPaTek untuk layanan teknik dan pengujian tingkat lanjut.',
        exploring: 'Jelajahi',

        // Klien Page
        clientTag: 'Dipercaya Oleh Pemimpin Industri',
        titlePrefix: 'Mitra ',
        titleHighlight: 'Kami',
        footerText: 'Memberikan rekayasa yang presisi',

        // About Us Page
        aboutTagline: 'Mengapa Memilih JaPaTek',
        aboutTitleLine1: 'Keahlian teknik yang',
        aboutTitleLine2: 'dapat Anda andalkan',
        aboutDescText: 'JaPaTek Engineering Consulting berspesialisasi dalam rekayasa desain struktural, sipil, dan industri. Kami memberikan solusi rekayasa yang presisi, sesuai standar, dibangun di atas pemodelan komputasi modern, simulasi yang ketat, dan pengetahuan lapangan yang praktis.',
        aboutFeatures: [
            { title: 'Terakreditasi & Bersertifikat', desc: 'Tim kami mempertahankan standar profesional di seluruh disiplin desain struktural, sipil, dan mekanikal, memastikan kepatuhan penuh pada setiap proyek.' },
            { title: 'Desain Teknik Modern', desc: 'Memanfaatkan pemodelan CAD 3D, simulasi struktural (FEA), dan analisis lanjutan untuk mengubah tantangan teknis yang rumit menjadi solusi yang jelas dan dapat dibangun.' },
            { title: 'Pengiriman Ujung-ke-Ujung', desc: 'Dari studi kelayakan awal dan desain terperinci hingga gambar fabrikasi dan persetujuan kualitas — JaPaTek mengawal setiap proyek hingga selesai.' }
        ],
        aboutStats: [
            { val: '100%', lbl: 'Sesuai Standar' },
            { val: '50+', lbl: 'Proyek Selesai' },
            { val: '3D/FEA', lbl: 'Simulasi Lanjutan' },
            { val: '100%', lbl: 'Kepuasan Klien' }
        ],
        notReady: 'Mohon Maaf Fitur Belum Tersedia',
        notReadyDesc: 'Saat Ini Kami Sedang Berusaha Untuk Mengembangkan Fitur ini.',
        yes: 'Mengerti',
        bck: 'Kembali',

        // --- Navigation Menu ---
        navPlatform: 'Platform',
        navArticle: 'Artikel',
        navCertificate: 'Sertifikat',
        navTraining: 'Latihan',
        navHome: 'Beranda',
        navChat: 'Chat',

        // ------------------------------------------------------------------
        // Quest Builder (admin) — Kuis/Sertifikasi Gambar Teknik
        // ------------------------------------------------------------------
        questBuilderTitle: 'Buat Quest',
        questBuilderSubtitle: 'Buat tantangan baru untuk kursus Gambar Teknik.',
        questFieldTitle: 'Judul',
        questFieldDifficulty: 'Tingkat Kesulitan',
        questFieldCategory: 'Kategori',
        questFieldDescription: 'Deskripsi',
        questFieldInstructions: 'Instruksi',
        questFieldPoints: 'Poin',
        questFieldMedia: 'Media Referensi',
        questMediaHint: 'Unggah gambar, video, atau PDF sebagai bahan acuan peserta.',
        questFieldAnswerType: 'Tipe Jawaban',
        questAnswerMultipleChoice: 'Pilihan Ganda',
        questAnswerTextInput: 'Input Teks',
        questAnswerFileUpload: 'Unggah Model 3D',
        questOptionsLabel: 'Opsi Jawaban',
        questAddOption: 'Tambah Opsi',
        questRemoveOption: 'Hapus',
        questCorrectAnswer: 'Jawaban Benar',
        questExpectedValue: 'Nilai yang Diharapkan',
        questExpectedValueHint: 'Misalnya nilai toleransi atau hasil perhitungan gaya.',
        questCaseSensitive: 'Peka huruf besar/kecil',
        questTolerance: 'Toleransi (opsional)',
        questAllowedFileTypes: 'Tipe File yang Diizinkan',
        questMaxFileSize: 'Ukuran File Maks (MB)',
        questUploadFile: 'Unggah File',
        questUploading: 'Mengunggah...',
        questPublish: 'Publikasikan Quest',
        questSaveDraft: 'Simpan sebagai Draf',
        questSaving: 'Menyimpan...',
        questSaved: 'Quest tersimpan.',
        questSaveError: 'Quest gagal disimpan — periksa formulir dan coba lagi.',

        // Pertanyaan dalam satu quest
        questionsLabel: 'Pertanyaan',
        questionLabel: 'Pertanyaan',
        questionPrompt: 'Teks Pertanyaan',
        questionAddQuestion: 'Tambah Pertanyaan',
        questionRemoveQuestion: 'Hapus Pertanyaan',
        questFieldCertifications: 'Termasuk Sertifikasi',
        questNoCertifications: 'Belum ada sertifikasi — buat satu terlebih dahulu, atau biarkan quest ini sebagai latihan saja.',

        // Certification dashboard
        dashTitle: 'Progres Saya',
        dashSubtitle: 'Pantau quest Anda dan buka sertifikasi seiring waktu.',
        dashPoints: 'Poin',
        dashQuestsCompleted: 'Quest Selesai',
        dashStreak: 'Hari Beruntun',
        dashCertifications: 'Sertifikasi',
        dashUnlocked: 'Terbuka',
        dashLocked: 'Terkunci',
        dashQuestsLeft: 'quest lagi',
        dashViewCertificate: 'Lihat Sertifikat',
        dashDownload: 'Unduh',
        dashVerificationCode: 'Kode Verifikasi',
        dashNoCertifications: 'Selesaikan quest untuk membuka sertifikasi pertama Anda.',

        // Pricing / subscription
        pricingTitle: 'Pilih Paket Anda',
        pricingSubtitle: 'Akses penuh ke semua quest, alat, dan sertifikasi.',
        pricingPerWeek: '/ minggu',
        pricingPerMonth: '/ bulan',
        pricingPerQuarter: '/ 3 bulan',
        pricingSubscribe: 'Berlangganan',
        pricingProcessing: 'Memproses...',
        pricingHaveCode: 'Punya kode diskon?',
        pricingApply: 'Terapkan',
        pricingCurrentPlan: 'Paket Saat Ini',
        pricingMostPopular: 'Paling Populer',
        pricingError: 'Checkout gagal dimulai — silakan coba lagi.',

        // Admin — manajemen harga & pemasaran
        adminPricingTitle: 'Harga & Diskon',
        adminPricingSubtitle: 'Kelola paket langganan dan kode diskon.',
        adminAddPlan: 'Tambah Paket',
        adminEditPlan: 'Ubah Paket',
        adminAddDiscount: 'Tambah Diskon',
        adminEditDiscount: 'Ubah Diskon',
        adminActive: 'Aktif',
        adminInactive: 'Tidak Aktif',
        adminRedemptions: 'Penukaran',
        adminSave: 'Simpan',
        adminCancel: 'Batal',

        // Admin — sertifikasi
        certAdminTitle: 'Sertifikasi',
        certAdminSubtitle: 'Kelola sertifikasi dan lihat quest mana yang menjadi syaratnya.',
        certAdminAdd: 'Tambah Sertifikasi',
        certAdminEdit: 'Ubah Sertifikasi',
        certAdminLinkedQuests: 'Quest Terkait',
        certAdminEarnedBy: 'Diperoleh Oleh',
        certAdminBadge: 'Gambar Lencana',
    }
};

export type Language = keyof typeof translations;
// Extract the type of the translation object for type safety
export type TranslationType = typeof translations['en'];