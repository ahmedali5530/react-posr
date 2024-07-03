export const DB_REST_API = import.meta.env.VITE_DB_WEBDOCKET;
export const DB_REST_USER = 'root';
export const DB_REST_PASS = 'root';
export const DB_REST_DB = 'posr'; // database name
export const DB_REST_NS = 'posr'; // namespace

export const withApi = (path: string) => {
  return DB_REST_API + path;
}
