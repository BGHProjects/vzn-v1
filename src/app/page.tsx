"use client";
import AppButton from "@/components/AppButton";
import HowToPlay from "@/components/HowToPlay";
import SplashEnemy from "@/components/SplashEnemy";
import { bgColour } from "@/lib/consts/consts";
import { Center, Text, VStack } from "@chakra-ui/react";
import { range } from "lodash";
import { useRouter } from "next/navigation";
import { useState } from "react";

const HomePage = () => {
  const router = useRouter();
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const goToGameplay = () => router.push("/gameplay");

  const commonStyles = {
    height: 60,
    width: 200,
  };

  return (
    <Center
      w="100vw"
      h="100vh"
      bg={bgColour}
      flexDirection="column"
      overflow="hidden"
      position="relative"
    >
      <Text fontSize="150px" color="white" fontFamily="Tektur">
        VZN
      </Text>
      <VStack mt="60px" spacing="20px" height="200">
        <AppButton
          {...commonStyles}
          action={() => goToGameplay()}
          label="Play Now"
        />
        <AppButton
          {...commonStyles}
          action={() => setShowHowToPlay(!showHowToPlay)}
          label="How to Play"
          animationDelay={0.1}
        />
      </VStack>
      {range(50).map((ship) => (
        <SplashEnemy />
      ))}
      {showHowToPlay && (
        <HowToPlay closeFunction={() => setShowHowToPlay(false)} />
      )}
    </Center>
  );
};

export default HomePage;
