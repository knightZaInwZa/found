export type ItemCategory =
  | 'Electronics & Gadgets'
  | 'Wallets & Money'
  | 'Bags & Luggage'
  | 'Keys & Fobs'
  | 'IDs & Documentation'
  | 'Clothing & Outerwear'
  | 'Eyewear & Glasses'
  | 'Jewelry & Watches'
  | 'Books & Notebooks'
  | 'Other Belongings';

export type ReportStatus =
  | 'submitted'
  | 'under_review'
  | 'potential_match'
  | 'ready_for_pickup'
  | 'resolved';

export interface LostItemReport {
  id: string; // e.g. LTR-2026-92814
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  itemType: ItemCategory;
  itemTitle: string; // Specific name e.g. "Black Apple Leather Wallet"
  color: string;
  location: string;
  locationDetails?: string;
  lostDate: string; // YYYY-MM-DD
  lostTime: string; // HH:mm
  description: string;
  identifyingFeatures?: string;
  isUrgent: boolean;
  hasReward: boolean;
  rewardAmount?: string;
  photoUrl?: string;
  photoName?: string;
  status: ReportStatus;
  createdAt: string;
  deskNotes?: string;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  itemType?: string;
  itemTitle?: string;
  location?: string;
  lostDate?: string;
  lostTime?: string;
  description?: string;
  phone?: string;
}
