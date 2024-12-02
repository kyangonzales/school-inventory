import { Injectable } from '@angular/core';
import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable';
import { ImageService } from './image.service'; // Import ImageService
import Swal from 'sweetalert2'; // If you're using SweetAlert for notifications

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor(private imageService: ImageService) {}

  async exportPdf(filteredItems: any[], reportType: string): Promise<void> {
    const doc = new jsPDF();
    let col: string[] = [];
    const rows: any[] = [];
    let reportTitle:string=''

    if (reportType === 'item') {
      col = ["#", "Barcode", "Name", "Brand", "Status", "Quantity", "Room"];
      filteredItems.forEach((item, index) => {
        const temp = [index + 1, item.barcode, item.name, item.brand.name, item.status, item.quantity, item.room.name];
        rows.push(temp);
      });
      reportTitle = 'Item List';
    } 
    else if (reportType === 'inventory') {
      col = ["#", "Item", "Brand", "Quantity", "Status", "Registrar", "Date"];
      filteredItems.forEach((log, index) => {
        const temp = [
          index + 1,               
          log.item,               
          log.brand,               
          log.quantity,            
          log.status,              
          log.registrar,            
          log.date,               
        ];
        rows.push(temp);
      });
      reportTitle = 'Inventory List';

    }
    else if (reportType === 'stocks') {
      col = ["#", "Name", "Good", "Missing", "Damage", "Total"];
      filteredItems.forEach((stock, index) => {
        const temp = [
          index + 1,          
          stock.name,  
          stock.good,
          stock.missing,        
          stock.damage,        
          stock.total,         
        ];
        rows.push(temp);
        reportTitle = 'Stock List';
      });
    }
     else if (reportType === 'room') {
      col = ["#", "Room", "Item Count"];
      filteredItems.forEach((item, index) => {
        // const roomName = item.name ? item.room.name : 'N/A'; 
        // const itemCount = item.items.length;  
        const temp = [index + 1, item.name];
        rows.push(temp);
      });
      reportTitle = 'Room List';
    } 
    else if (reportType === 'brand') {
      col = ["#", "Brand", "Item Count"];
      filteredItems.forEach((brand, index) => {
        // const brandName = item.brand ? item.brand : 'N/A';  
        // const itemCount = item.items.length; 
        const temp = [index + 1, brand.name];
        rows.push(temp);
      });    
        reportTitle = 'Brand List';

    }
    else if (reportType === 'roomInventory') {
      col = ["#", "Name", "Good", "Missing", "Damage", "Total"];
      filteredItems.forEach((stock, index) => {
        const temp = [
          index + 1,          
          stock.name,  
          stock.good,
          stock.missing,        
          stock.damage,        
          stock.total,         
        ];
        rows.push(temp);
        reportTitle = 'Stock List';
      });
    }
    try {
      const headerImg = await this.imageService.getBase64ImageFromURL('assets/header.jpg');
      const pageWidth = doc.internal.pageSize.getWidth(); // Full width of the PDF page
      const headerHeight = 40; // Adjust the height as needed
      doc.addImage(headerImg, 'JPEG', 0, 0, pageWidth, headerHeight);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, 45);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(reportTitle, pageWidth / 2, 50, { align: 'center' });

      autoTable(doc, {
        startY: 55,
        head: [col],
        body: rows,
      });

      doc.save(`${reportType}-report.pdf`);

      Swal.fire({
        title: 'PDF Generated',
        text: `The ${reportType} report has been successfully generated and saved.`,
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      Swal.fire({
        title: 'Error',
        text: 'There was an error generating the PDF. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }
  
}
