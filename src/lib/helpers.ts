export const renderCell = (info: any) => {
  const value = info.getValue();
  return value ?? "Não informado.";
};
