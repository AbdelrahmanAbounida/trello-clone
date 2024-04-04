import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={cn(
        "h-screen w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-gray-200 flex items-center justify-center "
      )}
    >
      {children}
    </div>
  );
}
