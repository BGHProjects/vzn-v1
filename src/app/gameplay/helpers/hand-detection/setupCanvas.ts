const setupCanvas = async (video: any) => {
  const canvas = document.getElementById("canvas") as any;
  const ctx = canvas.getContext("2d");

  canvas.width = video.width;
  canvas.height = video.height;

  return ctx;
};

export default setupCanvas;
