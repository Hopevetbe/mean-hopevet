import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ElementRef, Injectable, ViewChild } from "@angular/core";
import { AuthServiceService } from "src/app/onboarding/services/auth-service.service";
import { environment } from "src/environment/environment";
import { MedicalRecordModel, PatientModel } from "../models/patient.model";
import { ProductBrand, SupplierModel } from "../models/product-brand.model";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// import * as html2pdf from 'html2pdf.js';
declare module 'html2pdf.js';
import * as html2pdf from 'html2pdf.js';
import jspdf from 'jspdf';

@Injectable({ providedIn: 'root'})
export class PDFGenerationService{
 // @ViewChild('container', { static: true }) containerRef: ElementRef | undefined;
    constructor(private readonly httpClient:HttpClient, private readonly authService:AuthServiceService){}
//     printPrescrption(responseData:any){
//       const htmlContent = `
  
//       <div id="letter-pad">
  
//           <div class="header">
//               <h2>{clinic[0].legalName}</h2>
//                           <p>Phone: {clinic[0].mobileNumber} | Email:{clinic[0].email} </p>
//           </div>
//           <hr>
  
//           <div class="doctor-info">
//               <p><strong>Dr {doctor.userName}</strong></p>
//               <p> Vet medicine </p>
//           </div>
//            <hr>
//            <div class="patient-details">
//           <div class="patient-info">
//               <p>Pet Name :<strong>${responseData.selectedPet.petName} </strong></p>
//               <p>Pet Age  :<strong>${responseData.selectedPet.petAge}</strong></p>
//           </div>
//           <div class="patient-info">
//               <p>Date  :<strong>${responseData.visitedDate}</strong> </p>
//                <p>Weight:<strong> ${responseData.selectedPet.petWeight}</strong></p>
//           </div>
//           <div class="patient-info">
//               <p>Vaccinated  :<strong>${responseData.vaccinationDetails.vaccinated ? 'YES':'NO'}</strong> </p>
//                <p>Next Vaccination:<strong> ${responseData.vaccinationDetails.nextVaccination}</strong></p>
//           </div>
          
//           </div>
//           <hr>
//           <div class="diagnosis">
//               <h4>Diagnosis</h4>
//               <p>${responseData.medicalRecords.remarks}</p>
//             </div>
//           <div class="letter-body">
//             <table>
//             <thead>
//             <tr>
//             <th>Medicine Name</th>
//             <th>Dosage</th>
//             <th colspan="4">Duration</th>
//             </tr>
//             <tr>
//                 <th></th>
//                 <th></th>
//                 <th>Morning</th>
//                 <th>Afternoon</th>
//                 <th>Evening</th>
//                 <th>Night</th>
//             </tr>

//         </thead>
//         <tbody>
//         ${responseData.medicalRecords.medicine.map((item:any) => `<tr>
//         <td>${item.medicine}</td>
//         <td>${item.dosage}</td>
//         <td>${item.duration.morning}</td>
//         <td>${item.duration.afternoon}</td>
//         <td>${item.duration.evening}</td>
//         <td>${item.duration.night}</td>
//     </tr>`).join('')}
        
//         </tbody>
//     </table>
//           </div>
  
//           <div class="signature">
//               <p>Sincerely,</p>
              
//               <p>Dr. {doctor.userName}<br>Internal Medicine Specialist</p>
//           </div>
  
//       </div>
  
//       <footer>
//           &copy; 2024 {clinic[0].tradeName}. All rights reserved.
//       </footer>
//   `;
//     // Dynamically create an HTML element
// const newElement = document.createElement('div');

// // Set attributes or properties of the new element
// newElement.textContent = htmlContent;

// // Append the new element to an existing element in the DOM
// this.containerRef?.nativeElement.appendChild(newElement);
//  // Create a jsPDF instance
//  const doc = new jsPDF();
// // Select the element with ID 'letter-pad'
// const letterPadElement = newElement;

// if (letterPadElement) {
//   // Convert HTML content to canvas using html2canvas
//   html2canvas(letterPadElement).then(canvas => {
//     // Add canvas image to PDF
//     const imageData = canvas.toDataURL('image/png');
//     doc.addImage(imageData, 'PNG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);
    
//     // Save PDF
//     doc.save('generated.pdf');
//   });
// } else {
//   console.error("Element with ID 'letter-pad' not found.");
// }
//     }
    generatePDF(componentHtml: string, fileName: string) {
      // Create a jsPDF instance
      const doc = new jsPDF();
      const newHtml = document.createElement('div');
      newHtml.innerHTML = componentHtml;
      // Convert HTML content to canvas using html2canvas
      html2canvas(newHtml).then(canvas => {
        // Add canvas image to PDF
        const imageData = canvas.toDataURL('image/png');
        doc.addImage(imageData, 'PNG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);
        
        // Save PDF
        doc.save(fileName);
      });
    }
}