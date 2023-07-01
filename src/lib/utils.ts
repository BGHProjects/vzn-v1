const FINGER_LOOKUP_INDICES: Record<string, number[]> = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

const drawHands = (hands: any, ctx: any) => {
  let rightIndexTipX = 0;
  let rightIndexTipY = 0;
  let leftIndexTipX = 0;
  let leftIndexTipY = 0;

  if (hands.length <= 0) {
    return;
  }

  hands.sort((hand1: any, hand2: any) => {
    if (hand1.handedness < hand2.handedness) return 1;
    if (hand1.handedness > hand2.handedness) return -1;
    return 0;
  });

  for (let i = 0; i < hands.length; i++) {
    ctx.fillStyle = hands[i].handedness === "Left" ? "black" : "Blue";
    ctx.strokeStyle = "White";
    ctx.lineWidth = 2;

    for (let y = 0; y < hands[i].keypoints.length; y++) {
      const keypoint = hands[i].keypoints[y];

      const isRightIndexTip =
        keypoint.name === "index_finger_tip" && hands[i].handedness === "Right";
      const isLeftIndexTip =
        keypoint.name === "index_finger_tip" && hands[i].handedness === "Left";
      const isRightMiddleTip =
        keypoint.name === "middle_finger_tip" &&
        hands[i].handedness === "Right";
      const isLeftMiddleTip =
        keypoint.name === "middle_finger_tip" && hands[i].handedness === "Left";

      if (isRightIndexTip) {
        rightIndexTipX = keypoint.x;
        rightIndexTipY = keypoint.y;
      }

      if (isLeftIndexTip) {
        leftIndexTipX = keypoint.x;
        leftIndexTipY = keypoint.y;
      }

      ctx.fillStyle = isRightIndexTip
        ? "dodgerblue"
        : isRightMiddleTip
        ? "lime"
        : isLeftIndexTip
        ? "red"
        : isLeftMiddleTip
        ? "gold"
        : "black";

      ctx.beginPath();
      ctx.arc(
        keypoint.x,
        keypoint.y,
        isRightIndexTip || isRightMiddleTip || isLeftIndexTip || isLeftMiddleTip
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

  return { rightIndexTipX, rightIndexTipY, leftIndexTipX, leftIndexTipY };
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
