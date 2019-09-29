class Guid {

    ///
    /// LOCAL
    ///
    private _sValue: string;

    constructor(sGuid: string = Guid.UUID()) {
        this._sValue = sGuid;
    }

    ///
    /// PRIVATE
    ///

    private uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }

    ///
    /// PUBLIC
    ///

    public toString(): string {
        return this._sValue;
    }

    public equals(gGuid: Guid): boolean {
        if(this._sValue.equals(gGuid._sValue))
            return true;

        return false;
    }

    ///
    /// STATIC
    ///

    static UUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
    }

    static NewGuid(): Guid {
        return new Guid();
    }


}