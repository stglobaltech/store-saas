import Fuse from 'fuse.js';

// const options: Fuse.FuseOptions<any> = {
//   keys: ['author', 'tags'],
// };

export default function search(
  dataToSearch: any,
  basedOnOptionsKey: string[],
  searchByValue: string = ''
) {
  if (searchByValue.trim()) {
    let fuse = new Fuse(dataToSearch, {
      keys: basedOnOptionsKey,
      // isCaseSensitive: false,
      // includeScore: false,
      // shouldSort: true,
      // includeMatches: false,
      // findAllMatches: false,
      minMatchCharLength: 2,
      // location: 0,
      threshold: 0.3,
      // distance: 100,
      // useExtendedSearch: false,
      // ignoreLocation: false,
      // ignoreFieldNorm: false,
    });
    let result = fuse.search(searchByValue).map((r) => r.item);

    return result;
  }

  return dataToSearch;
}
