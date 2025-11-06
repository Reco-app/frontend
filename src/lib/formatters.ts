export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatCurrency = (value: number | string) => {
  const formattedValue = Number(value);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(formattedValue);
};

export const formatPercentage = (value: number | string) => {
  const formattedValue = Number(value);
  return `${formattedValue}%`;
};

export const formatDocument = (document: string) => {
  const digits = document.replace(/\D/g, "");

  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  if (digits.length === 14) {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }
  return digits;
};

export const capitalize = (originalString: string) => {
  return originalString.charAt(0).toUpperCase() + originalString.toLowerCase().slice(1);
};

export function formatPhone(phone: string | null | undefined): string | null {
  if (!phone) {
    return null;
  }

  let digits = phone.replace(/\D/g, "");

  if (digits.startsWith("55")) {
    digits = digits.substring(2);
  }

  let ddd: string;
  let number: string;

  if (digits.length === 11) {
    ddd = digits.substring(0, 2);
    number = digits.substring(2);
  } else if (digits.length === 10) {
    ddd = digits.substring(0, 2);
    number = digits.substring(2);
  } else if (digits.length === 9) {
    ddd = "83";
    number = digits;
  } else if (digits.length === 8) {
    ddd = "83";
    number = digits;
  } else {
    return phone;
  }

  if (number.length === 9) {
    return `(${ddd}) ${number.substring(0, 5)}-${number.substring(5)}`;
  } else if (number.length === 8) {
    return `(${ddd}) ${number.substring(0, 4)}-${number.substring(4)}`;
  }

  return phone;
}
