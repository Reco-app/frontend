/**
 * Formata uma string de data para o padrão dd/mm/aaaa, hh:mm.
 */
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formata um número para o padrão de moeda BRL (R$).
 */
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata uma string de documento para CPF ou CNPJ.
 */
export const formatDocument = (document: string) => {
  if (document.length === 11) {
    // CPF
    return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  if (document.length === 14) {
    // CNPJ
    return document.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return document; // Retorna o original se não for um tamanho válido
};
