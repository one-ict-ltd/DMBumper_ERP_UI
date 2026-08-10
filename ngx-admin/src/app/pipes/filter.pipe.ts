import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    debugger;
    transform(items: any[], searchText: string): any[] {
        if (!items) {
            return [];
        }
        if (!searchText) {
            return items;
        }

        searchText = searchText.toLowerCase();
        return items.filter(item => {
            // Implement your search logic based on item properties
            // For example, assuming each item has a 'name' property:
            //return item.partyName.toLowerCase().includes(searchText);
            return JSON.stringify(item).toLowerCase().includes(searchText);
        });
    }
}