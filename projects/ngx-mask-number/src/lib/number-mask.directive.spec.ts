import { NgxNumberMaskDirective } from './number-mask.directive';
import { ElementRef, Renderer2 } from '@angular/core';

describe('NgxNumberMaskDirective', () => {
  let directive: NgxNumberMaskDirective;

  beforeEach(() => {
    // Mock ElementRef and Renderer2
    const mockElement = document.createElement('input');
    const mockElementRef = new ElementRef<HTMLInputElement>(mockElement);

    const mockRenderer: Renderer2 = {
      setAttribute: () => {},
    } as unknown as Renderer2;;

    directive = new NgxNumberMaskDirective(mockElementRef, mockRenderer);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
