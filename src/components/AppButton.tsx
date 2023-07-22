import { Center, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";

interface IAppButton {
  width: number;
  height: number;
  action: () => void;
  label: string;
  animationDelay?: number;
  animationDuration?: number;
}

const AppButton = ({
  width,
  height,
  action,
  label,
  animationDelay = 0,
  animationDuration = 0.2,
}: IAppButton) => {
  const [justRendered, setJustRendered] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [animDelay, setAnimDelay] = useState(animationDelay);

  const handleMouseEnter = () => {
    setHovering(true);
    setJustRendered(false);
    setAnimDelay(0);
  };

  const handleMouseExit = () => {
    setHovering(false);
  };

  const handleHoverState = (
    baseState: any,
    animatedState: any
  ): number | number[] =>
    justRendered
      ? baseState
      : hovering
      ? [baseState, animatedState]
      : [animatedState, baseState];

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseExit}
      onClick={action}
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: "10px",
        border: "2px solid white",
        zIndex: "2",
        position: "relative",
        opacity: 0,
        cursor: "pointer",
      }}
      animate={{
        y: [200, 0],
        opacity: [0, 1],
        width: [0, width],
        height: [0, height],
        scale: handleHoverState(1, 1.1),
      }}
      transition={{
        ease: "easeInOut",
        duration: animationDuration,
        delay: animDelay,
        y: {
          duration: animationDuration * 2,
          delay: animDelay,
        },
        width: {
          duration: animationDuration,
          delay: justRendered ? animDelay * 3 : 0,
        },
        height: {
          duration: animationDuration,
          delay: justRendered ? animDelay * 2 : 0,
        },
        scale: {
          delay: 0,
        },
      }}
    >
      <Center boxSize="100%" bg="rgba(0,0,0,0.5)" borderRadius="10px">
        <motion.span
          style={{
            fontSize: 20,
            color: "white",
            textAlign: "center",
            fontFamily: "Tektur",
          }}
          animate={{
            opacity: [0, 1],
          }}
          transition={{
            opacity: {
              delay: animationDelay * 3 + animationDuration,
            },
          }}
        >
          {label}
        </motion.span>
      </Center>
    </motion.div>
  );
};

export default AppButton;
