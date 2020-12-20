export const buildFieldLabels = <T = any>(label: string, fields: T[]): T[] => {
  return fields.reduce((acc, field) => [...acc, `${label}.${field}`], []);
};
