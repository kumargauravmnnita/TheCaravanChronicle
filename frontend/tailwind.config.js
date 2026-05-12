/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        circus: {
          red: "#C0392B", // deep crimson — main brand color
          gold: "#D4AC0D", // gold — accent color
          darkred: "#922B21", // darker red for hover states
          cream: "#FDF6E3", // warm cream — background color
          dark: "#1C1C1C", // near black — text color
          tent: "#8B0000", // dark red — sidebar color
        },
      },
      // Custom font family
      fontFamily: {
        circus: ['"Playfair Display"', "serif"], // elegant serif for headings
        body: ['"Inter"', "sans-serif"], // clean sans for body text
      },
      // Custom box shadow for cards
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.08)",
        "card-hover": "0 4px 16px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};
