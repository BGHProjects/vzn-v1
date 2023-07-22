"use client";
import Enemy from "@/components/Enemy";
import GameplayReticle from "@/components/GameplayReticle";
import { Center, Flex, Text, VStack, chakra } from "@chakra-ui/react";
import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm";
import "@tensorflow/tfjs-backend-webgl";

import useGameplay from "@/lib/hooks/components/useGameplay";
import AppButton from "@/components/AppButton";
import { bgColour } from "@/lib/consts/consts";

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
    seconds,
    minutes,
    playerScore,
  } = variables;

  const { handleEnemyKilled, handleStartGame } = functions;

  return (
    <Center w="100vw" h="100vh" bg={bgColour} flexDirection={"column"}>
      <Center mt="20px" h="50px">
        <AppButton
          width={250}
          height={40}
          label="Return to Main Menu"
          action={() => router.push("/")}
        />
      </Center>

      <Flex
        w="80vw"
        maxW="800px"
        justifyContent="space-between"
        py="3px"
        px="10px"
      >
        {playingGame && (
          <StandardText>
            {minutes}:
            {seconds.toString().length === 1
              ? seconds.toString().padStart(2, "0")
              : seconds}
          </StandardText>
        )}

        {playingGame && <StandardText>SCORE: {playerScore}</StandardText>}
      </Flex>

      <Center
        w="80vw"
        maxW="800px"
        h="100%"
        bg="black"
        mb="30px"
        position="relative"
        overflow="hidden"
        border="1px solid white"
        borderRadius="5px"
      >
        <VStack>
          {gameOver && (
            <VStack my="20px">
              <StandardText fontSize="30px">Game Over</StandardText>

              <StandardText>SCORE: {playerScore}</StandardText>
            </VStack>
          )}

          {showPlayButton && readyToPlay && (
            <Center h="60px">
              <AppButton
                width={200}
                height={60}
                label="Start Game"
                action={() => handleStartGame()}
              />
            </Center>
          )}
        </VStack>

        {enemies.map((enemy: any, index: number) => (
          <Enemy
            reticle1X={(leftIndexXPos / cameraMaxWidth) * 100}
            reticle1Y={(leftIndexYPos / cameraMaxHeight) * 100}
            reticle2X={(rightIndexXPos / cameraMaxWidth) * 100}
            reticle2Y={(rightIndexYPos / cameraMaxHeight) * 100}
            firingLeft={firingLeft}
            firingRight={firingRight}
            playingGame={playingGame}
            key={index} // Assign a unique key to each enemy
            onKilled={handleEnemyKilled}
          />
        ))}

        {/* Right Target Reticle */}
        <GameplayReticle
          top={(rightIndexYPos / cameraMaxHeight) * 100}
          right={(rightIndexXPos / cameraMaxWidth) * 100 - 5}
          colour="#FF5600"
          firing={firingRight}
        />

        {/* Left Target Reticle */}
        <GameplayReticle
          top={(leftIndexYPos / cameraMaxHeight) * 100}
          right={(leftIndexXPos / cameraMaxWidth) * 100 - 5}
          colour="dodgerblue"
          firing={firingLeft}
        />
      </Center>
      <Center
        mt="auto"
        mb="20px"
        w={`${videoWidth}vw`}
        h={`${videoWidth * (2 / 3)}vw`}
        bg="black"
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
            <StandardText>Loading video...</StandardText>
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

const StandardText = chakra(Text, {
  baseStyle: {
    color: "white",
    fontSize: "20px",
    fontFamily: "Tektur",
  },
});

export default Gameplay;
