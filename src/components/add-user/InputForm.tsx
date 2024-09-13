// @NOTE: in case you are using Next.js
"use client";

import React, { forwardRef, useState, useCallback } from "react";

import { motion, AnimationProps } from "framer-motion";

import { tv } from "tailwind-variants";

import { AlertCircle } from "lucide-react";

interface InputFocusBlurProps extends React.ComponentProps<"input"> {
  feedbackError?: string;
}

const EIXO_X_PLACEHOLDER = 24;
const STANDARD_DURATION = 0.3;

const inputFocusBlurStyles = tv({
  slots: {
    baseStyle: `w-full h-[50px] flex items-center rounded-xl border border-stroke focus-within:border-secondary/50 
    bg-secondary/10 transition-all duration-200 relative `,
    inputStyle: `flex-1 h-full py-2 focus:ring-0  border-none text-secondary bg-transparent relative z-[9999] placeholder:sr-only 
    disabled:cursor-not-allowed`,
    placeholderStyle: `text-sm text-neutral-500 absolute left-3`,
    feedbackErrorStyle: `flex items-center gap-1 text-sm text-red-300 mt-1`,
  },
  variants: {
    error: {
      true: {
        baseStyle: `border-red-300`,
      },
    },
    disabled: {
      true: {
        baseStyle: `bg-neutral-800 cursor-not-allowed`,
      },
    },
  },
});

const { baseStyle, inputStyle, placeholderStyle, feedbackErrorStyle } =
  inputFocusBlurStyles();

export const InputForm = forwardRef<HTMLInputElement, InputFocusBlurProps>(
  ({ placeholder, feedbackError = "", disabled, value, ...props }, ref) => {
    const [isFocus, setIsFocus] = useState(false);
    const [internalValue, setInternalValue] = useState("");

    const handle = useCallback((type: "focus" | "blur") => {
      setIsFocus(type === "focus");
    }, []);

    function observeFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
      setInternalValue(event.target.value);
    }

    const isFilled = internalValue.length > 0 || !!value;
    const isFocusOrFilled = isFocus || isFilled;

    const isError = feedbackError.length > 0 && !disabled;

    const placeholderAnimation: AnimationProps["animate"] = isFocusOrFilled
      ? {
          x: EIXO_X_PLACEHOLDER,
          filter: "blur(4px)",
          opacity: 0,
        }
      : {
          x: 0,
        };

    return (
      <div className="w-full max-w-[300px]">
        <div
          className={baseStyle({ error: isError, disabled })}
          data-filled={isFilled}
        >
          <input
            ref={ref}
            type="text"
            className={inputStyle()}
            placeholder={placeholder}
            onFocus={() => handle("focus")}
            onBlur={() => handle("blur")}
            onChange={observeFieldChange}
            disabled={disabled}
            value={value}
            {...props}
          />

          <motion.span
            className={placeholderStyle()}
            initial={{
              x: 0,
            }}
            animate={placeholderAnimation}
            transition={{
              easings: ["easeOut"],
              duration: STANDARD_DURATION,
            }}
          >
            {placeholder}
          </motion.span>
        </div>

        {isError && (
          <motion.span
            className={feedbackErrorStyle()}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: STANDARD_DURATION,
            }}
          >
            <AlertCircle size={12} />
            {feedbackError}
          </motion.span>
        )}
      </div>
    );
  }
);

InputForm.displayName = "InputForm";
