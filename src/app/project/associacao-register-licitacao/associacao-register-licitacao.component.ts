import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import axios from 'axios';
import Stepper from 'bs-stepper';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { forkJoin } from "rxjs";
import { AllotmentRequestDto } from "src/app/interface/licitacao.interface";
import { AssociationBidRequestDto } from "src/dtos/association/association-bid.dto";
import { WorkPlanDto } from "src/dtos/convenio/convenio-response.dto";
import { CostItemsResponseDto } from "src/dtos/cost-items/cost-items-response.dto";
import { WorkPlanRegisterRequest } from "src/dtos/workPlan/work-plan-register-request.dto";
import { AgreementActiveStatusEnum } from "src/enums/agreement-active-status.enum";
import { BidStatusEnum } from "src/enums/bid-status.enum";
import { AssociationBidService } from "src/services/association-bid.service";
import { ConvenioService } from "src/services/convenio.service";
import { CostItemsService } from "src/services/cost-items.service";
import { ItemsService } from "src/services/items.service";
import { SupplierService } from "src/services/supplier.service";
import { WorkPlanService } from "src/services/work-plan.service";
import { SHA256, enc } from "crypto-js";

@Component({
  selector: "app-associacao-register-licitacao",
  templateUrl: "./associacao-register-licitacao.component.html",
  styleUrls: ["./associacao-register-licitacao.component.scss"],
})
export class AssociacaoRegisterLicitacaoComponent {
  @ViewChild('pdfLote') pdfFileLote: ElementRef;
  @ViewChild('miInputFile') miInputFile: ElementRef;


  formModel!: FormGroup;
  formDate!: FormGroup;
  formAddLots!: FormGroup;
  form!: FormGroup;
  isSubmit: boolean = false;
  selectedFile: File | null = null;
  invitedSupplier: any[] = [];
  invitedSupplierId: any[] = [];
  supplierImg: string = "";
  selectedImageUrl: string;
  notImage = true;
  notEdital = true;
  notAta = true;
  selectFile: any = [];
  totalFiles: File[] = [];
  lots: any[] = [];
  item: any[] = [];
  userList: any;
  convenioList: any[];
  //costItemsList: CostItemsResponseDto[];
  costItemsList: any[];
  selectedEdital: any;
  selectedAta: any;
  checkBidType: string;
  today: any;
  fileName: string = "-"
  itemFile: any;

  date: string;
  classification: any[] = [];
  costItemsListFilter: any[] = [];
  lotItemsList: any[] = []

  storedLanguage: string | null;

  selectedAdditionalFiles: any[] = [];

  daysToDeliveryValidator: boolean = false;

  disableEditLot = false;
  itemIdOfLote: string;
  quantityItem = 0;
  lotToEdit: any
  lotNumber: number;

  itemSelected: any = true;
  unitList: any[] = [];

  private stepper: Stepper;

  estados: string[] = [];
  cidades: string[] = [];

  unit: string = "";  

  estadosArrGet: any[] = [
    { estado: "Acre", sigla: "AC" },
    { estado: "Alagoas", sigla: "AL" },
    { estado: "Amapá", sigla: "AP" },
    { estado: "Amazonas", sigla: "AM" },
    { estado: "Bahia", sigla: "BA" },
    { estado: "Ceará", sigla: "CE" },
    { estado: "Distrito Federal", sigla: "DF" },
    { estado: "Espírito Santo", sigla: "ES" },
    { estado: "Goiás", sigla: "GO" },
    { estado: "Maranhão", sigla: "MA" },
    { estado: "Mato Grosso", sigla: "MT" },
    { estado: "Mato Grosso do Sul", sigla: "MS" },
    { estado: "Minas Gerais", sigla: "MG" },
    { estado: "Pará", sigla: "PA" },
    { estado: "Paraíba", "sigla": "PB" },
    { estado: "Paraná", "sigla": "PR" },
    { estado: "Pernambuco", sigla: "PE" },
    { estado: "Piauí", sigla: "PI" },
    { estado: "Rio de Janeiro", sigla: "RJ" },
    { estado: "Rio Grande do Norte", sigla: "RN" },
    { estado: "Rio Grande do Sul", sigla: "RS" },
    { estado: "Rondônia", sigla: "RO" },
    { estado: "Roraima", sigla: "RR" },
    { estado: "Santa Catarina", sigla: "SC" },
    { estado: "São Paulo", sigla: "SP" },
    { estado: "Sergipe", sigla: "SE" },
    { estado: "Tocantins", sigla: "TO" }
  ];

  supplierList: any = [];

  resumo: boolean = false;

  associationSelected: any;

  placeToDelivery: string = ''
  daysToDelivery: string = ''
  insuranceId: string;
  workPlanId: WorkPlanDto[];
  workPlanList: any[] = [];

  viewBiddingTypeMsg: boolean = false;
  viewModalityMsg: boolean = false;
  viewDescriptionMsg: boolean = false;
  viewInsuranceMsg: boolean = false;
  viewClassificationMsg: boolean = false;
  viewAdicionalSiteMsg: boolean = false;
  quantityAgreement: number;

  itemsAdded: any = [];
  editItemControl: boolean = false;

  editItemSelect: any;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private associationBidService: AssociationBidService,
    private workPlanService: WorkPlanService,
    private convenioService: ConvenioService,
    private supplierService: SupplierService,
    private ngxSpinnerService: NgxSpinnerService,
    private costItemsService: CostItemsService,
    private itemsService: ItemsService
  ) {
    this.formModel = this.formBuilder.group({
      biddingType: ["", [Validators.required]],
      modality: ["", [Validators.required]],
      description: ["", [Validators.required]],
      insurance: ["", [Validators.required]],
      classification: ["", [Validators.required]],
      adicionalSite: [""],
      editalFile: [""],
      ataFile: [""]
    });

    this.formDate = this.formBuilder.group({
      initialDate: [""],
      closureDate: ["", [Validators.required, Validators.max(120)]],
      timebreakerDays: ["", [Validators.required, Validators.max(10)]],
      executionDays: ["", [Validators.required, Validators.max(720), Validators.min(1)]],
      deliveryPlace: ["", [Validators.required]],
      stateSelect: ['', [Validators.required]],
      citySelect: ['', [Validators.required]],
    })

    this.formAddLots = this.formBuilder.group({
      batchName: ["", [Validators.required]],
      deliveryTimeDays: [""],
      deliveryPlaceLots: [""],
      quantity: [0],
      item: [""],
      inviteSuppliers: [""],
      unit: [""]
    });
  }

  ngOnInit(): void {
      
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true,
    })

    this.today = new Date()
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() + 10);
    this.date = currentDate.toISOString().slice(0, 10);

    const fork = forkJoin({
      //costItens: this.costItemsService.list(),
      costItens: this.itemsService.getItems(),
      suppliers: this.supplierService.supplierList(),
      convenios: this.convenioService.getConvenioForAssociation(),
    });

    fork.subscribe({ 
      next: data => {

        this.costItemsList = data.costItens;        
        this.userList = data.suppliers;
        // this.convenioList = data.convenios

        this.convenioList = data.convenios.filter((item: any) => item.activeStatus === AgreementActiveStatusEnum.active && !!item.association);
        let maxQuantity: number = 0;

        /* comment */
        /*
        this.formAddLots.controls['item'].valueChanges.subscribe({
          next: data => {
            if (data && data !== '') {
              const convenio = this.convenioList.filter(el => el._id === this.formModel.controls['insurance'].value);
              for (let iterator of convenio[0].workPlan) {
                for (let item of iterator.product) {
                  if (item.costItems._id === data) {
                    maxQuantity = item.quantity
                  }
                }
              }
            }
          }
        })
        */
        

        /* comment */
        /*
        this.formAddLots.controls['quantity'].valueChanges.subscribe({
          next: data => {
            if (data > maxQuantity) {
              this.formAddLots.patchValue({
                quantity: maxQuantity
              })
            }
          }
        });
        */

        

        this.formModel.controls['biddingType'].valueChanges.subscribe({
          next: data => {
            if (data !== 'individualPrice') {
              this.formDate.controls['deliveryPlace'].valueChanges.subscribe({
                next: data => {
                  this.formAddLots.patchValue({
                    deliveryPlaceLots: data
                  })
                }
              })
            }
          }
        })

        this.formModel.controls['insurance'].valueChanges.subscribe({
          next: data => {
            let association = [];
            association = this.convenioList.filter((el: any) => el._id === data);
            this.formDate.patchValue({
              deliveryPlace: association[0].association.address.publicPlace
            })
          }
        });

        this.formDate.controls['executionDays'].valueChanges.subscribe({
          next: data => {
            this.formAddLots.patchValue({
              deliveryTimeDays: data
            })
          }
        });



        if (localStorage.getItem("newBid")) {

          const newBid = JSON.parse(localStorage.getItem("newBid") || "{}");
          this.invitedSupplierId = newBid.invitedSupplierId;

          newBid.add_allotment.forEach((element: any) => {
            delete element['_id'];
          });

          this.lots = newBid.add_allotment;
          const executionDays = this.differenceInDays(newBid.days_to_delivery);

          this.formModel.patchValue({
            description: newBid.description,
            status: newBid.status || "awaiting",
            insurance: newBid.agreement._id,
            initialDate: newBid.start_at,
            closureDate: newBid.end_at,
            executionDays: executionDays,
            timebreakerDays: newBid.days_to_tiebreaker,
            deliveryPlace: newBid.local_to_delivery,
            biddingType: newBid.bid_type,
            modality: newBid.modality,
            adicionalSite: newBid.aditional_site,
            add_allotment: this.lots,
            invited_suppliers: this.invitedSupplierId,
          });

          this.changeAgreement(this.insuranceId);

          this.formModel.patchValue({
            classification: newBid.classification,
          });

          this.changeClassification();
        }
      },
      error: err => {
        console.error(err);
      }
    });

    this.storedLanguage = localStorage.getItem('selectedLanguage');
    this.carregarEstados();
  }


  viewMessage(msgView: string) {
    if (msgView === 'biddingType') {
      this.viewBiddingTypeMsg = true;
      this.viewModalityMsg = false;
      this.viewDescriptionMsg = false;
      this.viewInsuranceMsg = false;
      this.viewClassificationMsg = false;
      this.viewAdicionalSiteMsg = false;
    }

    if (msgView === 'modality') {
      this.viewBiddingTypeMsg = false;
      this.viewModalityMsg = true;
      this.viewDescriptionMsg = false;
      this.viewInsuranceMsg = false;
      this.viewClassificationMsg = false;
      this.viewAdicionalSiteMsg = false;
    }

    if (msgView === 'description') {
      this.viewBiddingTypeMsg = false;
      this.viewModalityMsg = false;
      this.viewDescriptionMsg = true;
      this.viewInsuranceMsg = false;
      this.viewClassificationMsg = false;
      this.viewAdicionalSiteMsg = false;
    }

    if (msgView === 'insurance') {
      this.viewBiddingTypeMsg = false;
      this.viewModalityMsg = false;
      this.viewDescriptionMsg = false;
      this.viewInsuranceMsg = true;
      this.viewClassificationMsg = false;
      this.viewAdicionalSiteMsg = false;
    }

    if (msgView === 'classification') {
      this.viewBiddingTypeMsg = false;
      this.viewModalityMsg = false;
      this.viewDescriptionMsg = false;
      this.viewInsuranceMsg = false;
      this.viewClassificationMsg = true;
      this.viewAdicionalSiteMsg = false;
    }

    if (msgView === 'adicionalSite') {
      this.viewBiddingTypeMsg = false;
      this.viewModalityMsg = false;
      this.viewDescriptionMsg = false;
      this.viewInsuranceMsg = false;
      this.viewClassificationMsg = false;
      this.viewAdicionalSiteMsg = true;
    }
  }

  next(value: string) {
    if (value === 'step1' || value === 'step2') {
      this.stepper.next();
    }
    if (value === 'step3' && this.formModel.controls['modality'].value !== 'openClosed') {
      alert("1")
      if (this.formModel.controls['modality'].value === '') {
        this.toastrService.error('Selecione uma modalidade', '', { progressBar: true })
        return
      }
      this.updateWorkPlan();
      this.stepper.next();
    }
    // De lotes a resumen
    if (value === 'step3' && this.formModel.controls['modality'].value === 'openClosed') {
      
      this.resumo = true;
      for (let iterator of this.convenioList) {
        if (iterator._id === this.formModel.controls['insurance'].value) {
          this.associationSelected = iterator
        }
      }
      this.updateWorkPlan();
      this.stepper.to(5);
    } else if (value === 'step4') { 
      this.resumo = true;
      for (let iterator of this.convenioList) {
        if (iterator._id === this.formModel.controls['insurance'].value) {
          this.associationSelected = iterator
        }
      }
      this.stepper.next();
    }
  }

  carregarEstados() {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then((response: any) => {
        this.estados = response.data.map((estado: any) => estado.nome);
      })
      .catch((error: any) => {
        console.error('Erro ao carregar estados:', error);
      });
  }

  selecionarEstado(estado: string) {
    if (!estado) {
      this.cidades = [];
      this.formDate.patchValue({
        citySelect: ''
      });
      return;
    }
  
    const estadoSelecionado = this.estadosArrGet.find(el => el.estado === estado);
  
    if (estadoSelecionado) {
      axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado.sigla}/municipios`)
        .then((response: any) => {
          this.cidades = response.data.map((cidade: any) => cidade.nome);
          this.formDate.patchValue({
            citySelect: '' 
          });
        })
        .catch((error: any) => {
          console.error('Erro ao carregar cidades:', error);
        });
    }
  }

  selecionarCidade(cidade: string) { }


  validationInput(event: any) {
    const valueInput = event?.target.value
    this.formDate.patchValue({
      executionDays: valueInput.replace(/[^0-9]/g, '')
    })
  }

  validationExecutionDays(event: any) {
    const valueInput = event?.target.value
    this.formDate.patchValue({
      timebreakerDays: valueInput.replace(/[^0-9]/g, '')
    })
  }

  checkClosureDate(event: any) {
    // const valueInput = event?.target.value;

    // console.log(this.formDate.controls["closureDate"].value)
    // let sanitizedValue = valueInput.replace(/[^0-9]/g, '');

    // if (sanitizedValue.length > 1 && sanitizedValue.startsWith('0')) {
    //   sanitizedValue = sanitizedValue.slice(1);
    // }


    // this.formDate.patchValue({
    //   closureDate: sanitizedValue
    // });
  }

  validationDeliveryTimeDays(event: any) {
    const valueInput = event?.target.value
    this.formAddLots.patchValue({
      deliveryTimeDays: valueInput.replace(/[^0-9]/g, '')
    })

  }

  validateDaysInput() {
    const executionDaysValue = parseInt(this.formDate.controls["executionDays"].value);
    const deliveryTimeDaysValue = parseInt(this.formAddLots.controls["deliveryTimeDays"].value);

    if (deliveryTimeDaysValue > executionDaysValue) {
      this.daysToDeliveryValidator = true;
    } else {
      this.daysToDeliveryValidator = false;
    }
  }

  ngOnDestroy(): void {
    
    localStorage.removeItem('newBid');
  }

  generateRandomId() {
    const min = 1;
    const max = 100000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  onSubmitDraft() {
    this.isSubmit = true;
    if (this.formModel.status == "INVALID") {

      let errorMessage = 'Preencha todos os campos obrigatórios!';

      switch (this.storedLanguage) {
        case 'pt':
          errorMessage = 'Preencha todos os campos obrigatórios!'
          break;
        case 'en':
          errorMessage = 'Fill in all required fields!'
          break;
        case 'fr':
          errorMessage = 'Remplissez tous les champs obligatoires !'
          break;
        case 'es':
          errorMessage = '¡Complete todos los campos requeridos!'
          break;
      }


      this.toastrService.error(errorMessage);
      return;
    }

    let newBid: any;

    if (!this.item || this.item.length === 0) {
      
      newBid = {
        description: this.formModel.controls["description"].value,
        status: BidStatusEnum.draft,
        agreementId: this.formModel.controls["insurance"].value,
        classification: this.formModel.controls["classification"].value,
        start_at: this.formDate.controls["initialDate"].value,
        end_at: this.formDate.controls["closureDate"].value,
        days_to_delivery: this.formDate.controls["executionDays"].value.toString(),
        days_to_tiebreaker: this.formDate.controls["timebreakerDays"].value.toString(),
        local_to_delivery: this.formDate.controls["deliveryPlace"].value,
        bid_type: this.formModel.controls["biddingType"].value,
        modality: this.formModel.controls["modality"].value,
        aditional_site: this.formModel.controls["adicionalSite"].value,
        state: this.formDate.controls["stateSelect"].value,
        city: this.formDate.controls["citySelect"].value,
        add_allotment: this.lots,
        invited_suppliers: this.invitedSupplierId,
        editalFile: this.selectedEdital,
        ataFile: this.selectedAta || null,
      };

    

    } else {
      
      newBid = {
        description: this.formModel.controls["description"].value,
        status: BidStatusEnum.draft,
        agreementId: this.formModel.controls["insurance"].value,
        classification: this.formModel.controls["classification"].value,
        start_at: this.formDate.controls["initialDate"].value,
        end_at: this.formDate.controls["closureDate"].value,
        days_to_delivery: this.formDate.controls["executionDays"].value,
        days_to_tiebreaker: this.formDate.controls["timebreakerDays"].value,
        local_to_delivery: this.formDate.controls["deliveryPlace"].value,
        bid_type: this.formModel.controls["biddingType"].value,
        modality: this.formModel.controls["modality"].value,
        aditional_site: this.formModel.controls["adicionalSite"].value,
        state: this.formDate.controls["stateSelect"].value,
        city: this.formDate.controls["citySelect"].value,
        add_allotment: this.lots,
        invited_suppliers: this.invitedSupplierId,
        editalFile: this.selectedEdital,
        ataFile: this.selectedAta || null,
      };     

    }

    this.ngxSpinnerService.show();

    const formData = new FormData();

    this.selectedAdditionalFiles.forEach((file: any) => {
      formData.append('files', file);
    });

    formData.append('description', newBid.description!);
    formData.append('agreementId', newBid.agreementId!);
    formData.append('classification', newBid.classification!);
    formData.append('start_at', newBid.start_at!);
    formData.append('end_at', newBid.end_at!);
    formData.append('days_to_delivery', newBid.days_to_delivery!);
    formData.append('days_to_tiebreaker', newBid.days_to_tiebreaker!);
    formData.append('local_to_delivery', newBid.local_to_delivery!);
    formData.append('status', newBid.status!);
    formData.append('bid_type', newBid.bid_type!);
    formData.append('modality', newBid.modality!);
    formData.append('aditional_site', newBid.aditional_site!);
    formData.append('state', newBid.state!);
    formData.append('city', newBid.city!);

    if (newBid.invited_suppliers)
      for (let i = 0; i < newBid.invited_suppliers.length; i++)
        formData.append(`invited_suppliers[${i}][_id]`, newBid.invited_suppliers[i]!);      

    if (newBid.add_allotment) {
      for (let i = 0; i < newBid.add_allotment.length; i++) {
        formData.append(`add_allotment[${i}][allotment_name]`, newBid.add_allotment[i].allotment_name!);
        formData.append(`add_allotment[${i}][days_to_delivery]`, newBid.add_allotment[i].days_to_delivery!);
        formData.append(`add_allotment[${i}][place_to_delivery]`, newBid.add_allotment[i].place_to_delivery!);
        formData.append(`add_allotment[${i}][quantity]`, newBid.add_allotment[i].quantity!);
        formData.append(`add_allotment[${i}][files]`, newBid.add_allotment[i].files!);

        for (let j = 0; j < newBid.add_allotment[i].add_item.length; j++) {
          formData.append(`add_allotment[${i}][add_item][${j}][group]`, newBid.add_allotment[i].add_item[j].group);
          formData.append(`add_allotment[${i}][add_item][${j}][item]`, newBid.add_allotment[i].add_item[j].name);
          formData.append(`add_allotment[${i}][add_item][${j}][quantity]`, newBid.add_allotment[i].add_item[j].quantity);
          formData.append(`add_allotment[${i}][add_item][${j}][unitMeasure]`, newBid.add_allotment[i].add_item[j].unit);
          formData.append(`add_allotment[${i}][add_item][${j}][specification]`, newBid.add_allotment[i].add_item[j].specification);
        }
      }
    }


    this.associationBidService.bidRegisterFormData(formData).subscribe({
      next: data => {

        let successMessage = 'Licitação criada com sucesso!';

        switch (this.storedLanguage) {
          case 'pt':
            successMessage = 'Licitação criada com sucesso!'
            break;
          case 'en':
            successMessage = 'Tender created successfully!'
            break;
          case 'fr':
            successMessage = "Appel d'offres créé avec succès !"
            break;
          case 'es':
            successMessage = '¡Oferta creada con éxito!'
            break;
        }

        this.toastrService.success(successMessage, "", { progressBar: true });
        this.ngxSpinnerService.hide();
        this.router.navigate(["/pages/associacao/licitacoes"]);
      },
      error: error => {

        let errorMessage = 'Não foi possível criar a Licitação, verifique os campos';

        switch (this.storedLanguage) {
          case 'pt':
            errorMessage = 'Não foi possível criar a Licitação, verifique os campos'
            break;
          case 'en':
            errorMessage = 'Unable to create the Tender, check the fields'
            break;
          case 'fr':
            errorMessage = "Impossible de créer l'offre, vérifiez les champs"
            break;
          case 'es':
            errorMessage = 'No se pudo crear la Oferta, verifique los campos'
            break;
        }

        this.toastrService.error(errorMessage, "", { progressBar: true });
        this.ngxSpinnerService.hide();
      },
    });
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.formModel.status == "INVALID") {

      let errorMessage = 'Preencha todos os campos obrigatórios!';

      switch (this.storedLanguage) {
        case 'pt':
          errorMessage = 'Preencha todos os campos obrigatórios!'
          break;
        case 'en':
          errorMessage = 'Fill in all required fields!'
          break;
        case 'fr':
          errorMessage = 'Remplissez tous les champs obligatoires !'
          break;
        case 'es':
          errorMessage = '¡Complete todos los campos requeridos!'
          break;
      }


      this.toastrService.error(errorMessage);
      return;
    }

    let newBid: any;    

    if (!this.item || this.item.length === 0) {
      newBid = {
        description: this.formModel.controls["description"].value,
        status: BidStatusEnum.awaiting,
        agreementId: this.formModel.controls["insurance"].value,
        classification: this.formModel.controls["classification"].value,
        start_at: this.formDate.controls["initialDate"].value,
        end_at: this.formDate.controls["closureDate"].value,
        days_to_delivery: this.formDate.controls["executionDays"].value.toString(),
        days_to_tiebreaker: this.formDate.controls["timebreakerDays"].value.toString(),
        local_to_delivery: this.formDate.controls["deliveryPlace"].value,
        bid_type: this.formModel.controls["biddingType"].value,
        modality: this.formModel.controls["modality"].value,
        aditional_site: this.formModel.controls["adicionalSite"].value,
        state: this.formDate.controls["stateSelect"].value,
        city: this.formDate.controls["citySelect"].value,
        add_allotment: this.lots,
        invited_suppliers: this.invitedSupplierId,
        editalFile: this.selectedEdital,
        ataFile: this.selectedAta || null, 
      };

    } else {
      newBid = {
        description: this.formModel.controls["description"].value,
        status: BidStatusEnum.awaiting,
        agreementId: this.formModel.controls["insurance"].value,
        classification: this.formModel.controls["classification"].value,
        start_at: this.formDate.controls["initialDate"].value,
        end_at: this.formDate.controls["closureDate"].value,
        days_to_delivery: this.formDate.controls["executionDays"].value,
        days_to_tiebreaker: this.formDate.controls["timebreakerDays"].value,
        local_to_delivery: this.formDate.controls["deliveryPlace"].value,
        bid_type: this.formModel.controls["biddingType"].value,
        modality: this.formModel.controls["modality"].value,
        aditional_site: this.formModel.controls["adicionalSite"].value,
        state: this.formDate.controls["stateSelect"].value,
        city: this.formDate.controls["citySelect"].value,
        add_allotment: this.lots,
        invited_suppliers: this.invitedSupplierId,
        editalFile: this.selectedEdital,
        ataFile: this.selectedAta || null,
      };

    }    

    const formData = new FormData();

    this.selectedAdditionalFiles.forEach((file: any) => {
      formData.append('files', file);
    });

    formData.append('description', newBid.description!);
    formData.append('agreementId', newBid.agreementId!);
    formData.append('classification', newBid.classification!);
    formData.append('start_at', newBid.start_at!);
    formData.append('end_at', newBid.end_at!);
    formData.append('days_to_delivery', newBid.days_to_delivery!);
    formData.append('days_to_tiebreaker', newBid.days_to_tiebreaker!);
    formData.append('local_to_delivery', newBid.local_to_delivery!);
    formData.append('status', newBid.status!);
    formData.append('bid_type', newBid.bid_type!);
    formData.append('modality', newBid.modality!);
    formData.append('aditional_site', newBid.aditional_site!);
    formData.append('state', newBid.state!);
    formData.append('city', newBid.city!);

    if (newBid.invited_suppliers)
      for (let i = 0; i < newBid.invited_suppliers.length; i++)
        formData.append(`invited_suppliers[${i}][_id]`, newBid.invited_suppliers[i]!);

    if (newBid.add_allotment) {
      
      for (let i = 0; i < newBid.add_allotment.length; i++) {
        formData.append(`add_allotment[${i}][allotment_name]`, newBid.add_allotment[i].allotment_name!);
        formData.append(`add_allotment[${i}][days_to_delivery]`, newBid.add_allotment[i].days_to_delivery!);
        formData.append(`add_allotment[${i}][place_to_delivery]`, newBid.add_allotment[i].place_to_delivery!);
        formData.append(`add_allotment[${i}][quantity]`, newBid.add_allotment[i].quantity!);
        formData.append(`add_allotment[${i}][files]`, newBid.add_allotment[i].files!);

        for (let j = 0; j < newBid.add_allotment[i].add_item.length; j++) {
          formData.append(`add_allotment[${i}][add_item][${j}][group]`, newBid.add_allotment[i].add_item[j].group);
          formData.append(`add_allotment[${i}][add_item][${j}][item]`, newBid.add_allotment[i].add_item[j].name);
          formData.append(`add_allotment[${i}][add_item][${j}][quantity]`, newBid.add_allotment[i].add_item[j].quantity);
          formData.append(`add_allotment[${i}][add_item][${j}][unitMeasure]`, newBid.add_allotment[i].add_item[j].unit);
          formData.append(`add_allotment[${i}][add_item][${j}][specification]`, newBid.add_allotment[i].add_item[j].specification);
        }
      }
    }

    this.ngxSpinnerService.show();

    this.associationBidService.bidRegisterFormData(formData).subscribe({
      next: data => {

        let successMessage = 'Licitação criada com sucesso!';

        switch (this.storedLanguage) {
          case 'pt':
            successMessage = 'Licitação criada com sucesso!'
            break;
          case 'en':
            successMessage = 'Tender created successfully!'
            break;
          case 'fr':
            successMessage = "Appel d'offres créé avec succès !"
            break;
          case 'es':
            successMessage = '¡Licitación creada con éxito!'
            break;
        }

        this.toastrService.success(successMessage, "", { progressBar: true });
        this.ngxSpinnerService.hide();
        this.router.navigate(["/pages/associacao/licitacoes"]);
      },
      error: error => {

        let errorMessage = 'Não foi possível criar a Licitação, verifique os campos';

        switch (this.storedLanguage) {
          case 'pt':
            errorMessage = 'Não foi possível criar a Licitação, verifique os campos'
            break;
          case 'en':
            errorMessage = 'Unable to create the Tender, check the fields'
            break;
          case 'fr':
            errorMessage = "Impossible de créer l'offre, vérifiez les champs"
            break;
          case 'es':
            errorMessage = 'No se pudo crear la licitación, verifique los campos'
            break;
        }

        this.toastrService.error(errorMessage, "", { progressBar: true });
        this.ngxSpinnerService.hide();
      },
    });
  }

  setModality(item: any) {
    this.checkBidType = item.value
  }

  isFormValid(): boolean {
    const itemValid = this.formAddLots.controls["item"].valid;
    const quantityValid = this.formAddLots.controls["quantity"].valid;
    const isIndividualPrice = this.formModel.controls["biddingType"].value === "individualPrice";
    const isOneItem = this.item?.length === 1;

    return itemValid && quantityValid && !(isIndividualPrice && isOneItem);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  selectSupplier(supplierId: string) {
    for (let iterator of this.userList) {
      if (iterator._id == supplierId) {
        return { _id: supplierId, name: iterator.name };
      }
    }

    return null;
  }

  addSupplier() {
    const supplierId = this.formAddLots.controls["inviteSuppliers"].value;
    const supplier = this.selectSupplier(supplierId);
    if (supplier && !this.invitedSupplierId.includes(supplierId)) {
      this.invitedSupplierId.push(supplierId);
      this.invitedSupplier.push(supplier);
    }
  }

  removeSupplier(index: number) {
    this.invitedSupplier.splice(index, 1);
    this.invitedSupplierId.splice(index, 1);
  }



  onSelectFileProductImage(event: any) {

    this.itemFile = event.target.files[0];
    this.fileName = event.target.files[0].name;

    for (let i = 0; i < event.target.files.length; i++) {
      this.totalFiles.push(event.target.files[i]);
    }

    if (event.target.files && event.target.files[0]) {
      this.notImage = false;
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.supplierImg = event.target.result as string;
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  onSelectFileEdital(event: any) {

    if (event.target.files && event.target.files[0]) {
      this.notEdital = false;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.selectedEdital = event.target.result as string;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onSelectFileAta(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.notAta = false;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.selectedAta = event.target.result as string;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onSelectAdditionalFiles(event: any) {
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.selectedAdditionalFiles.push(event.target.files[i]);
      }
    }
  }

  setItemValue(idLotItem: string) {
        
    /*
    this.itemIdOfLote = IdItem
    for (let i = 0; i < this.workPlanId.length; i++) {
      for (let x = 0; x < this.workPlanId[i].product.length; x++) {
        
        const item = this.workPlanId[i].product[x];        

        if (item.costItems === this.itemIdOfLote) {                            
          this.quantityAgreement = item.quantity
          this.quantityItem = item.quantity    
          this.unit = item.unit
        }
      }
    }
    */      

    for(let i=0;i<this.lotItemsList.length;i++){      
      if(this.lotItemsList[i].id === idLotItem){        
        this.quantityAgreement = this.lotItemsList[i].quantity
        this.quantityItem = this.lotItemsList[i]. quantity
        this.unit = this.lotItemsList[i].unit
        break;
      }
    }

    this.formAddLots.controls['quantity'].setValue(0)
    
    if (this.editItemControl === true) {
      this.editItemControl = false;
    }

    this.itemSelected = false;
    
  }

  addItem() {  

    const idLotItem = this.formAddLots.controls['item'].value;    

    let selectedItem;

    for(let i=0;i<this.lotItemsList.length;i++){
      if(this.lotItemsList[i].id === idLotItem){
        this.item.push({"name": this.lotItemsList[i].name, "quantity": this.formAddLots.controls['quantity'].value, "unit": this.lotItemsList[i].unit, "group": this.lotItemsList[i].group});        
        selectedItem = this.item[this.item.length-1]
        break;    
      }
    }          

    for (let i = 0; i < this.workPlanId.length; i++) {
      for (let x = 0; x < this.workPlanId[i].product.length; x++) {
        const item = this.workPlanId[i].product[x];
        if (item.costItems === this.itemIdOfLote) {
          let countQuantity = item.quantity - Number(this.formAddLots.controls["quantity"].value)

          this.workPlanId[i].product[x].quantity = countQuantity;

          let workplandto: WorkPlanRegisterRequest = {
            name: this.workPlanId[i].name,
            product: [{
              quantity: countQuantity,
              unit: item.unit,             
              unitValue: item.unitValue,
              costItems: item.costItems
            }]
          }

          Object.assign(workplandto, { workplanId: this.workPlanId[i]._id })

          this.itemsAdded.push(workplandto);

          // this.workPlanService.update(this.workPlanId[i]._id, workplandto).subscribe({
          //   next: data => { },
          //   error: error => {
          //     console.error('deu errado', error.error.message);
          //   },
          // });

        }
      }
    }
    /* comment
    const selectedItem = this.costItemsList.find(item => item._id === this.formAddLots.controls["item"].value);
    if (this.checkBidType !== 'individualPrice') {
      if (selectedItem) {
        const newItem: any = {
          group: "grupo",
          item: selectedItem.name || "",
          quantity: this.formAddLots.controls["quantity"].value,
          unitMeasure: selectedItem.unitMeasure!,
          specification: selectedItem.specification
        };
        this.item.push(newItem);
        this.formAddLots.controls["item"].reset()
        this.formAddLots.controls["quantity"].reset();
        this.formAddLots.markAsPristine();
      }
    } else {

      if (selectedItem) {
        const newItem: any = {
          group: "grupo",
          item: selectedItem.name || "",
          quantity: this.formAddLots.controls["quantity"].value,
          unitMeasure: selectedItem.unitMeasure!,
          specification: selectedItem.specification
        };

        const newAllotment: AllotmentRequestDto = {
          allotment_name: this.formModel.controls["description"].value,
          days_to_delivery: this.formDate.controls["closureDate"].value,
          place_to_delivery: this.formDate.controls["deliveryPlace"].value,
          quantity: this.formAddLots.controls["quantity"].value,
          files: this.supplierImg,
          add_item: [newItem],
          isSectionOpen: false
        };


        this.lots.push({ ...newAllotment });


        this.item = [];
        this.pdfFileLote.nativeElement.value = "";
        this.formAddLots.reset();
        this.supplierImg = "";


      }
      this.itemSelected = true
    }
    */
    
    //const selectedItem = this.lotItemsList.find(item => item.id === idLotItem);    

    if (this.checkBidType !== 'individualPrice') {
      
      if (selectedItem) {

        const newItem: any = {
          group: selectedItem.group,
          name: selectedItem.name || "",
          quantity: selectedItem.quantity,
          unit: selectedItem.unit,
          specification: ""
        };        
                     
      }
    } else {

      if (selectedItem) {
        const newItem: any = {
          group: selectedItem.group,
          name: selectedItem.name || "",
          quantity: selectedItem.quantity,
          unit: selectedItem.unit,
          specification: ""
        };

        const newAllotment: AllotmentRequestDto = {
          allotment_name: this.formModel.controls["description"].value,
          days_to_delivery: this.formDate.controls["closureDate"].value,
          place_to_delivery: this.formDate.controls["deliveryPlace"].value,
          quantity: this.formAddLots.controls["quantity"].value,
          files: this.supplierImg,
          add_item: [newItem],
          isSectionOpen: false
        };

        this.lots.push({ ...newAllotment });
        this.pdfFileLote.nativeElement.value = "";      
        this.supplierImg = "";

      }
      this.itemSelected = true
    }      

    this.formAddLots.controls['quantity'].setValue(0)      

  }

  getItemName(itemId: string): string {
    const item = this.costItemsList.find(item => item._id === itemId);
    return item && item.name ? item.name : "";
  }

  changeAgreement(insurance: string) {
    this.insuranceId = insurance;
   
    this.convenioService.getConvenioById(insurance).subscribe({
      next: data => {
        this.workPlanId = data.workPlan;
      },
      error: error => {
        console.error(error.error.message);
      },
    });

    this.classification = [];

    this.formModel.patchValue({
      classification: ''
    });

    this.formAddLots.patchValue({
      item: ''
    });

    let convenioIndex = this.convenioList.findIndex((el: any) => el._id == this.formModel.controls['insurance'].value);
    for (const workPlan of this.convenioList[convenioIndex].workPlan) {
      const categorys = workPlan.product.map((a: any) => a.costItems?.category?.category_name);
      for (const category of categorys) {
        if (!this.classification.includes(category)) {
          this.classification.push(category);
        }
      }
    }
    
    /* comment */
    /*
    this.costItemsList = [];
    for (const workPlan of this.convenioList[convenioIndex].workPlan) {
        
      const costItems = workPlan.product.map((a: any) => a.costItems);
      for (const item of costItems) {
        this.costItemsList.push(item);
      }
    }
    */
    
  }

  changeClassification() {
    
    this.costItemsListFilter = [];
    this.costItemsListFilter = this.costItemsList.filter((a: any) => a.group?.category_name == this.formModel.controls['classification'].value);
    
    // Delete items that are not in the workplan
    let _id
    let array = [];       
    for(let t=0;t<this.costItemsListFilter.length;t++){        
      _id = this.costItemsListFilter[t]._id
      for (let i = 0; i < this.workPlanId.length; i++) {
        for (let x = 0; x < this.workPlanId[i].product.length; x++) {          
          const item = this.workPlanId[i].product[x];        
          if (item.costItems === _id) {                    
            array.push(this.costItemsListFilter[t])
            this.lotItemsList.push({              
              "name": this.costItemsListFilter[t].name,
              "quantity": item.quantity,
              "unit": item.unit,
              "group": this.costItemsListFilter[t].group.segment
            })            
          }
        }
      }
      
    }
    
    const dataArr = new Set(array)
    this.costItemsListFilter = [...dataArr];

    const dataArrLotList = new Set(this.lotItemsList)
    this.lotItemsList = [...dataArrLotList];            

    for(let i=0;i<this.lotItemsList.length;i++){
      this.lotItemsList[i].id = SHA256(this.lotItemsList[i].name+this.lotItemsList[i].quantity+this.lotItemsList[i].unit+new Date()).toString(enc.Hex);      
    }



    /* comment
    for (const costItem of this.costItemsList) {
      if (costItem?.group?.category_name == this.formModel.controls['insurance'].value) {
        this.costItemsListFilter.push(costItem);
      }
    } 
    */        
    
    this.supplierList = [];

    for (let item of this.userList) {
      for (let iterator of item.categories) {
        if (iterator.category_name === this.formModel.controls['classification'].value) {
          if (item.blocked === false) {
            this.supplierList.push(item);
          }
        }
      }
    }    

  }

  updateWorkPlan() {

    if (this.itemsAdded.length === 0) return;

      for (let iterator of this.itemsAdded) {
        this.workPlanService.update(iterator.workplanId, iterator).subscribe({
          next: data => {
            
          },
          error: error => {
            console.error(error.error.message);
          },
        });
      }

  }

  addLot() {    
    if (this.checkBidType !== 'individualPrice') {      
      if (this.item.length > 0) {        
        const newAllotment: AllotmentRequestDto = {
          allotment_name: this.formAddLots.controls["batchName"].value,
          days_to_delivery: this.daysToDelivery || this.formAddLots.controls["deliveryTimeDays"].value,
          place_to_delivery: this.placeToDelivery || this.formAddLots.controls["deliveryPlaceLots"].value,
          quantity: this.formAddLots.controls["quantity"].value,
          files: this.supplierImg,
          add_item: [...this.item],
          isSectionOpen: false
        };

        this.lots.push({ ...newAllotment });        

        this.item = [];
        this.pdfFileLote.nativeElement.value = "";        
        this.supplierImg = "";

      } else {

        let errorMessage = 'É necessário adicionar pelo menos um item ao lote';

        switch (this.storedLanguage) {
          case 'pt':
            errorMessage = 'É necessário adicionar pelo menos um item ao lote'
            break;
          case 'en':
            errorMessage = 'You must add at least one item to the batch'
            break;
          case 'fr':
            errorMessage = "Vous devez ajouter au moins un article au lot"
            break;
          case 'es':
            errorMessage = 'Debe agregar al menos un artículo al lote'
            break;
        }

        this.toastrService.error(errorMessage, "", { progressBar: true });
      }
      this.formAddLots.markAsPristine();

      this.formAddLots.patchValue({
        deliveryTimeDays: this.formDate.controls['executionDays'].value,
        deliveryPlaceLots: this.formDate.controls['deliveryPlace'].value
      })
    }
  }

  getYear(event: any, formName: string) {

    const yearNow = new Date().getTime()
    const selectDate = new Date(event.target.value).getTime()


    if (formName === 'closureDate') {
      if (!this.formDate.controls['initialDate'].value) {
        this.formDate.controls['closureDate'].reset()
      }
    } else {
      this.formDate.controls['closureDate'].reset()

    }

  }

  removeLot(index: number) {    
    if(this.checkBidType == "individualPrice"){
      this.item.splice(index,1)
    }    
    this.lots.splice(index,1)
    if(!this.lots.length && this.miInputFile) {
      this.fileName = "-"
      this.itemFile = null;
      this.miInputFile.nativeElement.value = '';
    }
  }

  editAllotment(event: any) {
    switch (event.target.id) {
      case 'batchName':
        this.lots[this.lotNumber].allotment_name = event.target.value;

        break
      case 'deliveryTimeDays':
        this.lots[this.lotNumber].days_to_delivery = event.target.value
        break
      case 'deliveryPlaceLots':
        this.lots[this.lotNumber].place_to_delivery = event.target.value
        break
      default:
    }

  }

  addAllotmentItem(item: any) {

    const selectedItem = this.costItemsList.find(item => item._id === this.formAddLots.controls["item"].value);

    if (selectedItem) {
      const newItem: any = {
        group: "grupo",
        item: selectedItem.name || "",
        quantity: this.formAddLots.controls["quantity"].value,
        unitMeasure: selectedItem.unitMeasure || "",
        specification: selectedItem.specification
      };

      this.lots[this.lotNumber].add_item.push(newItem);


    }
  }

  onSelectFileAllotment(event: any) {

    for (let i = 0; i < event.target.files.length; i++) {
      this.totalFiles.push(event.target.files[i]);
    }

    if (event.target.files && event.target.files[0]) {
      this.notImage = false;
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.supplierImg = event.target.result as string;

        };
        reader.readAsDataURL(event.target.files[i]);

      }
    }

  }

  removeAllotmentItem(index: number) {
    this.lots[this.lotNumber].add_item.splice(index, 1)

  }

  editBatch(event: any, index: number) {
    this.lotNumber = index


  }

  saveChanges() {
    this.disableEditLot = !this.disableEditLot

    this.lots[this.lotNumber].files = this.supplierImg
  }

  editLot(index: number) {

    this.lotNumber = index;
    this.disableEditLot = !this.disableEditLot;
    this.lotToEdit = this.lots[index];

    const item = this.costItemsListFilter.filter(el => el.name === this.lotToEdit.add_item[0].item);


    this.formAddLots.patchValue({
      batchName: this.lotToEdit.allotment_name,
      deliveryTimeDays: this.lotToEdit.days_to_delivery,
      deliveryPlaceLots: this.lotToEdit.place_to_delivery,
      quantity: this.lotToEdit.add_item[0].quantity,
      item: item[0]._id,
    });

  }

  editItem(item: any) {
    this.editItemControl = true;
    this.editItemSelect = item;
    for (let iterator of this.costItemsListFilter) {
      if (iterator.name === item.item) {
        this.formAddLots.patchValue({
          quantity: item.quantity,
          item: iterator._id,
        })
      }
    }
  }

  deleteItem(item: any) {
    let filter = this.lotToEdit.add_item.indexOf(item);
    this.lotToEdit.add_item.splice(filter, 1);
  }

  editItemSelected() {
    let filter = this.lotToEdit.add_item.indexOf(this.editItemSelect);
    this.lotToEdit.add_item[filter].quantity = this.formAddLots.controls['quantity'].value;

    this.formAddLots.patchValue({
      quantity: 0,
      item: ''
    })
  }

  saveEdit() {


    // const index = this.lots.indexOf(this.lotToEdit);
    // if (index > -1) {
    //   this.lots.splice(index, 1);
    // }

    const selectedItem = this.costItemsList.find(item => item._id === this.formAddLots.controls["item"].value);

    if (selectedItem) {
      const newItem: any = {
        group: "grupo",
        item: selectedItem.name || "",
        quantity: this.formAddLots.controls["quantity"].value,
        unitMeasure: selectedItem.unitMeasure || "",
        specification: selectedItem.specification
      };

      this.lots[this.lotNumber].add_item.push(newItem);

    }
    
    this.disableEditLot = !this.disableEditLot
  }

  checkValue(event: any) {
    if (event.target.value < 0) {
      event.target.value = 0
    }
  }

  setLot(event: any) {
    if (event.target.id === 'executionDays') {
      this.daysToDelivery = event.target.value


    }
    if (event.target.id === 'deliveryPlace') {
      this.placeToDelivery = event.target.value

    }

    if (event.target.id === 'deliveryPlaceLots') {
      this.placeToDelivery = event.target.value

    }

    if (event.target.id === 'deliveryTimeDays') {
      this.daysToDelivery = event.target.value
    }



  }

  removeItem(index: number) {
    
    this.item.splice(index,1)
    this.lots.splice(index,1)      
        
    // tipo de licitación = 'individualPrice', Si no hay items no hay lotes
    if(this.item.length === 0) {
      this.formAddLots.controls["batchName"].enable()
      this.formAddLots.controls["deliveryTimeDays"].enable()
      this.formAddLots.controls["deliveryPlaceLots"].enable()      
      if(this.miInputFile) {
        this.fileName = "-"
        this.itemFile = null;
        this.miInputFile.nativeElement.value = '';
      }
    }
    
  }

  differenceInDays(date: string) {
    const splitedDate = date.split('-');
    const futureDate = new Date(+splitedDate[0], +splitedDate[1], +splitedDate[2]);;
    var now = new Date();
    let difference = futureDate.getTime() - now.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
  }

  toggleSectionAllotment(allotment: AllotmentRequestDto) {
    allotment.isSectionOpen = !allotment.isSectionOpen;
  }
}

