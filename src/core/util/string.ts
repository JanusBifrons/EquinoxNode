interface String {
    /**
     * Determines if this string matches another.
     * @param {string | Guid} s String or Guid to match
     * @param {StringComparison} sc? Comparison option (case sensitivity)
     */
    equals(s: string | Guid, sc?: StringComparison): boolean;

    /**
     * Does this string contain another string?
     * @param {string} contains String to match within current string
     */
    contains(contains: string): boolean;
}    

interface StringConstructor {
    /**
     * Indicates whether the specified string is null or an Empty string.
     * @param {string} str The string to test
     */
    isNullOrEmpty(str: string): boolean;

	/**
	 * Indicates whether a specified string is null, empty, or consists only of white-space characters.
	 * @param {string} str The string to test
	 */
    isNullOrWhiteSpace(str: string): boolean;

    /**
     * The value of an empty string
     */
	empty: string;

	/**
	 * Replaces one or more format items in a specified string with the string representation of a specified object.
	 * @param {string} format Format string
	 * @param {any[]} ...params objects to replace into format
	 */
    format(format: string, ...params: any[]): string;
}

const enum StringComparison {
    CaseSensitive = 0,
    CaseInsensitive = 1,
    OrdinalIgnoreCase = 1,
    InvariantCultureIgnoreCase = 1
}

if (typeof String.prototype.equals !== 'function') {
    String.prototype.equals = function (s, cm) {
        if (s instanceof Guid) {
            return this.toUpperCase() === s.toString().toUpperCase();
        }
        else if (!hasValue(s)) {
            return false;
        }
        else {
            switch (cm) {
                case StringComparison.CaseInsensitive:
                    return this.toUpperCase() === s.toUpperCase();
                default://case sensitive
                    return this.valueOf() === s.valueOf();
            }
        }
    }
}

if (typeof String.prototype.contains !== 'function') {
    String.prototype.contains = function (contains) {
        return (this.indexOf(contains) >= 0);
    }
}

if (typeof String.format !== 'function') {
    String.format = function (format: string) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)(:*)([\w#,/]*)}/g, function (match, number) {
            if (args[number] == null) {
                return String.empty;
            } else {
                if (match.contains(":")) {
                    let rawMatch: any = args[number];
                    let formatChars: any = match.split(":")[1].split("}")[0];

                    if (typeof rawMatch === 'string') {
                        return typeof args[number] != 'undefined' ? args[number] : match;
                    }
                } else {
                    return typeof args[number] != 'undefined' ? args[number] : match;
                }
            }
        });
    };
}


if (typeof String.isNullOrEmpty !== 'function') {
    String.isNullOrEmpty = (str: string) => !str;
}
else {
    throw new Error("This dialog cannot start due to a compatibility issue (1). Please contact CML Support.");
}

if (typeof String.isNullOrWhiteSpace !== 'function') {
    String.isNullOrWhiteSpace = (str: string) => { return (!str || (str.trim().length <= 0)) };
}
else {
    throw new Error("This dialog cannot start due to a compatibility issue (1). Please contact CML Support.");
}

if (typeof String.empty !== 'string') {
    String.empty = "";
}
else {
    throw new Error("This dialog cannot start due to a compatibility issue (1). Please contact CML Support.");
}