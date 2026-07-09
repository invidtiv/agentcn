export default async (inputData: {
  readonly source: unknown;
  readonly customer_tier: unknown;
  readonly start_date?: string;
  readonly end_date?: string;
  readonly limit?: number;
  readonly offset?: number;
}) => {
  const {
    source,
    customer_tier,
    start_date,
    end_date,
    limit = 40,
    offset = 0,
  } = inputData;

  // In a real implementation, this would query a database
  // For now, we'll return a mock response structure
  const filtersApplied: Record<string, string> = {};

  if (source) {
    filtersApplied.source = source;
  }

  if (customer_tier) {
    filtersApplied.customer_tier = customer_tier;
  }

  if (start_date) {
    filtersApplied.start_date = start_date;
  }

  if (end_date) {
    filtersApplied.end_date = end_date;
  }

  const allFeedback = [
    {
      customer_tier: "pro",
      date: "2025-06-15",
      id: "fb-001",
      source: "app_review",
      text: "The new dashboard loads much faster, great improvement!",
    },
    {
      customer_tier: "enterprise",
      date: "2025-06-16",
      id: "fb-002",
      source: "support_ticket",
      text: "Mobile app crashes every time I try to upload a file larger than 5MB.",
    },
    {
      customer_tier: "free",
      date: "2025-06-17",
      id: "fb-003",
      source: "survey",
      text: "Love the dark mode feature, please add more theme options.",
    },
    {
      customer_tier: "enterprise",
      date: "2025-06-18",
      id: "fb-004",
      source: "support_ticket",
      text: "The API response times have degraded significantly in the last week.",
    },
    {
      customer_tier: "pro",
      date: "2025-06-19",
      id: "fb-005",
      source: "social_media",
      text: "Your product is overpriced compared to competitors. Considering alternatives.",
    },
    {
      customer_tier: "free",
      date: "2025-06-20",
      id: "fb-006",
      source: "app_review",
      text: "The onboarding tutorial was confusing, took me 2 hours to set up.",
    },
    {
      customer_tier: "pro",
      date: "2025-06-21",
      id: "fb-007",
      source: "social_media",
      text: "Fantastic customer support team! Resolved my issue within minutes.",
    },
    {
      customer_tier: "pro",
      date: "2025-06-22",
      id: "fb-008",
      source: "support_ticket",
      text: "The CSV export feature keeps failing with large datasets.",
    },
    {
      customer_tier: "enterprise",
      date: "2025-06-23",
      id: "fb-009",
      source: "survey",
      text: "Would be great to have Slack integration for team notifications.",
    },
    {
      customer_tier: "free",
      date: "2025-06-24",
      id: "fb-010",
      source: "app_review",
      text: "The search functionality is slow and returns irrelevant results.",
    },
    {
      customer_tier: "pro",
      date: "2025-06-25",
      id: "fb-011",
      source: "support_ticket",
      text: "Billing page is confusing, I was charged twice for my subscription.",
    },
    {
      customer_tier: "enterprise",
      date: "2025-06-26",
      id: "fb-012",
      source: "social_media",
      text: "Great product overall, been using it daily for 6 months.",
    },
    {
      customer_tier: "free",
      date: "2025-06-27",
      id: "fb-013",
      source: "app_review",
      text: "The keyboard shortcuts don't work on Firefox, only Chrome.",
    },
    {
      customer_tier: "pro",
      date: "2025-06-28",
      id: "fb-014",
      source: "survey",
      text: "Need better data export options, CSV alone is not enough.",
    },
    {
      customer_tier: "enterprise",
      date: "2025-06-29",
      id: "fb-015",
      source: "social_media",
      text: "The real-time collaboration feature is a game changer for our team!",
    },
  ];

  let filtered = [...allFeedback];

  if (source) {
    filtered = filtered.filter((f) => f.source === source);
  }
  if (customer_tier) {
    filtered = filtered.filter((f) => f.customer_tier === customer_tier);
  }
  if (start_date) {
    filtered = filtered.filter((f) => f.date >= start_date);
  }
  if (end_date) {
    filtered = filtered.filter((f) => f.date <= end_date);
  }

  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    feedback: paginated,
    filters_applied: filtersApplied,
    has_more: offset + limit < total,
    limit,
    offset,
    returned: paginated.length,
    total,
  };
};
