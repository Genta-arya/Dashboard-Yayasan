import { clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const responseHandler = (error) => {
  console.log(error?.response.status);
  const message = error?.response?.data?.message;
  console.log(error);
  switch (error?.response?.status) {
    case 401:
      toast.error(message);
      break;

    case 400:
      toast.error(message);
      break;

    case 409:
      toast.error(message , {
        duration: 2000,
        // arah kan ke /login
        onAutoClose: () =>  window.location.href = "/login",
      });
      localStorage.removeItem("token");
      break;

    default:
      toast.error("Terjadi kesalahan. harap hubungi developer.");
  }
};
