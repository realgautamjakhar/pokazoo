import Header from "@/components/Header";
import "./globals.css";

export const metadata = {
  title: "PokaZoo",
  description: "List of Pokemons",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className=" min-h-[100dvh] px-4 ">
        <Header />
        {children}
      </body>
    </html>
  );
}
