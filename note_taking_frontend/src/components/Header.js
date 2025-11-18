import lng from '@lightningjs/core';
import { transitions } from '../utils/ui';

/**
 * PUBLIC_INTERFACE
 * Header component that displays application title and action button slot
 */
/**
 * PUBLIC_INTERFACE
 * Header is a LightningJS component that displays the app title and provides a slot
 * for action elements on the right.
 */
export class Header extends lng.Component {
  static _template() {
    return {
      rect: true,
      color: 0xffffffff,
      h: 64,
      shader: { type: lng.shaders.RoundedRectangle, radius: 12 },
      transitions: { y: transitions.medium, alpha: transitions.medium },
      Background: {
        rect: true,
        w: (w) => w,
        h: 64,
        color: 0x00ffffff,
      },
      TitleWrap: {
        x: 24,
        y: 16,
        Label: {
          text: {
            text: 'Simple Note Keeper',
            fontSize: 24,
            textColor: 0xff111827,
          },
        },
        Sub: {
          y: 28,
          text: {
            text: 'Ocean Professional',
            fontSize: 14,
            textColor: 0xff6b7280,
          },
        },
      },
      Actions: {
        x: (w) => w - 24,
        y: 12,
        mountX: 1,
      },
      TopBorder: {
        rect: true,
        w: (w) => w,
        h: 64,
        colorTop: 0x00ffffff,
        colorBottom: 0x1a000000,
        shader: { type: lng.shaders.Gradient, x0: 0, y0: 0, x1: 0, y1: 64 },
      },
    };
  }

  _init() {
    // Gradient background approximation
    this.tag('Background').patch({
      colorTop: 0x1a2563eb,
      colorBottom: 0xfff9fafb,
      shader: { type: lng.shaders.Gradient, x0: 0, y0: 0, x1: 0, y1: 64 },
    });
  }

  /**
   * PUBLIC_INTERFACE
   * Set title text
   */
  setTitle(title) {
    this.tag('Label').text.text = title;
  }

  /**
   * PUBLIC_INTERFACE
   * Place action content in the header right area
   */
  setActions(content) {
    this.tag('Actions').children = Array.isArray(content) ? content : [content];
  }
}
