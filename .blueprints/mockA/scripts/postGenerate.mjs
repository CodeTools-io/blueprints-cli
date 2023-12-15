export default async function(data, libraries) {
  // fs docs: https://github.com/jprichardson/node-fs-extra
  // _ docs: https://lodash.com/docs
  // date docs: https://date-fns.org

  const {_, fs, date, File, log} = libraries;

  // ...code to execute

  // must return Promise
  const result = await Promise.resolve(true);
  return result;
}