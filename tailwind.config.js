/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html", "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors:{
        primaryColor:"#0067FF",
        yellowColor: "#FEB60D",
        purpleColor:"oklch(0.257 0.09 281.288)",
        irisBlueColor :"#977IFF",
        Gray:"oklch(0.446 0.03 256.802)",
        headingColor:"oklch(0.147 0.004 49.25)",
        textColor:"oklch(0.147 0.004 49.25)",
      },

      boxShadow:{
        panelShadow :"rgba (17,12,46,0.15) 0px 48px 100px 0px;"
      }
    },
  },
  plugins: [],
};

