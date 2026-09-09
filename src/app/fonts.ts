import localFont from "next/font/local";

export const googleSans = localFont({
  src: [
    {
      path: "./font/GoogleSans-VariableFont_GRAD,opsz,wght.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./font/GoogleSans-Italic-VariableFont_GRAD,opsz,wght.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-google-sans",
  display: "swap",
});
