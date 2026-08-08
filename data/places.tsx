type Place = {
  name: string;
  visited: boolean;
  date?: string; // month · year
  image?: string; // replace with your own photos
};

export const PLACES: Place[] = [
  // ── been ──────────────────────────────────────────────────────
  {
    name: "Ahmedabad, Gujarat",
    visited: true,
    date: "May · 2016",
    image: "/ahmedabad.jpg",
  },
  {
    name: "Agra, India",
    visited: true,
    date: "Mar · 2022",
    image: "/agra.png",
  },
  {
    name: "New Delhi, India",
    visited: true,
    date: "Nov · 2023",
    image: "/delhi.png",
  },
  {
    name: "Manali, Himachal Pradesh",
    visited: true,
    date: "May · 2022",
    image: "/manali-22.png",
  },
  {
    name: "Manali, Himachal Pradesh",
    visited: true,
    date: "Oct · 2023",
    image: "/manali.png",
  },
  {
    name: "Fatehpur Sikri, Uttar Pradesh",
    visited: true,
    date: "Sept · 2024",
    image: "/sikri.png",
  },
  {
    name: "Mussoorie, Uttarakhand",
    visited: true,
    date: "Jan · 2025",
    image: "/mussorie.jpg",
  },
  {
    name: "Chakrata, Uttarakhand",
    visited: true,
    date: "Apr · 2025",
    image: "/chakrata.png",
  },
  {
    name: "Mcleodganj, Himachal Pradesh",
    visited: true,
    date: "May · 2025",
    image: "/mcleod.png",
  },
  {
    name: "Chopta, Uttarakhand",
    visited: true,
    date: "Jan · 2026",
    image: "/chopta.jpg",
  },
  {
    name: "Shimla, Himachal Pradesh",
    visited: true,
    date: "Apr-2026",
    image: "/shimla.jpg",
  },
  {
    name: "Kalpa, Himachal Pradesh",
    visited: true,
    date: "Apr-2026",
    image: "/kalpa.jpg",
  },
  {
    name: "Nako, Himachal Pradesh",
    visited: true,
    date: "Apr-2026",
    image: "/nako.jpg",
  },
  {
    name: "Chitkul, Himachal Pradesh",
    visited: true,
    date: "Apr-2026",
    image: "/chitkul.jpg",
  },
  {
    name: "Rishikesh, Uttarakhand",
    visited: true,
    date: "Jun-2026",
    image: "/rishikesh.jpg",
  },
  {
    name: "Harsil, Uttarakhand",
    visited: true,
    date: "Jun-2026",
    image: "/harsil.jpg",
  },
  {
    name: "Shoja, Himachal Pradesh",
    visited: true,
    date: "Jun-2026",
    image: "/shoja.jpg",
  },

  // ── want to go ────────────────────────────────────────────────

  { name: "Bir, Himachal Pradesh", visited: false },
  { name: "Munsiyari,Uttarakhand", visited: false },
  { name: "Banaras, Uttar Pradesh", visited: false },
  { name: "Jodhpur, Rajasthan", visited: false },
  { name: "Udaipur,Rajasthan", visited: false },
  { name: "Jaisalmer, Rajasthan", visited: false },
  { name: "Spiti, Himachal Pradesh", visited: false },
  { name: "Kasol, Himachal Pradesh", visited: false },
  { name: "Leh, Ladakh", visited: false },
  { name: "Ladakh", visited: false },
  { name: "Ziro, Arunachal Pradesh", visited: false },
  { name: "Tirthan Valley, Himachal Pradesh", visited: false },
];
