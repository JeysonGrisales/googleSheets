import { Component, OnInit } from "@angular/core"
import { PeopleService } from "./services/people.service";

@Component({
    selector: 'app-Principal',
    templateUrl: './Principal.component.html',
    styleUrls: ['./Principal.component.css']
})

export class PrincipalComponent implements OnInit {
    public listPeople: any = [];
    public tempArray: any = []
    data: boolean = false;
    posicionActual: number = 0
    showWindow: boolean = false
    showConfirmation: boolean = false
    newText = ""
    newValue = false
    newIcon = ""
    userUpdate = ""
    //Expresión regular que solo permite texto
    textoRegExp = /^[A-Za-z\s]+$/;
    //Expresión regular que solo permite números
    numeroRegExp = /^[0-9]+$/

    //Inputs de crear
    public inputCreate1: string = '';
    public inputCreate2: string = '';
    public inputCreate3: string = '';
    public inputCreate4: string = '';
    //input de edicion
    public manageInput1: string = '';
    public manageInput2: string = '';
    public manageInput3: string = '';
    public manageInput4: string = '';

    constructor(private peopleSvc: PeopleService) { }

    ngOnInit(): void {
        this.loadData();
    }

    //////////Metodos//////////

    //Cargar usuarios

    public loadData() {

        this.inputCreate1 = ""
        this.inputCreate2 = ""
        this.inputCreate3 = ""
        this.inputCreate4 = ""

        this.manageInput1 = ""
        this.manageInput2 = ""
        this.manageInput3 = ""
        this.manageInput4 = ""

        this.peopleSvc.get(`http://localhost:3000/api/data`).subscribe(res => {
            this.listPeople = res;
            this.data = res === null;
        });
    }

    //Crear usuarios

    public createData() {

        if (this.inputCreate1.length === 0 || this.inputCreate2.length === 0 || this.inputCreate3.length === 0 || this.inputCreate4.length === 0) {
            this.ventanaEmergente("No se permiten campos vacíos", false);
        } else if (!this.numeroRegExp.test(this.inputCreate1)) {
            this.ventanaEmergente("En Servicio solo se permiten números", false)
        }else if (!this.numeroRegExp.test(this.inputCreate2)) {
            this.ventanaEmergente("En Identificación solo se permiten números", false)
        } else if (!this.numeroRegExp.test(this.inputCreate4)) {
            this.ventanaEmergente("En Télefono solo se permiten números", false)
        } else if (!this.textoRegExp.test(this.inputCreate3)) {
            this.ventanaEmergente("En el campo nombre solo se permite texto", false)
        } else if (this.inputCreate2.length !== 10) {
            this.ventanaEmergente("Ingrese una identificación valida", false);
        } else if (this.inputCreate4.length !== 10) {
            this.ventanaEmergente("Ingrese un télefono valido", false);
        } else {
            const createObject = {
                valor1: this.inputCreate1,
                valor2: this.inputCreate2,
                valor3: this.inputCreate3,
                valor4: this.inputCreate4
            };

            this.peopleSvc.post('http://localhost:3000/api/send', createObject)
                .subscribe(res => {
                    this.ventanaEmergente("Cliente Creado!", true);
                    this.loadData()
                });
        }
    }

    //Actualizar usuarios

    public updateData() {

        if (this.manageInput1.length === 0 || this.manageInput2.length === 0 || this.manageInput3.length === 0 || this.manageInput4.length === 0) {
            this.ventanaEmergente("No se permiten campos vacíos", false);
        } else if (!this.numeroRegExp.test(this.manageInput1)) {
            this.ventanaEmergente("En Servicio solo se permiten números", false)
        } else if (!this.numeroRegExp.test(this.manageInput2)) {
            this.ventanaEmergente("En Identificación solo se permiten números", false)
        } else if (!this.numeroRegExp.test(this.manageInput4)) {
            this.ventanaEmergente("En Télefono solo se permiten números", false)
        } else if (!this.textoRegExp.test(this.manageInput3)) {
            this.ventanaEmergente("En el campo nombre solo se permite texto", false)
        } else if (this.manageInput2.length !== 10) {
            this.ventanaEmergente("Ingrese una identificación valida", false);
        } else if (this.manageInput4.length !== 10) {
            this.ventanaEmergente("Ingrese una télefono valido", false);
        } else {
            let index = this.posicionActual


            const updateObject = {
                valor1: this.manageInput1,
                valor2: this.manageInput2,
                valor3: this.manageInput3,
                valor4: this.manageInput4
            };

            const apiUrl = `http://localhost:3000/api/update/${index}`;
            this.peopleSvc.put(apiUrl, updateObject).subscribe(
                (res) => {
                    this.ventanaEmergente("Cliente Actualizado!", true);
                    this.loadData()
                }
            );
        }
    }

    //Eliminar usuarios

    public deleteData() {
        let index = this.posicionActual
        this.showConfirmation = false
        this.peopleSvc.delete(`http://localhost:3000/api/delete/${index}`).subscribe(() => {
            this.ventanaEmergente("Cliente Eliminado", true);
            this.loadData()
        });
    }

    public confirmar() {
        if (this.manageInput1.length === 0 || this.manageInput2.length === 0 || this.manageInput3.length === 0 || this.manageInput4.length === 0) {
            this.ventanaEmergente("Seleccione un cliente para Eliminar", false);
        } else {
            this.showConfirmation = true
            let index = this.posicionActual
            this.tempArray = ""
            this.tempArray = this.listPeople[index]
            let user = this.tempArray[2]
            this.userUpdate = user
        }
    }

    public cancelarConfirmar() {
        this.showConfirmation = false
    }

    ////////Demas logica////////

    //Actualizar inputs

    public updateInputs(i: number) {
        this.posicionActual = i
        this.tempArray = ""
        this.tempArray = this.listPeople[i]
        this.manageInput1 = this.tempArray[0]
        this.manageInput2 = this.tempArray[1]
        this.manageInput3 = this.tempArray[2]
        this.manageInput4 = this.tempArray[3]
        this.posicionActual = i
    }

    //Ventana emergente

    public ventanaEmergente(text: string, value: boolean) {
        this.showWindow = false
        let icon = ""
        let cronometro
        clearTimeout(cronometro)
        value === true ? icon = "✔️" : icon = "❌"
        this.newText = text
        this.newValue = value
        this.newIcon = icon
        this.showWindow = true

        cronometro = setTimeout(() => {
          this.showWindow = false
      }, 3500);
    }

    public limitarLongitud(event: any, maxLength: number) {
        if (event.target.value.length > maxLength) {
            event.target.value = event.target.value.slice(0, maxLength);
        }
    }
}
