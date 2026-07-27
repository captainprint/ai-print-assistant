"use client";

import { useEffect, useState } from "react";
import { ImageIcon, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { ChatRecommendation, MatchedImage, MatchedImageGroup } from "@/lib/chat";

type Props = {
  recommendations: ChatRecommendation[];
  images: MatchedImageGroup[];
};

type LightboxState = {
  images: MatchedImage[];
  index: number;
};

export default function RecommendationCards({ recommendations, images }: Props) {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  return (
    <>
      <div
        className="mt-3 flex w-full min-w-0 max-w-full gap-3 overflow-x-auto overflow-y-hidden pb-2
        [scrollbar-width:thin] [scrollbar-color:#d1d5db_transparent]
        [&::-webkit-scrollbar]:h-1.5
        [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300
        hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"
      >
        {recommendations.map((rec, i) => (
          <RecommendationCard
            key={`${rec.productType}-${i}`}
            recommendation={rec}
            images={images[i]?.images ?? []}
            onImageClick={(imgs, index) => setLightbox({ images: imgs, index })}
          />
        ))}
      </div>

      {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onNavigate={(index) => setLightbox((prev) => (prev ? { ...prev, index } : prev))}
        />
      )}
    </>
  );
}

function RecommendationCard({
  recommendation,
  images,
  onImageClick,
}: {
  recommendation: ChatRecommendation;
  images: MatchedImageGroup["images"];
  onImageClick: (images: MatchedImage[], index: number) => void;
}) {
  return (
    <div className="w-[240px] shrink-0 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex gap-1.5 p-1.5">
        {(images.length > 0 ? images.slice(0, 3) : [null]).map((image, i) => (
          <Thumbnail
            key={image?.url ?? i}
            url={image?.url}
            altText={image?.altText}
            onClick={image ? () => onImageClick(images, i) : undefined}
          />
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

        {recommendation.productUrl && (
          <a
            href={recommendation.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#3157F6] hover:underline"
          >
            View product
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}

function Thumbnail({
  url,
  altText,
  onClick,
}: {
  url?: string;
  altText?: string;
  onClick?: () => void;
}) {
  const [failed, setFailed] = useState(false);

  if (!url || failed) {
    return (
      <div className="flex h-16 w-full flex-1 items-center justify-center rounded-lg bg-gray-100">
        <ImageIcon size={18} className="text-gray-400" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="h-16 w-full flex-1 cursor-pointer overflow-hidden rounded-lg"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={altText || "Product preview"}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
    </button>
  );
}

function ImageLightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: MatchedImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const hasMultiple = images.length > 1;
  const current = images[index];

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (hasMultiple && e.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (hasMultiple && e.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, images.length, hasMultiple, onClose, onNavigate]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 cursor-pointer text-white/80 transition hover:text-white"
      >
        <X size={28} />
      </button>

      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((index - 1 + images.length) % images.length);
          }}
          aria-label="Previous image"
          className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current.url}
        alt={current.altText || "Product preview"}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
      />

      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((index + 1) % images.length);
          }}
          aria-label="Next image"
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {hasMultiple && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
