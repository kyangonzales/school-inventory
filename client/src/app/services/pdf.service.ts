import { ComponentFactoryResolver, Injectable } from '@angular/core';
import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable';
import { ImageService } from './image.service';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class PdfService {
  custodian:string=''
  constructor(private imageService: ImageService, public authService: AuthService,) {}
  
  getCustodian(){
    const info = this.authService.info();
    return info?.fullName;
  }
    
  formattedDate(dateString: string | number | Date): string {
    const date = new Date(dateString); 
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }
  
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    };
  
    return date.toLocaleString('en-US', options).replace(',', '');
  }
  getFormattedDateTime(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      month: '2-digit', // Numeric month
      day: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true // AM/PM format
    };
  
    const datePart = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const timePart = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  
    return `${datePart} at ${timePart}`;
  }
  


   formattedDateText(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  }
  
  
  
  async exportPdf(filteredItems: any[], reportType: string, withBrand:boolean=false): Promise<void> {
    const doc = new jsPDF()
    let col: string[] = []
    const rows: any[] = []
    let reportTitle:string=''
  
    var baseDate={endDate:"",startDate:""}


    if (reportType === 'item') {
      

      col = [ "Barcode", "Name", "Status", "Quantity", "Room", "Date"];
      filteredItems.forEach((item, index) => {
        const nameAndBrand = `${' '}\n${item.brand.name}`; 
        const temp = [ item.barcode, nameAndBrand, item.status, item.quantity, item.room.name, this.formattedDate(item.createdAt) ];
        rows.push(temp);
      });
      reportTitle = 'Item List';
    } 
    if (reportType === 'report') {
    
      col = [ "Barcode", "Name", "Status", "Quantity", "Room", "Custodian"];
      filteredItems.forEach((item, index) => {
        const nameAndBrand = `${' '}\n${item.brand.name}`; 
        const temp = [ item.barcode, nameAndBrand, item.status, item.quantity, item.room.name, item?.registrar?.fullName||'--'];
        rows.push(temp);
      });


      const fakeStorage=localStorage.getItem("date")
     if(fakeStorage){
         baseDate=JSON.parse(fakeStorage)
     }

    //  if(baseDate.startDate && baseDate.endDate){
    //      reportTitle = `Report of ${filteredItems[0]?.status||""} Items ${baseDate.startDate} - ${baseDate.endDate}  `;

    //  }else{
      reportTitle = `Report of ${filteredItems[0]?.status||""} Items `;

    //  }
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
      col = ["#", "Name", "Good", "Missing", "Damaged", "Total"];
      filteredItems.forEach((stock, index) => {
        const temp = [
          index + 1,          
          stock.name,  
          stock.Good,
          stock.Missing,        
          stock.Damage,        
          stock.Good + stock.Damage + stock.Missing             
        ];
        rows.push(temp);
        console.log(stock)

        reportTitle = 'Stock List';
      });
    }
     else if (reportType === 'room') {
      col = ["#", "Room", "Good", "Missing", "Damaged", "No. of Item"];
      filteredItems.forEach((item, index) => {
        // const roomName = item.name ? item.room.name : 'N/A'; 
        const itemCount = item.items.length;  
        const temp = [index + 1, item.name, item.Good, item.Missing, item.Damage, itemCount];
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

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(reportTitle, pageWidth / 2, 40, { align: 'center' });

      if(baseDate.startDate && baseDate.endDate){
          doc.setFont('helvetica', 'normal');
         doc.setFontSize(12);
        
        const _date = `From ${this. formattedDateText(baseDate.startDate)} To ${ this.formattedDateText(baseDate.endDate)}`;
        const pageWidth = doc.internal.pageSize.width; // Get the width of the page
        const _dateWidth = doc.getTextWidth(_date); // Get the text width
        const centerX = (pageWidth - _dateWidth) / 2; // Calculate center position
        
        doc.text(_date, centerX, 45); // Use centerX for x-coordinate

      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const generatedText = this.getFormattedDateTime();;
      const generatedTextWidth = doc.getTextWidth(generatedText);

      doc.text(generatedText, 155, 50);
    

      const generatedBy = `Generated By: ${this.getCustodian()}`;
      const generatedByWidth = doc.getTextWidth(generatedBy);
      doc.text(generatedBy, 5, 50);

      autoTable(doc, {
        startY: 55,
        head: [col],
        body: rows,
        margin: { left: 5, top: 10, right: 0}, 
        tableWidth: pageWidth - 10, 
        didDrawCell: (data) => {
          
          const rowIndex= data.row.index;
          if (data.column.index === 1&&data.row.section=="body"&&withBrand)  {

            const nameAndBrand = (data.row.raw as string[])[1]; 
            console.log(nameAndBrand)
            const name = filteredItems[rowIndex].name
            // const [name] = nameAndBrand.split('\n');
      
            // Get x, y positions for text
            const x = data.cell.x + 1.6; // Adjust as needed
            const y = data.cell.y + 4.8; // Adjust as needed
      
            // Set font, add bold text
            doc.setFont('Helvetica', 'bold');
            doc.text(name, x, y);
            doc.setFont('Helvetica', 'normal'); // Reset font
          }
        },
        
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




