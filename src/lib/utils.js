import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export const responseHandler = (response) => {
  switch (response?.status) {
    
    case 401:
      alert('Username atau password salah!');
      break;
    default:
      alert('Terjadi kesalahan, coba lagi nanti.');
  }
};
