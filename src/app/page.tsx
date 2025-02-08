import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">Next.js PWA Template (Next.js 15, TailwindCSS v4.0, Serwist)</h1>
      <p>I noticed that most of the docs for Next.js PWA are a bit outdated. So, I decided to create this template for personal use. Feel free to clone it from my GitHub. The template is very minimal with just the required stuff to make PWA work. If you encounter any issues, please report them in the issues tab in the repo. Your support is appreciated!</p>

      <ul className="list-inside list-disc">
        <li>Next.js 15</li>
        <li>TailwindCSS v4.0</li>
        <li>Serwist</li>
      </ul>

      <div className="space-x-2">
        <Link href={`https://github.com/damnitjoshua/nextjs-pwa`} className="bg-black p-2 text-center text-white rounded">Link to Repo</Link>
        <Link href={`https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdamnitjoshua%2Fnextjs-pwa`} className="bg-black p-2 text-center text-white rounded">Deploy with Vercel</Link>
      </div>
     
    </div>
  );
}
