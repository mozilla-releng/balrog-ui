export default (...arrays) => {
  const args = [].slice.call(arrays);
  const longest = args.reduce((a, b) => (a.length > b.length ? a : b), []);

  return longest.map((_, i) => args.map(array => array[i]));
};
