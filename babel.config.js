module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'inline-dotenv',
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@components': './src/components',
            '@pages': './src/pages',
            '@assets': './src/assets',
            '@dtos/*': ['src/dtos/*'],
            '@storage': './src/storage',
            '@utils': './src/utils',
            '@redux': './src/redux',
            '@services': './src/services',
          },
        },
      ],
    ],
  };
};
