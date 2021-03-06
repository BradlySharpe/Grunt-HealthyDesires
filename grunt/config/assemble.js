module.exports = {
  options: {
    collections: [
      {
        name: 'post',
        sortby: 'posted',
        sortorder: 'descending'
      },
      {
        name: 'shop',
        sortby: 'title',
        sortorder: 'ascending'
      },
      {
        name: 'catering',
        sortby: 'title',
        sortorder: 'ascending'
      }
    ],
    helpers: '<%= config.src %>bonnet/helpers/**/*.js',
    layout: 'page.hbs',
    layoutdir: '<%= config.src %>bonnet/layouts/',
    partials: '<%= config.src %>bonnet/partials/**/*.hbs',
    config: '<%= config %>',
    pkg: '<%= pkg %>',
    plugins: ['grunt-assemble-permalinks'],
    permalinks: {
      structure: ':basename/index:ext'
    }
  },
  posts: {
    files: [
      {
        cwd: '<%= config.src %>content/',
        dest: '<%= config.dest %>',
        expand: true,
        src: ['**/*.hbs', '**/*.md', '!_pages/**/*.hbs', '!includes/**/*']
      },
      {
        cwd: '<%= config.src %>content/_pages/',
        dest: '<%= config.dest %>',
        expand: true,
        src: ['**/*.hbs']
      }
    ]
  }
};
