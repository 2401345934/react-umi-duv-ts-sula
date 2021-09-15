import pathToRegexp from 'path-to-regexp';
import memoizeOne from 'memoize-one';
import { isEqual } from "lodash"
import { formatMessage } from 'umi';

const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;

function compilePath (path, options) {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {});

  if (pathCache[path]) return pathCache[path];

  const keys = [];
  const regexp = pathToRegexp(path, keys, options);
  const result = { regexp, keys };

  if (cacheCount < cacheLimit) {
    pathCache[path] = result;
    // eslint-disable-next-line no-plusplus
    cacheCount++;
  }

  return result;
}




export const formatter = (data, parentAuthority, parentName) => {
  return data
    .map((item) => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }
      const result = {
        ...item,
        name: formatMessage({ id: locale, defaultMessage: item.name }),
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter((item) => item);
};


/**
 * Public API for matching a URL pathname to a path.
 */
export function matchPath (pathname, options = {}) {
  if (typeof options === 'string' || Array.isArray(options)) {
    // eslint-disable-next-line no-param-reassign
    options = { path: options };
  }

  const { path, exact = false, strict = false, sensitive = false } = options;

  const paths = [].concat(path);

  // eslint-disable-next-line no-shadow
  return paths.reduce((matched, path) => {
    if (!path && path !== '') return null;
    if (matched) return matched;

    const { regexp, keys } = compilePath(path, {
      end: exact,
      strict,
      sensitive,
    });
    const match = regexp.exec(pathname);

    if (!match) return null;

    const [url, ...values] = match;
    const isExact = pathname === url;

    if (exact && !isExact) return null;

    return {
      path, // the path used to match
      url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
      isExact, // whether or not we matched exactly
      params: keys.reduce((memo, key, index) => {
        // eslint-disable-next-line no-param-reassign
        memo[key.name] = values[index];
        return memo;
      }, {}),
    };
  }, null);
}




export const memoizeOneFormatter = memoizeOne(formatter, isEqual);

export const getBreadcrumbNameMap = (menuData) => {
  const routerMap = {};

  const flattenMenuData = (data) => {
    data.forEach((menuItem) => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

export const ergodicMenuRoutes = (routes) => {
  const codeArray = [];

  function ergodicRoutes (routesParam) {
    routesParam.forEach((element) => {
      // 目前没有控制权限 先去除 code
      // if (element.code && element.hideInMenu) {
      if (element.hideInMenu) {
        codeArray.push(element);
      }
      if (element.routes) {
        ergodicRoutes(element.routes);
      }
    });
  }
  ergodicRoutes(routes);

  return codeArray;
};

