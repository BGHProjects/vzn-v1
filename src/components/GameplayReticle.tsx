import { motion } from "framer-motion";

interface IGameplayReticle {
  top: number;
  right: number;
  colour: string;
  firing: boolean;
}

const firingSize = 0.75;
const cursorSize = "30px";

const GameplayReticle = ({ top, right, colour, firing }: IGameplayReticle) => {
  return (
    <motion.div
      style={{
        top: `${top}%`,
        right: `${right}%`,
        position: "absolute",
        borderRadius: cursorSize,
        height: cursorSize,
        width: cursorSize,
        border: "2px solid",
        borderColor: colour,
      }}
      animate={{
        scale: firing ? [1, firingSize] : [firingSize, 1],
        backgroundColor: firing ? colour : "transparent",
      }}
      transition={{
        ease: "easeInOut",
        duration: 0.1,
      }}
    ></motion.div>
  );
};

export default GameplayReticle;
