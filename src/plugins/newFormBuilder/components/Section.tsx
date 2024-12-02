/* eslint-disable arrow-body-style */
import React from 'react';

interface SectionProps {
  title: string;
  hint?: string;
  bordered?: boolean;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, hint, bordered, children }) => {
  return (
    <div className={`section ${bordered ? 'bordered' : ''}`}>
      <h3>{title}</h3>
      {hint && <p className="hint">{hint}</p>}
      <div className="section-content">{children}</div>
    </div>
  );
};

export default Section;
