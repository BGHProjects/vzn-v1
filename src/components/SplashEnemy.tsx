import getRandomNumber from "@/lib/helpers/getRandomNumber";
import { Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";

const enemySize = 100;

const SplashEnemy = () => {
  const [whichSpaceShip] = useState(getRandomNumber(1, 5));

  const moveRight = getRandomNumber(0, 1) === 1; // Randomly decide whether to move right
  const moveDown = getRandomNumber(0, 1) === 1; // Randomly decide whether to move down

  const xStart = moveRight
    ? getRandomNumber(-120, -20)
    : getRandomNumber(120, 140);
  const xEnd = moveRight
    ? getRandomNumber(120, 140)
    : getRandomNumber(-120, -20);
  const yStart = moveDown
    ? getRandomNumber(-120, -20)
    : getRandomNumber(120, 140);
  const yEnd = moveDown
    ? getRandomNumber(120, 140)
    : getRandomNumber(-120, -20);

  // Calculate the angle between the starting and ending points
  const angleRad = Math.atan2(yEnd - yStart, xEnd - xStart);
  const angleDeg = (angleRad * 180) / Math.PI;

  return (
    <motion.div
      style={{
        width: enemySize,
        height: enemySize,
        position: "absolute",
        top: `${yStart}vh`,
        left: `${xStart}vw`,
        rotate: `${angleDeg + 90}deg`,
      }}
      animate={{
        top: `${yEnd}vh`,
        left: `${xEnd}vw`,
      }}
      transition={{
        ease: `linear`,
        repeat: Infinity,
        duration: getRandomNumber(3, 7),
      }}
    >
      <Image
        src={`/assets/images/spaceship${whichSpaceShip}.png`}
        boxSize="100%"
      />
    </motion.div>
  );
};

export default SplashEnemy;
