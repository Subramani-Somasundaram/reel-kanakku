import React from 'react';
import { useCurrency } from 'context/CurrencyContext';

const COST_ITEMS = [
  { key: 'ticketCost', label: 'Ticket(s)' },
  { key: 'bookingCharges', label: 'Booking Charges' },
  { key: 'tax', label: 'Tax' },
  { key: 'parking', label: 'Parking' },
  { key: 'popcorn', label: 'Popcorn' },
  { key: 'coke', label: 'Coke' },
  { key: 'snacks', label: 'Snacks' },
  { key: 'puffs', label: 'Puffs' },
  { key: 'vadaPaav', label: 'Vada Paav' },
  { key: 'water', label: 'Water' },
  { key: 'samosaChat', label: 'Samosa Chat' },
  { key: 'nachos', label: 'Nachos' },
  { key: 'hotDog', label: 'Hot Dog' },
  { key: 'coffee', label: 'Coffee' },
  { key: 'pressedJuice', label: 'Pressed Juice' },
];

const CostBreakdown = ({ entry }) => {
  const { formatCurrency } = useCurrency();
  const items = COST_ITEMS?.filter((item) => entry?.[item?.key] && entry?.[item?.key] > 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
      {items?.map((item) => (
        <div key={item?.key} className="flex items-center justify-between py-1" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <span className="text-xs" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
            {item?.label}
          </span>
          <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-data)', color: 'var(--color-text-primary)' }}>
            {formatCurrency(entry?.[item?.key])}
          </span>
        </div>
      ))}
      <div className="flex items-center justify-between py-1.5 sm:col-span-2 mt-1 rounded-md px-2" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)' }}>
        <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-primary)' }}>
          Total
        </span>
        <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-data)', color: 'var(--color-primary)' }}>
          {formatCurrency(entry?.totalCost)}
        </span>
      </div>
    </div>
  );
};

export default CostBreakdown;