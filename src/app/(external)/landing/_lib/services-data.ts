export interface Services {
  name: string;
  slug: string;
  desc: string;
  extend_desc: string;
  caps: string[];
  
  // Added optional Indonesian fields
  id_name?: string;
  id_desc?: string;
  id_extend_desc?: string;
  id_caps?: string[];
}

export const servicesData: Services[] = [
  {
    name: 'Heavy Machinery',
    id_name: 'Alat Berat',
    slug: 'heavy-machinery',
    desc: 'Engineering support for power generation assets, focusing on finite element analysis (FEA), thermal stress evaluations, and complex 3D visual simulations for critical components like gas turbines.',
    id_desc: 'Dukungan teknik untuk aset pembangkit listrik, berfokus pada analisis elemen hingga (FEA), evaluasi tegangan termal, dan simulasi visual 3D kompleks untuk komponen kritis seperti turbin gas.',
    extend_desc: `The global energy landscape is evolving rapidly, placing unprecedented operational demands on critical power generation assets. In the high-stakes environment of power plants, equipment failure is not an option—downtime can cost millions and disrupt entire energy grids. Our engineering solutions are specifically tailored to address the extreme thermal, mechanical, and aerodynamic stresses experienced by heavy-duty machinery such as gas turbines, generators, and steam infrastructure.

We move beyond traditional engineering by integrating next-generation simulation technologies, including comprehensive Finite Element Analysis (FEA) and computational stress modeling. These advanced computational methods allow us to predict material fatigue, thermal expansion, and potential failure points long before they manifest physically on the plant floor. Furthermore, we revolutionize maintenance and training workflows by developing ultra-detailed, interactive 3D exploded views and visual simulations of highly complex assemblies.

• Advanced Finite Element Analysis (FEA) to predict thermal fatigue and structural stress before physical failure occurs.
• Interactive 3D exploded view modeling (e.g., M701F gas turbines) to accelerate maintenance, outage planning, and inspection training.
• Precision mechanical assessments designed specifically to extend the remaining service life of heavy-duty rotary equipment.

By digitizing internal components down to the smallest fastener, we empower maintenance teams to visualize internal wear, plan precise interventions, and execute overhauls with unmatched safety and speed. This proactive, technology-driven approach ensures that major utility operators achieve maximum thermal efficiency, extend asset lifecycles, and maintain uninterrupted base-load power for communities and industries alike.`,
    id_extend_desc: `Lanskap energi global berkembang pesat, menempatkan tuntutan operasional yang belum pernah terjadi sebelumnya pada aset pembangkit listrik kritis. Di lingkungan pembangkit listrik berisiko tinggi, kegagalan peralatan bukanlah suatu pilihan—waktu henti (downtime) dapat memakan biaya jutaan dan mengganggu seluruh jaringan energi. Solusi teknik kami disesuaikan secara khusus untuk mengatasi tekanan termal, mekanis, dan aerodinamis ekstrem yang dialami oleh mesin-mesin berat seperti turbin gas, generator, dan infrastruktur uap.

Kami bergerak melampaui rekayasa tradisional dengan mengintegrasikan teknologi simulasi generasi berikutnya, termasuk Analisis Elemen Hingga (FEA) yang komprehensif dan pemodelan tegangan komputasional. Metode komputasi canggih ini memungkinkan kami untuk memprediksi kelelahan material, ekspansi termal, dan potensi titik kegagalan jauh sebelum hal itu bermanifestasi secara fisik di lantai pabrik. Selain itu, kami merevolusi alur kerja pemeliharaan dan pelatihan dengan mengembangkan tampilan pecahan (exploded views) 3D interaktif yang sangat detail dan simulasi visual dari rakitan yang sangat kompleks.

• Analisis Elemen Hingga (FEA) tingkat lanjut untuk memprediksi kelelahan termal dan tegangan struktural sebelum kegagalan fisik terjadi.
• Pemodelan tampilan pecahan (exploded view) 3D interaktif (misalnya turbin gas M701F) untuk mempercepat pemeliharaan, perencanaan pemadaman, dan pelatihan inspeksi.
• Penilaian mekanis presisi yang dirancang khusus untuk memperpanjang sisa umur pakai peralatan putar tugas berat.

Dengan mendigitalkan komponen internal hingga ke pengencang terkecil, kami memberdayakan tim pemeliharaan untuk memvisualisasikan keausan internal, merencanakan intervensi yang tepat, dan melaksanakan perbaikan (overhaul) dengan keselamatan dan kecepatan yang tak tertandingi. Pendekatan proaktif berbasis teknologi ini memastikan bahwa operator utilitas utama mencapai efisiensi termal maksimum, memperpanjang siklus hidup aset, dan mempertahankan daya beban dasar (base-load power) tanpa gangguan bagi masyarakat dan industri.`,
    caps: ['Gas turbine FEA & simulation', 'Thermal stress analysis', 'Structural integrity assessment', '3D maintenance workflow modeling'],
    id_caps: ['FEA & simulasi turbin gas', 'Analisis tegangan termal', 'Penilaian integritas struktural', 'Pemodelan alur kerja pemeliharaan 3D'],
  },
  {
    name: 'Structural & Piping',
    id_name: 'Struktural & Pemipaan',
    slug: 'structural',
    desc: 'Comprehensive structural engineering and analysis for heavy industrial frameworks, offshore platforms, and commercial facilities, ensuring maximum load-bearing integrity and safety compliance.',
    id_desc: 'Rekayasa dan analisis struktural komprehensif untuk kerangka industri berat, anjungan lepas pantai, dan fasilitas komersial, memastikan integritas penahan beban maksimum dan kepatuhan keselamatan.',
    extend_desc: `The physical integrity of industrial infrastructure is the bedrock upon which all operational safety and productivity rest. Our Structural Engineering sector provides rigorous, comprehensive design and analysis services for the most demanding environments, from towering offshore platforms to sprawling industrial processing facilities. We understand that heavy industrial frameworks face constant exposure to extreme operational vibrations, massive load variations, and harsh environmental conditions.

Our approach combines foundational civil engineering principles with advanced computational modeling. We conduct extensive load-bearing analyses, seismic stress tests, and environmental impact simulations to ensure that every beam, joint, and foundation exceeds stringent international safety codes. Whether designing a greenfield structural framework from the ground up or assessing the retrofitting needs of an aging facility, we engineer for longevity and unyielding stability.

• Comprehensive structural load analysis and optimization for heavy industrial facilities and offshore platforms.
• Advanced seismic and wind load simulations to guarantee infrastructure resilience against extreme environmental factors.
• Detailed structural health monitoring and retrofitting design for aging industrial assets and brownfield expansions.

We deliver deeply detailed fabrication blueprints, steel detailing, and connection engineering that streamline the construction phase and eliminate costly on-site modifications. By proactively engineering for structural endurance and identifying potential failure points before ground is even broken, we safeguard immense capital investments and protect the personnel who operate within these facilities every single day.`,
    id_extend_desc: `Integritas fisik infrastruktur industri adalah fondasi di mana semua keselamatan dan produktivitas operasional bertumpu. Sektor Rekayasa Struktural kami menyediakan layanan desain dan analisis yang ketat dan komprehensif untuk lingkungan yang paling menuntut, mulai dari anjungan lepas pantai yang menjulang tinggi hingga fasilitas pemrosesan industri yang luas. Kami memahami bahwa kerangka industri berat terus menghadapi paparan terhadap getaran operasional ekstrem, variasi beban masif, dan kondisi lingkungan yang keras.

Pendekatan kami menggabungkan prinsip-prinsip dasar teknik sipil dengan pemodelan komputasi canggih. Kami melakukan analisis penahan beban yang ekstensif, uji tegangan seismik, dan simulasi dampak lingkungan untuk memastikan bahwa setiap balok, sambungan, dan fondasi melampaui standar kode keselamatan internasional yang ketat. Baik merancang kerangka struktural baru (greenfield) dari awal atau menilai kebutuhan perkuatan fasilitas yang menua, kami merekayasa untuk umur panjang dan stabilitas yang pantang menyerah.

• Analisis beban struktural komprehensif dan optimalisasi untuk fasilitas industri berat dan anjungan lepas pantai.
• Simulasi beban seismik dan angin tingkat lanjut untuk menjamin ketahanan infrastruktur terhadap faktor lingkungan ekstrem.
• Pemantauan kesehatan struktural terperinci dan desain perkuatan untuk aset industri yang menua dan ekspansi fasilitas yang sudah ada (brownfield).

Kami memberikan cetak biru fabrikasi yang sangat mendetail, pendetailan baja, dan rekayasa sambungan yang merampingkan fase konstruksi serta menghilangkan modifikasi di tempat yang memakan biaya. Dengan merekayasa ketahanan struktural secara proaktif dan mengidentifikasi potensi titik kegagalan bahkan sebelum pembangunan dimulai, kami melindungi investasi modal yang sangat besar dan melindungi personel yang beroperasi di dalam fasilitas ini setiap harinya.`,
    caps: ['Heavy industrial framework design', 'Seismic & wind load analysis', 'Steel detailing & connections', 'Structural health monitoring & retrofitting'],
    id_caps: ['Desain kerangka industri berat', 'Analisis beban seismik & angin', 'Detailing baja & koneksi', 'Pemantauan kesehatan & perkuatan struktural']
  },
  {
    name: 'Robotics & Automation',
    id_name: 'Robotika & Otomasi',
    slug: 'robotics',
    desc: 'Mechanical design and condition assessment for automated systems, bridging traditional structural engineering with complex motion control and AI-driven automation workflows.',
    id_desc: 'Desain mekanis dan penilaian kondisi untuk sistem otomatis, menjembatani rekayasa struktural tradisional dengan kontrol gerak kompleks dan alur kerja otomasi berbasis AI.',
    extend_desc: `As industries rapidly transition into the era of smart manufacturing and autonomous operations, the demand for resilient, hyper-precise mechanical systems has never been greater. Our Robotics and Automation sector bridges the gap between traditional heavy structural engineering and the agile, high-tech world of automated motion control. We specialize in the complete mechanical design, structural condition assessment, and lifecycle analysis of complex interactive systems. 

Whether we are engineering the internal slot configurations, motion control rails, and fail-safe dispensing mechanisms of an advanced commercial vending machine, or designing industrial-scale automated material handlers, our focus remains on precision, safety, and long-term durability. Beyond product design, we apply our robotics expertise to heavy industrial asset management through the deployment of drone-assisted Non-Destructive Evaluation (NDE). 

• Precision mechanical design and internal structural configuration for commercial automated systems and complex dispensing units.
• Drone-assisted Non-Destructive Evaluation (NDE) to safely inspect offshore platforms and hazardous, hard-to-reach confined spaces.
• Advanced Remaining Service Life (RSL) analysis to predict long-term wear and tear on continuous-motion machinery.

By utilizing advanced drones and robotics to access hazardous environments—such as towering offshore oil platforms or confined industrial spaces—we eliminate human risk while capturing high-fidelity structural data. This data is then fed into our remaining service life (RSL) analysis models, allowing operators to make informed, data-driven decisions regarding asset maintenance. We engineer automated systems that not only perform their tasks flawlessly millions of times over, but also adapt to drive the future of intelligent infrastructure.`,
    id_extend_desc: `Seiring dengan transisi cepat industri menuju era manufaktur pintar dan operasi otonom, permintaan akan sistem mekanis yang tangguh dan sangat presisi belum pernah sebesar ini. Sektor Robotika dan Otomasi kami menjembatani kesenjangan antara rekayasa struktural berat tradisional dan dunia kontrol gerak otomatis berteknologi tinggi yang tangkas. Kami berspesialisasi dalam desain mekanis lengkap, penilaian kondisi struktural, dan analisis siklus hidup untuk sistem interaktif yang kompleks. 

Baik kami merekayasa konfigurasi slot internal, rel kontrol gerak, dan mekanisme pengeluaran gagal-aman (fail-safe) dari mesin penjual otomatis komersial tingkat lanjut, atau merancang sistem penanganan material otomatis skala industri, fokus kami tetap pada presisi, keamanan, dan daya tahan jangka panjang. Di luar desain produk, kami menerapkan keahlian robotika kami pada manajemen aset industri berat melalui penerapan Evaluasi Non-Destruktif (NDE) berbantuan drone. 

• Desain mekanis presisi dan konfigurasi struktural internal untuk sistem otomatis komersial dan unit pengeluaran yang kompleks.
• Evaluasi Non-Destruktif (NDE) berbantuan drone untuk memeriksa anjungan lepas pantai dengan aman serta ruang terbatas berbahaya yang sulit dijangkau.
• Analisis Sisa Umur Pakai (RSL) tingkat lanjut untuk memprediksi keausan jangka panjang pada mesin dengan pergerakan kontinu.

Dengan memanfaatkan drone dan robotika canggih untuk mengakses lingkungan berbahaya—seperti anjungan minyak lepas pantai yang menjulang tinggi atau ruang industri yang sempit—kami menghilangkan risiko manusia sambil menangkap data struktural dengan akurasi tinggi (high-fidelity). Data ini kemudian dimasukkan ke dalam model analisis sisa umur pakai (RSL) kami, memungkinkan operator membuat keputusan berbasis data mengenai pemeliharaan aset. Kami merekayasa sistem otomatis yang tidak hanya menjalankan tugasnya dengan sempurna jutaan kali, tetapi juga beradaptasi untuk mendorong masa depan infrastruktur yang cerdas.`,
    caps: ['Automated mechanical system design', 'Motion control & internal layout', 'Drone-assisted NDE inspections', 'Structural life analysis for machinery'],
    id_caps: ['Desain sistem mekanis otomatis', 'Kontrol gerak & tata letak internal', 'Inspeksi NDE berbasis drone', 'Analisis umur struktural mesin'],
  },
  {
    name: 'Others',
    id_name: 'Lainnya',
    slug: 'others',
    desc: 'Comprehensive technology solutions bridging hardware and digital domains, including custom electronic PCB design, professional PC assembly, and full-stack website development.',
    id_desc: 'Solusi teknologi komprehensif yang menjembatani ranah perangkat keras dan digital, termasuk desain PCB elektronik kustom, perakitan PC profesional, dan pengembangan situs web full-stack.',
    extend_desc: `Beyond our core heavy engineering and industrial design capabilities, we offer a specialized suite of technology and hardware solutions tailored to modern business requirements. Our 'Other' services division bridges the physical and digital worlds, providing custom electronics and IT infrastructure to power your operations and scale your business.

We specialize in end-to-end electronic Printed Circuit Board (PCB) design and fabrication, creating bespoke circuitry for specialized industrial applications, IoT devices, and custom automation controllers. Complementing this, our professional PC assembly services deliver high-performance, custom-built computing workstations optimized for heavy computational tasks such as CAD modeling, Finite Element Analysis (FEA), and 3D rendering.

• Custom Electronic PCB Design and prototyping for industrial automation, robotics, and IoT integration.
• Professional PC Assembly providing high-performance, custom workstations tailored for engineering and computational workloads.
• Full-stack Website Development to build robust, scalable digital presences and custom internal web applications.

To ensure your business thrives in the digital age, we also provide comprehensive full-stack website development. From corporate landing pages to complex internal operational dashboards, we build secure, scalable, and responsive web platforms that streamline your digital presence and internal workflows, ensuring your technological infrastructure is as robust as your physical assets.`,
    id_extend_desc: `Di luar kemampuan inti rekayasa berat dan desain industri kami, kami menawarkan rangkaian solusi teknologi dan perangkat keras khusus yang disesuaikan dengan kebutuhan bisnis modern. Divisi layanan 'Lainnya' kami menjembatani dunia fisik dan digital, menyediakan elektronik kustom dan infrastruktur TI untuk menggerakkan operasi Anda dan menskalakan bisnis Anda.

Kami berspesialisasi dalam desain dan fabrikasi Papan Sirkuit Cetak (PCB) elektronik terpadu (end-to-end), menciptakan sirkuit pesanan khusus (bespoke) untuk aplikasi industri spesifik, perangkat IoT, dan pengontrol otomasi kustom. Sebagai pelengkap, layanan perakitan PC profesional kami menghadirkan stasiun kerja komputasi (workstation) rakitan kustom berkinerja tinggi yang dioptimalkan untuk tugas komputasi berat seperti pemodelan CAD, Analisis Elemen Hingga (FEA), dan rendering 3D.

• Desain dan pembuatan prototipe PCB Elektronik Kustom untuk otomasi industri, robotika, dan integrasi IoT.
• Perakitan PC Profesional yang menyediakan stasiun kerja kustom berkinerja tinggi yang disesuaikan untuk beban kerja teknik dan komputasi.
• Pengembangan Situs Web Full-stack untuk membangun kehadiran digital yang kuat, terukur, dan aplikasi web internal kustom.

Untuk memastikan bisnis Anda berkembang pesat di era digital, kami juga menyediakan pengembangan situs web full-stack yang komprehensif. Mulai dari halaman arahan (landing page) perusahaan hingga dasbor operasional internal yang kompleks, kami membangun platform web yang aman, skalabel, dan responsif yang merampingkan kehadiran digital dan alur kerja internal Anda, memastikan infrastruktur teknologi Anda sekuat aset fisik Anda.`,
    caps: ['Custom PCB design & fabrication', 'High-performance PC assembly', 'Full-stack website development', 'Custom IT & hardware solutions'],
    id_caps: ['Desain & fabrikasi PCB kustom', 'Perakitan PC berkinerja tinggi', 'Pengembangan situs web full-stack', 'Solusi TI & perangkat keras khusus']
  }
];