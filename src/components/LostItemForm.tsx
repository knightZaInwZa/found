import React, { useState, useRef } from 'react';
import {
  FileText,
  MapPin,
  Clock,
  User,
  Mail,
  Phone,
  Tag,
  AlertCircle,
  Upload,
  X,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { LostItemReport, ItemCategory, FormErrors } from '../types';
import { ITEM_CATEGORIES, POPULAR_LOCATIONS, COLOR_OPTIONS } from '../mockData';

interface LostItemFormProps {
  onSubmitSuccess: (report: LostItemReport) => void;
}

export const LostItemForm: React.FC<LostItemFormProps> = ({ onSubmitSuccess }) => {
  // Today's date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const nowTimeStr = new Date().toTimeString().slice(0, 5);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [itemType, setItemType] = useState<ItemCategory>('Electronics & Gadgets');
  const [itemTitle, setItemTitle] = useState('');
  const [color, setColor] = useState('Black');
  const [customColor, setCustomColor] = useState('');
  const [description, setDescription] = useState('');
  const [identifyingFeatures, setIdentifyingFeatures] = useState('');

  const [location, setLocation] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [lostDate, setLostDate] = useState(todayStr);
  const [lostTime, setLostTime] = useState(nowTimeStr);

  const [isUrgent, setIsUrgent] = useState(false);
  const [hasReward, setHasReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState('');

  // Image upload state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick autofill for demonstration
  const handleAutofillSample = () => {
    setFirstName('Alexander');
    setLastName('Wright');
    setEmail('a.wright@university.edu');
    setPhone('+1 (555) 438-9201');
    setItemType('Electronics & Gadgets');
    setItemTitle('Sony WH-1000XM5 Noise Canceling Headphones');
    setColor('Black');
    setDescription(
      'Matte black over-ear wireless headphones kept in their original zippered fabric case. Includes a gold-plated 3.5mm audio jack adapter tucked inside the mesh pocket.'
    );
    setIdentifyingFeatures(
      'Small white monogram sticker "AW" on the inside curve of the left headband slider.'
    );
    setLocation('Central Library - 2nd Floor Study Tables');
    setLocationDetails(
      'Cubicle 18 against the east quiet zone window, next to the power column.'
    );
    setLostDate(todayStr);
    setLostTime('14:30');
    setIsUrgent(false);
    setHasReward(true);
    setRewardAmount('$30');
    setErrors({});
  };

  const handleReset = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setItemType('Electronics & Gadgets');
    setItemTitle('');
    setColor('Black');
    setCustomColor('');
    setDescription('');
    setIdentifyingFeatures('');
    setLocation('');
    setLocationDetails('');
    setLostDate(todayStr);
    setLostTime(nowTimeStr);
    setIsUrgent(false);
    setHasReward(false);
    setRewardAmount('');
    setPhotoPreview(null);
    setPhotoName(null);
    setErrors({});
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be smaller than 5MB');
        return;
      }
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPhotoPreview(null);
    setPhotoName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Quick time preset setter
  const setQuickTime = (type: 'morning' | 'noon' | 'evening' | 'recent') => {
    if (type === 'morning') {
      setLostTime('09:30');
    } else if (type === 'noon') {
      setLostTime('13:00');
    } else if (type === 'evening') {
      setLostTime('18:00');
    } else if (type === 'recent') {
      const now = new Date();
      now.setHours(now.getHours() - 1);
      setLostTime(now.toTimeString().slice(0, 5));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. First Name
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    }

    // 2. Last Name
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    }

    // 3. Email
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please provide a valid email address (e.g. name@domain.com).';
    }

    // 4. Type of lost item
    if (!itemType) {
      newErrors.itemType = 'Please select the type of lost item.';
    }

    // Item title
    if (!itemTitle.trim()) {
      newErrors.itemTitle = 'Please specify what the item is (e.g. Apple Watch, Leather Wallet).';
    }

    // 5. Location
    if (!location.trim()) {
      newErrors.location = 'Please state where the item was lost or last seen.';
    }

    // 6. Time and Date
    if (!lostDate) {
      newErrors.lostDate = 'Date is required.';
    }
    if (!lostTime) {
      newErrors.lostTime = 'Time is required.';
    }

    // Description
    if (!description.trim()) {
      newErrors.description = 'Please describe the item to help staff verify ownership.';
    } else if (description.trim().length < 15) {
      newErrors.description = 'Please provide at least 15 characters describing key details.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      // Scroll to the first error
      const firstErrorEl = document.querySelector('[data-error="true"]');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    // Generate random 5-digit ID
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const reportId = `LTR-2026-${randomDigits}`;

    const newReport: LostItemReport = {
      id: reportId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      itemType,
      itemTitle: itemTitle.trim(),
      color: customColor.trim() ? customColor.trim() : color,
      location: location.trim(),
      locationDetails: locationDetails.trim() || undefined,
      lostDate,
      lostTime,
      description: description.trim(),
      identifyingFeatures: identifyingFeatures.trim() || undefined,
      isUrgent,
      hasReward,
      rewardAmount: hasReward && rewardAmount ? rewardAmount.trim() : undefined,
      photoUrl: photoPreview || undefined,
      photoName: photoName || undefined,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      deskNotes: 'Report lodged successfully. Cross-referencing current intake warehouse items.',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitSuccess(newReport);
    }, 450);
  };

  const activeCategory = ITEM_CATEGORIES.find((c) => c.name === itemType);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold tracking-wider uppercase text-slate-500 mb-1.5 flex items-center gap-2">
            <span>Official Incident Intake</span>
            <span aria-hidden="true">·</span>
            <span>Intake Desk Dispatch</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Lost Item Report Form
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl text-balance">
            Provide precise item specifications, the loss location, and incident timing.
            Submitted reports are instantly cataloged against intake inventory and reviewed by on-duty recovery staff.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleAutofillSample}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            title="Populate all fields with a realistic test case"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Fill Sample Data</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            Clear Form
          </button>
        </div>
      </div>

      {/* Main Grid: Form on Left (65%), Guidance / Desk Info on Right (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8 items-start">
        {/* Form Container */}
        <form onSubmit={handleSubmit} noValidate className="lg:col-span-8 space-y-8">
          {/* SECTION 1: Reporter Contact Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    1. Reporter Contact Information
                  </h2>
                  <p className="text-xs text-slate-500">
                    Staff will use these credentials to verify claimant identity upon recovery.
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-mono">* Required fields</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Field 1: First Name */}
              <div data-error={!!errors.firstName}>
                <label
                  htmlFor="first-name-input"
                  className="block text-xs font-semibold text-slate-800 mb-1.5"
                >
                  First Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id="first-name-input"
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName) setErrors({ ...errors, firstName: undefined });
                    }}
                    placeholder="e.g. Eleanor"
                    autoComplete="given-name"
                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                      errors.firstName
                        ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/20'
                        : 'border-slate-300 focus:ring-slate-900/10 focus:border-slate-900'
                    }`}
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.firstName}</span>
                  </p>
                )}
              </div>

              {/* Field 2: Last Name */}
              <div data-error={!!errors.lastName}>
                <label
                  htmlFor="last-name-input"
                  className="block text-xs font-semibold text-slate-800 mb-1.5"
                >
                  Last Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id="last-name-input"
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (errors.lastName) setErrors({ ...errors, lastName: undefined });
                    }}
                    placeholder="e.g. Vance"
                    autoComplete="family-name"
                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                      errors.lastName
                        ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/20'
                        : 'border-slate-300 focus:ring-slate-900/10 focus:border-slate-900'
                    }`}
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.lastName}</span>
                  </p>
                )}
              </div>

              {/* Field 3: Email Address */}
              <div data-error={!!errors.email} className="sm:col-span-1">
                <label
                  htmlFor="email-input"
                  className="block text-xs font-semibold text-slate-800 mb-1.5"
                >
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="e.g. eleanor.vance@company.com"
                    autoComplete="email"
                    className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/20'
                        : 'border-slate-300 focus:ring-slate-900/10 focus:border-slate-900'
                    }`}
                  />
                </div>
                {errors.email ? (
                  <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">
                    Report verification and match alerts are dispatched here.
                  </p>
                )}
              </div>

              {/* Optional Phone Number */}
              <div className="sm:col-span-1">
                <label
                  htmlFor="phone-input"
                  className="block text-xs font-semibold text-slate-800 mb-1.5"
                >
                  Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="phone-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 234-5678"
                    autoComplete="tel"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Recommended for instant pickup SMS notifications.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: Type of Lost Item & Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    2. Lost Item Specification
                  </h2>
                  <p className="text-xs text-slate-500">
                    Specify the category, model, and physical descriptors.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Field 4: Type of Lost Item */}
              <div data-error={!!errors.itemType}>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Type of Lost Item <span className="text-rose-600">*</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {ITEM_CATEGORIES.map((category) => {
                    const isSelected = itemType === category.name;
                    return (
                      <button
                        type="button"
                        key={category.name}
                        onClick={() => {
                          setItemType(category.name);
                          if (errors.itemType) setErrors({ ...errors, itemType: undefined });
                        }}
                        className={`text-left p-3 rounded-lg border text-xs font-medium transition-all flex flex-col justify-between h-20 ${
                          isSelected
                            ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                            : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100/80 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-[11px] leading-tight block truncate font-semibold">
                          {category.name}
                        </span>
                        <span
                          className={`text-[10px] block transition-opacity ${
                            isSelected ? 'text-slate-300' : 'text-slate-400'
                          }`}
                        >
                          Select
                        </span>
                      </button>
                    );
                  })}
                </div>

                {errors.itemType && (
                  <p className="mt-2 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.itemType}</span>
                  </p>
                )}
              </div>

              {/* Specific Item Title */}
              <div data-error={!!errors.itemTitle}>
                <label
                  htmlFor="item-title-input"
                  className="block text-xs font-semibold text-slate-800 mb-1.5"
                >
                  Item Name / Model / Brand <span className="text-rose-600">*</span>
                </label>
                <input
                  id="item-title-input"
                  type="text"
                  value={itemTitle}
                  onChange={(e) => {
                    setItemTitle(e.target.value);
                    if (errors.itemTitle) setErrors({ ...errors, itemTitle: undefined });
                  }}
                  placeholder={activeCategory?.placeholder || 'e.g. Leather wallet, iPhone 14 Pro'}
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    errors.itemTitle
                      ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-slate-900/10 focus:border-slate-900'
                  }`}
                />
                {errors.itemTitle && (
                  <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.itemTitle}</span>
                  </p>
                )}
              </div>

              {/* Color selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Primary Color or Finish
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {COLOR_OPTIONS.map((col) => {
                    const isSelected = color === col.name;
                    return (
                      <button
                        type="button"
                        key={col.name}
                        onClick={() => {
                          setColor(col.name);
                          setCustomColor('');
                        }}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-slate-900 bg-slate-100 text-slate-950 font-semibold ring-1 ring-slate-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/15 inline-block shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comprehensive Description */}
              <div data-error={!!errors.description}>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="description-textarea"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    Detailed Description <span className="text-rose-600">*</span>
                  </label>
                  <span className="text-xs text-slate-400 font-mono tabular-nums">
                    {description.length} chars
                  </span>
                </div>
                <textarea
                  id="description-textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors({ ...errors, description: undefined });
                  }}
                  placeholder="Detail any case, contents (e.g. cards inside wallet, documents in backpack), labels, stickers, or brand markings..."
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 resize-y ${
                    errors.description
                      ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-slate-900/10 focus:border-slate-900'
                  }`}
                />
                {errors.description && (
                  <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.description}</span>
                  </p>
                )}
              </div>

              {/* Identifying Features & Serial Number */}
              <div>
                <label
                  htmlFor="identifying-features-input"
                  className="block text-xs font-semibold text-slate-800 mb-1.5"
                >
                  Identifying Marks or Serial Number{' '}
                  <span className="text-slate-400 font-normal">(Crucial for verification)</span>
                </label>
                <input
                  id="identifying-features-input"
                  type="text"
                  value={identifyingFeatures}
                  onChange={(e) => setIdentifyingFeatures(e.target.value)}
                  placeholder="e.g. Scratched corner, lockscreen picture of black cat, serial number, monogram"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                />
              </div>

              {/* Optional Photo Attachment */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Reference Photograph or Receipt{' '}
                  <span className="text-slate-400 font-normal">(Optional)</span>
                </label>

                {photoPreview ? (
                  <div className="relative border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center gap-4">
                    <img
                      src={photoPreview}
                      alt="Uploaded lost item"
                      className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-900 truncate">{photoName}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Image attached successfully</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-white transition-colors"
                      title="Remove attachment"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50"
                  >
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-medium text-slate-700">
                      Click to upload an image or product reference photo
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      PNG, JPG or WEBP up to 5MB (speeds up inventory confirmation)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: Incident Location & Time */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    3. Location & Timing of Loss
                  </h2>
                  <p className="text-xs text-slate-500">
                    Pinpoint where and approximately when you last had possession of the item.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Field 5: Location where it was lost */}
              <div data-error={!!errors.location}>
                <label
                  htmlFor="location-input"
                  className="block text-xs font-semibold text-slate-800 mb-1.5"
                >
                  Location Where It Was Lost <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    id="location-input"
                    type="text"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      if (errors.location) setErrors({ ...errors, location: undefined });
                    }}
                    placeholder="e.g. Central Library 2nd Floor, Terminal 3 Gate 12, Student Dining Hall"
                    className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                      errors.location
                        ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/20'
                        : 'border-slate-300 focus:ring-slate-900/10 focus:border-slate-900'
                    }`}
                  />
                </div>
                {errors.location && (
                  <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.location}</span>
                  </p>
                )}

                {/* Popular Location Suggestions */}
                <div className="mt-2.5">
                  <span className="text-[11px] text-slate-500 block mb-1.5">
                    Quick suggestions from recent reports:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_LOCATIONS.slice(0, 4).map((loc) => (
                      <button
                        type="button"
                        key={loc}
                        onClick={() => {
                          setLocation(loc);
                          if (errors.location) setErrors({ ...errors, location: undefined });
                        }}
                        className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Specific location details (seat/desk/aisle) */}
              <div>
                <label
                  htmlFor="location-details-input"
                  className="block text-xs font-semibold text-slate-800 mb-1.5"
                >
                  Specific Room, Table, or Seat Details{' '}
                  <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="location-details-input"
                  type="text"
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  placeholder="e.g. Table 4 near the coffee machine, Row G Seat 14, Lockbox 23"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                />
              </div>

              {/* Field 6: Time & Date it was lost */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                {/* Date */}
                <div data-error={!!errors.lostDate}>
                  <label
                    htmlFor="date-lost-input"
                    className="block text-xs font-semibold text-slate-800 mb-1.5"
                  >
                    Date Lost <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      id="date-lost-input"
                      type="date"
                      max={todayStr}
                      value={lostDate}
                      onChange={(e) => {
                        setLostDate(e.target.value);
                        if (errors.lostDate) setErrors({ ...errors, lostDate: undefined });
                      }}
                      className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-colors focus:outline-none focus:ring-2 font-mono tabular-nums ${
                        errors.lostDate
                          ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/20'
                          : 'border-slate-300 focus:ring-slate-900/10 focus:border-slate-900'
                      }`}
                    />
                  </div>
                  {errors.lostDate && (
                    <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.lostDate}</span>
                    </p>
                  )}
                </div>

                {/* Time */}
                <div data-error={!!errors.lostTime}>
                  <label
                    htmlFor="time-lost-input"
                    className="block text-xs font-semibold text-slate-800 mb-1.5"
                  >
                    Approximate Time Lost <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <input
                      id="time-lost-input"
                      type="time"
                      value={lostTime}
                      onChange={(e) => {
                        setLostTime(e.target.value);
                        if (errors.lostTime) setErrors({ ...errors, lostTime: undefined });
                      }}
                      className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-colors focus:outline-none focus:ring-2 font-mono tabular-nums ${
                        errors.lostTime
                          ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/20'
                          : 'border-slate-300 focus:ring-slate-900/10 focus:border-slate-900'
                      }`}
                    />
                  </div>
                  {errors.lostTime && (
                    <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.lostTime}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Time Preset Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-500">Quick time shortcuts:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setQuickTime('recent')}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    1 Hour Ago
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickTime('morning')}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    Morning (09:30)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickTime('noon')}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    Midday (13:00)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickTime('evening')}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    Evening (18:00)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Urgency & Reward Flags */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-xs">
            <h2 className="text-base font-semibold text-slate-900 mb-4">
              4. Priority Flags & Recovery Incentive
            </h2>

            <div className="space-y-4">
              {/* Urgent Flag */}
              <label className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer bg-slate-50/50">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-slate-900 border-slate-300 focus:ring-slate-900"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-900 block">
                    High Priority Incident
                  </span>
                  <span className="text-slate-500 mt-0.5 block">
                    Check if the item contains essential prescription medication, active travel passports, keys to a locked residence, or critical medical equipment.
                  </span>
                </div>
              </label>

              {/* Reward Flag */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasReward}
                    onChange={(e) => setHasReward(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded text-slate-900 border-slate-300 focus:ring-slate-900"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-900 block">
                      Offer Finder's Gratitude / Reward
                    </span>
                    <span className="text-slate-500 mt-0.5 block">
                      Specify an optional cash or token gratitude offered upon verified handoff.
                    </span>
                  </div>
                </label>

                {hasReward && (
                  <div className="pl-7 pt-1">
                    <label
                      htmlFor="reward-amount-input"
                      className="block text-[11px] font-semibold text-slate-700 mb-1"
                    >
                      Reward Amount or Note
                    </label>
                    <input
                      id="reward-amount-input"
                      type="text"
                      value={rewardAmount}
                      onChange={(e) => setRewardAmount(e.target.value)}
                      placeholder="e.g. $50 Cash or Coffee Card"
                      className="w-full sm:w-64 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions / Submit */}
          <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Encrypted & Verified Report Registry</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                By submitting, a tracking ticket will be generated and confirmation sent to{' '}
                <span className="text-white font-mono">{email || 'your email'}</span>.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 whitespace-nowrap cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    <span>Lodging Report...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Submit Lost Item Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Right Sidebar: Guidelines, What Happens Next, Desk Hours */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Recovery Workflow */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-700" />
              <span>How Item Recovery Works</span>
            </h3>

            <ol className="space-y-4 text-xs text-slate-600 mt-4">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-100 font-mono text-[11px] font-semibold text-slate-900 flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <span className="font-semibold text-slate-900 block">Report Lodged</span>
                  Your loss details enter the real-time cross-referencing system with an official ID.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-100 font-mono text-[11px] font-semibold text-slate-900 flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <span className="font-semibold text-slate-900 block">Inventory Matching</span>
                  Physical intake sweeps and turn-ins at security hubs are checked for descriptors.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-100 font-mono text-[11px] font-semibold text-slate-900 flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <span className="font-semibold text-slate-900 block">Claim Verification</span>
                  You receive an email notification with photo match or passcode prompt to claim.
                </div>
              </li>
            </ol>
          </div>

          {/* Tips for Accurate Reports */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-slate-700" />
              <span>Tips for Quick Identification</span>
            </h3>

            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-slate-400">·</span>
                <span>
                  <strong>Unique stickers & scuffs:</strong> Note any scratches, cases, or decals.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400">·</span>
                <span>
                  <strong>Lock screen artwork:</strong> If reporting a phone or tablet, describe the wallpaper.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400">·</span>
                <span>
                  <strong>Key accessories:</strong> Mention specific keychains, fobs, or gym tags.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400">·</span>
                <span>
                  <strong>Exact timestamps:</strong> If you traveled by bus/shuttle, note the route and run time.
                </span>
              </li>
            </ul>
          </div>

          {/* Desk Contact Hours */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-xs">
            <h3 className="font-bold text-slate-900 mb-2">Central Lost & Found Office</h3>
            <p className="text-slate-600 mb-3">
              Ground Floor, Hall of Administration, Room 104
            </p>

            <div className="space-y-1.5 text-slate-500 font-mono text-[11px] tabular-nums">
              <div className="flex justify-between">
                <span>Monday – Friday:</span>
                <span className="text-slate-800 font-medium">08:00 – 19:00</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span className="text-slate-800 font-medium">10:00 – 16:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday & Holidays:</span>
                <span className="text-slate-800 font-medium">On-Duty Security</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Helpline:</span>
              <span className="text-slate-900 font-semibold font-mono tabular-nums">
                +1 (800) 555-LOST
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
