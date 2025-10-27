import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import icon1 from "../assets/images/icon1.png";
import icon2 from "../assets/images/icon2.jpg";
import icon3 from "../assets/images/icon3.png";
import About from "../Components/About/about";
import ServiceList from "../Components/Services/serviceList";
import DoctorList from "../Components/doctors/DoctorsList";
import FaqList from "../Components/Faq/FaqList";
import helpDoc from "../assets/images/helpDoc.jpg";
import toast from "react-hot-toast";

const Home = ({ user }) => {
  return (
    <Fragment>
      {user?.role === "admin" ? (
        <div className="bg-dark text-white p-4 text-center">
          <Link to="/admin/dashboard" className="btn btn-primary text-white fw-bold fs-5 hover-btn-primary-dark transition">
            Go to Admin Dashboard
          </Link>
        </div>
      ) : user ? (
        <div className="bg-danger text-white p-4 text-center">
          <p className="fs-5">Only admins can access the dashboard. Contact support for assistance.</p>
        </div>
      ) : null}

<section className="hero-section position-relative min-vh-100 d-flex align-items-center overflow-hidden">
  {/* Background Image with Overlay */}
  <div className="position-absolute top-0 start-0 w-100 h-100">
    <img 
      src="\src\assets\images\bg.jpg"
      alt="Hospital background" 
      className="object-fit-cover w-100 h-100"
      loading="lazy"
    />
    <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25"></div>
  </div>

  <div className="container position-relative z-1 py-5 my-5">
    <div className="row align-items-center g-5">
      {/* Text Content */}
      <div className="col-lg-6 order-lg-1 order-2 text-center text-lg-start">
        <h1 className="display-3 fw-bold text-white mb-4">
          We Help Patients Live a Healthy, Longer Life
        </h1>
        <p className="lead text-light mb-4 opacity-75">
          World-class healthcare at your fingertips. Our expert team provides compassionate, personalized care using the latest medical advancements.
        </p>
        <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
          <button className="btn btn-primary btn-lg px-4 py-3 rounded-pill fw-bold">
            Request an Appointment
          </button>
          <button className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill fw-bold ">
            Meet Our Doctors
          </button>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Features */}
      <section>
        <div className="container row row-cols-1 row-cols-md-3 g-4 mt-4">
          <div className="col">
            <FeatureCard icon={icon1} title="Find a Doctor" link="/doctors/find" />
          </div>
          <div className="col">
            <FeatureCard icon={icon2} title="Find a Location" link="/locations/" />
          </div>
          <div className="col">
            <FeatureCard icon={icon3} title="Book an Appointment" link="/doctors/find" />
          </div>
        </div>
      </section>
      <About />

      <section className="container">
        <h2 className="display-5 text-center mb-2">Our Medical Services</h2>
        <ServiceList />
      </section>

      <section className="container">
        <h2 className="display-5 text-center mb-4">Our Great Doctors</h2>
        <DoctorList />
      </section>
      <section className="container">
        <h2 className="display-5 mb-4">Dedicated to Your Well-being</h2>
        <div className="row g-4">
          <div className="col-md-6 d-none d-md-block">
            <img src={helpDoc} alt="FAQ" className="img-fluid h-90 w-90 object-cover" />
          </div>
          <div className="col-md-6">
            <FaqList />
          </div>
        </div>
      </section>
    </Fragment>
  );
};

const FeatureCard = ({ icon, title, link }) => (
  <div className="p-4 text-center">
    <style>
      {`
        .feature-card-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid #181A1E;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s, border 0.3s;
        }
        .feature-card-btn:hover {
          background-color: #007BFF;
          border: none;
        }
        .feature-card-btn svg {
          width: 24px;
          height: 20px;
          color: #181A1E;
          transition: color 0.3s;
        }
        .feature-card-btn:hover svg {
          color: #FFFFFF;
        }
      `}
    </style>
    <div className="d-flex justify-content-center align-items-center mb-3">
      <img src={icon} alt={title} className="img-fluid" style={{ maxWidth: '100px' }} />
    </div>
    <h2 className="fs-3 fw-bold mb-0">{title}</h2>
    <Link to={link} className="feature-card-btn mt-4 mx-auto">
      <BsArrowRight />
    </Link>
  </div>
);

export default Home;