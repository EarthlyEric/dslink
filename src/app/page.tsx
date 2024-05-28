import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="flex justify-center top-5">
          <Image src="/images/dslink_banner.png" alt="DSLink Logo" width={600} height={150} priority={false}/>
      </div>
    </div>
  );
}
