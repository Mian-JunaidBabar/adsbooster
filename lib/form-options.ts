// Kept free of zod so the client form can import it without the validation bundle.
export const businessTypes = [
  "Clinic or healthcare",
  "Education or training",
  "Visa or immigration",
  "Skin care or beauty",
  "Retail or e-commerce",
  "Real estate",
  "Restaurant or food",
  "Services (other)",
  "Other",
] as const;

export const budgetOptions = [
  "Under 50k PKR",
  "50k–150k PKR",
  "150k–500k PKR",
  "500k+ PKR",
] as const;
