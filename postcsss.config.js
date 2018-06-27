module.exports = {
  plugins: [
    require('postcss-line-height-px-to-unitless')(),
    require('postcss-preset-env')({
      browsers: ['> 1%', 'last 2 versions', 'not ie <= 10'],
    }),
  ],
}
