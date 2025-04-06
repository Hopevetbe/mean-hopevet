import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PatientModel, PetDetails } from '../../models/patient.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// import * as html2pdf from 'html2pdf.js';
//declare module 'html2pdf.js';
import * as html2pdf from 'html2pdf.js';
import jspdf from 'jspdf';
import { PetDetailsService } from '../../services/petDetails.service';
import { MedicalRecordsService } from '../../services/medical.service';
import { Router } from '@angular/router';
import { PDFGenerationService } from '../../services/pdf-generation.service';

 
@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  patient!:PatientModel;
  patientForm!: FormGroup;
  casePatientForm!: FormGroup;
  firstForm = true;
  prescription= false;
  selectedPet!:PetDetails;
  patientDetail!:any;
  petOwner!:any;
  loader = false;
  ownerList!: any;
  selectedPetIndex!:number | undefined;
  isAlreadyExistOwner = false;
  alreadyExistOwner!: any;
  vaccination!: any;
  selectedOwner!:any;
  filteredOwnerOption!:{id:string,name:string}[];
  searchOwnerTerm='';
  oldMedicalRecord!:any;
  @ViewChild('pdfTable', {static: false}) pdfTable!: ElementRef;
  lastVaccinationDate='';
  throwError=false;
  prescriptionResponse!: any;
  
  @ViewChild('downloadableContent', { static: false }) downloadableContent!: ElementRef;
  downloadPrescription: boolean=false;
  doctor!: any;
  clinic!: any;
  constructor(private fb: FormBuilder, 
    private petDetailsService: PetDetailsService, private router:Router,
    private medicalRecordService: MedicalRecordsService, private pDFGenerationService:PDFGenerationService){}
  ngOnInit(): void {
   this.onincomponent();
   // this.initialiseCasePatientForm();
  }
  onincomponent(){
    this.fetchPetOwners();
    this.initialisePatientsForm();
  }
  others:boolean[]= [];
  category(event:any,i:number){
    const categoryName = event.target.value;
    if(categoryName === 'others'){
      this.others[i] = true;
    }else{
      this.others[i] = false;
    }
  }
  initialisePatients(patientObj: PatientModel) {
    let prodChoiceArray = this.fb.array([]) as FormArray;
    if (patientObj) {
      patientObj.petDetails.forEach(patientObj => {
        let patientDetailGroup = this.fb.group({
          category: [patientObj.category, Validators.required],
          petName: [patientObj.petName,Validators.required],
          petWeight: [patientObj.petWeight],
          petAge: [patientObj.petAge],
          petAgeDetails: [patientObj.petAgeDetails],
          petImage: [patientObj.petImage],
          id:[patientObj.id],
         });
        prodChoiceArray.push(patientDetailGroup);
      });
    };
    this.patientForm = this.fb.group({
      '_id': [patientObj ? patientObj._id : null],
      'ownerName': [patientObj ? patientObj.ownerName : null, Validators.required],
      'email': [patientObj ? patientObj.email : null, Validators.required],
      'address': [patientObj ? patientObj.address : null, Validators.required],
      'phoneNumber': [patientObj ? patientObj.phoneNumber : null, Validators.required],
      'createdBy': [patientObj ? patientObj.createdBy : null],
      'createdDate': [patientObj ? patientObj.createdDate : null],
      'updatedBy': [patientObj ? patientObj.updatedBy : null],
      'lastupdatedDate': [patientObj ? patientObj.lastupdatedDate : null],
      'petDetails': patientObj ? prodChoiceArray : this.fb.array([this.fb.group({
          category: [null,Validators.required],
          petName: [null,Validators.required],
          petWeight: [null],
          petAge: [null],
          petAgeDetails: [null],
          petImage: [null],
          id:[null],                                                                        
          isOpen:true,
      })]),
    }
    
    );
  }
  get petDetailsArray(): FormArray {
    return this.patientForm.get('petDetails') as FormArray;
  }
  get medicinesArray(): FormArray {
    return this.casePatientForm.get('medicines') as FormArray;
  }
  addPet(){
    
    this.petDetailsArray.markAllAsTouched();
    if (this.petDetailsArray.valid) {
      // close all other tabs
      this.petDetailsArray.value.forEach((_exp: any, index: any) => {
        const pet = this.petDetailsArray.at(index);

        if (pet.value.isOpen && pet.valid) {
          pet.patchValue({ isOpen: false });
        }
      });
    }
    this.petDetailsArray.push(this.fb.group({
      category: [null, Validators.required],
      petName: [null, Validators.required],
      petWeight: [null],
      petAge: [null],
      petAgeDetails:[null],
      petImage: [null],
      id:[null],
      isOpen:true,

    }));
  }
  removePet(index: number) {
    this.petDetailsArray.removeAt(index);
  }
  savePatient(){
   
    this.selectedPetIndex = this.selectedPetIndex ?? this.patientForm.value.petDetails.findIndex((data:PetDetails)=>data.isOpen);
    if(this.selectedPetIndex === -1){
      this.throwError = true;
      return;
    }
    this.throwError = false;
    this.loader = true;
    if (!this.isAlreadyExistOwner){;
    this.petDetailsService.savePetDetails(this.patientForm.value,this.selectedPetIndex).subscribe((response: any) => { 
      this.petOwner = response.data;
      this.selectedPet = this.petOwner.selectedPet;
      this.lastVaccinationDate = this.petOwner.lastVaccinationDetails ?? '';
       this.getOldMedicalRecords(this.petOwner.selectedPet._id);
      this.loader = false;
      this.firstForm = false;
    this.initialiseCasePatientForm();      
    },
      (err) => { console.log(err);
      this.loader = false;
      });
    }else{
      this.petDetailsService.updateSavedPetDetails(this.patientForm.value,this.selectedPetIndex,this.alreadyExistOwner).subscribe((response:any)=>{
        this.petOwner = response.data;
        this.selectedPet = this.petOwner.selectedPet;
        this.lastVaccinationDate = this.petOwner.lastVaccinationDetails ?? '';
       this.getOldMedicalRecords(this.petOwner.selectedPet._id);
        this.loader = false;
        this.firstForm = false;
        this.initialiseCasePatientForm();
      })
    }
    
  }
  public downloadAsPDF() {
    
    const options = {
      filename: 'invoice.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    const element: Element = this.downloadableContent.nativeElement;
    html2pdf()
      .from(element)
      .set(options)
      .save();
  }
    
    


onSelectedPet(index: number,pet:PetDetails){
  this.selectedPetIndex = index;
  this.petDetailsArray.value.forEach((_exp: any, i: any) => {
    const pet = this.petDetailsArray.at(i);
    if(pet.invalid){
      this.removePet(i);
    }
    if (pet.valid && i === index) {
      pet.patchValue({ isOpen: true });
    }else{
      pet.patchValue({ isOpen: false });
    }
  });

}
initialiseCasePatientForm(){
  this.casePatientForm = this.fb.group({
    lastVaccinationDate: [null],
    nextVaccinationDate: [null],
    Vaccination: [false],
    remarks: [null],
    medicines: this.fb.array([this.fb.group({
      medicine: [null],
      dosage: [null],
      morning: [null],
      afternoon: [null],
      evening: [null],
      night: [null],
      isShow: true,
    })]),
  })
}
addMedicine(){
  this.medicinesArray.markAllAsTouched();
    if (this.medicinesArray.valid) {
      // close all other tabs
      this.medicinesArray.value.forEach((_exp: any, index: any) => {
        const med = this.medicinesArray.at(index);

        if (med.value.isShow && med.valid) {
          med.patchValue({ isShow: false });
        }
      });
    }
    this.medicinesArray.push(this.fb.group({
      medicine: [null],
      dosage: [null],
      morning: [null],
      afternoon: [null],
      evening: [null],
      night: [null],
      isShow: true,

    }));
}
preview(){
  let previewFields={
    petDetail: this.patientForm.value,
    caseDetail: this.casePatientForm.value,
    selectedPet: this.selectedPet,
  }
  //this.prescription = true;
  this.patientDetail = previewFields;
  this.petDetailsService.updatePetDetails(this.mapMedicalRecords(),this.petOwner._id).subscribe((response:any)=>{
    this.prescriptionResponse = response.data;
    this.doctor = response.doctor;
    this.clinic = response.clinic[0];
    this.showPrescrition();
    
   // this.pDFGenerationService.printPrescrption(this.prescriptionResponse);
    // this.petDetailsService.printPrescription(response.data).subscribe((pdfBlob: Blob) => {
    //   const blobUrl = URL.createObjectURL(pdfBlob);
    //   const link = document.createElement('a');
    //   link.href = blobUrl;
    //   link.download = 'generated.pdf';
    //   link.click();
    //   this.refreshComponent();
    // });
  });
}
public convetToPDF()
{
var data = document.getElementById('pdfTable');
html2canvas(this.pdfTable.nativeElement).then(canvas => {
// Few necessary setting options
var imgWidth = 208;
var pageHeight = 295;
var imgHeight = canvas.height * imgWidth / canvas.width;
var heightLeft = imgHeight;
 
const contentDataURL = canvas.toDataURL('image/png')
let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
var position = 0;
pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
pdf.save('new-file.pdf'); // Generated PDF

});

this.reset();

}
initialisePatientsForm(){
  this.patientForm = this.fb.group({
    '_id': [null],
    'ownerName': [null, Validators.required],
    'email': [null],
    'address': [null],
    'phoneNumber': [ null, Validators.required],
    'createdBy': [ null],
    'createdDate': [null],
    'updatedBy': [ null],
    'lastupdatedDate': [ null],
    'petDetails': this.fb.array([this.fb.group({
        category: [null],
        petName: [null],
        petWeight: [null],
        petAge: [null],
        petAgeDetails: [null],
        petImage: [null],
        id:[null],                                                                        
        isOpen:true,
    })]),
  }
  
  );
}
reset(){
  this.patient={} as PatientModel;
  this.initialisePatientsForm();
  this.initialiseCasePatientForm();
  this.firstForm = true;
  this.prescription= false;
  this.selectedPet={} as PetDetails;
  this.patientDetail={};
  this.petOwner={};
  this.loader = false;
  this.selectedPetIndex=undefined;
  this.isAlreadyExistOwner = false;
  this.alreadyExistOwner={};
}
/**
 * Function to implement medical records
 */
mapMedicalRecords(){
  return {
    prescriptionNumber: this.petOwner.prescriptionNumber,
    petOwnerDetails: this.petOwner.petOwnerDetails,
    selectedPet: this.selectedPet,
    createMedicalRecord: true,
    vaccinationDetails: {
        vaccinated: this.patientDetail.caseDetail.Vaccination,
        vaccinatedDate: this.patientDetail.caseDetail.Vaccination ? this.petOwner.visitedDate :'',
        nextVaccination: this.patientDetail.caseDetail.nextVaccinationDate
    },
    medicalRecords: {
        medicine: this.mapMedicineDetails(this.patientDetail.caseDetail.medicines),
        remarks: this.patientDetail.caseDetail.remarks
    }
}
}
mapMedicineDetails(medicine:{medicine: string,dosage:string,morning:string,afternoon:string,evening:string,night:string,isShow:boolean}[]){
  let mappedMedicineDetails: {medicine: string,dosage:string,duration:{morning:string,afternoon:string,evening:string,night:string}}[]=[];
  medicine.forEach((medicine:{medicine: string,morning:string,afternoon:string,evening:string,night:string,dosage:string,isShow:boolean})=>{
    if(medicine&& medicine.medicine){
      const mappingData = {
        medicine: medicine.medicine,
        dosage: medicine.dosage??'-',
        duration: {
          morning:medicine.morning ?? 0,
          afternoon:medicine.afternoon??0,
          evening:medicine.evening??0,
          night:medicine.night??0,
        }
      }
    
      mappedMedicineDetails.push(mappingData);
    }
  })
  return mappedMedicineDetails;
}
fetchPetOwners(){
  this.petDetailsService.getAllPetDetails().subscribe((response:any)=>{
    this.ownerList = response.petOwnerList;
    this.filteredOwnerOption = this.mapFilterOwnerOption(this.ownerList);
  })
}
get petDetailsFormArray(): FormArray {
  return this.patientForm.get('petDetails') as FormArray;
}
changeEvent(owner:{id:string,name:string}){
  const selectedOwner = this.ownerList.find((item:any)=>item._id === owner.id);
  this.isAlreadyExistOwner = true;
  this.alreadyExistOwner = owner;
  this.patientForm.reset();
  const control = <FormArray>this.patientForm.controls['petDetails'];
        for(let i = control.length-1; i >= 0; i--) {
            control.removeAt(i)
    }
  this.patientForm.patchValue({
    ownerName:selectedOwner.ownerName,
    email:selectedOwner.email,
    address:selectedOwner.address,
    phoneNumber: selectedOwner.phoneNumber,
  });
  selectedOwner.petDetails.forEach((pet:any,i:number)=>{
    this.addPet();
    this.petDetailsFormArray.at(i).patchValue({
      category: pet.category,
      petName: pet.petName,
      petWeight: pet.petWeight,
      petAge: pet.petAge,
      petAgeDetails: pet.petAgeDetails,      
      petImage: [null],
      id:pet._id,                                                                        
      isOpen:false,
    })
  })

}
mapFilterOwnerOption(list:any[]){
  let mappedData:{id:string,name:string}[]=[];
  let mappingOwner;
  list.forEach((item:any)=>{
    mappingOwner={
      id:item._id,
      name:item.phoneNumber.toString(),
    };
    mappedData.push(mappingOwner);
  })
  return mappedData;
}
refreshComponent(){
  this.patient={} as PatientModel;
  this.initialisePatientsForm();
  this.initialiseCasePatientForm();
  this.firstForm = true;
  this.prescription= false;
  this.selectedPet={} as PetDetails;
  this.patientDetail={};
  this.petOwner={};
  this.loader = false;
  this.selectedPetIndex=undefined;
  this.isAlreadyExistOwner = false;
  this.alreadyExistOwner={};
  this.vaccination={};
  this.selectedOwner={};
  this.filteredOwnerOption=[];
  this.searchOwnerTerm='';
  this.oldMedicalRecord={};
  this.lastVaccinationDate='';
  this.throwError=false;
  this.prescriptionResponse={};
  this.downloadPrescription=false;
  this.doctor={};
  this.clinic={};
  this.onincomponent();

}
changeOwnerSearch(search:string){
  this.searchOwnerTerm = search;
}
getOldMedicalRecords(id:string){
  this.medicalRecordService.getMedicalRecordById(id).subscribe((response:any)=>{
    const filter = response.petMedicalRecords;
    this.oldMedicalRecord= filter[filter.length-1];
  })
}
touched(touchedField:boolean){
 
  if (touchedField) this.patientForm.get('phoneNumber')?.markAsTouched();
}
generatePDF(element: HTMLElement) {
  const doc = new jsPDF();
  const hiddenCanvas = document.createElement('canvas');
  const context = hiddenCanvas.getContext('2d');

  html2canvas(element, { canvas: hiddenCanvas }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const img = new Image();
    img.src = imgData;
    img.onload = () => {
      const imageData = canvas.toDataURL('image/png');
      doc.addImage(imageData, 'PNG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height); // Adjust positioning as needed
      doc.save('export.pdf');
    };
  });
}
downloadPDF() {
   const getElement = this.downloadableContent.nativeElement;
   getElement.removeAttribute('hidden');
    const doc = new jsPDF();
    if(!getElement) return;
    html2canvas(getElement).then(canvas => {
      // Add canvas image to PDF
      const imageData = canvas.toDataURL('image/png');
      doc.addImage(imageData, 'PNG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);
      
      // Save PDF
      doc.save('export.pdf');
    });
  //this.generatePDF(this.downloadableContent.nativeElement);
}
showPrescrition(){
  this.downloadPrescription = true;
}

}

