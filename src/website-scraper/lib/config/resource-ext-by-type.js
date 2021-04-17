import { html, css, js } from './resource-types';
const defaultExtensions = {};

// should contain same data as ./resource-type-by-ext
defaultExtensions[html] = [ '.html', '.htm' ];
defaultExtensions[css] = [ '.css' ];
defaultExtensions[js] = [ '.js' ];

export default defaultExtensions;
