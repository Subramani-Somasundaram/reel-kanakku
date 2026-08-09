import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from 'lib/supabase';
import { useAuth } from 'contexts/AuthContext';
import { uploadMoviePoster } from 'utils/moviePosterStorage';

import TopNavigation from 'components/ui/TopNavigation';
import NavigationProgressIndicator from 'components/ui/NavigationProgressIndicator';

import SectionHeader from './components/SectionHeader';
import MovieDetailsSection from './components/MovieDetailsSection';
import CompanionSection from './components/CompanionSection';

import CostBreakdownSection from './components/CostBreakdownSection';
import FormActions from './components/FormActions';
import UnsavedChangesModal from './components/UnsavedChangesModal';
import SuccessToast from './components/SuccessToast';

const INITIAL_FORM = {
  movieName: '',
  watchDate: new Date()?.toISOString()?.split('T')?.[0],
  language: '',
  theatre: '',
  screenType: '',
  screenNumber: '',
  companions: '',
  ticketCount: '1',
  seatNumbers: '',
  is3D: false,
  isOpeningDay: false,
  isOpeningShow: false,
  showTime: '',
  paymentMode: '',
  popcornSize: 'none',
  costPopcorn: '',
  costCoke: '',
  costSnacks: '',
  costVadaPaav: '',
  costNachos: '',
  costHotDog: '',
  costCoffee: '',
  costPressedJuice: '',
  costWater: '',
  costSamosaChat: '',
  costPuffs: '',
  costTicket: '',
  costBookingCharges: '',
  costTax: '',
  costParking: '',
  city: '',
  state: '',
  country: '',
};

const COST_KEYS = [
  'costPopcorn', 'costCoke', 'costSnacks', 'costVadaPaav', 'costNachos',
  'costHotDog', 'costCoffee', 'costPressedJuice', 'costWater', 'costSamosaChat',
  'costPuffs', 'costTicket', 'costBookingCharges', 'costTax', 'costParking',
];

function formatSupabaseErrorDetails(error) {
  if (!error) return 'Failed to save entry. Please try again.';
  const code = error.code ?? '(none)';
  const message = error.message ?? String(error);
  const details = error.details ?? '(none)';
  const hint = error.hint ? `\nhint: ${error.hint}` : '';
  return `code: ${code}\nmessage: ${message}\ndetails: ${details}${hint}`;
}

function reportSaveError(error, context) {
  console.error(`[AddMovieEntry] Save failed${context ? ` (${context})` : ''}:`, error);
  if (error && typeof error === 'object') {
    console.error('[AddMovieEntry] Error code:', error.code);
    console.error('[AddMovieEntry] Error message:', error.message);
    console.error('[AddMovieEntry] Error details:', error.details);
    if (error.hint) console.error('[AddMovieEntry] Error hint:', error.hint);
  }
  return formatSupabaseErrorDetails(error);
}

const SECTIONS = [
  { id: 'basic', label: 'Basic Info', icon: 'Info', title: 'Movie Details', subtitle: 'Name, date, language & theatre' },
  { id: 'details', label: 'Movie Details', icon: 'Film', title: 'Show & Companion Info', subtitle: 'Show time, who you went with, seat & flags' },
  { id: 'cost', label: 'Cost & Venue', icon: 'IndianRupee', title: 'Cost Breakdown', subtitle: 'All food, ticket, payment & other expenses' },
  { id: 'notes', label: 'Notes & Rating', icon: 'Star', title: 'Show Details', subtitle: 'Additional show notes' },
];

const AddMovieEntry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState('');
  const [openSections, setOpenSections] = useState({ basic: true, details: false, cost: false, notes: false });
  const [isSaving, setIsSaving] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editEntryId, setEditEntryId] = useState(null);
  const [posterUrl, setPosterUrl] = useState('');
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [posterError, setPosterError] = useState('');
  const [clearPoster, setClearPoster] = useState(false);
  const [theatreSuggestions, setTheatreSuggestions] = useState([]);
  const [companionSuggestions, setCompanionSuggestions] = useState([]);

  // Fetch previously used theatre names and companions from Supabase
  useEffect(() => {
    if (!user) return;
    const fetchSuggestions = async () => {
      const { data } = await supabase?.from('movie_entries')?.select('theatre, companions')?.eq('user_id', user?.id)?.not('theatre', 'is', null);

      if (data) {
        const theatres = [...new Set(data.map(r => r.theatre).filter(Boolean))]?.sort();
        setTheatreSuggestions(theatres);

        const allCompanions = data?.flatMap(r => (r?.companions ? r?.companions?.split(',')?.map(c => c?.trim()) : []))?.filter(Boolean);
        const uniqueCompanions = [...new Set(allCompanions)]?.sort();
        setCompanionSuggestions(uniqueCompanions);
      }
    };
    fetchSuggestions();
  }, [user]);

  // Pre-populate form when editing an existing entry
  useEffect(() => {
    const entry = location?.state?.entry;
    if (entry?.id) {
      setEditEntryId(entry.id);
      setFormData({
        movieName: entry?.movieName || '',
        watchDate: entry?.date || '',
        language: entry?.language || '',
        theatre: entry?.theatre || '',
        screenType: entry?.screen || '',
        screenNumber: '',
        companions: entry?.companions || '',
        ticketCount: String(entry?.tickets || '1'),
        seatNumbers: entry?.seatNo || '',
        is3D: entry?.is3D || false,
        isOpeningDay: entry?.openingDay || false,
        isOpeningShow: entry?.openingShow || false,
        showTime: entry?.showTime || '',
        paymentMode: entry?.paymentMode || '',
        popcornSize: entry?.popcornSize || 'none',
        costPopcorn: entry?.popcorn ? String(entry?.popcorn) : '',
        costCoke: entry?.coke ? String(entry?.coke) : '',
        costSnacks: entry?.snacks ? String(entry?.snacks) : '',
        costVadaPaav: entry?.vadaPaav ? String(entry?.vadaPaav) : '',
        costNachos: entry?.nachos ? String(entry?.nachos) : '',
        costHotDog: entry?.hotDog ? String(entry?.hotDog) : '',
        costCoffee: entry?.coffee ? String(entry?.coffee) : '',
        costPressedJuice: entry?.pressedJuice ? String(entry?.pressedJuice) : '',
        costWater: entry?.water ? String(entry?.water) : '',
        costSamosaChat: entry?.samosaChat ? String(entry?.samosaChat) : '',
        costPuffs: entry?.puffs ? String(entry?.puffs) : '',
        costTicket: entry?.ticketCost ? String(entry?.ticketCost) : '',
        costBookingCharges: entry?.bookingCharges ? String(entry?.bookingCharges) : '',
        costTax: entry?.tax ? String(entry?.tax) : '',
        costParking: entry?.parking ? String(entry?.parking) : '',
        posterUrl: entry?.posterUrl || '',
        city: entry?.city || '',
        state: entry?.state || '',
        country: entry?.country || '',
      });
      setPosterUrl(entry?.posterUrl || '');
      setPosterFile(null);
      setPosterPreview(null);
      setClearPoster(false);
      setPosterError('');
    }
  }, [location?.state?.entry]);

  useEffect(() => {
    return () => {
      if (posterPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(posterPreview);
      }
    };
  }, [posterPreview]);

  const totalCost = useMemo(() => {
    return COST_KEYS?.reduce((sum, key) => sum + (parseFloat(formData?.[key]) || 0), 0);
  }, [formData]);

  const completedSections = useMemo(() => {
    const completed = [];
    if (formData?.movieName && formData?.watchDate && formData?.language && formData?.theatre) completed?.push('basic');
    if (formData?.showTime && formData?.paymentMode) completed?.push('notes');
    if (totalCost > 0) completed?.push('cost');
    if (formData?.ticketCount) completed?.push('details');
    return completed;
  }, [formData, totalCost]);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (errors?.[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  }, [errors]);

  const handleSelectChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (errors?.[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  }, [errors]);

  const toggleSection = useCallback((sectionId) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev?.[sectionId] }));
  }, []);

  const handlePosterSelect = useCallback((file, errorMessage) => {
    if (errorMessage) {
      setPosterError(errorMessage);
      return;
    }
    setPosterError('');
    if (!file) return;
    setPosterFile(file);
    setClearPoster(false);
    setHasChanges(true);
    setPosterPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }, []);

  const handlePosterRemove = useCallback(() => {
    setPosterFile(null);
    setPosterUrl('');
    setClearPoster(true);
    setPosterError('');
    setHasChanges(true);
    setPosterPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return null;
    });
    setFormData((prev) => ({ ...prev, posterUrl: '' }));
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData?.movieName?.trim()) newErrors.movieName = 'Movie name is required';
    if (!formData?.watchDate) newErrors.watchDate = 'Watch date is required';
    if (!formData?.language) newErrors.language = 'Language is required';
    if (!formData?.theatre?.trim()) newErrors.theatre = 'Theatre name is required';
    if (!formData?.showTime) newErrors.showTime = 'Show time is required';
    if (!formData?.paymentMode) newErrors.paymentMode = 'Payment mode is required';
    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors)?.length > 0) {
      setErrors(validationErrors);
      if (validationErrors?.movieName || validationErrors?.watchDate || validationErrors?.language || validationErrors?.theatre) {
        setOpenSections((prev) => ({ ...prev, basic: true }));
      }
      if (validationErrors?.showTime) {
        setOpenSections((prev) => ({ ...prev, details: true }));
      }
      if (validationErrors?.paymentMode) {
        setOpenSections((prev) => ({ ...prev, cost: true }));
      }
      return;
    }

    if (!user) {
      setSaveError('You must be logged in to save an entry.');
      return;
    }

    setIsSaving(true);
    setSaveError('');

    const entryId = editEntryId ?? location?.state?.entry?.id ?? null;
    const isEditing = Boolean(entryId);

    if (isEditing && !editEntryId) {
      setEditEntryId(entryId);
    }

    const basePayload = {
      movie_name: formData?.movieName?.trim(),
      watch_date: formData?.watchDate,
      language: formData?.language,
      theatre: formData?.theatre?.trim(),
      city: formData?.city?.trim() || null,
      state: formData?.state?.trim() || null,
      country: formData?.country?.trim() || null,
      screen_type: formData?.screenType || null,
      screen_number: formData?.screenNumber || null,
      companions: formData?.companions || null,
      ticket_count: parseInt(formData?.ticketCount, 10) || 1,
      seat_numbers: formData?.seatNumbers || null,
      is_3d: formData?.is3D,
      is_opening_day: formData?.isOpeningDay,
      is_opening_show: formData?.isOpeningShow,
      show_time: formData?.showTime,
      payment_mode: formData?.paymentMode,
      popcorn_size: formData?.popcornSize || 'none',
      cost_popcorn: parseFloat(formData?.costPopcorn) || 0,
      cost_coke: parseFloat(formData?.costCoke) || 0,
      cost_snacks: parseFloat(formData?.costSnacks) || 0,
      cost_vada_paav: parseFloat(formData?.costVadaPaav) || 0,
      cost_nachos: parseFloat(formData?.costNachos) || 0,
      cost_hot_dog: parseFloat(formData?.costHotDog) || 0,
      cost_coffee: parseFloat(formData?.costCoffee) || 0,
      cost_pressed_juice: parseFloat(formData?.costPressedJuice) || 0,
      cost_water: parseFloat(formData?.costWater) || 0,
      cost_samosa_chat: parseFloat(formData?.costSamosaChat) || 0,
      cost_puffs: parseFloat(formData?.costPuffs) || 0,
      cost_ticket: parseFloat(formData?.costTicket) || 0,
      cost_booking_charges: parseFloat(formData?.costBookingCharges) || 0,
      cost_tax: parseFloat(formData?.costTax) || 0,
      cost_parking: parseFloat(formData?.costParking) || 0,
      total_cost: totalCost,
    };

    let error;

    try {
      if (isEditing) {
        let poster_url = clearPoster ? null : (posterUrl || null);
        if (posterFile) {
          poster_url = await uploadMoviePoster(entryId, posterFile);
        }

        const updatePayload = { ...basePayload, poster_url };
        console.log('[AddMovieEntry] Save debug:', {
          stateEntryId: location?.state?.entry?.id,
          editEntryId,
          resolvedEntryId: entryId,
          mode: 'edit',
          payload: updatePayload,
        });

        const { error: updateError } = await supabase
          .from('movie_entries')
          .update(updatePayload)
          .eq('id', entryId)
          .eq('user_id', user.id);
        error = updateError;
      } else {
        const insertPayload = {
          ...basePayload,
          user_id: user.id,
          poster_url: null,
        };
        console.log('[AddMovieEntry] Save debug:', {
          stateEntryId: location?.state?.entry?.id,
          editEntryId,
          resolvedEntryId: entryId,
          mode: 'insert',
          payload: insertPayload,
        });

        const { data, error: insertError } = await supabase
          .from('movie_entries')
          .insert(insertPayload)
          .select('id')
          .single();
        error = insertError;

        if (!error && posterFile && data?.id) {
          const poster_url = await uploadMoviePoster(data.id, posterFile);
          const { error: posterUpdateError } = await supabase
            .from('movie_entries')
            .update({ poster_url })
            .eq('id', data.id)
            .eq('user_id', user.id);
          error = posterUpdateError;
        }
      }
    } catch (saveErr) {
      error = saveErr;
    }

    setIsSaving(false);

    if (error) {
      setSaveError(reportSaveError(error, isEditing ? 'update' : 'insert'));
      return;
    }

    setHasChanges(false);
    setShowSuccess(true);
    setTimeout(() => {
      setFormData(INITIAL_FORM);
      navigate('/movie-history');
    }, 2500);
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowUnsavedModal(true);
    } else {
      navigate('/dashboard');
    }
  };

  const handleConfirmDiscard = () => {
    setShowUnsavedModal(false);
    navigate('/dashboard');
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--color-background)' }}
    >
      <TopNavigation />
      {/* Page Content */}
      <main className="pt-16 pb-36 md:pb-24">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">

          {/* Page Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.3)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                  <line x1="7" y1="2" x2="7" y2="22" />
                  <line x1="17" y1="2" x2="17" y2="22" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <line x1="2" y1="7" x2="7" y2="7" />
                  <line x1="2" y1="17" x2="7" y2="17" />
                  <line x1="17" y1="17" x2="22" y2="17" />
                  <line x1="17" y1="7" x2="22" y2="7" />
                </svg>
              </div>
              <div>
                <h1
                  className="text-xl md:text-2xl lg:text-3xl font-bold"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
                >
                  {(editEntryId ?? location?.state?.entry?.id) ? 'Edit Movie Entry' : 'Add Movie Entry'}
                </h1>
                <p
                  className="text-xs md:text-sm"
                  style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}
                >
                  {(editEntryId ?? location?.state?.entry?.id) ? 'Update your cinema experience details' : 'Record your cinema experience with full details'}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div
            className="mb-6 p-4 rounded-xl"
            style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
          >
            <NavigationProgressIndicator
              completedSections={completedSections}
              activeSection={Object.entries(openSections)?.find(([, v]) => v)?.[0] || 'basic'}
            />
          </div>

          {/* Save Error */}
          {saveError && (
            <div
              className="mb-4 p-3 rounded-lg text-sm whitespace-pre-wrap break-words"
              style={{ background: 'rgba(255,142,142,0.12)', border: '1px solid rgba(255,142,142,0.3)', color: 'var(--color-destructive)', fontFamily: 'var(--font-caption)' }}
              role="alert"
            >
              <p className="font-semibold mb-1">Save failed</p>
              {saveError}
            </div>
          )}

          {/* Form Sections */}
          <div className="space-y-4">

            {/* Section 1: Movie Details */}
            <div
              className="rounded-xl overflow-visible"
              style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
            >
              <SectionHeader
                title={SECTIONS?.[0]?.title}
                subtitle={SECTIONS?.[0]?.subtitle}
                iconName={SECTIONS?.[0]?.icon}
                isOpen={openSections?.basic}
                onToggle={() => toggleSection('basic')}
                isCompleted={completedSections?.includes('basic')}
              />
              {openSections?.basic && (
                <div className="p-4 md:p-6" style={{ borderTop: '1px solid var(--color-border)' }}>
                  <MovieDetailsSection
                    formData={{ ...formData, posterUrl }}
                    errors={errors}
                    onChange={handleChange}
                    onSelectChange={handleSelectChange}
                    theatreSuggestions={theatreSuggestions}
                    posterPreview={posterPreview || posterUrl || null}
                    onPosterSelect={handlePosterSelect}
                    onPosterRemove={handlePosterRemove}
                    posterError={posterError}
                  />
                </div>
              )}
            </div>

            {/* Section 2: Companion & Show Flags */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
            >
              <SectionHeader
                title={SECTIONS?.[1]?.title}
                subtitle={SECTIONS?.[1]?.subtitle}
                iconName={SECTIONS?.[1]?.icon}
                isOpen={openSections?.details}
                onToggle={() => toggleSection('details')}
                isCompleted={completedSections?.includes('details')}
              />
              {openSections?.details && (
                <div className="p-4 md:p-6" style={{ borderTop: '1px solid var(--color-border)' }}>
                  <CompanionSection
                    formData={formData}
                    errors={errors}
                    onChange={handleChange}
                    companionSuggestions={companionSuggestions}
                  />
                </div>
              )}
            </div>

            {/* Section 3: Cost Breakdown */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
            >
              <SectionHeader
                title={SECTIONS?.[2]?.title}
                subtitle={SECTIONS?.[2]?.subtitle}
                iconName={SECTIONS?.[2]?.icon}
                isOpen={openSections?.cost}
                onToggle={() => toggleSection('cost')}
                isCompleted={completedSections?.includes('cost')}
              />
              {openSections?.cost && (
                <div className="p-4 md:p-6" style={{ borderTop: '1px solid var(--color-border)' }}>
                  <CostBreakdownSection
                    formData={formData}
                    errors={errors}
                    onChange={handleChange}
                    onSelectChange={handleSelectChange}
                    totalCost={totalCost}
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
      {/* Sticky Form Actions */}
      <FormActions
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
        hasUnsavedChanges={hasChanges}
        totalCost={totalCost}
      />
      {/* Unsaved Changes Modal */}
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onConfirm={handleConfirmDiscard}
        onCancel={() => setShowUnsavedModal(false)}
      />
      {/* Success Toast */}
      <SuccessToast
        isVisible={showSuccess}
        movieName={formData?.movieName}
        totalCost={totalCost}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
};

export default AddMovieEntry;
