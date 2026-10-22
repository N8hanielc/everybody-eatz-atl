/**
 * ─────────────────────────────────────────────────────────────
 *  EVERYBODY EATZ ATL — CENTRAL SITE CONFIGURATION
 * ─────────────────────────────────────────────────────────────
 *  Edit this one file to update event details, the fundraising
 *  goal, donation options, partners, grocery items, and the
 *  drop-off status. Every page reads from here.
 *
 *  This file is safe to import in the browser: it contains NO
 *  secrets. API keys live in environment variables (.env.local
 *  locally, and the Vercel dashboard in production).
 * ─────────────────────────────────────────────────────────────
 */

export type IllustrationKind = "can" | "box" | "pouch" | "packet";

export type GroceryItem = {
  id: string;
  name: string;
  /** Approximate price in dollars. Use null when unknown — shows "Price TBD". */
  price: number | null;
  description?: string;
  /**
   * Path to a local image in /public, e.g. "/images/items/green-beans.jpg".
   * Leave null to show the built-in illustration instead.
   */
  image: string | null;
  imageAlt?: string;
  /** Fallback illustration style used when `image` is null or fails to load. */
  illustration: IllustrationKind;
  /** Optional retailer product page (opens in a new tab). Not used as an image. */
  productUrl?: string;
  productUrlLabel?: string;
};

export type AdditionalItemIcon =
  | "drumstick"
  | "corn"
  | "cranberry"
  | "mac"
  | "cornbread"
  | "bag";

export type AdditionalItem = {
  id: string;
  name: string;
  price: number | null;
  icon: AdditionalItemIcon;
};

export type Partner = {
  name: string;
  /** Path to an official logo in /public/images/partners. Null = show the name as text. */
  logo: string | null;
  url?: string;
};

export type DonationOption = {
  /** Amount in whole dollars. */
  amount: number;
  label: string;
  description: string;
};

type NavLink = { label: string; href: string };
type SelectOption = { value: string; label: string };

export const siteConfig = {
  organization: {
    name: "Everybody Eatz ATL",
    shortName: "Everybody Eatz",
    tagline: "Thanksgiving Food Drive & Community Giveaway",
    footerMessage:
      "A neighbor-to-neighbor effort to make sure every family in our community has a Thanksgiving meal.",
    /** Contact email shown in the footer. Leave empty ("") to hide. */
    contactEmail: "",
  },

  seo: {
    title: "Everybody Eatz ATL | Thanksgiving Food Drive",
    description:
      "Help Everybody Eatz ATL provide Thanksgiving food baskets to families and meals to individuals in need. Donate groceries, contribute funds, or volunteer.",
  },

  event: {
    /** ISO date used for calendar/metadata purposes. */
    isoDate: "2026-11-20",
    dateLabel: "Friday, November 20, 2026",
    timeLabel: "3:00 PM – 6:00 PM",
    locationName: "The Promise Center, West End",
    addressLine1: "740 Cameron M. Alexander Blvd NW",
    addressLine2: "Atlanta, GA",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=740+Cameron+M.+Alexander+Blvd+NW+Atlanta+GA",
    impactHeadline: "100 Families",
    impactDetail: "Plus individual meal bags for people experiencing homelessness.",
  },

  fundraising: {
    /** Goal in whole dollars. Progress = verified donations ÷ goal. */
    goal: 4000,
    familiesGoal: 100,
    /**
     * Currency for Stripe Checkout and display. Override with the
     * NEXT_PUBLIC_DONATION_CURRENCY environment variable (e.g. "usd").
     */
    currency: (process.env.NEXT_PUBLIC_DONATION_CURRENCY || "usd").toLowerCase(),
    /** Server-enforced limits for a single donation, in whole dollars. */
    minAmount: 1,
    maxAmount: 10000,
    options: [
      { amount: 10, label: "$10", description: "Help provide an individual meal." },
      { amount: 40, label: "$40", description: "Sponsor a family's Thanksgiving basket." },
      { amount: 100, label: "$100", description: "Help provide groceries for multiple families." },
    ] as DonationOption[],
    /** Product name shown on the Stripe Checkout page and receipt. */
    checkoutProductName: "Donation to Everybody Eatz ATL",
    checkoutProductDescription: "Thanksgiving Food Drive & Community Giveaway — November 20, 2026",
    /**
     * Only set to true once the organization's tax-exempt status has been
     * confirmed. While false, the site never claims donations are tax-deductible.
     */
    taxDeductibleConfirmed: false,
  },

  partners: [
    { name: "The Promise Center West End", logo: null },
    { name: "314+", logo: null },
  ] as Partner[],
  /** Shows an "Additional community partners" placeholder tile after the partners above. */
  showAdditionalPartnersTile: true,

  groceries: {
    priceNote: "Prices are approximate and may vary by retailer and location.",
    carousel: [
      {
        id: "green-beans",
        name: "Canned Green Beans",
        price: 1.39,
        description: "French-style cut green beans, about 14.5 oz.",
        image: null,
        illustration: "can",
        productUrl:
          "https://www.kroger.com/p/del-monte-fresh-cut-blue-lake-french-style-green-beans-145-oz-can/0002400016289",
        productUrlLabel: "Example at Kroger",
      },
      {
        id: "stuffing",
        name: "Stuffing Mix",
        price: 1.5,
        description: "Stovetop stuffing mix, about 6 oz.",
        image: null,
        illustration: "box",
        productUrl: "https://www.walmart.com/ip/Kraft-For-Turkey-Stove-Top-Stuffing-Mix-6-oz/10313598",
        productUrlLabel: "Example at Walmart",
      },
      {
        id: "mashed-potatoes",
        name: "Mashed Potatoes",
        price: 1.39,
        description: "Instant homestyle mashed potatoes pouch.",
        image: null,
        illustration: "pouch",
        productUrl:
          "https://www.kroger.com/p/idahoan-buttery-homestyle-mashed-potatoes-pouch/0002970000141",
        productUrlLabel: "Example at Kroger",
      },
      {
        id: "gravy",
        name: "Gravy Mix",
        price: 1.19,
        description: "Brown gravy mix packet, about 0.87 oz.",
        image: null,
        illustration: "packet",
        productUrl: "https://www.kroger.com/p/mccormick-brown-gravy-mix-087-oz/0005210009860",
        productUrlLabel: "Example at Kroger",
      },
    ] as GroceryItem[],
    additional: [
      { id: "turkey", name: "Turkey or Chicken", price: null, icon: "drumstick" },
      { id: "corn", name: "Canned Corn", price: null, icon: "corn" },
      { id: "cranberry", name: "Cranberry Sauce", price: null, icon: "cranberry" },
      { id: "mac", name: "Macaroni and Cheese", price: null, icon: "mac" },
      { id: "cornbread", name: "Cornbread Mix", price: null, icon: "cornbread" },
      { id: "bags", name: "Food Baskets or Reusable Grocery Bags", price: null, icon: "bag" },
    ] as AdditionalItem[],
  },

  dropOff: {
    /** Flip to true (and fill in the details) once The Promise Center approves drop-off. */
    confirmed: false,
    locationName: "The Promise Center, West End",
    pendingMessage: "The Promise Center, West End — drop-off details pending confirmation.",
    /** Only shown when `confirmed` is true. */
    confirmedDetails: "",
  },

  volunteer: {
    roles: [
      { value: "basket_assembly", label: "Basket Assembly" },
      { value: "distribution", label: "Event-Day Distribution" },
      { value: "both", label: "Both" },
    ] as SelectOption[],
    availability: [
      { value: "before_event", label: "Before the event (basket assembly)" },
      { value: "event_day", label: "On event day" },
      { value: "both", label: "Both" },
    ] as SelectOption[],
    maxGroupSize: 50,
    studentNote:
      "Students interested in earning community service hours are welcome to inquire. Service-hour verification is subject to organizer confirmation.",
  },

  /** Optional homepage closing image. Put a photo at this path in /public to use it; null = illustration. */
  closingImage: null as string | null,

  nav: [
    { label: "Home", href: "/" },
    { label: "Items", href: "/items" },
    { label: "Donate", href: "/donate" },
    { label: "Volunteer", href: "/donate#volunteer" },
  ] as NavLink[],
};

export type SiteConfig = typeof siteConfig;
