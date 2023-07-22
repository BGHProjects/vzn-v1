"use client";
import AppButton from "@/components/AppButton";
import { bgColour } from "@/lib/consts/consts";
import { Center, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  const goToGameplay = () => router.push("/gameplay");

  const commonStyles = {
    height: 60,
    width: 200,
  };

  return (
    <Center w="100vw" h="100vh" bg={bgColour} flexDirection="column">
      <Text fontSize="60px" color="white" fontFamily="Tektur">
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
          action={() => alert("Not yet implemented")}
          label="How to Play"
          animationDelay={0.1}
        />
      </VStack>
    </Center>
  );
};

export default HomePage;
