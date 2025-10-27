import React from 'react';
import { services } from "../../assets/datas/services";
import ServiceCard from '../Services/ServiceCard';

const ServiceList = () => {
  return (
    <section className="px-4 lg:px-8 py-10">
      <div className="text-center mb-20">
        <h1 className="text-gray-600 ">Explore the healthcare services we provide</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px]">
        {services.map((item, index) => (
          <ServiceCard item={item} key={index} />
        ))}
      </div>
    </section>
  );
};

export default ServiceList;
