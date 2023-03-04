module.exports = {
  launch: {
    dumpio: false,
    headless: process.env.HEADLESS !== "false",
    product: "chrome",
    // slowMo: 300,
  },
  browserContext: "default",
};
