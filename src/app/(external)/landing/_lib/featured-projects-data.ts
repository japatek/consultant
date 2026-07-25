export interface Project {
  tag: string;
  title: string;
  desc: string;
  slug: string;
  extend_desc: string;
  media: {
    type: 'image' | 'video';
    url: string;
    alt?: string;
  };
}

export const featuredProjects: Project[] = [
  {
    tag: "Power Plant",
    title: "Inspection Simulation For Gas Turbine M701F Owned by PT. Indonesia Power based on Indonesia",
    desc: "Development of a complex 3D exploded view and visual simulation for the M701F gas turbine, detailed to highlight internal components and maintenance inspection workflows for digital website content.",
    slug: "pln-ip",
    extend_desc: `  This project delivers a comprehensive inspection simulation for the M701F gas turbine, commissioned by PT. Indonesia Power to support both maintenance planning and external communications. The solution is centered on a highly detailed 3D exploded view of the turbine, with a focus on making complex mechanical relationships easy to understand for technical teams and non-technical stakeholders alike.

  The project is framed around a series of practical design pointers:
  • Component-level visualization – each major assembly is isolated and labelled to show compressor stages, combustor sections, turbine blades, shaft bearings, seals, and lubrication systems.
  • Inspection workflow sequencing – the simulation traces a logical inspection path, highlighting which panels to remove, which sensor readings to capture, and the order in which critical components should be assessed.
  • Maintenance risk communication – the tool identifies high-wear elements and provides a narrative for remaining useful life, allowing teams to prioritize replacement schedules and minimize unplanned downtime.
  • Training and familiarization – the asset is designed for onboarding new technicians, supporting a step-by-step exploration of turbine internals without needing physical access to a running unit.
  • Digital portfolio integration – the simulation doubles as a marketing asset, presenting an engineering story that enhances the company’s digital footprint while preserving technical credibility.

  This extended description clarifies how the project serves distinct audiences. For frontline engineers, it offers an inspection-oriented reference that makes maintenance tasks more efficient and less error-prone. For project managers and operational planners, it provides a clear, visual representation of inspection stages, helping to align resources, schedule outages, and coordinate vendor support.

  From a content perspective, the deliverable is positioned as an accessible digital showcase. It augments the website narrative by demonstrating the firm’s ability to handle complex power plant systems and deliver technically accurate, visually compelling simulations. The simulation is structured to answer the questions most relevant to the client: where are the critical components, how do they connect, and what should be checked during an inspection.

  In summary, the M701F inspection simulation is both a functional engineering asset and a communication platform. It is built to reduce inspection risk, improve team alignment, and elevate the client’s portfolio through a polished digital story that is grounded in real maintenance requirements.`,
    media: {
      type: 'image',
      url: 'https://d2tbt8ofproiin.cloudfront.net/pln-ip/pln-ip-1.jpg',
      alt: 'Gas Turbine M701F'
    }
  },
  {
    tag: "Waste Management",
    title: "Water Waste Treatment Plant Design",
    desc: "Detailed piping and instrumentation with layout design and project management for a major water treatment plant with 7000 TCD capacity for sugar mill factory owned by PT. Perkebunan Nusantara based in indonesia.",
    slug: "ipal",
    extend_desc: `  This project defines a complete water waste treatment plant design for a 7000 TCD facility serving a sugar mill owned by PT. Perkebunan Nusantara. The engineering scope covers the full process from influent intake to final effluent discharge, with an emphasis on reliability, maintainability, and alignment with environmental discharge standards.

  The description is structured around a set of practical pointers:
  • Process sequencing – the design clearly maps how wastewater moves from reception and screening to equalization, biological treatment, clarification, tertiary polishing, and sludge handling.
  • Layout optimization – the plant layout balances equipment placement, piping routes, access for inspection, and service corridors to support safe operation and maintenance.
  • Piping and instrumentation integration – the plan details how process piping, valves, pumps, flow meters, analyzers, and control panels work together to maintain stable treatment performance.
  • Operational resilience – the system design includes redundancy, bypass arrangements, and buffer storage volumes to manage variability in inlet flow and to ensure continuous operation during maintenance.
  • Documentation and delivery – the project also covers project management deliverables such as equipment specifications, construction drawings, and commissioning documentation, ensuring the design is ready for implementation.

  The narrative explains how the project addressed specific site and operational requirements. It discusses how the treatment plant was organized to handle high-strength sugar factory wastewater, how it accommodates seasonal variations in flow and load, and how it integrates with the existing industrial utility network. It also highlights the need to align with regulatory monitoring, chemical dosing strategies, and sludge dewatering considerations.

  In addition to technical detail, the description emphasizes the benefits for stakeholders. For plant operators, the design provides a robust foundation for stable wastewater management and easier troubleshooting. For management and regulators, it demonstrates a commitment to sustainable industrial practice through efficient resource recovery, controlled discharge, and minimized environmental impact.

  Ultimately, this plant design is presented as a strategic investment in long-term operational performance. The narrative positions the project as both an engineering milestone and an environmental solution, showing how a well-organized wastewater treatment facility can protect the sugar mill, conserve water resources, and support responsible industrial growth.`,
    media: {
      type: 'image',
      url: 'https://d2tbt8ofproiin.cloudfront.net/ipal/ipal-1.jpg',
      alt: 'Water Waste Treatment Plant'
    }
  },
  {
    tag: "Robotics",
    title: "Pharmacy Vending Machine",
    desc: "Interactive automated medication dispensing system design with mechanical motion control, internal slot arrangement, and user-friendly interface.",
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
    media: {
      type: 'image',
      url: 'https://d2tbt8ofproiin.cloudfront.net/vending-machine/vending-machine-1.jpg',
      alt: 'Pharmacy Vending Machine'
    }
  },
  {
    tag: "Robotics",
    title: "Education Robot",
    desc: "Full structural condition assessment and remaining service life analysis for automated mechanical systems.",
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
    media: {
      type: 'image',
      url: 'https://d2tbt8ofproiin.cloudfront.net/edu-bot/edu-bot-1.jpg',
      alt: 'Education Robotics'
    }
  }
];
