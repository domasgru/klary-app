export const RECEIVED_TYPE = 'received';
export const SENT_TYPE = 'sent';
export const FAVORITES_TYPE = 'favorites';
export const REMOVED_TYPE = 'removed';

export const NAME_TYPE_MAP = {
  received: RECEIVED_TYPE,
  sent: SENT_TYPE,
  favorites: FAVORITES_TYPE,
  trash: REMOVED_TYPE,
};

// Invidual participants states
export const ACTIVE_STATE = 'ACTIVE';
export const REMOVED_STATE = 'REMOVED';
export const DELETED_STATE = 'DELETED';

// Status for both participants
export const CLOSED_STATUS = 'CLOSED';
export const ACTIVE_STATUS = 'ACTIVE';

// Flags
export const FAVORITE_FLAG = 'FAVORITE';

// firestore
export const FEEDBACKS_COLLECTION = 'feedbacks';
