export const roots = {
  drive: { name: "Drive", icon: "cloud" },
  shared: { name: "Shared", icon: "group" },
  bin: { name: "Bin", icon: "delete" },
};

export type RootKey = keyof typeof roots;

export const defaultRoot: RootKey = "drive";

const defaultActiveTab: Tab = { path: defaultRoot, id: crypto.randomUUID() };

export default (): Settings => ({
  theme: "light",
  columns: {
    order: ["name", "size", "type", "dateAdded", "dateModified"],
    orderBy: "name",
    orderDesc: false,
  },
  searchColumns: {
    order: ["name", "size", "type", "dateAdded", "dateModified"],
    orderBy: "name",
    orderDesc: false,
  },
  view: "list",
  // Todo: currently, both main and search use 'view' property.
  // Maybe it's better to put ViewSelector.vue to SearchOptions.vue?
  searchView: "list",
  tabs: [defaultActiveTab],
  activeTabId: defaultActiveTab.id,
});

export const columnNames: Partial<Record<keyof ItemCore, string>> = {
  name: "Name",
  size: "Size",
  type: "Type",
  dateAdded: "Date added",
  dateModified: "Date modified",
};
