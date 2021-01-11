import { Pipe, PipeTransform } from '@angular/core';

/**
 * Given a string, capitalize the very first character.
 *
 * Like the `ucfirst` pipe provided by `ngxpipes`. However, if the first word
 * a string is hyphenated, that pipe mistakenly capitalizes both halves of the
 * hyphenated word. For example, it turns 'narrow-leaved purple coneflower"
 * into "Narrow-Leaved purple coneflower", which is undesired.
 *
 * This pipe isn't smart enough to handle astral-plane characters, though, so
 * careful about that! :)
 */
@Pipe({ name: 'sentenceCase' })
export class SentenceCasePipe implements PipeTransform {
  transform(value: string) {
    if (!value || value.length < 1) {
      return value;
    } else {
      return value.charAt(0).toUpperCase() + value.substring(1);
    }
  }
}
