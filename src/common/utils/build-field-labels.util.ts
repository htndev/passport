export const buildFieldLabels = <T extends any[]>(label: string, fields: T): T =>
  fields.reduce((acc, field) => [...acc, `${label}.${field}`], []);
