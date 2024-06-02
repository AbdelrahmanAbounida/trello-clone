import { KanbanBoard } from "./(routes)/[userId]/[oragnizationId]/(bord)/_components/board";

export default function Home() {
  return (
    <main className="h-full w-full flex items-center justify-center text-lg">
      <KanbanBoard />
    </main>
  );
}
