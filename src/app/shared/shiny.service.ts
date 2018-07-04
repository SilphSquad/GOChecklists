import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from "@angular/common/http";
import { map } from "rxjs/operators";

import { Shiny } from "./shiny.model";
import { ShinyHelper } from "./shiny-helper";

@Injectable()
export class ShinyService {
  public shinies = new Array<Shiny>();
  helper = new ShinyHelper();

  constructor(private http: HttpClient) {}

  getShinies() {
    return this.http.get("https://baas.kinvey.com/appdata/kid_H1_cK1DWQ/Shinies", {
      headers: this.getHeaders(), params: { "sort": "id" }
    })
    .pipe(
      map((data) => {
        let shinies = <Shiny[]>data;
        let ownedArray = this.getOwnedData();
        this.rearrangeBabies(shinies);
        this.shinies = [];

        shinies.forEach((shiny) => {
          let owned = false;
          ownedArray.forEach((ownedId) => {
            if (ownedId == shiny.id) {
              owned = true;
            }
          })
          this.shinies.push(new Shiny(shiny.name, shiny.id, owned));
        });
      })
    );
  }

  toggleShinyOwned(index) {
    this.shinies[index].owned = !this.shinies[index].owned;
    this.saveOwnedData();
  }

  private saveOwnedData() {
    let saved = [];
    this.shinies.forEach((shiny) => {
      if (shiny.owned) {
        saved.push(shiny.id);
      }
    });

    this.helper.save(saved);
  }

  private getOwnedData() {
    let owned = this.helper.read();
    let ownedArray = [];

    if (owned) {
      ownedArray = JSON.parse(owned);
    }

    return ownedArray;
  }

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      "Authorization": "Basic a2lkX0gxX2NLMURXUTozZjExNTVhOGY5ODE0MDBlYTYyMWFkYTczMmViZTFjMQ=="
    };
  }

  private rearrangeBabies(shinies: Shiny[]) {
    let pichuIndex;
    let pikachuIndex;
    for (let i = 0; i < shinies.length; i++) {
      if (shinies[i].id == "172") { pichuIndex = i; }
      if (shinies[i].id == "25") { pikachuIndex = i; }

    }
    this.arrayMove(shinies, pichuIndex, pikachuIndex);

    let magbyIndex;
    let magmarIndex;
    for (let i = 0; i < shinies.length; i++) {
      if (shinies[i].id == "240") { magbyIndex = i; }
      if (shinies[i].id == "126") { magmarIndex = i; }
    }
    this.arrayMove(shinies, magbyIndex, magmarIndex);

    let wynautIndex;
    let wobbuffetIndex;
    for (let i = 0; i < shinies.length; i++) {
      if (shinies[i].id == "360") { wynautIndex = i; }
      if (shinies[i].id == "202") { wobbuffetIndex = i; }
    }
    this.arrayMove(shinies, wynautIndex, wobbuffetIndex);
  }

  private arrayMove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }
}

