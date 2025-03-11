import {Suspense} from "react";
import Tiptap from "@/components/Tiptap";

export default function HomePage() {
  return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Välkommen till din Bibelstudie-app!</h2>
        <div>
            <Suspense>
                <Tiptap />
            </Suspense>
        </div>
      </div>
  );
}