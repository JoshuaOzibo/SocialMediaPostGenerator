import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface FloatingLabelInputProps {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  id,
  type,
  label,
  value,
  onChange,
  error,
  icon,
  rightIcon,
  className
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10">
            {icon}
          </div>
        )}
        
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "w-full h-12 px-3 pt-4 pb-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            icon && "pl-10",
            rightIcon && "pr-10",
            error && "border-red-500 focus:ring-red-500",
            "peer"
          )}
          placeholder=""
        />
        
        <label
          htmlFor={id}
          className={cn(
            "absolute left-3 transition-all duration-200 pointer-events-none text-gray-500 dark:text-gray-400",
            icon && "left-10",
            isFloating
              ? "top-1 text-xs text-blue-600 dark:text-blue-400"
              : "top-1/2 transform -translate-y-1/2 text-sm"
          )}
        >
          {label}
        </label>
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default FloatingLabelInput;