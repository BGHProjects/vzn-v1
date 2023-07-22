const mfd = "middle_finger_dip";
const mft = "middle_finger_tip";
const ift = "index_finger_tip";

const drawHands = (hands: any, ctx: any) => {
  let leftIndexTipX = 0;
  let leftIndexTipY = 0;
  let rightIndexTipX = 0;
  let rightIndexTipY = 0;

  let firingLeft = false;
  let firingRight = false;

  hands.sort((hand1: any, hand2: any) => {
    if (hand1.handedness < hand2.handedness) return 1;
    if (hand1.handedness > hand2.handedness) return -1;
    return 0;
  });

  for (let i = 0; i < hands.length; i++) {
    const rightHand = hands[i].handedness === "Right";
    const leftHand = hands[i].handedness === "Left";

    for (let y = 0; y < hands[i].keypoints.length; y++) {
      const keypoint = hands[i].keypoints[y];

      if (keypoint.name === mfd && leftHand) {
        const mdfy = keypoint.y;
        const mftKeypoint = hands[i].keypoints.find(
          (kp: any) => kp.name === mft
        );

        // Flipped because the y values increase from the top
        if (mftKeypoint && mdfy > mftKeypoint.y) {
          firingLeft = true;
        }
      }

      /**
       * Separate Left from Right, so each can be fired independently
       */
      if (keypoint.name === mfd && rightHand) {
        const mdfy = keypoint.y;
        const mftKeypoint = hands[i].keypoints.find(
          (kp: any) => kp.name === mft
        );

        // Flipped because the y values increase from the top
        if (mftKeypoint && mdfy > mftKeypoint.y) {
          firingRight = true;
        }
      }

      const isLeftIndexTip = keypoint.name === ift && leftHand;
      const isLeftMiddleTip = keypoint.name === mft && leftHand;

      const isRightIndexTip = keypoint.name === ift && rightHand;
      const isRightMiddleTip = keypoint.name === mft && rightHand;

      if (isLeftIndexTip) {
        leftIndexTipX = keypoint.x;
        leftIndexTipY = keypoint.y;
      }

      if (isRightIndexTip) {
        rightIndexTipX = keypoint.x;
        rightIndexTipY = keypoint.y;
      }

      ctx.fillStyle = isLeftIndexTip
        ? "#FF5600"
        : isRightIndexTip
        ? "dodgerblue"
        : isLeftMiddleTip || isRightMiddleTip
        ? "gold"
        : "black";

      if (
        isLeftIndexTip ||
        isRightIndexTip ||
        isLeftMiddleTip ||
        isRightMiddleTip
      ) {
        ctx.beginPath();
        ctx.arc(
          keypoint.x,
          keypoint.y,
          isLeftIndexTip ||
            isLeftMiddleTip ||
            isRightIndexTip ||
            isRightMiddleTip
            ? 10
            : 4,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }
    }
  }

  return {
    leftIndexTipX,
    leftIndexTipY,
    rightIndexTipX,
    rightIndexTipY,
    firingLeft,
    firingRight,
  };
};

export { drawHands };
