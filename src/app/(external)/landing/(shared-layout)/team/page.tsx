import { ChildHero } from '../../_components/child-hero';
import { Team } from '../../_components/team';
import { FeaturedProjects } from '../../_components/featured-projects';
import { CTA } from '../../_components/CTA';

const desc = "Merging deep physical engineering design with cutting-edge AI tools and computational modeling. From detailed 3D CAD modeling and finite element analysis (FEA) to AI-assisted design optimization and automated inspection workflows, we empower industrial projects with faster execution, uncompromised safety, and exact technical execution."
export default function AboutPage() {
  return(
      <div className="font-sans antialiased text-vertex-fg bg-white overflow-x-hidden selection:bg-[royalblue] selection:text-white">
      <ChildHero title= 'About' titledesc= 'About Us' description={desc} />
      <Team/>
      <FeaturedProjects />
      <CTA />
    </div>
  )
}