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

tfjsWasm.setWasmPaths(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm`
);

const Gameplay = () => {
  const router = useRouter();
  const videoWidth = 20;

  const detectorRef = useRef();
  const videoRef = useRef();
  const [ctx, setCtx] = useState();

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
    drawHands(hands, ctx);
  }, !!(detectorRef.current && videoRef.current && ctx));

  return (
    <Center w="100vw" h="100vh" bg="black" flexDirection={"column"}>
      <Center
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
      <Button w="200px" mt="20px" onClick={() => router.push("/")}>
        Return to Main Menu
      </Button>
    </Center>
  );
};

export default Gameplay;
