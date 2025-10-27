import { BsArrowRight } from "react-icons/bs";
import { doctors } from "../../assets/datas/doctors";
import { Link } from "react-router-dom";
import starIcon from "../../assets/images/starIcon.png";


const DoctorsCard = ({ doctor }) => {
  const {
    name,
    photo,
    specialization,
    totalPatients,
    hospital,
  } = doctor;

  return (
    <div className="p-3 lg:p-5 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-white">
      <div className="rounded-lg overflow-hidden">
        <img src={photo} className="w-full h-[250px] object-cover" alt={name} />
      </div>

      <h2 className="text-[18px] leading-[30px] lg:text-[26px] lg:leading-9 text-headingColor font-[700] mt-3 lg:mt-5">
        {name}
      </h2>

      <div className="mt-2 lg:mt-4 flex items-center justify-between">
        <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[12px] lg:text-[16px] leading-7 font-semibold rounded">
          {specialization}
        </span>
      </div>


      <div className="mt-[18px] lg:mt-5 flex items-center justify-between">
        <h3 className="text-[16px] leading-7 lg:text-[18px] lg:leading-[30px] font-semibold text-headingColor">
          +{totalPatients} patients
        </h3>
        <p className="text-[14px] leading-6 font-[400] text-textColor">
          At {hospital}
        </p>
      </div>

      <Link
        to="/doctors"
        className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] 
        mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none transition-all duration-300"
      >
        <BsArrowRight className="group-hover:text-white w-6 h-5" />
      </Link>
    </div>
    
  );
};

export default DoctorsCard;