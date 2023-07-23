import {
  Button,
  Flex,
  Icon,
  HStack,
  Divider,
  Text,
  chakra,
  Center,
  VStack,
} from "@chakra-ui/react";
import { TbHandFinger, TbHandTwoFingers } from "react-icons/tb";
import { AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";

interface IHowToPlay {
  closeFunction: () => void;
}

const cursorSize = "30px";

const HowToPlay = ({ closeFunction }: IHowToPlay) => {
  return (
    <Flex
      border="1px solid white"
      borderRadius="10px"
      bg="rgba(0,0,0, 0.7)"
      w="75vw"
      h="75vh"
      position="absolute"
      zIndex="3"
      flexDir="column"
      alignItems="center"
    >
      <Button
        boxSize="50px"
        bg="transparent"
        colorScheme="red"
        onClick={closeFunction}
        border="1px solid white"
        left="45%"
        top="1%"
      >
        <Icon as={AiOutlineClose} color="white" boxSize="40px" />
      </Button>

      <HStack h="100%" w="100%" justifyContent="space-around">
        <InstructionContainer>
          <CommonText>
            Aim using your index finger. Move your finger across the screen to
            move the cursor across the screen.
          </CommonText>

          <Center h="70%" flexDir="column" position="absolute">
            <motion.div
              style={{
                height: cursorSize,
                width: cursorSize,
                border: "2px solid",
                borderColor: "#FF5600",
                borderRadius: cursorSize,
              }}
              animate={{
                x: [-100, 100, -100],
                y: [50, -50, 50, -50, 50],
              }}
              transition={{
                ease: "linear",
                repeat: Infinity,
                loop: true,
                duration: 2,
              }}
            ></motion.div>

            <motion.div
              style={{ marginTop: "50px" }}
              animate={{
                x: [-100, 100, -100],
                y: [50, -50, 50, -50, 50],
              }}
              transition={{
                ease: "linear",
                repeat: Infinity,
                loop: true,
                duration: 2,
              }}
            >
              <Icon as={TbHandFinger} color="white" boxSize="100px" />
            </motion.div>
          </Center>
          <Center h="70%" flexDir="column" position="absolute">
            <motion.div
              style={{
                height: cursorSize,
                width: cursorSize,
                border: "2px solid",
                borderColor: "dodgerblue",
                borderRadius: cursorSize,
              }}
              animate={{
                x: [110, -80, 110, -70, 110],
                y: [30, -30, 30, -30, 30, -30, 30],
              }}
              transition={{
                ease: "linear",
                repeat: Infinity,
                loop: true,
                duration: 5,
              }}
            ></motion.div>

            <motion.div
              style={{ marginTop: "50px" }}
              animate={{
                x: [110, -80, 110, -70, 110],
                y: [30, -30, 30, -30, 30, -30, 30],
              }}
              transition={{
                ease: "linear",
                repeat: Infinity,
                loop: true,
                duration: 5,
              }}
            >
              <Icon
                as={TbHandFinger}
                color="white"
                boxSize="100px"
                transform="scaleX(-1)"
              />
            </motion.div>
          </Center>
        </InstructionContainer>
        <Divider orientation="vertical" color="white" h="80%" />
        <InstructionContainer>
          <CommonText>
            Lift your middle finger to fire. Line up your cursor with an enemy
            while firing to shoot them down and score a point.
          </CommonText>

          <HStack h="70%" w="60%" justifyContent="space-between" p="10px">
            <VStack h="100%">
              <Center h="100%" flexDir="column">
                <motion.div
                  style={{
                    height: cursorSize,
                    width: cursorSize,
                    border: "2px solid",
                    borderColor: "dodgerblue",
                    borderRadius: cursorSize,
                  }}
                  animate={{
                    scale: [1, 0.75, 0.75, 1],
                    backgroundColor: [
                      "hsla(210, 100%, 56%, 0)",
                      "hsla(210, 100%, 56%, 1)",
                      "hsla(210, 100%, 56%, 1)",
                      "hsla(210, 100%, 56%, 0)",
                    ],
                  }}
                  transition={{
                    ease: "linear",
                    repeat: Infinity,
                    loop: true,
                    duration: 3,
                  }}
                ></motion.div>

                <Center position="relative" mt="100px">
                  <motion.div
                    style={{ position: "absolute" }}
                    animate={{
                      opacity: [1, 0, 0, 1],
                    }}
                    transition={{
                      ease: "linear",
                      repeat: Infinity,
                      loop: true,
                      duration: 3,
                    }}
                  >
                    <Icon
                      as={TbHandFinger}
                      color="white"
                      boxSize="100px"
                      transform="scaleX(-1)"
                    />
                  </motion.div>

                  <motion.div
                    style={{ position: "absolute" }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      ease: "linear",
                      repeat: Infinity,
                      loop: true,
                      duration: 3,
                    }}
                  >
                    <Icon
                      as={TbHandTwoFingers}
                      color="white"
                      boxSize="100px"
                      transform="scaleX(-1)"
                    />
                  </motion.div>
                </Center>
              </Center>
            </VStack>

            <VStack h="100%">
              <Center h="100%" flexDir="column">
                <motion.div
                  style={{
                    height: cursorSize,
                    width: cursorSize,
                    border: "2px solid",
                    borderColor: "#FF5600",
                    borderRadius: cursorSize,
                  }}
                  animate={{
                    scale: [1, 0.75, 0.75, 1],
                    backgroundColor: [
                      "hsla(20, 100%, 50%, 0)",
                      "hsla(20, 100%, 50%, 1)",
                      "hsla(20, 100%, 50%, 1)",
                      "hsla(20, 100%, 50%, 0)",
                    ],
                  }}
                  transition={{
                    ease: "linear",
                    repeat: Infinity,
                    loop: true,
                    duration: 3,
                  }}
                ></motion.div>

                <Center position="relative" mt="100px">
                  <motion.div
                    style={{ position: "absolute" }}
                    animate={{
                      opacity: [1, 0, 0, 1],
                    }}
                    transition={{
                      ease: "linear",
                      repeat: Infinity,
                      loop: true,
                      duration: 3,
                    }}
                  >
                    <Icon as={TbHandFinger} color="white" boxSize="100px" />
                  </motion.div>

                  <motion.div
                    style={{ position: "absolute" }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      ease: "linear",
                      repeat: Infinity,
                      loop: true,
                      duration: 3,
                    }}
                  >
                    <Icon as={TbHandTwoFingers} color="white" boxSize="100px" />
                  </motion.div>
                </Center>
              </Center>
            </VStack>
          </HStack>
        </InstructionContainer>
      </HStack>
    </Flex>
  );
};

const CommonText = chakra(Text, {
  baseStyle: {
    color: "white",
    fontFamily: "Tektur",
    fontSize: "16px",
    textAlign: "center",
  },
});

const InstructionContainer = chakra(Flex, {
  baseStyle: {
    w: "40%",
    h: "90%",
    flexDir: "column",
    p: "10px",
    alignItems: "center",
  },
});

export default HowToPlay;
