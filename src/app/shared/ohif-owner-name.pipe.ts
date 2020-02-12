import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ohifOwnerName'
})
export class OhifOwnerNamePipe implements PipeTransform {

  transform(study: any, ...args: any[]): any {
    if (!study) {
      return '';
    }
    
    if (typeof study !== 'object') {
        console.warn(`Expected study object but got ${typeof study}`, study);
        return study;
    }
 
    let names: Set<string> = new Set();
    
    (study.seriesList || []).forEach(series => {
        (series.instances || []).forEach(instance => {
            if (instance.responsiblePersonRole === "OWNER" && !!instance.responsiblePerson) {
                names.add(instance.responsiblePerson);
            }
        });
    });
    
    if (names.size === 0) {
        // Fallback to the patientName extracted by our
        // backend
        names.add(study.patientName);
    }
    
    return Array.from(names.values()).join(", ");
  }

}