module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
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
          },
        },
      ],
    ],
  };
};
