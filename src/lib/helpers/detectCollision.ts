/**
 * Helper function to determine collision
 * between two objects
 *
 * @param x1 x coord of the first object
 * @param y1 y coord of the first object
 * @param x2 x coord of the second object
 * @param y2 y coord of the second object
 * @param firing Whether or not the player is firing
 * @param collisionThreshold The distance threshold of whether both objects are considered colliding
 * @returns Whether or not the two objects are colliding
 */
const detectionCollision = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  firing: boolean,
  collisionThreshold: number
) => {
  const yDiff = Math.abs(y2 - y1);
  const xDiff = Math.abs(x2 - (100 - x1));

  const yHit = yDiff < collisionThreshold;
  const xHit = xDiff < collisionThreshold;

  return yHit && xHit && firing;
};

export default detectionCollision;
