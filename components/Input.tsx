import React, { forwardRef, InputHTMLAttributes } from 'react'
import {cn} from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  rightElement?: React.ReactNode;
}
const Input = forwardRef<HTMLInputElement,InputProps>((
  { label, error, helperText, className, fullWidth = true, rightElement, ...props }, ref
) => {
  return (
    <div className={cn('space-y-2', fullWidth && 'w-ful')}>
      {
        label && (
          <label className='block text-sm font-medium text-gray-400'>
            {label}
          </label>
        )
      }
      <div className=' relative group'>
        <input ref={ref} 
          className={cn("w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg \
           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 \
           outline-none transition-all duration-200 text-gray-100 \
           placeholder-gray-500", rightElement && "pr-12",error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              className)}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={cn(
          "text-sm",
          error ? "text-red-500" : "text-gray-500"
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  )
})

export default Input
