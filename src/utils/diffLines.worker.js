import { diffLines } from 'diff';
import { NEW_LINES_REGEX } from './constants';

onmessage = e => {
  const [firstString, secondString] = e.data;
  const diffed = diffLines(firstString, secondString);
  const items = diffed.map(part => ({
    ...part,
    value: undefined,
    lines: part.value
      .split(NEW_LINES_REGEX)
      .slice(0, part.count)
      .map(line => line),
  }));

  postMessage(JSON.stringify(items));
};
