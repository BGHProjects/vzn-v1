const FINGER_LOOKUP_INDICES: Record<string, number[]> = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

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

    const mfd = "middle_finger_dip";
    const mft = "middle_finger_tip";
    const ift = "index_finger_tip";

    ctx.fillStyle = leftHand ? "black" : "Blue";
    ctx.strokeStyle = "White";
    ctx.lineWidth = 2;

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
        ? "red"
        : isRightIndexTip
        ? "purple"
        : isLeftMiddleTip || isRightMiddleTip
        ? "gold"
        : "black";

      ctx.beginPath();
      ctx.arc(
        keypoint.x,
        keypoint.y,
        isLeftIndexTip || isLeftMiddleTip || isRightIndexTip || isRightMiddleTip
          ? 10
          : 4,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }

    const fingers = Object.keys(FINGER_LOOKUP_INDICES);
    for (let z = 0; z < fingers.length; z++) {
      const finger = fingers[z];
      const points = FINGER_LOOKUP_INDICES[finger].map(
        (idx: number) => hands[i].keypoints[idx]
      );
      drawPath(points, ctx);
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

const drawPath = (points: any, ctx: any, closePath = false) => {
  const region = new Path2D();
  region.moveTo(points[0]?.x, points[0]?.y);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point?.x, point?.y);
  }

  if (closePath) {
    region.closePath();
  }

  ctx.stroke(region);
};

export { drawHands, drawPath };
