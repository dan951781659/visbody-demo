module.exports = ({ config }) => ({
  ...config,
  ...(process.env.MOTIONSTATION_WEB_BASE_URL
    ? { experiments: { ...config.experiments, baseUrl: process.env.MOTIONSTATION_WEB_BASE_URL } }
    : {}),
});
