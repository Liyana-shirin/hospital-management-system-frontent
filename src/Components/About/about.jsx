import React from 'react';
import pdoc from "../../assets/images/pdoc.png";
// import icon3 from "../../assets/images/icon3.png";
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <section>
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-[50px] lg:gap-[130px] xl:gap-0">
          {/* =========== About Image =========== */}
          <div className="relative w-full lg:w-1/2 xl:w-[770px] z-10 order-1 lg:order-1">
            <img src={pdoc} alt="LifeCare Hospital" className="w-full mx-auto mb-4" />
            {/* <div className="absolute z-20 bottom-4 w-[200px] md:w-[300px] right-[-30%] md:right-[-22%]">
              <img src={icon3} alt="Icon" /> */}
            {/* </div> */}
          </div>

          {/* =========== About Content =========== */}
          <div className="w-full lg:w-1/2 xl:w-[670px] order-2 lg:order-2">
            <h2 className="heading mb-5">Proud to be one of Kerala's best</h2>

            <p className="text_para">

              LifeCare Hospital is a premier multispecialty healthcare facility dedicated to providing exceptional medical care with compassion and 
              innovation. Strategically located to serve our community, we offer a comprehensive range of services, including advanced diagnostics, 
              emergency care, and specialized treatments in cardiology, orthopedics, gynecology, and more. Our state-of-the-art infrastructure,
              coupled with a team of highly skilled doctors, nurses, and support staff, ensures personalized care tailored to each patient’s needs.
            </p>
            <p className="text_para mt-[30px]">
              At LifeCare, we prioritize patient well-being, fostering a warm and welcoming environment while leveraging cutting-edge technology
              to deliver superior outcomes. Committed to affordability and accessibility,
              LifeCare Hospital stands as your trusted partner in health, empowering you to live a healthier, happier life.
            </p>
            <Link to="/about">
              <button className="btn">Learn more</button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;