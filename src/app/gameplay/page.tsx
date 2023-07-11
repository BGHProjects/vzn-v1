// @ts-nocheck
"use client";
import { Center, Text, Button } from "@chakra-ui/react";
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
import GameplayReticle from "@/components/GameplayReticle";
import Enemy from "@/components/Enemy";
import { range } from "lodash";

tfjsWasm.setWasmPaths(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm`
);

// These values are experimental, and should somehow be calculated programmatically
const cameraMaxWidth = 640;
const cameraMaxHeight = 480;

const Gameplay = () => {
  const router = useRouter();
  const videoWidth = 20;

  const detectorRef = useRef<any>();
  const videoRef = useRef<any>();
  const [ctx, setCtx] = useState<any>();

  const [rightIndexXPos, setRightIndexXPos] = useState(0);
  const [rightIndexYPos, setRightIndexYPos] = useState(0);
  const [leftIndexXPos, setLeftIndexXPos] = useState(0);
  const [leftIndexYPos, setLeftIndexYPos] = useState(0);

  const [firingLeft, setFiringLeft] = useState(false);
  const [firingRight, setFiringRight] = useState(false);

  const [playingGame, setPlayingGame] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [readyToPlay, setReadyToPlay] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [enemies, setEnemies] = useState([]);
  const [aliveEnemyCount, setAliveEnemyCount] = useState(0);

  const spawnEnemy = () => {
    setAliveEnemyCount((prev) => prev + 1);
  };

  const handleEnemyKilled = () => {
    setAliveEnemyCount((prev) => prev - 1);
  };

  useEffect(() => {
    setEnemies((prev) => [...range(aliveEnemyCount)]);
  }, [aliveEnemyCount]);

  const initalise = async () => {
    videoRef.current = await setupVideo();
    const ctx = await setupCanvas(videoRef.current);
    detectorRef.current = await setupDetector();

    setCtx(ctx);
  };

  useEffect(() => {
    if (playingGame && !aliveEnemyCount) {
      setGameOver(true);
    }
  }, [aliveEnemyCount]);

  useEffect(() => {
    initalise();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      setReadyToPlay(true);
    }
  }, [videoRef.current]);

  useEffect(() => {
    if (readyToPlay) setShowPlayButton(true);
  }, [readyToPlay]);

  useEffect(() => {
    if (playingGame) {
      range(5).forEach(() => {
        spawnEnemy();
      });
    }
  }, [playingGame]);

  useAnimationFrame(async (delta: any) => {
    const hands = await detectorRef.current.estimateHands(video, {
      flipHorizontal: false,
    });

    if (ctx) {
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
    }

    const {
      leftIndexTipX,
      leftIndexTipY,
      rightIndexTipX,
      rightIndexTipY,
      firingLeft,
      firingRight,
    } = drawHands(hands, ctx);

    // For some reason, these have to be flipped?
    setRightIndexXPos(leftIndexTipX);
    setRightIndexYPos(leftIndexTipY);
    setLeftIndexXPos(rightIndexTipX);
    setLeftIndexYPos(rightIndexTipY);

    setFiringLeft(firingRight);
    setFiringRight(firingLeft);
  }, !!(detectorRef.current && videoRef.current && ctx));

  const handleStartGame = () => {
    setShowPlayButton(false);
    setPlayingGame(true);
  };

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
        overflow="hidden"
      >
        {showPlayButton && readyToPlay && (
          <Button w="200px" onClick={handleStartGame}>
            Start Game
          </Button>
        )}

        {gameOver && <Text>Game Over</Text>}

        {enemies.map((enemy, index) => (
          <Enemy
            reticle1X={(leftIndexXPos / cameraMaxWidth) * 100}
            reticle1Y={(leftIndexYPos / cameraMaxHeight) * 100}
            reticle2X={(rightIndexXPos / cameraMaxWidth) * 100}
            reticle2Y={(rightIndexYPos / cameraMaxHeight) * 100}
            firingLeft={firingLeft}
            firingRight={firingRight}
            playingGame={playingGame}
            key={index}
            onKilled={handleEnemyKilled} // Assign a unique key to each enemy
          />
        ))}

        {/* Right Target Reticle */}
        <GameplayReticle
          top={(rightIndexYPos / cameraMaxHeight) * 100}
          right={(rightIndexXPos / cameraMaxWidth) * 100 - 5}
          colour="red"
        />

        {/* Left Target Reticle */}
        <GameplayReticle
          top={(leftIndexYPos / cameraMaxHeight) * 100}
          right={(leftIndexXPos / cameraMaxWidth) * 100 - 5}
          colour="purple"
        />
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
