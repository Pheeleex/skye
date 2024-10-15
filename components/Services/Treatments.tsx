import { botox, chemicalpeel, derma, hairloss, massage, mdwl } from '@/public';
import React from 'react';

const Treatments = () => {
  const treatments = [
    { img: chemicalpeel, title: 'Chemical Peel Treatments' },
    { img: botox, title: 'Botox' },
    { img: derma, title: 'Dermaneedling' },
    { img: massage, title: 'Massage' },
    { img: mdwl, title: 'Medical weight loss treatment' },
    { img: hairloss, title: 'Hair Loss Treatment' }
  ];

  return (
    <div className="treatments-container">
      <div className="grid grid-cols-3 gap-4">
        {treatments.map((treatment, index) => (
          <div className={`image-container ${index % 2 === 1 ? 'staggered' : ''}`} key={index}>
            <img src={treatment.img.src} alt={treatment.title} className="image-s" />
            <div className="image-title">{treatment.title}</div>
          </div>
        ))}
      </div>
      <button className="more-button">And More</button>
    </div>
  );
};

export default Treatments;

