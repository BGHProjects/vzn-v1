import { Image } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import getRandomNumber from "../lib/helpers/getRandomNumber";
import detectionCollision from "../lib/helpers/detectCollision";

const enemySize = 60;
const movementRange = 3;
const collisionThreshold = 5;

interface IEnemy {
  reticle1X: number;
  reticle1Y: number;
  reticle2X: number;
  reticle2Y: number;
  firingRight: boolean;
  firingLeft: boolean;
  playingGame: boolean;
  onKilled: () => void;
}

const Enemy = ({
  reticle1X,
  reticle1Y,
  reticle2X,
  reticle2Y,
  firingLeft,
  firingRight,
  playingGame,
  onKilled,
}: IEnemy) => {
  const [top, setTop] = useState(getRandomNumber(20, 80));
  const [left, setLeft] = useState(getRandomNumber(20, 80));
  const [alive, setAlive] = useState(true);
  const [whichSpaceShip] = useState(getRandomNumber(1, 5));
  const [rotation, setRotation] = useState(0);

  const xDelta = getRandomNumber(-movementRange, movementRange);
  const yDelta = getRandomNumber(-movementRange, movementRange);

  const moveBox = () => {
    if (rotation === 0) {
      const angleRad = Math.atan2(yDelta, xDelta);
      const angleDeg = (angleRad * 180) / Math.PI;
      setRotation(angleDeg - 90);
    }

    setLeft((ov) => {
      if (ov < -10) return 100;
      if (ov > 110) return 0;
      return (ov -= xDelta);
    });

    setTop((ov) => {
      if (ov < -10) return 100;
      if (ov > 110) return 0;
      return (ov -= yDelta);
    });
  };

  useEffect(() => {
    if (playingGame) {
      const interval = setInterval(moveBox, 100);
      return () => clearInterval(interval);
    }
  }, [playingGame]);

  useEffect(() => {
    if (playingGame) {
      if (
        Math.abs(reticle1X - left) > 10 &&
        Math.abs(reticle2X - left) > 10 &&
        Math.abs(reticle1Y - top) > 10 &&
        Math.abs(reticle2Y - top) > 10
      )
        return;

      const leftHit = detectionCollision(
        reticle1X,
        reticle1Y,
        left,
        top,
        firingLeft,
        collisionThreshold
      );

      const rightHit = detectionCollision(
        reticle2X,
        reticle2Y,
        left,
        top,
        firingRight,
        collisionThreshold
      );

      if ((leftHit || rightHit) && alive) {
        setAlive(false);
        onKilled();
      }
    }
  }, [reticle1X, reticle1Y, reticle2X, reticle2Y, left, top, playingGame]);

  return (
    playingGame &&
    alive && (
      <Image
        src={`/assets/images/spaceship${whichSpaceShip}.png`}
        position="absolute"
        top={`${top}%`}
        left={`${left}%`}
        boxSize={`${enemySize}px`}
        borderRadius="full"
        transform={`rotate(${rotation}deg)`}
      />
    )
  );
};

export default Enemy;
