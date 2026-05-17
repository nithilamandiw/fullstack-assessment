import "./globals.css";
import Navbar from "./Navbar";

export const metadata = {
  title: "ServiceBoard - Mini Service Request Board",
  description:
    "Post and manage service requests for homeowners and tradespeople. Find plumbers, electricians, painters and joiners in your area.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
