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
          onChange={(e) => onChange('theatre', e?.target?.value)}
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