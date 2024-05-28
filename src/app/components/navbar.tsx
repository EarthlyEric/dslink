import Image from "next/image";

export default function Navbar() {
  return (
    <main className="grid grid-cols-2 mx-10 my-5 p-4 rounded-lg border-double border-4 border-teal-400">
        <div className="flex justify-start">
            <a href="/">
                <Image src="/images/dslink_banner.png" alt="DSLink Logo" width={150} height={37.5} priority={false} />
            </a>
        </div>
        <div className="flex justify-end items-center space-x-4">
            <a href="/login" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Login
            </a>
        </div>
    </main>
  );
}
