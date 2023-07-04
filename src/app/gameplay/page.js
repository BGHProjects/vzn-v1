"use client";
import { Center, Text, Button, Box } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs-backend-webgl";
import { drawHands } from "@/lib/utils";
import useAnimationFrame from "@/lib/hooks/useAnimationFrame";
import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm";
import {
  setupCanvas,
  setupDetector,
  setupVideo,
} from "./helpers/hand-detection";
import { useRouter } from "next/navigation";

tfjsWasm.setWasmPaths(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm`
);

// These values are experimental, and should somehow be calculated programmatically
const cameraMaxWidth = 640;
const cameraMaxHeight = 480;

const playerYPosition = 85;

const Gameplay = () => {
  const router = useRouter();
  const videoWidth = 20;

  const detectorRef = useRef();
  const videoRef = useRef();
  const [ctx, setCtx] = useState();

  const [rightIndexXPos, setRightIndexXPos] = useState(0);
  const [rightIndexYPos, setRightIndexYPos] = useState(0);
  const [palmXPos, setPalmXPos] = useState(0);

  const [firing, setFiring] = useState(false);
  const [projectilePosition, setProjectilePosition] = useState(playerYPosition);

  const [playerRotation, setPlayerRotation] = useState(0);

  // Projectile logic
  const projectileRef = useRef(null);
  const projectileSpeed = 2;

  useEffect(() => {
    const calculateRotation = () => {
      const reticleY = (rightIndexYPos / cameraMaxHeight) * 100;
      const reticleX = (rightIndexXPos / cameraMaxHeight) * 100 - 5;

      const deltaX = reticleX - (palmXPos / cameraMaxWidth) * 100;
      const deltaY = playerYPosition - reticleY;

      const angle = (Math.atan2(deltaY, deltaX) * (180 / Math.PI) - 90) % 360;
      setPlayerRotation(angle);
    };

    calculateRotation();
  }, [rightIndexYPos, rightIndexXPos]);

  useEffect(() => {
    const animateProjectile = () => {
      setProjectilePosition((prevPosition) => {
        let newPosition = prevPosition - projectileSpeed;

        if (newPosition < 0) {
          newPosition = playerYPosition;
        }

        return newPosition;
      });

      requestAnimationFrame(animateProjectile);
    };

    animateProjectile();

    return () => cancelAnimationFrame(animateProjectile);
  }, []);

  useEffect(() => {
    if (!firing) setProjectilePosition(playerYPosition);
  }, [firing]);

  const initalise = async () => {
    videoRef.current = await setupVideo();
    const ctx = await setupCanvas(videoRef.current);
    detectorRef.current = await setupDetector();

    setCtx(ctx);
  };

  useEffect(() => {
    initalise();
  }, []);

  useAnimationFrame(async (delta) => {
    const hands = await detectorRef.current.estimateHands(video, {
      flipHorizontal: false,
    });

    ctx.clearRect(
      0,
      0,
      videoRef.current.videoWidth,
      videoRef.current.videoHeight
    );
    ctx.drawImage(
      videoRef.current,
      0,
      0,
      videoRef.current.videoWidth,
      videoRef.current.videoHeight
    );
    const { palmX, leftIndexTipX, leftIndexTipY, firing } = drawHands(
      hands,
      ctx
    );

    setRightIndexXPos(leftIndexTipX);
    setRightIndexYPos(leftIndexTipY);

    setPalmXPos(palmX);

    setFiring(firing);
  }, !!(detectorRef.current && videoRef.current && ctx));

  return (
    <Center w="100vw" h="100vh" bg="black" flexDirection={"column"}>
      <Button w="200px" mt="20px" onClick={() => router.push("/")}>
        Return to Main Menu
      </Button>
      <Center
        w="80vw"
        maxW="800px"
        h="100%"
        bg="orange"
        my="30px"
        position="relative"
      >
        {/* Target Reticle */}
        <Box
          borderRadius="full"
          bg="red"
          boxSize="30px"
          top={`${(rightIndexYPos / cameraMaxHeight) * 100}%`}
          right={`${(rightIndexXPos / cameraMaxWidth) * 100 - 5}%`}
          position="absolute"
        ></Box>

        {/* Player Position */}
        <Box
          borderRadius="10px"
          bg="transparent"
          boxSize="50px"
          top={`${playerYPosition}%`}
          right={`${(palmXPos / cameraMaxWidth) * 100 - 5}%`}
          position="absolute"
          borderLeft="30px solid transparent"
          borderRight="30px solid transparent"
          borderBottom="60px solid green"
          transform={`rotate(${playerRotation}deg)`}
          transformOrigin="bottom center"
        ></Box>

        {/* Projectile */}
        {firing && (
          <Center
            borderRadius="full"
            bg="dodgerblue"
            boxSize="20px"
            top={`${projectilePosition}%`}
            right={`${(palmXPos / cameraMaxWidth) * 100 - 5}%`}
            position="absolute"
            ref={projectileRef}
          ></Center>
        )}
      </Center>
      <Center
        mt="auto"
        mb="20px"
        w={`${videoWidth}vw`}
        h={`${videoWidth * (2 / 3)}vw`}
        bg="navy"
        borderRadius="10px"
        position="relative"
      >
        {!videoRef.current && (
          <Center
            position="absolute"
            left="50%"
            transform="translate(-50%, 0)"
            boxSize="100%"
          >
            <Text fontSize="20px" color="white">
              Loading video...
            </Text>
          </Center>
        )}

        <canvas
          style={{
            width: "100%",
            height: "100%",
            zIndex: 1,
            transform: "scaleX(-1)",
          }}
          id="canvas"
        ></canvas>
        <video
          style={{
            visibility: "hidden",
            transform: "scaleX(-1)",
            position: "absolute",
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            borderRadius: "10px",
          }}
          id="video"
          playsInline
        ></video>
      </Center>
    </Center>
  );
};

export default Gameplay;
