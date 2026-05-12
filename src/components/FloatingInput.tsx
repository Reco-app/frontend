import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FieldError } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(({ className, label, error, type, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="relative w-full space-y-1">
      <div className="relative group">
        <Input
          ref={ref}
          type={inputType}
          placeholder=" "
          className={cn(
            "peer h-12 pt-4 placeholder:transparent focus-visible:ring-1",
            isPassword && "pr-10",
            error ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-primary",
            className,
          )}
          {...props}
        />
        <Label
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 cursor-text px-1 transition-all duration-200 ease-in-out bg-none text-muted-foreground",
            "peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-white",
            "peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs",
            error && "peer-focus:text-destructive text-destructive peer:focus:bg-white",
            "pointer-events-none",
          )}
        >
          {label}
        </Label>

        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && <p className="text-[0.8rem] font-medium text-destructive">{error.message}</p>}
    </div>
  );
});
FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
