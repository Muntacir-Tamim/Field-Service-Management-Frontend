import { Manrope } from "next/font/google";

// শুধু homepage এর heading এর জন্য। বাকি app এর font বদলায় না।
export const display = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});
