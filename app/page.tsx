import Greet from "@/components/Greet/Greet";
import LanguageChoose from "@/components/shared/LanguageChoose";

export default function Home() {
  return <div className="flex flex-col w-full h-full">
    <Greet />
    <LanguageChoose />
  </div>;
}
