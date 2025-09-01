import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex flex-col items-center">
      <div
        className={`
          relative h-[50px] w-[120px]
          md:h-[50px] md:w-[180px]
        `}
      >
        <Image
          className={`
            hidden transition-transform duration-200
            hover:scale-110
            dark:block
          `}
          src="/logo.png"
          alt="logo"
          fill
          sizes="(max-width: 640px) 120px, 180px"
          style={{ objectFit: "contain" }}
        />
        <Image
          className={`
            block transition-transform duration-200
            hover:scale-110
            dark:hidden
          `}
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
