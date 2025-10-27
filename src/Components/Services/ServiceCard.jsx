import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";

const ServiceCard = ({ item }) => {
  const { name, desc } = item;

  return (
    <div className="border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition bg-white">
      <h2 className="text-[26px] leading-9 text-headingColor font-[700]">
        {name}
      </h2>

      <p className="text-[16px] leading-7 font-[400] text-textColor mt-4">
        {desc}
      </p>

      <div className="flex justify-start mt-6">
        <Link
          to="/doctors"
          className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] 
          flex items-center justify-center group hover:bg-primaryColor hover:border-none transition"
        >
          <BsArrowRight className="group-hover:text-white w-6 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
