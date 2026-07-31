export interface Sector {
  name: string;
  slug: string;
  desc: string;
  extend_desc: string;
  caps: string[];
  id_name?: string;
  id_desc?: string;
  id_caps?: string[];
}

export const sectorData: Sector[] = [
  {
    name: 'Power Plant',
    id_name: 'Pembangkit Listrik',
    slug: 'power-plant',
    desc: 'Engineering support for power generation assets, focusing on finite element analysis (FEA), thermal stress evaluations, and complex 3D visual simulations for critical components like gas turbines.',
    id_desc: 'Dukungan teknik untuk aset pembangkit listrik, berfokus pada analisis elemen hingga (FEA), evaluasi tegangan termal, dan simulasi visual 3D kompleks untuk komponen kritis seperti turbin gas.',
    extend_desc: `The global energy landscape is evolving rapidly, placing unprecedented operational demands on critical power generation assets. In the high-stakes environment of power plants, equipment failure is not an option—downtime can cost millions and disrupt entire energy grids. Our engineering solutions are specifically tailored to address the extreme thermal, mechanical, and aerodynamic stresses experienced by heavy-duty machinery such as gas turbines, generators, and steam infrastructure.

We move beyond traditional engineering by integrating next-generation simulation technologies, including comprehensive Finite Element Analysis (FEA) and computational stress modeling. These advanced computational methods allow us to predict material fatigue, thermal expansion, and potential failure points long before they manifest physically on the plant floor. Furthermore, we revolutionize maintenance and training workflows by developing ultra-detailed, interactive 3D exploded views and visual simulations of highly complex assemblies.

• Advanced Finite Element Analysis (FEA) to predict thermal fatigue and structural stress before physical failure occurs.
• Interactive 3D exploded view modeling (e.g., M701F gas turbines) to accelerate maintenance, outage planning, and inspection training.
• Precision mechanical assessments designed specifically to extend the remaining service life of heavy-duty rotary equipment.

By digitizing internal components down to the smallest fastener, we empower maintenance teams to visualize internal wear, plan precise interventions, and execute overhauls with unmatched safety and speed. This proactive, technology-driven approach ensures that major utility operators achieve maximum thermal efficiency, extend asset lifecycles, and maintain uninterrupted base-load power for communities and industries alike.`,
    caps: ['Gas turbine FEA & simulation', 'Thermal stress analysis', 'Structural integrity assessment', '3D maintenance workflow modeling'],
    id_caps: ['FEA & simulasi turbin gas', 'Analisis tegangan termal', 'Penilaian integritas struktural', 'Pemodelan alur kerja pemeliharaan 3D'],
  },
  {
    name: 'Water & Waste Management',
    id_name: 'Manajemen Air & Limbah',
    slug: 'water-waste',
    desc: 'Full-cycle engineering design and assessment for water treatment plants, industrial piping layouts, and instrumentation networks to support massive capacity processing facilities.',
    id_desc: 'Desain dan penilaian teknik siklus penuh untuk instalasi pengolahan air, tata letak perpipaan industri, dan jaringan instrumentasi untuk mendukung fasilitas pemrosesan kapasitas besar.',
    extend_desc: `Water is the lifeblood of both industrial operations and civil infrastructure, and managing it at scale requires engineering precision of the highest order. Our Water & Waste Management sector tackles the immense logistical and environmental challenges of processing millions of gallons of fluid daily. We provide end-to-end engineering design for massive-capacity facilities, such as 7000 TCD (Tons of Cane per Day) industrial water treatment plants and municipal sewage systems.

Designing these massive ecosystems involves creating highly intricate Piping and Instrumentation Diagrams (P&ID), optimizing complex fluid dynamics, and ensuring fail-safe structural layouts that can withstand constant hydraulic pressure and highly corrosive chemical environments. Our approach goes beyond just moving water; we engineer complete, resilient systems designed for sustainability and zero-downtime operations. We meticulously plan facility layouts to optimize spatial efficiency, allowing for seamless future expansions while adhering to the strictest environmental and safety compliances.

• Comprehensive Piping and Instrumentation Diagrams (P&ID) engineered for high-capacity flow and harsh chemical resistance.
• Spatial optimization and facility layout planning to support seamless future scalability and safe maintenance access.
• Structural design of holding tanks, advanced filtration systems, and effluent discharge networks built for extreme hydraulic pressure.

From raw water intake and advanced filtration systems to chemical dosing and safe effluent discharge, every node of the treatment lifecycle is simulated and validated. By combining deep civil engineering roots with modern industrial layout software, we deliver robust water management solutions that safeguard the environment, ensure regulatory compliance, and guarantee operational continuity for heavy industrial conglomerates.`,
    caps: ['Water treatment plant design', 'Piping and instrumentation (P&ID)', 'Large-scale facility layout design', 'Project management & compliance'],
    id_caps: ['Desain instalasi pengolahan air', 'Perpipaan & instrumentasi (P&ID)', 'Desain tata letak fasilitas skala besar', 'Manajemen proyek & kepatuhan'],
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
    caps: ['Automated mechanical system design', 'Motion control & internal layout', 'Drone-assisted NDE inspections', 'Structural life analysis for machinery'],
    id_caps: ['Desain sistem mekanis otomatis', 'Kontrol gerak & tata letak internal', 'Inspeksi NDE berbasis drone', 'Analisis umur struktural mesin'],
  },
];