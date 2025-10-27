import React from 'react'
import {faqs} from "../../assets/datas/faqs";
import FaqItem from './faqItem';

const FaqList = () => {
  return (
   <ul className='mt-[38px]'>
    {faqs.map((item,index) =>(
        <FaqItem item={item} key={index} />
    ))}
   </ul>
  );
};

export default FaqList;
