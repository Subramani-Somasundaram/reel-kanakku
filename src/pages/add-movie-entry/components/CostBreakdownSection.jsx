import React, { useContext, useState } from 'react';
import Input from 'components/ui/Input';
import Select from 'components/ui/Select';
import Icon from 'components/AppIcon';
import CurrencyContext from 'context/CurrencyContext';

const POPCORN_SIZE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
];

const PAYMENT_OPTIONS = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI / Digital Wallet' },
  { value: 'gift_card', label: 'Gift Card' },
  { value: 'apple_pay', label: 'Apple Pay' },
  { value: 'google_pay', label: 'Google Pay' },
  { value: 'paypal', label: 'PayPal' },
];

// Primary food items always visible
const FOOD_PRIMARY = [
  { key: 'costPopcorn', label: 'Popcorn', icon: 'ShoppingBag' },
  { key: 'costCoke', label: 'Coke / Soda', icon: 'Coffee' },
];

// Secondary food items hidden by default
const FOOD_SECONDARY = [
  { key: 'costSnacks', label: 'Donut', icon: 'Cookie' },
  { key: 'costVadaPaav', label: 'Vada Paav', icon: 'Sandwich' },
  { key: 'costNachos', label: 'Nachos', icon: 'Utensils' },
  { key: 'costHotDog', label: 'Hot Dog', icon: 'Utensils' },
  { key: 'costCoffee', label: 'Coffee', icon: 'Coffee' },
  { key: 'costPressedJuice', label: 'Pressed Juice', icon: 'Droplets' },
  { key: 'costWater', label: 'Water', icon: 'Droplets' },
  { key: 'costSamosaChat', label: 'Samosa Chaat', icon: 'Utensils' },
  { key: 'costPuffs', label: 'Puffs', icon: 'ShoppingBag' },
];

const TICKET_FIELDS = [
  { key: 'costTicket', label: 'Ticket Price', icon: 'Ticket' },
  { key: 'costBookingCharges', label: 'Booking Charges', icon: 'Receipt' },
  { key: 'costTax', label: 'Tax (GST/VAT)', icon: 'Percent' },
];

const PARKING_FIELDS = [
  { key: 'costParking', label: 'Parking', icon: 'Car' },
];

const CostBreakdownSection = ({ formData, onChange, onSelectChange, errors, totalCost }) => {
  const { currency, formatCurrency } = useContext(CurrencyContext);
  const [showOtherItems, setShowOtherItems] = useState(false);

  const allFoodFields = [...FOOD_PRIMARY, ...FOOD_SECONDARY];
  const foodTotal = allFoodFields?.reduce((sum, f) => sum + (parseFloat(formData?.[f?.key]) || 0), 0);
  const ticketTotal = TICKET_FIELDS?.reduce((sum, f) => sum + (parseFloat(formData?.[f?.key]) || 0), 0);
  const parkingTotal = PARKING_FIELDS?.reduce((sum, f) => sum + (parseFloat(formData?.[f?.key]) || 0), 0);

  // Check if any secondary food field has a value (to auto-expand if needed)
  const hasSecondaryValues = FOOD_SECONDARY?.some(f => parseFloat(formData?.[f?.key]) > 0);

  const renderCurrencyInput = (field) => (
    <div key={field?.key} className="relative">
      <div
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
        style={{ marginTop: '10px' }}
      >
        <span
          className="text-xs font-medium"
          style={{ fontFamily: 'var(--font-data)', color: 'var(--color-text-secondary)' }}
        >
          {currency?.symbol}
        </span>
      </div>
      <Input
        label={field?.label}
        type="number"
        placeholder="0.00"
        value={formData?.[field?.key]}
        onChange={(e) => onChange(field?.key, e?.target?.value)}
        min={0}
        step="0.01"
        className="pl-6"
      />
    </div>
  );

  const SectionHeader = ({ label, color, total }) => (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}
        >
          {label}
        </span>
      </div>
      {total > 0 && (
        <span
          className="text-xs font-semibold"
          style={{ fontFamily: 'var(--font-data)', color }}
        >
          {formatCurrency(total)}
        </span>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Food & Beverages */}
      <div>
        <SectionHeader label="Food & Beverages" color="var(--color-accent)" total={foodTotal} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Popcorn Size always visible */}
          <div>
            <Select
              label="Popcorn Size"
              options={POPCORN_SIZE_OPTIONS}
              value={formData?.popcornSize}
              onChange={(val) => onSelectChange?.('popcornSize', val)}
              placeholder="Select size"
            />
          </div>
          {/* Primary food fields always visible */}
          {FOOD_PRIMARY?.map(renderCurrencyInput)}
        </div>

        {/* Other Items toggle */}
        <button
          type="button"
          onClick={() => setShowOtherItems(!showOtherItems)}
          className="mt-3 flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <Icon
            name={showOtherItems || hasSecondaryValues ? 'ChevronUp' : 'ChevronDown'}
            size={14}
            color="var(--color-text-secondary)"
          />
          {showOtherItems || hasSecondaryValues ? 'Hide other items' : 'Other items'}
        </button>

        {(showOtherItems || hasSecondaryValues) && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
            {FOOD_SECONDARY?.map(renderCurrencyInput)}
          </div>
        )}
      </div>
      {/* Ticket & Charges */}
      <div>
        <SectionHeader label="Ticket & Charges" color="var(--color-primary)" total={ticketTotal} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {TICKET_FIELDS?.map(renderCurrencyInput)}
          <div>
            <Select
              label="Payment Mode"
              options={PAYMENT_OPTIONS}
              value={formData?.paymentMode}
              onChange={(val) => onSelectChange?.('paymentMode', val)}
              placeholder="Select payment"
              error={errors?.paymentMode}
              required
            />
          </div>
        </div>
      </div>
      {/* Parking */}
      <div>
        <SectionHeader label="Parking" color="var(--color-success)" total={parkingTotal} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {PARKING_FIELDS?.map(renderCurrencyInput)}
        </div>
      </div>
      {/* Running Total */}
      <div
        className="flex items-center justify-between p-4 rounded-lg"
        style={{
          background: 'rgba(212, 175, 55, 0.1)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: 'var(--shadow-golden)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-md flex items-center justify-center"
            style={{ background: 'rgba(212, 175, 55, 0.2)', border: '1px solid rgba(212, 175, 55, 0.4)' }}
          >
            <Icon name="Calculator" size={18} color="var(--color-primary)" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
              Running Total
            </p>
            <p className="text-xs mt-0.5" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
              All expenses combined
            </p>
          </div>
        </div>
        <div className="text-right">
          <p
            className="text-2xl md:text-3xl font-bold"
            style={{ fontFamily: 'var(--font-data)', color: 'var(--color-primary)' }}
          >
            {formatCurrency(totalCost)}
          </p>
          <p className="text-xs" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
            {currency?.code}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CostBreakdownSection;