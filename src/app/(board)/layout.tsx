import { cn } from "@/lib/utils";

export default function BoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("h-screen  ")}>{children}</body>
    </html>
  );
}
