import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  pure: true,
})
export class SearchPipe implements PipeTransform {
  static forRoot(): any[] | import("@angular/core").Type<any> {
    throw new Error('Method not implemented.');
  }

  transform(languages: string[], searchInput: string): any[] {
    if (!searchInput) {
      return [];
    }

    searchInput = searchInput.toLowerCase();
    return languages.filter(
      x => x.toLowerCase().includes(searchInput)
    )
  }
}
