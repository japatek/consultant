export interface ServiceItem {
  title: string;
  desc: string;
  extend_desc: string;
  slug: string;

  // Added optional Indonesian translation fields
  id_title?: string;
  id_desc?: string;
  id_extend_desc?: string;
}

export const listServices: ServiceItem[] = [
  {
    title: 'Inspection & Condition Assessment',
    id_title: 'Inspeksi & Penilaian Kondisi',
    desc: 'Portfolio-proven inspection services that assess structural, mechanical, and operational condition across power, industrial, and infrastructure assets.',
    id_desc: 'Layanan inspeksi teruji portofolio yang menilai kondisi struktural, mekanis, dan operasional di berbagai aset pembangkit, industri, dan infrastruktur.',
    extend_desc: `Industrial assets operate under continuous stress, and unexpected failures can lead to catastrophic downtime and safety hazards. Our Inspection & Condition Assessment service is a proactive, data-driven approach designed to evaluate the true health of your structural and mechanical systems. We go beyond basic visual checks, utilizing advanced diagnostic tools and field-proven methodologies to uncover hidden degradation before it compromises your operations.

From heavy-duty rotary equipment in power plants to complex offshore structural nodes, we deploy a variety of techniques including drone-assisted Non-Destructive Evaluation (NDE) to safely access hazardous or confined areas. Our assessments translate raw field data into actionable intelligence, providing you with a clear picture of asset health, risk profiles, and precise repair prioritization.

• Drone-assisted and robotic Non-Destructive Evaluation (NDE) for safe, high-fidelity data capture in hard-to-reach areas.
• Remaining Service Life (RSL) analysis to accurately predict wear rates and optimize lifecycle planning.
• Prioritized defect reporting and actionable maintenance workflows that directly reduce operational risk and prevent unplanned outages.

We don't just hand you a list of problems; we deliver a structured roadmap for asset recovery. By bridging the gap between field observations and engineering solutions, we empower facility managers to make confident, budget-aligned decisions that extend service life and maximize operational readiness.`,
    slug: 'inspection-condition-assessment',
  },
  {
    title: 'Project Management',
    id_title: 'Manajemen Proyek',
    desc: 'End-to-end project management for engineering, fabrication, and site execution with clear scope control, stakeholder alignment, and transparent progress reporting.',
    id_desc: 'Manajemen proyek ujung-ke-ujung untuk rekayasa, fabrikasi, dan eksekusi lapangan dengan kontrol ruang lingkup yang jelas, penyelarasan pemangku kepentingan, dan pelaporan kemajuan yang transparan.',
    extend_desc: `Successfully delivering complex engineering projects requires more than just technical expertise; it demands rigorous oversight, multidisciplinary coordination, and uncompromising scope control. Our Project Management service is built on decades of hands-on delivery experience across the power, water, and industrial sectors. We act as the central nervous system of your project, aligning stakeholders, contractors, and technical teams toward a singular goal of flawless execution.

We manage the entire project lifecycle—from initial feasibility studies and procurement through fabrication, site installation, and final commissioning. By implementing disciplined scheduling and proactive risk mitigation strategies, we identify potential bottlenecks before they impact your critical path. Our approach guarantees that technical specifications are met without scope creep, budget overruns, or scheduling delays.

• Multidisciplinary coordination managing civil, structural, and mechanical teams under a unified delivery strategy.
• Proactive risk mitigation, budget tracking, and strict scope control to prevent costly variations.
• Transparent, milestone-based progress reporting that keeps stakeholders aligned from kick-off to final handover.

With JaPaTek managing your project, you gain a dedicated partner committed to protecting your investment. We absorb the logistical friction of complex industrial projects, ensuring that every asset is delivered safely, on time, and fully compliant with all operational requirements.`,
    slug: 'project-management',
  },
  {
    title: 'Structural Analysis & Design',
    id_title: 'Analisis & Desain Struktural',
    desc: 'Advanced structural analysis and design for steel, concrete, and composite systems, delivering optimised solutions that are compliant and constructible.',
    id_desc: 'Analisis dan desain struktural tingkat lanjut untuk sistem baja, beton, dan komposit, memberikan solusi optimal yang sesuai standar dan mudah dibangun.',
    extend_desc: `In heavy industry, structural integrity is the foundation of operational safety. Our Structural Analysis & Design service leverages cutting-edge computational modeling to engineer resilient load-bearing systems capable of withstanding extreme environmental and operational stresses. Whether we are designing towering industrial process plants, high-capacity water treatment facilities, or retrofitting existing mechanical support structures, we deliver solutions that balance maximum strength with material efficiency.

We utilize state-of-the-art 3D Finite Element Analysis (FEA) and dynamic load simulations to test our designs against real-world scenarios—including seismic events, high-velocity winds, and extreme thermal expansion. This high-precision digital testing allows us to optimize the geometry and material selection of steel, concrete, and composite structures, ensuring 100% compliance with international engineering codes while minimizing construction costs.

• Advanced 3D Finite Element Analysis (FEA) for testing extreme stress, thermal fatigue, and dynamic load scenarios.
• Code-compliant structural design for steel, concrete, and composite frameworks across heavy industrial sectors.
• Retrofitting and capacity-upgrade engineering to safely extend the life of aging infrastructure.

Our philosophy is rooted in "constructability." We do not just design theoretical models; we engineer practical, buildable structures optimized for safe fabrication and efficient site assembly. The result is a robust, future-proof physical asset built to handle the highest demands of your industry.`,
    slug: 'structural-analysis-design',
  },
  {
    title: 'Laboratory Testing',
    id_title: 'Pengujian Laboratorium',
    desc: 'Material and component testing services providing data-driven insights for asset health, failure investigation, and quality assurance.',
    id_desc: 'Layanan pengujian material dan komponen yang memberikan wawasan berbasis data untuk kesehatan aset, investigasi kegagalan, dan jaminan kualitas.',
    extend_desc: `When field inspections uncover structural anomalies, or when critical components fail unexpectedly, visual assessments are no longer enough. Our Laboratory Testing service provides the hard empirical data required to solve complex metallurgical and mechanical mysteries. By combining physical testing with deep engineering analysis, we uncover the root causes of material degradation, ensuring that your repair strategies are based on science, not guesswork.

We coordinate and analyze a comprehensive suite of material tests—ranging from tensile and hardness testing to advanced spectrographic and microscopic analysis. Whether you need to verify the chemical composition of a newly fabricated pressure vessel or investigate a catastrophic weld failure on an offshore platform, we translate complex laboratory data into clear, actionable engineering directives.

• Deep metallurgical and chemical analysis to verify material grades and identify corrosive degradation.
• Root cause failure investigations (RCFA) to understand exactly why components fracture, yield, or fatigue.
• Destructive and non-destructive weld testing to validate fabrication quality against stringent industry standards.

Laboratory testing removes ambiguity from asset management. By validating assumptions with hard data, we help clients prevent recurring failures, optimize their material selection for future builds, and make legally and technically sound quality assurance decisions.`,
    slug: 'laboratory-testing',
  },
  {
    title: 'Manufacturing Surveillance',
    id_title: 'Pengawasan Manufaktur',
    desc: 'Factory and workshop surveillance services that ensure fabrication quality, code compliance and traceability through every stage of assembly.',
    id_desc: 'Layanan pengawasan pabrik dan bengkel yang memastikan kualitas fabrikasi, kepatuhan kode, dan keterlacakan melalui setiap tahap perakitan.',
     extend_desc: `The integrity of an industrial facility is determined long before the equipment arrives on site; it is forged on the factory floor. Our Manufacturing Surveillance service acts as your independent eyes and ears during the fabrication process. We provide rigorous third-party Quality Assurance and Quality Control (QA/QC) to ensure that every weld, component, and assembly strictly adheres to your approved design specifications and international codes.

Discovering a manufacturing defect after an asset has been shipped to a remote mining site or offshore platform can result in devastating delays and massive rework costs. Our surveillance engineers monitor fabrication activities in real-time, conducting strategic hold-point inspections, verifying material traceability, and ensuring that non-conformances are identified and corrected immediately at the source.

• Independent QA/QC surveillance at fabrication yards to enforce strict adherence to ASME, API, and ISO standards.
• Verification of Material Test Reports (MTRs), welding procedure specifications (WPS), and operator qualifications.
• Strategic hold-point inspections to catch dimensional errors and structural defects before final assembly and shipping.

By embedding our engineering expertise directly into the manufacturing supply chain, we drastically reduce the risk of on-site fit-up issues. We guarantee that the physical assets delivered to your site are fully traceable, built to exact design intents, and ready for safe, long-term operation.`,
    slug: 'manufacturing-surveillance',
  },
  {
    title: 'Specification Development',
    id_title: 'Pengembangan Spesifikasi',
    desc: 'Technical specification development for equipment, materials and inspection scopes, reducing ambiguity and safeguarding projects against costly variations.',
    id_desc: 'Pengembangan spesifikasi teknis untuk peralatan, material, dan ruang lingkup inspeksi, mengurangi ambiguitas dan melindungi proyek dari variasi yang mahal.',
    extend_desc: `Ambiguity is the enemy of successful engineering projects. Poorly defined requirements lead to scope creep, contractor disputes, substandard material selection, and ultimately, compromised safety. Our Specification Development service creates the airtight technical foundation required to procure, fabricate, and install complex industrial assets flawlessly. 

We write comprehensive, customized technical documents that leave no room for misinterpretation. By clearly defining exact material grades, dimensional tolerances, approved fabrication methodologies, and mandatory Inspection and Test Plans (ITPs), we align all vendors and contractors to a single standard of excellence. This rigorous documentation protects clients from bidding loopholes and ensures apples-to-apples comparisons during procurement.

• Custom development of technical equipment specifications, material requirements, and performance guarantees.
• Creation of rigorous Inspection and Test Plans (ITPs) to standardize QA/QC expectations across all vendors.
• Closing technical loopholes to protect projects from contractor disputes, scope creep, and unexpected variation claims.

A well-crafted specification is your strongest risk management tool. By defining the rules of engagement upfront, we empower you to drive contractor accountability, streamline procurement, and ensure that your project is delivered exactly as envisioned.`,
    slug: 'specification-development',
  },
  {
    title: 'Drafting Services',
    id_title: 'Layanan Penyusunan (Drafting)',
    desc: 'Precision drafting and documentation services producing native CAD files and engineering drawings that integrate seamlessly with client workflows.',
    id_desc: 'Layanan penyusunan dan dokumentasi presisi yang menghasilkan file CAD asli dan gambar teknik yang terintegrasi mulus dengan alur kerja klien.',
    extend_desc: `Great engineering design is only as effective as the documentation used to build it. Our Drafting Services bridge the gap between complex engineering calculations and real-world construction. We produce high-precision, clash-free technical drawings and native CAD deliverables that guide fabricators, installers, and maintenance teams with absolute clarity.

From detailed Piping and Instrumentation Diagrams (P&ID) for sprawling water treatment facilities to incredibly complex 3D exploded views of gas turbine internals, our drafting team visualizes engineering at its highest level. We ensure seamless coordination across civil, structural, and mechanical disciplines, eliminating spatial conflicts before construction begins.

• High-fidelity 2D fabrication drawings and general arrangements tailored for immediate workshop use.
• Complex 3D modeling and exploded visual assemblies to aid in spatial layout, maintenance planning, and digital twin creation.
• Accurate "As-Built" documentation updates to ensure your facility's digital records perfectly match physical reality.

We deliver documentation that integrates flawlessly into your existing digital workflows. By providing crystal-clear annotations and rigorous version control, we empower your contractors to build faster, safer, and with absolute confidence in the structural design.`,
    slug: 'drafting-services',
  },
  {
    title: 'Technical Training',
    id_title: 'Pelatihan Teknis',
    desc: 'Practical training programs for installation, inspection and maintenance techniques, delivered by senior engineers to improve operational confidence.',
    id_desc: 'Program pelatihan praktis untuk teknik instalasi, inspeksi, dan pemeliharaan, disampaikan oleh insinyur senior untuk meningkatkan kepercayaan operasional.',
     extend_desc: `The most advanced engineering systems in the world still rely on the competence of the personnel operating and maintaining them. Our Technical Training service bridges the critical skills gap, empowering your in-house teams with the practical knowledge required to manage heavy industrial assets safely and efficiently. Led by senior engineers with decades of field experience, our training goes far beyond standard textbook theory.

We utilize our advanced 3D visual simulations and exploded asset models to create highly immersive learning environments. Your teams will learn how to identify early signs of structural fatigue, execute complex maintenance workflows on rotary equipment, and conduct baseline condition assessments. By contextualizing the training around your specific site equipment, we ensure immediate, real-world applicability.

• Interactive, visually driven workshops utilizing 3D asset simulations to accelerate complex maintenance comprehension.
• Hands-on defect recognition training to help on-site personnel spot structural and mechanical fatigue early.
• Customized operational and installation masterclasses designed to reduce human error and boost field capability.

Investing in your workforce is the ultimate preventative maintenance strategy. By elevating the technical fluency of your team, we help you reduce reliance on external contractors, minimize accidental operational damage, and cultivate a culture of uncompromising safety and competence.`,
    slug: 'technical-training',
  },
];