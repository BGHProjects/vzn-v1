//@ts-nocheck
import { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs-backend-webgl";
import { drawHands } from "@/lib/utils";
import useAnimationFrame from "@/lib/hooks/useAnimationFrame";
import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm";
import { useRouter } from "next/navigation";
import { range } from "lodash";
import {
  setupCanvas,
  setupDetector,
  setupVideo,
} from "@/app/gameplay/helpers/hand-detection";
import { useTimer } from "react-timer-hook";

tfjsWasm.setWasmPaths(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm`
);

const useGameplay = () => {
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

  const [enemies, setEnemies] = useState<any>([]);
  const [aliveEnemyCount, setAliveEnemyCount] = useState(0);

  const timeLimit = new Date();
  timeLimit.setSeconds(timeLimit.getSeconds() + 60);

  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp: timeLimit, autoStart: false });

  const spawnEnemy = () => {
    setAliveEnemyCount((prev) => prev + 1);
  };

  const handleEnemyKilled = () => {
    setAliveEnemyCount((prev) => prev - 1);
  };

  useEffect(() => {
    setEnemies((prev: any) => [...range(aliveEnemyCount)]);
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
    const timeLimit = new Date();
    timeLimit.setSeconds(timeLimit.getSeconds() + 60);

    restart(timeLimit, false);
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
    start();
  };

  return {
    variables: {
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
    },
    functions: {
      handleEnemyKilled,
      handleStartGame,
    },
  };
};

export default useGameplay;