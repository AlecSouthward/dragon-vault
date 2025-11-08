export const convertToHstore = (obj: object) =>
  Object.entries(obj)
    .map(([k, v]) => {
      const value = v === null ? 'NULL' : '"' + String(v) + '"';
      return `"${k}"=>${value}`;
    })
    .join(', ');

export const convertFromHstore = (obj: string) => {
  if (!obj) return {};

  const [k, v] = obj.replaceAll('"', '').split('=>');

  return { [k.trim()]: Number(v.trim()) };
};
