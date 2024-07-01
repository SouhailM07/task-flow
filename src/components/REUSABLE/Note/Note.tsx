"use client";
import "./note.css";
import { Checkbox } from "@/components/ui/checkbox";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { useAnimationControls } from "framer-motion";
import { NotesContext } from "@/pages";
import notesStore from "@/zustand/notes.store";
export default function Note({
  index,
  note,
  done,
  _id,
}: {
  index: number;
  note: string;
  done: boolean;
  _id: string;
}) {
  // state toggle / state api / handlers
  const controls = useAnimationControls();
  const { handleDeleteNote, handleUpdateNote }: any = useContext(NotesContext);
  const animationVariants = {
    hidden: { x: "-200%", transition: { delay: 0 } },
    visible: { x: 0, transition: { delay: 0.2 * index } },
  };
  const handleClick = () => {
    controls.start("hidden");
    setTimeout(() => handleDeleteNote(_id), 200);
  };
  const { notes } = notesStore((state) => state);
  // import dynamic from 'next/dynamic'
  // const DynamicComponentWithNoSSR = dynamic(
  //   () => import('../components/hello3'),
  //   { ssr: false }
  // )

  useEffect(() => {
    controls.start("visible");
  }, [notes]);
  return (
    <motion.li
      variants={animationVariants}
      role="listitem"
      initial="hidden"
      animate={controls}
      className="flexBetween space-x-2 select-none min-w-[30rem] h-[3rem] px-[1rem]"
    >
      <div className="flex items-center gap-x-[1rem] h-full w-full">
        <Checkbox id={`terms${index}`} checked={done} />
        <label
          htmlFor={`terms${index}`}
          onClick={() => handleUpdateNote(_id, done)}
          className={`${
            done && "line-through"
          } h-full w-full flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
        >
          {note}
        </label>
      </div>
      <motion.button onClick={() => handleClick()} whileHover={{ scale: 1.2 }}>
        <FontAwesomeIcon icon={faTrash} />
      </motion.button>
    </motion.li>
  );
}
