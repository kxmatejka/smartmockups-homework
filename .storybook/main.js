module.exports = {
  webpackFinal: (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve('babel-loader'),
      options: {
        presets: [['react-app', { flow: false, typescript: true }]],
      }
    })
    config.resolve.extensions.push('.ts', '.tsx')

    return config
  },
  stories: [
    '../src/components/**/*.tsx'
  ],
  addons: [
    {
      name: '@storybook/addon-essentials',
    },
  ],
}
