import React from 'react';
import { Navbar } from '../../../_components/nav-bar';
import { ChildHero } from '../../../_components/child-hero';
import { WhyUs } from '../../../_components/whyus';
import { FeaturedProjects } from '../../../_components/featured-projects';
import { CTA } from '../../../_components/CTA';
import Footer  from '@/components/Footer';
import { OurClients } from '../../../_components/client';

const desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus lorem sapien. Aenean vel tortor a erat ornare pellentesque sit amet et turpis. Integer ac tristique tortor, vel dapibus nisl. Cras ac quam nec nisl efficitur dignissim vel nec ipsum. Curabitur eleifend scelerisque eleifend. Integer ut nibh massa. Pellentesque dapibus, ipsum ut elementum ultrices, lorem nisi egestas metus, nec tempus nisl arcu eu mauris. In dolor felis, tristique eget ornare sed, euismod sit amet nunc. Maecenas elit justo, dignissim nec viverra in, ultricies a elit. Proin sit amet fermentum nibh. Quisque at finibus purus, a tempor lorem. Etiam eu libero et ante convallis ullamcorper. Sed ligula ligula, consequat vel hendrerit nec, bibendum eu mauris. Praesent sit amet ex dignissim, auctor neque quis, malesuada odio. Morbi porttitor imperdiet elit ac tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae Vestibulum in odio libero. Etiam dolor velit, tempus at malesuada vel, mollis vel lectus. Suspendisse sit amet tortor in libero convallis rutrum. Duis vel quam vitae ex consectetur imperdiet ut nec sapien. Praesent velit orci, faucibus vel metus quis, hendrerit malesuada leo. Fusce pellentesque metus luctus erat condimentum ornare. Proin venenatis, neque ut vestibulum iaculis, quam ante faucibus eros, in tincidunt metus sem maximus turpis. Proin maximus blandit porta. Vivamus eu nulla non orci elementum sodales in et augue. Aliquam varius consequat sollicitudin. Donec tincidunt, turpis sit amet rutrum scelerisque, dui nulla venenatis augue, luctus tempus tortor magna eu est. Ut non tortor posuere, dapibus ipsum a, tristique orci. Praesent a auctor lacus. Nam euismod, lacus non sagittis lacinia, enim lacus tincidunt enim, ut blandit augue enim eu velit. Nunc tempor malesuada diam ut interdum. Fusce pretium eros sed dolor tincidunt, et volutpat elit placerat. Etiam auctor ultrices eros, vel tincidunt enim tempor ut. Sed id lectus consectetur, auctor nulla maximus, sollicitudin sapien. Proin egestas tincidunt arcu eu viverra. Mauris a nibh aliquam, aliquam ipsum id, egestas metus. Donec in magna vitae mi lobortis egestas eget non orci. Nam dictum turpis faucibus nisi sagittis, dictum ultricies enim iaculis. Suspendisse faucibus justo sit amet neque finibus, vitae efficitur enim sollicitudin. Aliquam euismod tellus at ligula venenatis, quis euismod dui suscipit. Sed non nunc sit amet magna mollis rutrum. Proin finibus, turpis eu auctor cursus, massa tortor tincidunt felis, sed placerat magna mauris vitae odio. Morbi aliquam condimentum lacus vel suscipit. Donec lobortis a urna et gravida. Mauris dictum diam dolor, ac porttitor ante viverra non. Duis rhoncus mi ac turpis placerat tempus. Cras placerat felis diam, sed molestie quam accumsan non. Morbi vulputate purus eu orci porta ultrices quis sed dolor. Phasellus facilisis quis dui et mattis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum malesuada odio a orci bibendum, vitae efficitur purus pharetra. Vestibulum cursus sed augue eget lacinia. Mauris sed maximus odio. Maecenas non rhoncus leo. Etiam vehicula vestibulum congue. Phasellus ut ligula metus."
export default function AboutPage() {
  return(
      <div className="font-sans antialiased text-vertex-fg bg-white overflow-x-hidden selection:bg-vertex-primary selection:text-white">
      <Navbar />
      <ChildHero title= 'Industries' titledesc= 'All industries that we cover.' description={desc} />
      <WhyUs/>
      <FeaturedProjects />
      <OurClients/>
      <CTA />
      <Footer />
    </div>
  )
}