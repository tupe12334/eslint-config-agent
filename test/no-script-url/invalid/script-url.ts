// Invalid: a `javascript:` URL string. The text after the scheme is executed
// by the engine exactly as `eval` would run it, so no-script-url flags it. The
// safe form is a real event handler or an `href="#"` with `preventDefault`.
export const link = 'javascript:void(0)'
