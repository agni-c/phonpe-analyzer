import pdfToText from 'react-pdftotext';

interface Transaction {
  Date: string;
  Type: string;
  Amount: string;
  Description: string;
  TransactionID?: string;
  UTR?: string;
  PaymentMethod?: string;
}

export class PDFParser {
  static async parsePDF(file: File): Promise<Transaction[]> {
    if (typeof window === 'undefined') {
      throw new Error('PDF parsing can only be done in the browser')
    }

    console.log('Starting PDF parsing...');

    try {
      console.log('Attempting to extract text from PDF...');
      const text = await pdfToText(file);
      
      if (!text || typeof text !== 'string') {
        throw new Error('Failed to extract text from PDF. The document might be empty or corrupted.');
      }

      console.log('Text extracted successfully. Starting transaction parsing...');
      const transactions = this.parsePhonePeStatement(text);
      
      if (transactions.length === 0) {
        throw new Error('No transactions found in the PDF. Please check if it\'s a valid PhonePe statement.');
      }

      console.log(`Parsing complete. ${transactions.length} transactions found.`);
      return transactions;
    } catch (error) {
      console.error('Error in PDF parsing:', error);
      throw new Error(`PDF parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static parsePhonePeStatement(text: string): Transaction[] {
    try {
      // Split by "Date   Transaction Details   Type   Amount" as it appears before each transaction block
      const sections = text.split(/Date\s+Transaction Details\s+Type\s+Amount/);
      const transactions: Transaction[] = [];

      // Process each section after the header
      sections.forEach(section => {
        // Use regex to find transaction patterns
        const transactionPattern = /(\w{3} \d{2}, \d{4} \d{2}:\d{2} (?:am|pm))\s+(\w+)\s+₹\s*([\d,]+(?:\.\d{2})?)\s+(.+?)(?=Transaction ID|$)/gi;
        const matches = section.matchAll(transactionPattern);

        for (const match of matches) {
          const [_, dateTime, type, amount, description] = match;
          
          // Create transaction object
          const transaction: Transaction = {
            Date: dateTime.trim(),
            Type: type.trim(),
            Amount: amount.replace(/,/g, '').trim(),
            Description: description.trim(),
          };

          // Extract Transaction ID if present
          const txnIdMatch = section.match(/Transaction ID\s+([^\n]+)/);
          if (txnIdMatch) {
            transaction.TransactionID = txnIdMatch[1].trim();
          }

          // Extract UTR if present
          const utrMatch = section.match(/UTR No\.\s+([^\n]+)/);
          if (utrMatch) {
            transaction.UTR = utrMatch[1].trim();
          }

          // Extract Payment Method if present
          const paymentMethodMatch = section.match(/Paid by\s+([^\n]+)/);
          if (paymentMethodMatch) {
            transaction.PaymentMethod = paymentMethodMatch[1].trim();
          }

          transactions.push(transaction);
        }
      });

      // Filter out any invalid transactions
      return transactions.filter(t => t.Date && t.Amount && t.Type);
    } catch (error) {
      console.error('Error parsing statement:', error);
      throw new Error('Failed to parse the statement format. Please ensure this is a valid PhonePe statement.');
    }
  }
}

