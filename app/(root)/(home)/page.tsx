import Image from "next/legacy/image";
import Hero from "./Hero";
import Services from "@/components/Services/Services";

export default function Home() {
  return (
    <div>
      <Hero />
      <Services />
    </div>
  );
}
