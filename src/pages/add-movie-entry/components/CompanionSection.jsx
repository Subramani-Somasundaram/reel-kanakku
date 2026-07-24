import React from 'react';
import Input from 'components/ui/Input';
import { Checkbox } from 'components/ui/Checkbox';

const CompanionSection = ({ formData, errors, onChange, companionSuggestions = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
      <Input
        label="Show Time"
        type="time"
        value={formData?.showTime}
        onChange={(e) => onChange('showTime', e?.target?.value)}
        error={errors?.showTime}
        required
      />
      <div className="md:col-span-2">
        <Input
          label="Who Did You Go With?"
          type="text"
          placeholder="e.g. Family, Friends, Solo, Partner"
          value={formData?.companions}
          onChange={(e) => onChange('companions', e?.target?.value)}
          list="companion-suggestions"
        />
        <datalist id="companion-suggestions">
          {companionSuggestions?.map(c => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>
      <Input
        label="Number of Tickets"
        type="number"
        placeholder="1"
        value={formData?.ticketCount}
        onChange={(e) => onChange('ticketCount', e?.target?.value)}
        min={1}
        max={20}
      />
      <Input
        label="Seat Number(s)"
        type="text"
        placeholder="e.g. G7, G8"
        value={formData?.seatNumbers}
        onChange={(e) => onChange('seatNumbers', e?.target?.value)}
      />
      <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 pt-2">
        <Checkbox
          label="3D Movie"
          description="Was this a 3D screening?"
          checked={formData?.is3D}
          onChange={(e) => onChange('is3D', e?.target?.checked)}
        />
        <Checkbox
          label="Opening Day"
          description="Watched on the opening day?"
          checked={formData?.isOpeningDay}
          onChange={(e) => onChange('isOpeningDay', e?.target?.checked)}
        />
        <Checkbox
          label="Opening Show"
          description="Was this the first show?"
          checked={formData?.isOpeningShow}
          onChange={(e) => onChange('isOpeningShow', e?.target?.checked)}
        />
      </div>
    </div>
  );
};

export default CompanionSection;