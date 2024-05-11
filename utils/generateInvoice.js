export const generateInvoiceNumber = () => {
    let number=Math.round(Math.random()*10000000)
    let year = new Date().getFullYear()
    if (new Date().getMonth() >= 3) {
      return `BRUN/${number}/${year}-${year + 1}`;
    } else {
      return `BRUN/${number}/${year - 1}-${year}`;
    }
  }
  