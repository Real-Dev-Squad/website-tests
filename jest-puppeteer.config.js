module.exports = {
  launch: {
    dumpio: false,
    headless: process.env.HEADLESS !== "false",
    product: "chrome",
    // slowMo: 300,
    defaultViewport: {
      width: 1920,
      height: 1080
    }
  },
  browserContext: "default",
};
