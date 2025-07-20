import React from 'react';
import Banner from './Banner';
import PetsCategory from './PetsCategory';
import CallToAction from './CallToAction';
import AboutUs from './AboutUs';
import WhyAdopt from './WhyAdopt';
import Volunteer from './Volunteer';

const Home = () => {
  return (
    <div className='space-y-20'>
      <Banner></Banner>
      <PetsCategory></PetsCategory>
      <CallToAction></CallToAction>
      <AboutUs></AboutUs>
      <WhyAdopt></WhyAdopt>
      <Volunteer></Volunteer>
    </div>
  );
};

export default Home;