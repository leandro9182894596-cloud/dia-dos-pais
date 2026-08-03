import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getHomenagem, decodeHomenagemPayload, type HomenagemData } from "../lib/storage";
import { HomenagemView } from "../components/HomenagemView";
import { ExpiredPage } from "../components/ExpiredPage";

export const Route = createFileRoute("/homenagem/$id")({
  component: HomenagemPage,
});

function HomenagemPage() {
  const { id } = Route.useParams();
  const [homenagem, setHomenagem] = useState<HomenagemData | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check hash payload (#p=...) if available
    let payloadData: HomenagemData | null = null;
    if (typeof window !== "undefined" && window.location.hash.includes("p=")) {
      const match = window.location.hash.match(/p=([^&]+)/);
      if (match && match[1]) {
        payloadData = decodeHomenagemPayload(match[1]);
      }
    }

    if (payloadData) {
      const result = getHomenagem(payloadData.id);
      if (result.data) {
        setHomenagem(result.data);
        setIsExpired(result.isExpired);
      } else {
        setHomenagem(payloadData);
        setIsExpired(Date.now() - payloadData.createdAt >= 24 * 60 * 60 * 1000);
      }
    } else {
      const result = getHomenagem(id);
      setHomenagem(result.data);
      setIsExpired(result.isExpired);
    }

    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-wine font-serif text-cream">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gold border-t-transparent" />
          <p className="text-lg">Carregando surpresa romântica...</p>
        </div>
      </div>
    );
  }

  if (isExpired || !homenagem) {
    return <ExpiredPage />;
  }

  return <HomenagemView data={homenagem} />;
}
