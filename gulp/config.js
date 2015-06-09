// Gobal config file

var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @author <%= pkg.author.name %>',
  ' * @license <%= pkg.licenses[0].type %>',
  ' */',
  ''].join('\n');

module.exports = {
  paths: {
    js: 'js',
    assets: 'assets',
    dist: 'dist',
    tmp: '.tmp',
    test: 'test',
    sass: 'sass'
  },

  banner: banner,

  modules: ['core', '/dialog', 'input' , 'massage', 'select', 'textboxs',
      'tip', 'validate'],
  lang: 'zh-cn'
};
