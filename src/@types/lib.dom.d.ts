/**
 * Enhance DOM event interfaces to accept CustomElement. All of these already accept
 * CustomEvent, but the DOM libraries only accept Event objects in their types.
 * Since each member in the hierarchy redeclares these functions, we have to redeclare
 * the interface for each of them.
 *
 * Covers the following types:
 * ```
 * EventTarget <- Window
 *                Node   <- Document
 *                          DocumentFragment <- ShadowRoot
 *                          Element          <- HTMLElement
 * ```
 *
 * For other types that may need the enhancement (anything ultimately deriving from
 * EventTarget, such as Notification, XMLHttpRequest, etc.), a type-cast might suffice:
 * ```typescript
 * (new EventTargetDerived() as EventTarget)
 *   .addEventListener("my-event", (evt: CustomEvent<MyCustomEvent>) => {});
 * ```
 *
 */

declare global {
  interface CustomEventListener {
    (evt: CustomEvent): void;
  }

  interface CustomEventListenerObject {
    handleEvent(evt: CustomEvent): void;
  }

  interface EventTarget {
    addEventListener(
      type: string,
      callback: CustomEventListener | CustomEventListenerObject | null,
      options?: AddEventListenerOptions | boolean,
    ): void;
    dispatchEvent(event: CustomEvent): boolean;
    removeEventListener(
      type: string,
      callback: CustomEventListener | CustomEventListenerObject | null,
      options?: EventListenerOptions | boolean,
    ): void;
  }

  interface Window {
    addEventListener(
      type: string,
      callback: CustomEventListener | CustomEventListenerObject | null,
      options?: AddEventListenerOptions | boolean,
    ): void;
    dispatchEvent(event: CustomEvent): boolean;
    removeEventListener(
      type: string,
      callback: CustomEventListener | CustomEventListenerObject | null,
      options?: EventListenerOptions | boolean,
    ): void;
  }

  interface Node {
    addEventListener(
      type: string,
      callback: CustomEventListener | CustomEventListenerObject | null,
      options?: AddEventListenerOptions | boolean,
    ): void;
    dispatchEvent(event: CustomEvent): boolean;
    removeEventListener(
      type: string,
      callback: CustomEventListener | CustomEventListenerObject | null,
      options?: EventListenerOptions | boolean,
    ): void;
  }

  interface Document {
    addEventListener(
      type: string,
      callback: CustomEventListener | CustomEventListenerObject | null,
      options?: AddEventListenerOptions | boolean,
    ): void;
    dispatchEvent(event: CustomEvent): boolean;
    removeEventListener(
      type: string,
      callback: CustomEventListener | CustomEventListenerObject | null,
      options?: EventListenerOptions | boolean,
    ): void;
  }

  interface DocumentFragment {
    addEventListener(
      type: string,
      callback: CustomEventListener | CustomEventListenerObject | null,
      options?: AddEventListenerOptions | boolean,
    ): void;
    dispatchEvent(event: CustomEvent): boolean;
    removeEventListener(
      type: string,
      callback: CustomEventListener | CustomEventListenerObject | null,
      options?: EventListenerOptions | boolean,
    ): void;
  }

  interface ShadowRoot {
    addEventListener(
      type: string,
      callback: CustomEventListener | CustomEventListenerObject | null,
      options?: AddEventListenerOptions | boolean,
    ): void;
    dispatchEvent(event: CustomEvent): boolean;
    removeEventListener(
      type: string,
      callback: CustomEventListener | CustomEventListenerObject | null,
      options?: EventListenerOptions | boolean,
    ): void;
  }

  interface Element {
    addEventListener(
      type: string,
      callback: CustomEventListener | CustomEventListenerObject | null,
      options?: AddEventListenerOptions | boolean,
    ): void;
    dispatchEvent(event: CustomEvent): boolean;
    removeEventListener(
      type: string,
      callback: CustomEventListener | CustomEventListenerObject | null,
      options?: EventListenerOptions | boolean,
    ): void;
  }

  interface HTMLElement {
    addEventListener(
      type: string,
      callback: CustomEventListener | CustomEventListenerObject | null,
      options?: AddEventListenerOptions | boolean,
    ): void;
    dispatchEvent(event: CustomEvent): boolean;
    removeEventListener(
      type: string,
      callback: CustomEventListener | CustomEventListenerObject | null,
      options?: EventListenerOptions | boolean,
    ): void;
  }

  type EventWithTarget<T, E extends Event = Event> = E & { target: T | null };
  type CustomEventWithTarget<C, T> = CustomEvent<C> & { target: T | null };
}

export {};
