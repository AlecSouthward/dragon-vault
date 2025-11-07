export const convertToHstore = (obj: object) =>
  Object.entries(obj)
    .map(([k, v]) => {
      const value = v === null ? 'NULL' : '"' + String(v) + '"';
      return `"${k}"=>${value}`;
    })
    .join(', ');
