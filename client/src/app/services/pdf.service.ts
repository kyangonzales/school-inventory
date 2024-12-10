import { Injectable } from '@angular/core';
import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable';
import { ImageService } from './image.service';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor(private imageService: ImageService) {}

  async exportPdf(filteredItems: any[], reportType: string): Promise<void> {
    const doc = new jsPDF()
    let col: string[] = []
    const rows: any[] = []
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
        const itemCount = item.items.length;  
        const temp = [index + 1, item.name, itemCount];
        rows.push(temp);
      });
      reportTitle = 'Room List';
    } 
    else if (reportType === 'brand') {
      col = ["#", "Brand"];
      filteredItems.forEach((brand, index) => {
        // const brandName = item.brand ? item.brand : 'N/A';  
        // const itemCount = item.items.length; 
        const temp = [index + 1, brand.name];
        rows.push(temp);
      });    
        reportTitle = 'Brand List';
    }
    else if (reportType === 'roomInventory') {
      col = ["#", "Name", "Brand", "Good", "Missing", "Damage", "Total"];
      filteredItems.forEach((stock, index) => {
        const temp = [
          index + 1,          
          stock.name,  
          stock.brand.name,  
          stock.Good,
          stock.Missing,        
          stock.Damage,        
          stock.Good + stock.Damage + stock.Missing      
        ];
        rows.push(temp);
        reportTitle = 'Stock List';
      });
    }
    try {
      const headerImg = await this.imageService.getBase64ImageFromURL('assets/header.jpg');
      const pageWidth = doc.internal.pageSize.getWidth(); 
      const headerHeight = 35; 
      doc.addImage(headerImg, 'JPEG', 0, 0, pageWidth, headerHeight);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const generatedText = `Generated on: ${new Date().toLocaleDateString()}`;
      const generatedTextWidth = doc.getTextWidth(generatedText);
      const generatedX = (pageWidth - generatedTextWidth) / 2;
      doc.text(generatedText, generatedX, 31);
    
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(reportTitle, pageWidth / 2, 40, { align: 'center' });

      autoTable(doc, {
        startY: 45,
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
