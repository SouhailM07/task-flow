import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./mybutton.css";
import { motion } from "framer-motion";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
export default function MyButton({
  label,
  icon = null,
  color,
}: {
  label: string;
  icon?: IconDefinition | null;
  color: string;
}) {
  return (
    <motion.button
      animate={{ borderBottom: "5px solid transparent" }}
      whileHover={{ borderBottom: "5px solid green", y: -5 }}
      whileTap={{ y: 5, borderBottom: "5px solid transparent" }}
      className={`${color} rounded-lg p-3 space-x-[1rem] `}
    >
      {icon ? (
        <>
          <span>{label}</span>
          <FontAwesomeIcon icon={icon} />
        </>
      ) : (
        <span>{label}</span>
      )}
    </motion.button>
  );
}
