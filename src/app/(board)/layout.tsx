import { cn } from "@/lib/utils";

export default function BoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={cn(" flex flex-col ")}>
      {/* <div className="sticky px-3 ">
        <Navbar />
      </div> */}
      <div className="h-screen">{children}</div>
    </div>
  );
}
