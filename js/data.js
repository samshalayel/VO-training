// Data module
// TODO: Store default content for branding and CV information
// This will contain user data, portfolio items, and customization options

export const defaultData = {
  brand: {
    name: 'اسمك',
    tagline: 'وصفتك المهنية',
    primaryColor: '#00e5ff',
    secondaryColor: '#ff2bd6',
  },
  cv: {
    // TODO: Add CV sections
  },
  gallery: {
    // TODO: Add portfolio items
  },
};

export function getDefaultData() {
  return defaultData;
}