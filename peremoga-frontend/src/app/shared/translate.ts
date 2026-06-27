import { Directive } from '@angular/core';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';

export const TRANSLATE_IMPORTS = [TranslatePipe, TranslateDirective] as const;
