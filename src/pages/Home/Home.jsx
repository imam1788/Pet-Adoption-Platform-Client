import React, { useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import Banner from "./Banner";
import PetsCategory from "./PetsCategory";
import CallToAction from "./CallToAction";
import AboutUs from "./AboutUs";
import WhyAdopt from "./WhyAdopt";
import Volunteer from "./Volunteer";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const aboutRef = useRef(null);

  useEffect(() => {
    if (location.state?.scrollToSection === "about" && aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth" });

      // Reset state after scrolling to prevent repeated scroll
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <div className="space-y-20">
      <Banner />
      <PetsCategory />
      <CallToAction />
      <div ref={aboutRef}>
        <AboutUs />
      </div>
      <WhyAdopt />
      <Volunteer />
    </div>
  );
};

export default Home;
