import { Input } from "@/components/ui/input";
import "./footerinput.css";
import MyButton from "@/components/REUSABLE/MyButton/MyButton";
export default function FooterInput() {
  return (
    <section className="border-t border-gray-400 fixed bottom-0 w-full pb-[1rem] pt-[0.5rem] flexBetween gap-x-[2rem] px-[2rem]">
      <Input placeholder="Add a new todo" className="" />
      <MyButton label="Add" color="bg-primaryBlack text-white" />
    </section>
  );
}
