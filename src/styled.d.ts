import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    dark: {
      fontColor: string;
      borderColor: string;
    };
    light: {
      fontColor: string;
      borderColor: string;
    };
  }
}
