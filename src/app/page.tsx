"use client";
import AppButton from "@/components/AppButton";
import { bgColour } from "@/lib/consts/consts";
import { Button, Center, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  const goToGameplay = () => router.push("/gameplay");

  return (
    <Center w="100vw" h="100vh" bg={bgColour} flexDirection={"column"}>
      <Text fontSize="30px" color="white">
        VZN
      </Text>
      <VStack mt="40px" spacing="20px" height="200">
        <AppButton
          height={60}
          width={200}
          action={() => goToGameplay()}
          label="Play Now"
        />
        <AppButton
          height={60}
          width={200}
          action={() => alert("Not yet implemented")}
          label="How to Play"
          animationDelay={0.1}
        />
      </VStack>
    </Center>
  );
};

export default HomePage;
