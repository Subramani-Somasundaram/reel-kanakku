import React, { useRef } from 'react';
import Input from 'components/ui/Input';
import Select from 'components/ui/Select';
import Icon from 'components/AppIcon';

const LANGUAGE_OPTIONS = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'telugu', label: 'Telugu' },
  { value: 'kannada', label: 'Kannada' },
  { value: 'malayalam', label: 'Malayalam' },
  { value: 'marathi', label: 'Marathi' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'punjabi', label: 'Punjabi' },
  { value: 'french', label: 'French' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'korean', label: 'Korean' },
];

const SCREEN_OPTIONS = [
  { value: 'standard', label: 'Standard' },
  { value: 'imax', label: 'IMAX' },
  { value: 'bigpix', label: 'BigPix' },
  { value: 'pxl', label: 'PXL' },
  { value: 'epiq', label: 'EPIQ' },
];

// Known theatres → location. Matching is case-insensitive and whitespace-tolerant.
// Adding a new theatre here makes it auto-fill next time; anything unknown is
// left blank for you to type, and never guessed at.
const THEATRE_LOCATIONS = {
  'sathyam cinemas':                    ['Chennai', 'Tamil Nadu', 'India'],
  'pvr - heritage':                     ['Chennai', 'Tamil Nadu', 'India'],
  's2 theyagaraja':                     ['Chennai', 'Tamil Nadu', 'India'],
  's2 - perambur':                      ['Chennai', 'Tamil Nadu', 'India'],
  'inox luxe - phoenix market city':    ['Chennai', 'Tamil Nadu', 'India'],
  'palazzo':                            ['Chennai', 'Tamil Nadu', 'India'],
  'pvr escape - express avenue mall':   ['Chennai', 'Tamil Nadu', 'India'],
  'mayajaal':                           ['Chennai', 'Tamil Nadu', 'India'],
  'pvr - vr chennai':                   ['Chennai', 'Tamil Nadu', 'India'],
  'ags cinemas omr: navalur':           ['Chennai', 'Tamil Nadu', 'India'],
  'the vijay park multiplex':           ['Chennai', 'Tamil Nadu', 'India'],
  'inox - the marina mall':             ['Chennai', 'Tamil Nadu', 'India'],
  'pvr - grand mall':                   ['Chennai', 'Tamil Nadu', 'India'],
  'rohini cinemas':                     ['Chennai', 'Tamil Nadu', 'India'],
  'inox national':                      ['Chennai', 'Tamil Nadu', 'India'],
  'pvr cinemas ampa sky walk':          ['Chennai', 'Tamil Nadu', 'India'],
  'sangam cinemas':                     ['Chennai', 'Tamil Nadu', 'India'],
  'shakthi towers preview screen':      ['Chennai', 'Tamil Nadu', 'India'],
  'cinepolis - bsr mall omr':           ['Chennai', 'Tamil Nadu', 'India'],
  'inox vishal de mal - madurai':       ['Madurai', 'Tamil Nadu', 'India'],
  'bombay theatre - thirunelveli':      ['Tirunelveli', 'Tamil Nadu', 'India'],
  'vdl cinemas chidambaram':            ['Chidambaram', 'Tamil Nadu', 'India'],
  'pvr cinemas bengaluru forum mall':   ['Bengaluru', 'Karnataka', 'India'],
  'regal simi valley civic center':     ['Simi Valley', 'California', 'USA'],
  'simi valley 10 cinemas':             ['Simi Valley', 'California', 'USA'],
  'cinemark promenade 18':              ['Woodland Hills', 'California', 'USA'],
  'amc promenade 16':                   ['Woodland Hills', 'California', 'USA'],
  'cinemark century stadium 25 & xd':   ['Orange', 'California', 'USA'],
};

const lookupLocation = (name) => {
  if (!name) return null;
  // normalise dashes and collapse whitespace so en-dashes and double spaces still match
  const key = String(name)
    ?.replace(/[\u2010-\u2015]/g, '-')
    ?.replace(/\s+/g, ' ')
    ?.trim()
    ?.toLowerCase();
  return THEATRE_LOCATIONS?.[key] || null;
};

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_POSTER_SIZE_MB = 5;

const MovieDetailsSection = ({
  formData,
  errors,
  onChange,
  onSelectChange,
  theatreSuggestions = [],
  posterPreview,
  onPosterSelect,
  onPosterRemove,
  posterError,
}) => {
  const fileInputRef = useRef(null);
  const displayPoster = posterPreview || formData?.posterUrl;

  const handleTheatreChange = (value) => {
    onChange('theatre', value);
    const loc = lookupLocation(value);
    if (loc) {
      onChange('city', loc?.[0]);
      onChange('state', loc?.[1]);
      onChange('country', loc?.[2]);
    }
  };

  const handleFileChange = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      onPosterSelect?.(null, 'Please upload a JPG, PNG, WebP, or GIF image.');
      return;
    }
    if (file.size > MAX_POSTER_SIZE_MB * 1024 * 1024) {
      onPosterSelect?.(null, `Image must be smaller than ${MAX_POSTER_SIZE_MB}MB.`);
      return;
    }
    onPosterSelect?.(file, '');
    e.target.value = '';
  };

  const autoFilled = Boolean(lookupLocation(formData?.theatre));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
      <div className="md:col-span-2">
        <Input
          label="Movie Name"
          type="text"
          placeholder="e.g. Oppenheimer"
          value={formData?.movieName}
          onChange={(e) => onChange('movieName', e?.target?.value)}
          error={errors?.movieName}
          required
        />
      </div>
      <Input
        label="Watch Date"
        type="date"
        value={formData?.watchDate}
        onChange={(e) => onChange('watchDate', e?.target?.value)}
        error={errors?.watchDate}
        required
      />
      <Select
        label="Language"
        options={LANGUAGE_OPTIONS}
        value={formData?.language}
        onChange={(val) => onSelectChange('language', val)}
        error={errors?.language}
        placeholder="Select language"
        required
        searchable
      />
      <div className="md:col-span-2">
        <Input
          label="Theatre Name"
          type="text"
          placeholder="e.g. PVR Phoenix"
          value={formData?.theatre}
          onChange={(e) => handleTheatreChange(e?.target?.value)}
          error={errors?.theatre}
          required
          list="theatre-suggestions"
        />
        <datalist id="theatre-suggestions">
          {theatreSuggestions?.map(t => (
            <option key={t} value={t} />
          ))}
        </datalist>
      </div>

      {/* Location — auto-filled for known theatres, editable for new ones */}
      <div className="md:col-span-2">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="MapPin" size={14} color="var(--color-text-secondary)" strokeWidth={1.8} />
          <span
            className="text-sm font-medium"
            style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-primary)' }}
          >
            Location
          </span>
          {autoFilled && (
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                background: 'rgba(212,175,55,0.12)',
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-caption)',
              }}
            >
              auto-filled
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="City"
            type="text"
            placeholder="e.g. Chennai"
            value={formData?.city || ''}
            onChange={(e) => onChange('city', e?.target?.value)}
          />
          <Input
            label="State"
            type="text"
            placeholder="e.g. Tamil Nadu"
            value={formData?.state || ''}
            onChange={(e) => onChange('state', e?.target?.value)}
          />
          <Input
            label="Country"
            type="text"
            placeholder="e.g. India"
            value={formData?.country || ''}
            onChange={(e) => onChange('country', e?.target?.value)}
          />
        </div>
      </div>

      <Select
        label="Screen Type"
        options={SCREEN_OPTIONS}
        value={formData?.screenType}
        onChange={(val) => onSelectChange('screenType', val)}
        placeholder="Select screen type"
      />
      <Input
        label="Screen / Auditorium Number"
        type="text"
        placeholder="e.g. Screen 5"
        value={formData?.screenNumber}
        onChange={(e) => onChange('screenNumber', e?.target?.value)}
      />
      <div className="md:col-span-2">
        <label
          className="block text-sm font-medium mb-2"
          style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-primary)' }}
        >
          Movie Poster <span className="font-normal" style={{ color: 'var(--color-text-secondary)' }}>(optional)</span>
        </label>
        <div
          className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-lg"
          style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
        >
          <div
            className="flex-shrink-0 rounded-md overflow-hidden flex items-center justify-center"
            style={{
              width: 60,
              height: 88,
              background: 'var(--color-surface-3)',
              border: '1px dashed var(--color-border)',
            }}
          >
            {displayPoster ? (
              <img
                src={displayPoster}
                alt="Poster preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <Icon name="Image" size={24} color="var(--color-text-secondary)" strokeWidth={1.5} />
            )}
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-xs" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
              Upload a custom poster. Saved to your entry and shown in history instead of the OMDb lookup.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors duration-150"
                style={{
                  background: 'rgba(212, 175, 55, 0.12)',
                  color: 'var(--color-primary)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  fontFamily: 'var(--font-caption)',
                }}
              >
                <Icon name="Upload" size={14} strokeWidth={2} />
                {displayPoster ? 'Replace image' : 'Choose image'}
              </button>
              {displayPoster && (
                <button
                  type="button"
                  onClick={onPosterRemove}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors duration-150"
                  style={{
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)',
                    fontFamily: 'var(--font-caption)',
                  }}
                >
                  <Icon name="X" size={14} strokeWidth={2} />
                  Remove
                </button>
              )}
            </div>
            {posterError && (
              <p className="text-xs" style={{ color: 'var(--color-destructive)', fontFamily: 'var(--font-caption)' }}>
                {posterError}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsSection;
