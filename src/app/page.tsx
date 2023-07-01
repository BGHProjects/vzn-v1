"use client";
import { Button, Center, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  const goToGameplay = () => router.push("/gameplay");

  return (
    <Center w="100vw" h="100vh" bg="black" flexDirection={"column"}>
      <Text fontSize="30px" color="white">
        VZN
      </Text>
      <VStack mt="40px" spacing="20px">
        <Button w="200px" onClick={() => goToGameplay()}>
          Play Now
        </Button>
        <Button w="200px">How to Play</Button>
      </VStack>
    </Center>
  );
};

export default HomePage;
