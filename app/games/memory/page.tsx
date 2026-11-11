import MemoryBoard from "@/features/memory/components/MemoryBoard";
import GameHeader from "@/features/memory/components/GameHeader";

export default function MemoryPage() {
    return (
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
            <GameHeader />

            <MemoryBoard />
        </main>
    );
}
