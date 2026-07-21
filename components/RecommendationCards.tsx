"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import type { ChatRecommendation, MatchedImageGroup } from "@/lib/chat";

type Props = {
  recommendations: ChatRecommendation[];
  images: MatchedImageGroup[];
};

export default function RecommendationCards({ recommendations, images }: Props) {
  return (
    <div className="mt-3 flex w-full min-w-0 max-w-full gap-3 overflow-x-auto overflow-y-hidden pb-2">
      {recommendations.map((rec, i) => (
        <RecommendationCard key={`${rec.productType}-${i}`} recommendation={rec} images={images[i]?.images ?? []} />
      ))}
    </div>
  );
}

function RecommendationCard({
  recommendation,
  images,
}: {
  recommendation: ChatRecommendation;
  images: MatchedImageGroup["images"];
}) {
  return (
    <div className="w-[240px] shrink-0 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex gap-1.5 p-1.5">
        {(images.length > 0 ? images.slice(0, 3) : [null]).map((image, i) => (
          <Thumbnail key={image?.url ?? i} url={image?.url} altText={image?.altText} />
        ))}
      </div>

      <div className="px-4 pb-4 pt-1">
        <p className="text-sm font-semibold text-gray-900">{recommendation.productType}</p>
        <p className="mt-1 text-xs text-gray-500">
          {recommendation.paperStock} · {recommendation.finish}
        </p>
        <p className="text-xs text-gray-500">{recommendation.size}</p>

        <p className="mt-2 text-xs leading-relaxed text-gray-600">{recommendation.explanation}</p>

        <p className="mt-2 text-sm font-semibold text-[#3157F6]">{recommendation.priceRange}</p>

        {recommendation.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {recommendation.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Thumbnail({ url, altText }: { url?: string; altText?: string }) {
  const [failed, setFailed] = useState(false);

  if (!url || failed) {
    return (
      <div className="flex h-16 w-full flex-1 items-center justify-center rounded-lg bg-gray-100">
        <ImageIcon size={18} className="text-gray-400" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={altText || "Product preview"}
      onError={() => setFailed(true)}
      className="h-16 w-full flex-1 rounded-lg object-cover"
    />
  );
}
