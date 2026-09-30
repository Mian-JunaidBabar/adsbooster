export type ProofStat = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  business: string;
  city: string;
};

export const proofStats: ProofStat[] = [];
export const testimonials: Testimonial[] = [];

function isPlaceholder(value: string) {
  return !value.trim() || /\[[^\]]*\]/.test(value);
}

export function getCompleteStats(stats: ProofStat[]) {
  return stats.filter(
    (stat) => !isPlaceholder(stat.label) && Number.isFinite(stat.value),
  );
}

export function getCompleteTestimonials(testimonialsToCheck: Testimonial[]) {
  return testimonialsToCheck.filter((testimonial) =>
    Object.values(testimonial).every(
      (value) => typeof value === "string" && !isPlaceholder(value),
    ),
  );
}
