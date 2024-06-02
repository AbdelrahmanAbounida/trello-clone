import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="h-full flex-col w-full flex items-center justify-center text-lg">
      <div className="">TODO: Create Main Page</div>
      <Button variant={"link"}>
        <Link className="text-blue-600 text-xl" href={"/main"}>
          Create Task
        </Link>
      </Button>
    </main>
  );
}
