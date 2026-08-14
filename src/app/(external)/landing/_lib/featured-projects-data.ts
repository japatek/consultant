export interface Project {
  tag: string;
  title: string;
  desc: string;
  slug: string;
  extend_desc: string;
  
  // Added optional Indonesian fields
  id_tag?: string;
  id_title?: string;
  id_desc?: string;
  id_extend_desc?: string;

  media: {
    type: 'image' | 'video';
    url: string;
    alt?: string;
  };
}

export const featuredProjects: Project[] = [
  {
    tag: "Heavy Machinery",
    id_tag: "Alat Berat",
    title: "Inspection Simulation For Gas Turbine M701F",
    id_title: "Simulasi Inspeksi Turbin Gas M701F",
    desc: "Development of a complex 3D exploded view and visual simulation for the M701F gas turbine, detailed to highlight internal components and maintenance inspection workflows for digital website content.",
    id_desc: "Pengembangan tampilan pecahan (exploded view) 3D yang kompleks dan simulasi visual untuk turbin gas M701F, dirinci untuk menyoroti komponen internal dan alur kerja inspeksi pemeliharaan untuk konten situs web digital.",
    slug: "pln-ip",
    extend_desc: `  On This project we assist PT.Tensor Sinergi Indonesia to delivers a comprehensive inspection simulation for the M701F gas turbine, commissioned by PT. Indonesia Power to support both maintenance planning and external communications. The solution is centered on a highly detailed 3D exploded view of the turbine, with a focus on making complex mechanical relationships easy to understand for technical teams and non-technical stakeholders alike.

  The project is framed around a series of practical design pointers:
  • Component-level visualization – each major assembly is isolated and labelled to show compressor stages, combustor sections, turbine blades, shaft bearings, seals, and lubrication systems.
  • Inspection workflow sequencing – the simulation traces a logical inspection path, highlighting which panels to remove, which sensor readings to capture, and the order in which critical components should be assessed.
  • Maintenance risk communication – the tool identifies high-wear elements and provides a narrative for remaining useful life, allowing teams to prioritize replacement schedules and minimize unplanned downtime.
  • Training and familiarization – the asset is designed for onboarding new technicians, supporting a step-by-step exploration of turbine internals without needing physical access to a running unit.
  • Digital portfolio integration – the simulation doubles as a marketing asset, presenting an engineering story that enhances the company’s digital footprint while preserving technical credibility.

  This extended description clarifies how the project serves distinct audiences. For frontline engineers, it offers an inspection-oriented reference that makes maintenance tasks more efficient and less error-prone. For project managers and operational planners, it provides a clear, visual representation of inspection stages, helping to align resources, schedule outages, and coordinate vendor support.

  From a content perspective, the deliverable is positioned as an accessible digital showcase. It augments the website narrative by demonstrating the firm’s ability to handle complex power plant systems and deliver technically accurate, visually compelling simulations. The simulation is structured to answer the questions most relevant to the client: where are the critical components, how do they connect, and what should be checked during an inspection.

  In summary, the M701F inspection simulation is both a functional engineering asset and a communication platform. It is built to reduce inspection risk, improve team alignment, and elevate the client’s portfolio through a polished digital story that is grounded in real maintenance requirements.`,
    id_extend_desc: `  Pada Proyek ini Kami membantu PT. Tensor Sinergi Indonesia  untuk melakukan simulasi inspeksi yang komprehensif pada mesin turbin gas M701F, proyek ini ditugaskan oleh PT. Indonesia Power untuk mendukung perencanaan pemeliharaan dan komunikasi eksternal. Solusi ini berpusat pada tampilan pecahan 3D turbin yang sangat mendetail, dengan fokus untuk membuat hubungan mekanis yang kompleks mudah dipahami baik oleh tim teknis maupun pemangku kepentingan non-teknis.

  Proyek ini disusun berdasarkan serangkaian poin desain praktis:
  • Visualisasi tingkat komponen – setiap rakitan utama diisolasi dan diberi label untuk menunjukkan tahapan kompresor, bagian ruang bakar, bilah turbin, bantalan poros, segel, dan sistem pelumasan.
  • Pengurutan alur kerja inspeksi – simulasi melacak jalur inspeksi logis, menyoroti panel mana yang harus dilepas, pembacaan sensor mana yang harus ditangkap, dan urutan komponen kritis yang harus dinilai.
  • Komunikasi risiko pemeliharaan – alat ini mengidentifikasi elemen dengan tingkat keausan tinggi dan memberikan narasi untuk sisa umur pakai, memungkinkan tim untuk memprioritaskan jadwal penggantian dan meminimalkan waktu henti yang tidak direncanakan.
  • Pelatihan dan pengenalan – aset ini dirancang untuk orientasi teknisi baru, mendukung eksplorasi langkah-demi-langkah dari bagian dalam turbin tanpa memerlukan akses fisik ke unit yang sedang berjalan.
  • Integrasi portofolio digital – simulasi ini juga berfungsi sebagai aset pemasaran, menyajikan cerita teknik yang meningkatkan jejak digital perusahaan sambil mempertahankan kredibilitas teknis.

  Deskripsi tambahan ini memperjelas bagaimana proyek melayani audiens yang berbeda. Bagi insinyur garis depan, ini menawarkan referensi berorientasi inspeksi yang membuat tugas pemeliharaan lebih efisien dan tidak rentan terhadap kesalahan. Bagi manajer proyek dan perencana operasional, ini memberikan representasi visual yang jelas tentang tahapan inspeksi, membantu menyelaraskan sumber daya, menjadwalkan pemadaman, dan mengoordinasikan dukungan vendor.

  Dari perspektif konten, hasil kerjanya diposisikan sebagai etalase digital yang dapat diakses. Hal ini melengkapi narasi situs web dengan menunjukkan kemampuan perusahaan untuk menangani sistem pembangkit listrik yang kompleks dan memberikan simulasi yang akurat secara teknis dan menarik secara visual. Simulasi ini terstruktur untuk menjawab pertanyaan yang paling relevan bagi klien: di mana komponen kritis berada, bagaimana mereka terhubung, dan apa yang harus diperiksa selama inspeksi.

  Singkatnya, simulasi inspeksi M701F adalah aset rekayasa fungsional sekaligus platform komunikasi. Ini dibangun untuk mengurangi risiko inspeksi, meningkatkan keselarasan tim, dan mengangkat portofolio klien melalui cerita digital yang disempurnakan dan didasarkan pada kebutuhan pemeliharaan yang nyata.`,
    media: {
      type: 'image',
      url: 'https://d2tbt8ofproiin.cloudfront.net/pln-ip/pln-ip-1.jpg',
      alt: 'Gas Turbine M701F'
    }
  },
  {
    tag: "Waste Management",
    id_tag: "Manajemen Limbah",
    title: "Water Waste Treatment Plant Design",
    id_title: "Desain Instalasi Pengolahan Air Limbah",
    desc: "Detailed piping and instrumentation with layout design and project management for a major water treatment plant with 7000 TCD capacity for sugar mill factory owned by PT. Perkebunan Nusantara based in indonesia.",
    id_desc: "Detail perpipaan dan instrumentasi dengan desain tata letak dan manajemen proyek untuk instalasi pengolahan air utama berkapasitas 7000 TCD untuk pabrik gula milik PT. Perkebunan Nusantara di Indonesia.",
    slug: "ipal",
    extend_desc: `  We help PT. LPP Agro Nusantara on create a complete water waste treatment plant design for a 7000 TCD facility serving a sugar mill owned by PT. Rajawali Nusindo. The engineering scope covers the full process from influent intake to final effluent discharge, with an emphasis on reliability, maintainability, and alignment with environmental discharge standards.

  The description is structured around a set of practical pointers:
  • Process sequencing – the design clearly maps how wastewater moves from reception and screening to equalization, biological treatment, clarification, tertiary polishing, and sludge handling.
  • Layout optimization – the plant layout balances equipment placement, piping routes, access for inspection, and service corridors to support safe operation and maintenance.
  • Piping and instrumentation integration – the plan details how process piping, valves, pumps, flow meters, analyzers, and control panels work together to maintain stable treatment performance.
  • Operational resilience – the system design includes redundancy, bypass arrangements, and buffer storage volumes to manage variability in inlet flow and to ensure continuous operation during maintenance.
  • Documentation and delivery – the project also covers project management deliverables such as equipment specifications, construction drawings, and commissioning documentation, ensuring the design is ready for implementation.

  The narrative explains how the project addressed specific site and operational requirements. It discusses how the treatment plant was organized to handle high-strength sugar factory wastewater, how it accommodates seasonal variations in flow and load, and how it integrates with the existing industrial utility network. It also highlights the need to align with regulatory monitoring, chemical dosing strategies, and sludge dewatering considerations.

  In addition to technical detail, the description emphasizes the benefits for stakeholders. For plant operators, the design provides a robust foundation for stable wastewater management and easier troubleshooting. For management and regulators, it demonstrates a commitment to sustainable industrial practice through efficient resource recovery, controlled discharge, and minimized environmental impact.

  Ultimately, this plant design is presented as a strategic investment in long-term operational performance. The narrative positions the project as both an engineering milestone and an environmental solution, showing how a well-organized wastewater treatment facility can protect the sugar mill, conserve water resources, and support responsible industrial growth.`,
    id_extend_desc: `  Kami membantu PT. LPP Agro Nusantar dalam perancangan instalasi pengolahan air limbah dengan kapasitas 7000 TCD (ton cane per day) yang melayani pabrik gula milik PT. Rajawali Nusindo. Ruang lingkup rekayasa mencakup proses penuh dari asupan influen hingga pembuangan efluen akhir, dengan penekanan pada keandalan, kemudahan perawatan, dan keselarasan dengan standar pembuangan lingkungan.

  Deskripsi ini disusun berdasarkan serangkaian poin praktis:
  • Pengurutan proses – desain dengan jelas memetakan bagaimana air limbah bergerak dari penerimaan dan penyaringan ke pemerataan, pengolahan biologis, klarifikasi, pemolesan tersier, dan penanganan lumpur.
  • Optimalisasi tata letak – tata letak pabrik menyeimbangkan penempatan peralatan, rute perpipaan, akses untuk inspeksi, dan koridor layanan untuk mendukung operasi dan pemeliharaan yang aman.
  • Integrasi perpipaan dan instrumentasi – rencana ini merinci bagaimana perpipaan proses, katup, pompa, pengukur aliran, alat analisis, dan panel kontrol bekerja bersama untuk mempertahankan kinerja pengolahan yang stabil.
  • Ketahanan operasional – desain sistem mencakup redundansi, pengaturan jalan pintas (bypass), dan volume penyimpanan penyangga untuk mengelola variabilitas aliran masuk dan memastikan operasi berkelanjutan selama pemeliharaan.
  • Dokumentasi dan pengiriman – proyek ini juga mencakup hasil manajemen proyek seperti spesifikasi peralatan, gambar konstruksi, dan dokumentasi commissioning, memastikan desain siap untuk diimplementasikan.

  Narasi menjelaskan bagaimana proyek menangani persyaratan situs dan operasional tertentu. Hal ini membahas bagaimana instalasi pengolahan diatur untuk menangani air limbah pabrik gula berkekuatan tinggi, bagaimana instalasi ini mengakomodasi variasi musiman dalam aliran dan beban, dan bagaimana ia terintegrasi dengan jaringan utilitas industri yang ada. Hal ini juga menyoroti kebutuhan untuk menyelaraskan dengan pemantauan peraturan, strategi pemberian dosis bahan kimia, dan pertimbangan dewatering lumpur.

  Selain detail teknis, deskripsi ini menekankan manfaat bagi pemangku kepentingan. Bagi operator pabrik, desain ini memberikan fondasi yang kuat untuk pengelolaan air limbah yang stabil dan pemecahan masalah yang lebih mudah. Bagi manajemen dan regulator, ini menunjukkan komitmen terhadap praktik industri yang berkelanjutan melalui pemulihan sumber daya yang efisien, pembuangan yang terkontrol, dan meminimalkan dampak lingkungan.

  Pada akhirnya, desain instalasi ini disajikan sebagai investasi strategis dalam kinerja operasional jangka panjang. Narasi memposisikan proyek ini sebagai tonggak rekayasa sekaligus solusi lingkungan, menunjukkan bagaimana fasilitas pengolahan air limbah yang terorganisir dengan baik dapat melindungi pabrik gula, melestarikan sumber daya air, dan mendukung pertumbuhan industri yang bertanggung jawab.`,
    media: {
      type: 'image',
      url: 'https://d2tbt8ofproiin.cloudfront.net/ipal/ipal-1.jpg',
      alt: 'Water Waste Treatment Plant'
    }
  },
  {
    tag: "Robotics",
    id_tag: "Robotika",
    title: "Pharmacy Vending Machine",
    id_title: "Mesin Penjual Obat Otomatis",
    desc: "Interactive automated medication dispensing system design with mechanical motion control, internal slot arrangement, and user-friendly interface.",
    id_desc: "Desain sistem pengeluaran obat otomatis interaktif dengan kontrol gerak mekanis, pengaturan slot internal, dan antarmuka yang ramah pengguna.",
    slug: "vending-machine",
    extend_desc: `  This project documents the design and operational concept for a Pharmacy Vending Machine, an automated medication dispensing system intended to support pharmacies and healthcare facilities. The solution blends mechanical motion control, internal slot arrangement, and a user-focused interface to deliver secure, efficient delivery of pharmaceuticals.

  The description is organized with detailed pointers:
  • Modular storage architecture – the machine houses medications in separate compartments, arranged by dosage, form factor, and handling requirements.
  • Retrieval mechanism – a robotic actuator selects and delivers items accurately, with motion control designed for minimal vibration and reliable extraction.
  • User interface and workflow – the display guides the customer through prescription selection, patient verification, and completion confirmation, while pharmacy staff retain oversight of the dispensing process.
  • Compliance and auditing – the system includes access control measures, transaction logging, and dose separation features to support regulatory requirements and controlled substance handling.
  • Temperature and environmental control – the design supports storage of sensitive medications through segmented compartments and optional climate control for stability.

  The narrative explains the operational advantages of the vending machine. It highlights how the system reduces wait times, improves service consistency, and lowers the risk of medication errors through automation. It also explains how the machine supports pharmacy inventory management by providing real-time status updates, low-stock alerts, and automated restocking indicators.

  The description further details the customer experience. It emphasizes clear instructions, intuitive prompts, and fast, secure handoff of medicines. It also covers how the machine can accommodate both walk-up users and pharmacy personnel, making it a flexible asset for busy healthcare settings.

  In conclusion, the Pharmacy Vending Machine is presented as a forward-looking solution that combines engineering reliability with patient-centered design. The project is positioned as an innovation that can improve pharmacy operations, enhance medication safety, and deliver a strong user experience while maintaining the strict security and compliance standards required in healthcare.`,
    id_extend_desc: `  Proyek ini mendokumentasikan desain dan konsep operasional untuk Mesin Penjual Otomatis Farmasi, sebuah sistem pengeluaran obat otomatis yang dimaksudkan untuk mendukung apotek dan fasilitas perawatan kesehatan. Solusi ini memadukan kontrol gerak mekanis, pengaturan slot internal, dan antarmuka yang berfokus pada pengguna untuk memberikan pengiriman obat-obatan yang aman dan efisien.

  Deskripsi diatur dengan petunjuk rinci:
  • Arsitektur penyimpanan modular – mesin ini menampung obat-obatan dalam kompartemen terpisah, disusun berdasarkan dosis, faktor bentuk, dan persyaratan penanganan.
  • Mekanisme pengambilan – aktuator robotik memilih dan mengirimkan barang secara akurat, dengan kontrol gerak yang dirancang untuk getaran minimal dan ekstraksi yang andal.
  • Antarmuka pengguna dan alur kerja – layar memandu pelanggan melalui pemilihan resep, verifikasi pasien, dan konfirmasi penyelesaian, sementara staf apotek tetap mengawasi proses pengeluaran.
  • Kepatuhan dan audit – sistem mencakup langkah-langkah kontrol akses, pencatatan transaksi, dan fitur pemisahan dosis untuk mendukung persyaratan peraturan dan penanganan zat yang dikendalikan.
  • Kontrol suhu dan lingkungan – desain mendukung penyimpanan obat-obatan sensitif melalui kompartemen tersegmentasi dan kontrol iklim opsional untuk stabilitas.

  Narasi menjelaskan keunggulan operasional dari mesin penjual otomatis. Hal ini menyoroti bagaimana sistem mengurangi waktu tunggu, meningkatkan konsistensi layanan, dan menurunkan risiko kesalahan pengobatan melalui otomatisasi. Ini juga menjelaskan bagaimana mesin mendukung manajemen inventaris apotek dengan memberikan pembaruan status waktu nyata, peringatan stok rendah, dan indikator penyetokan ulang otomatis.

  Deskripsi lebih lanjut merinci pengalaman pelanggan. Ini menekankan instruksi yang jelas, petunjuk intuitif, dan serah terima obat-obatan yang cepat dan aman. Ini juga mencakup bagaimana mesin dapat mengakomodasi pengguna langsung (walk-up) maupun personel apotek, menjadikannya aset fleksibel untuk pengaturan perawatan kesehatan yang sibuk.

  Kesimpulannya, Mesin Penjual Otomatis Farmasi disajikan sebagai solusi berwawasan ke depan yang menggabungkan keandalan teknik dengan desain yang berpusat pada pasien. Proyek ini diposisikan sebagai inovasi yang dapat meningkatkan operasi apotek, meningkatkan keamanan pengobatan, dan memberikan pengalaman pengguna yang kuat sambil mempertahankan standar keamanan dan kepatuhan ketat yang diperlukan dalam perawatan kesehatan.`,
    media: {
      type: 'image',
      url: 'https://d2tbt8ofproiin.cloudfront.net/vending-machine/vending-machine-1.jpg',
      alt: 'Pharmacy Vending Machine'
    }
  },
  {
    tag: "Robotics",
    id_tag: "Robotika",
    title: "Education Robot",
    id_title: "Robot Edukasi",
    desc: "Full structural condition assessment and remaining service life analysis for automated mechanical systems.",
    id_desc: "Penilaian kondisi struktural penuh dan analisis sisa umur pakai untuk sistem mekanis otomatis.",
    slug: "edu-bot",
    extend_desc: `  This Education Robot project is described as a comprehensive platform for structural condition assessment and remaining service life analysis of automated mechanical systems. It combines the practical demands of engineering evaluation with the pedagogical needs of an educational robot, offering a solution that is relevant for both training and technical decision-making.

  The description is built around several detailed pointers:
  • Structural evaluation – the assessment examines the robot’s chassis, joints, actuator assemblies, drive mechanisms, and supporting frames to determine the current condition of mechanical components.
  • Control and operational systems – it analyzes how sensors, controllers, software, and motion systems interact to produce predictable, repeatable behavior during normal operation and instructional exercises.
  • Lifecycle analysis – the project quantifies remaining useful life for wearable parts, predicts maintenance intervals, and evaluates which components are most likely to require replacement first.
  • Educational application – the robot is also designed to teach students about mechanical resilience, system diagnostics, and the process of translating data into maintenance decisions.

  The narrative explains why this dual-purpose approach is valuable. For engineers and maintenance planners, the platform provides actionable insights into component health and expected service life. For instructors and students, it offers a clear demonstration of engineering principles such as load distribution, failure modes, and preventive upkeep.

  The description also covers how the project supports decision-making. It identifies critical failure points, directs attention toward the most important inspection areas, and provides a framework for documenting how the robot’s condition changes over time. This makes the Education Robot a useful asset for developing maintenance strategies and reducing the risk of unexpected downtime.

  In summary, the Education Robot is presented as both a technical assessment tool and an educational resource. The project demonstrates how a robotic system can be evaluated for long-term serviceability while also functioning as a learning device that helps users understand the importance of condition monitoring, lifecycle planning, and system reliability.`,
    id_extend_desc: `  Proyek Robot Edukasi ini digambarkan sebagai platform komprehensif untuk penilaian kondisi struktural dan analisis sisa umur pakai dari sistem mekanis otomatis. Ini menggabungkan tuntutan praktis dari evaluasi teknik dengan kebutuhan pedagogis dari robot pendidikan, menawarkan solusi yang relevan baik untuk pelatihan maupun pengambilan keputusan teknis.

  Deskripsi ini dibangun di sekitar beberapa poin rinci:
  • Evaluasi struktural – penilaian memeriksa sasis robot, sambungan, rakitan aktuator, mekanisme penggerak, dan rangka pendukung untuk menentukan kondisi komponen mekanis saat ini.
  • Sistem kontrol dan operasional – ini menganalisis bagaimana sensor, pengontrol, perangkat lunak, dan sistem gerak berinteraksi untuk menghasilkan perilaku yang dapat diprediksi dan diulang selama operasi normal dan latihan instruksional.
  • Analisis siklus hidup – proyek mengukur sisa umur pakai yang berguna untuk bagian yang dapat aus, memprediksi interval pemeliharaan, dan mengevaluasi komponen mana yang paling mungkin memerlukan penggantian terlebih dahulu.
  • Aplikasi pendidikan – robot ini juga dirancang untuk mengajari siswa tentang ketahanan mekanis, diagnostik sistem, dan proses menerjemahkan data menjadi keputusan pemeliharaan.

  Narasi menjelaskan mengapa pendekatan tujuan ganda ini berharga. Bagi para insinyur dan perencana pemeliharaan, platform ini memberikan wawasan yang dapat ditindaklanjuti tentang kesehatan komponen dan perkiraan umur pakai. Bagi instruktur dan siswa, ini menawarkan demonstrasi yang jelas tentang prinsip-prinsip teknik seperti distribusi beban, mode kegagalan, dan pemeliharaan preventif.

  Deskripsi ini juga mencakup bagaimana proyek mendukung pengambilan keputusan. Ini mengidentifikasi titik kegagalan kritis, mengarahkan perhatian pada area inspeksi yang paling penting, dan menyediakan kerangka kerja untuk mendokumentasikan bagaimana kondisi robot berubah seiring waktu. Hal ini menjadikan Robot Edukasi aset yang berguna untuk mengembangkan strategi pemeliharaan dan mengurangi risiko waktu henti yang tidak terduga.

  Singkatnya, Robot Edukasi disajikan sebagai alat penilaian teknis sekaligus sumber pendidikan. Proyek ini menunjukkan bagaimana sistem robotik dapat dievaluasi untuk kemudahan servis jangka panjang sementara juga berfungsi sebagai perangkat pembelajaran yang membantu pengguna memahami pentingnya pemantauan kondisi, perencanaan siklus hidup, dan keandalan sistem.`,
    media: {
      type: 'image',
      url: 'https://d2tbt8ofproiin.cloudfront.net/edu-bot/edu-bot-1.jpg',
      alt: 'Education Robotics'
    }
  }
];