export interface ReviewDatabaseRow {
  id: string;
  created_time: string;
  properties: Array<{
    name: string;
    type: string;
    value: string | string[]; // value can be a single string or an array of strings for multi-select
  }>;
}
