import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex flex-col items-center">
      <div className="relative w-[120px] h-[50px] md:w-[180px] md:h-[50px]">
        <Image
          className="hidden dark:block hover:scale-110 transition-transform duration-200"
          src="/logo.png"
          alt="logo"
          fill
          sizes="(max-width: 640px) 120px, 180px"
          style={{ objectFit: "contain" }}
        />
        <Image
          className="block dark:hidden hover:scale-110 transition-transform duration-200"
          src="/logo-dark.png"
          alt="logo"
          fill
          sizes="(max-width: 640px) 120px, 180px"
          style={{ objectFit: "contain" }}
        />
      </div>
    </Link>
  );
}
