"use client";
import "./media-image.scss";

import Image, { type ImageProps } from "next/image";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { cx } from "@/lib/cx";

export function MediaImage({
  src,
  alt,
  className,
  onError,
  ...props
}: ImageProps) {
  const [failed, setFailed] = useState(!src);

  useEffect(() => {
    setFailed(!src);
  }, [src]);

  if (failed) {
    return (
      <span className={cx("media-image-fallback", className)} role="img" aria-label={alt || "Нет фото"}>
        <Camera strokeWidth={1.4} aria-hidden />
        <em>Здесь будет фото</em>
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
      {...props}
    />
  );
}
