import Image from "next/image";
import { useRouter } from "next/navigation";

export function Logo() {
  const router = useRouter();
  const handleHomeClick = () => router.push("/");

  return (
    <Image
      className="pt-2 hover:scale-110 transition-transform duration-200 cursor-pointer"
      src="/logo.png"
      alt="logo"
      height={180}
      width={180}
      onClick={handleHomeClick}
    />
  );
}