import Image from "next/image";

export default function LogoComponent() {
  return (
    <Image
      src="/logo.png"
      alt="logo"
      width={200}
      height={200}
      className="animate-duration-[5000ms] animate-infinite animate-wiggle"
  />
  )
}