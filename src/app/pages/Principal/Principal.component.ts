import { Component, OnInit } from "@angular/core";
import { PeopleService } from "./services/people.service";

interface Person {
  valueOne: string;
  valueTwo: string;
  valueThree: string;
  valueFour: string;
}

@Component({
  selector: "app-Principal",
  templateUrl: "./Principal.component.html",
  styleUrls: ["./Principal.component.css"],
})

export class PrincipalComponent implements OnInit {
  [x: string]: Object;
  public listPeople: any = [];
  public arrayPosition: any = [];
  public filteredResults: any = [];
  public originalList: any = [];
  public data: boolean = false;
  public position: number = 0;
  public showWindow: boolean = false;
  public showConfirmation: boolean = false;
  public newText = "";
  public newValue = false;
  public newIcon = "";
  public userUpdate = "";
  public searchTerm: string = "";


  // Expresiones regulares
  textoRegExp = /^[A-Za-z\s]+$/;
  numeroRegExp = /^[0-9]+/;

  // Input fields for create operation
  public inputCreateOne: string = "";
  public inputCreateTwo: string = "";
  public inputCreateThree: string = "";
  public inputCreateFour: string = "";

  // Input fields for update operation
  public inputUpdateOne: string = "";
  public inputUpdateTwo: string = "";
  public inputUpdateThree: string = "";
  public inputUpdateFour: string = "";

  constructor(private peopleSvc: PeopleService) {}

  ngOnInit(): void {
    this.loadData();
  }

  public loadData() {
    this.resetInputFields();
    this.peopleSvc.get(`http://localhost:3000/api/data`).subscribe((res) => {
      this.originalList = res;
      this.listPeople = res;
      this.data = res === null;
    });
  }

  public search(term: string) {
    console.log("Término de búsqueda:", term);
    if (term.trim() === "") {
      // Si el término de búsqueda está vacío, mostrar todos los resultados originales.
      this.listPeople = this.originalList;
    } else {
      // Filtrar la lista de personas utilizando el método some.
      this.listPeople = this.originalList.filter((person: Person )=>
        Object.values(person).some(value =>
          String(value).toLowerCase().includes(term.toLowerCase())
        )
      );
    }
  }
  
  

  public createData() {
    if (
      !this.validateInputFields(
        this.inputCreateOne,
        this.inputCreateTwo,
        this.inputCreateThree,
        this.inputCreateFour
      )
    ) {
      return;
    }

    const createObject = {
      valueOne: this.inputCreateOne,
      valueTwo: this.inputCreateTwo,
      valueThree: this.inputCreateThree,
      valueFour: this.inputCreateFour,
    };

    this.peopleSvc
      .post("http://localhost:3000/api/send", createObject)
      .subscribe((res) => {
        this.modalRes("Cliente Creado!", true);
        this.loadData();
      });
  }

  public updateData() {
    if (
      !this.validateInputFields(
        this.inputUpdateOne,
        this.inputUpdateTwo,
        this.inputUpdateThree,
        this.inputUpdateFour
      )
    ) {
      return;
    }

    let index = this.position;
    const updateObject = {
      valor1: this.inputUpdateOne,
      valor2: this.inputUpdateTwo,
      valor3: this.inputUpdateThree,
      valor4: this.inputUpdateFour,
    };
    const apiUrl = `http://localhost:3000/api/update/${index}`;

    this.peopleSvc.put(apiUrl, updateObject).subscribe((res) => {
      this.modalRes("Cliente Actualizado", true);
      this.loadData();
    });
  }

  public deleteData() {
    let index = this.position;
    this.showConfirmation = false;
    this.peopleSvc
      .delete(`http://localhost:3000/api/delete/${index}`)
      .subscribe(() => {
        this.modalRes("Cliente Eliminado", true);
        this.loadData();
      });
  }

  public updateInputs(i: number) {
    this.position = i;
    this.arrayPosition = this.listPeople[i];
    this.setUpdateInputFields(this.arrayPosition);
    this.position = i;
  }

  public informationLimit(event: any, maxLength: number) {
    if (event.target.value.length > maxLength) {
      event.target.value = event.target.value.slice(0, maxLength);
    }
  }

  public cancelarConfirmar() {
    this.showConfirmation = false;
  }

  public confirm() {
    if (
      this.inputUpdateOne.length === 0 ||
      this.inputUpdateTwo.length === 0 ||
      this.inputUpdateThree.length === 0 ||
      this.inputUpdateFour.length === 0
    ) {
      this.modalRes("Seleccione un cliente para Eliminar", false);
    } else {
      this.showConfirmation = true;
      let index = this.position;
      this.arrayPosition = this.listPeople[index];
      let user = this.arrayPosition[2];
      this.userUpdate = user;
    }
  }

  public modalRes(text: string, value: boolean) {
    this.showWindow = false;
    let icon = value ? "✔️" : "❌";
    this.newText = text;
    this.newValue = value;
    this.newIcon = icon;
    this.showWindow = true;
    setTimeout(() => {
      this.showWindow = false;
    }, 3500);
  }

  private resetInputFields() {
    this.inputCreateOne = "";
    this.inputCreateTwo = "";
    this.inputCreateThree = "";
    this.inputCreateFour = "";
    this.inputUpdateOne = "";
    this.inputUpdateTwo = "";
    this.inputUpdateThree = "";
    this.inputUpdateFour = "";
  }

  private setUpdateInputFields(data: any) {
    this.arrayPosition = data;
    this.inputUpdateOne = data[0];
    this.inputUpdateTwo = data[1];
    this.inputUpdateThree = data[2];
    this.inputUpdateFour = data[3];
  }

  private validateInputFields(
    input1: string,
    input2: string,
    input3: string,
    input4: string
  ): boolean {
    if (
      input1.length === 0 ||
      input2.length === 0 ||
      input3.length === 0 ||
      input4.length === 0
    ) {
      this.modalRes("No se permiten campos vacíos", false);
      return false;
    } else if (!this.numeroRegExp.test(input1)) {
      this.modalRes("En Servicio solo se permiten números", false);
      return false;
    } else if (!this.numeroRegExp.test(input2)) {
      this.modalRes("En Identificación solo se permiten números", false);
      return false;
    } else if (!this.numeroRegExp.test(input4)) {
      this.modalRes("En Télefono solo se permiten números", false);
      return false;
    } else if (!this.textoRegExp.test(input3)) {
      this.modalRes("En el campo nombre solo se permite texto", false);
      return false;
    } else if (input2.length !== 10) {
      this.modalRes("Ingrese una identificación válida", false);
      return false;
    } else if (input4.length !== 10) {
      this.modalRes("Ingrese un teléfono válido", false);
      return false;
    }
    return true;
  }
}
