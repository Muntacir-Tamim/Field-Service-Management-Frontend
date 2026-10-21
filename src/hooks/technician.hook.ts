import { useMutation } from "@tanstack/react-query";
import { applyAsTechnician } from "@/api";

export function useApplyAsTechnician() {
  return useMutation({ mutationFn: applyAsTechnician });
}

// NOTE: Step 5 (Technician module) এ বাকি hook এই file এই যোগ হবে
