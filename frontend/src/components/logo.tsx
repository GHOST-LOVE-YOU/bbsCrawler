import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" passHref>
      <Image
        className="pt-2 hover:scale-110 transition-transform duration-200 cursor-pointer"
        src="/logo.png"
        alt="logo"
        height={180}
        width={180}
      />
    </Link>
  );
}
