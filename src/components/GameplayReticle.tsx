import { Box } from "@chakra-ui/react";

interface IGameplayReticle {
  top: number;
  right: number;
  colour: string;
}

const GameplayReticle = ({ top, right, colour }: IGameplayReticle) => {
  return (
    <Box
      borderRadius="full"
      bg={colour}
      boxSize="30px"
      top={`${top}%`}
      right={`${right}%`}
      position="absolute"
    />
  );
};

export default GameplayReticle;
