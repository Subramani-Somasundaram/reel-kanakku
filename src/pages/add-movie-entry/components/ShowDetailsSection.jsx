import React from 'react';

const ShowDetailsSection = ({ formData, errors, onChange, onSelectChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
      {/* Show Time moved to Show & Companion Info section */}
      {/* Payment Mode moved to Ticket & Charges section */}
      <p className="md:col-span-2 text-sm" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
        Show Time is in the Show &amp; Companion Info section. Payment Mode is in the Cost Breakdown section.
      </p>
    </div>
  );
};

export default ShowDetailsSection;