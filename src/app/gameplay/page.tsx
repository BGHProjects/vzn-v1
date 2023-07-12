"use client";
import Enemy from "@/components/Enemy";
import GameplayReticle from "@/components/GameplayReticle";
import { Button, Center, Text } from "@chakra-ui/react";
import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm";
import "@tensorflow/tfjs-backend-webgl";

import useGameplay from "@/lib/hooks/components/useGameplay";

tfjsWasm.setWasmPaths(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm`
);

// These values are experimental, and should somehow be calculated programmatically
const cameraMaxWidth = 640;
const cameraMaxHeight = 480;

const Gameplay = () => {
  const { variables, functions } = useGameplay();

  const {
    showPlayButton,
    readyToPlay,
    leftIndexXPos,
    leftIndexYPos,
    rightIndexXPos,
    rightIndexYPos,
    firingLeft,
    firingRight,
    playingGame,
    videoRef,
    enemies,
    gameOver,
    videoWidth,
    router,
  } = variables;

  const { handleEnemyKilled, handleStartGame } = functions;

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

        {enemies.map((enemy: any, index: number) => (
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
