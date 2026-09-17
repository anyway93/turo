"use client";
import "./slider.scss";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";
import { cx } from "@/lib/cx";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const thumbs = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cx("slider", className)}
      {...props}
    >
      <SliderPrimitive.Track className="slider__track">
        <SliderPrimitive.Range className="slider__range" />
      </SliderPrimitive.Track>
      {thumbs.map((_, index) => (
        <SliderPrimitive.Thumb key={index} className="slider__thumb" />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
