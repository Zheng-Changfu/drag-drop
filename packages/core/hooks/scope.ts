export class Scope {
  _active = true

  get active() {
    return this._active
  }

  pause() {
    this._active = false
  }

  resume() {
    this._active = true
  }
}
