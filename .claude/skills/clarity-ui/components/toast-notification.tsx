import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        className: "border border-border bg-bg-elevated text-fg-primary text-sm shadow-md",
        duration: 4000,
      }}
    />
  );
}

/*
Usage anywhere in the app:

import { toast } from "sonner";

// Success
toast.success("Changes saved successfully.");

// Error with action
toast.error("Failed to save changes.", {
  action: { label: "Retry", onClick: () => handleRetry() },
});

// Loading → success pattern
toast.promise(saveData(), {
  loading: "Saving changes...",
  success: "Changes saved successfully.",
  error: "Failed to save changes.",
});
*/
