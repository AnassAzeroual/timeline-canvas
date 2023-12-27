import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {
i = 0
  constructor() {
  }

  randomHexColor(colorsToAvoid:string[] = []) {
    let colors: string[] = [
      "#000000", "#001F3F", "#228B22", "#8B0000", "#FF8C00",
      "#9400D3", "#008080", "#D2691E", "#d41e1e", "#708090",
      "#4B0082", "#800000", "#A0522D", "#008B8B", "#483D8B",
      "#8B4513", "#556B2F", "#191970", "#B22222", "#4682B4"
    ];
    colors = colors.filter(v => !colorsToAvoid.includes(v))
    console.log(colors.length);
    
    for (let i = colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colors[i], colors[j]] = [colors[j], colors[i]];
    }
    const randomIndex = Math.floor(Math.random() * colors.length);

    return colors[randomIndex];
  }

}
