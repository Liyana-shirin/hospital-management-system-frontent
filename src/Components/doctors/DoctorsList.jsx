import React from "react";
import { doctors } from "../../assets/datas/doctors";
import DoctorCard from "../doctors/DoctorsCard";

const DoctorList = () => {
  // Split the doctors array
  const firstThreeDoctors = doctors.slice(0, 3);
  const remainingDoctors = doctors.slice(3);

  return (
    <div className="container">
      {/* First 3 Cards - Static */}
      <div className="row">
        {firstThreeDoctors.map((doctor, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <DoctorCard doctor={doctor} />
          </div>
        ))}
      </div>

      {/* Remaining Cards - Scrollable */}
      {remainingDoctors.length > 0 && (
        <>
          <h5 className="mb-3">More Doctors</h5>
          <div className="d-flex overflow-auto gap-3 pb-2">
            {remainingDoctors.map((doctor, index) => (
              <div key={index} className="flex-shrink-0" style={{ width: "280px" }}>
                <DoctorCard doctor={doctor} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorList;
