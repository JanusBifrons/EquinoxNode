var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FireHare;
(function (FireHare) {
    var Camera = /** @class */ (function () {
        function Camera(cContext) {
            this._nFieldOfView = Math.PI / 4.0;
            this._nDistance = 2000.0;
            this._nDistanceSpeed = 10;
            this._cContext = cContext;
            this._aViewport = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                width: 0,
                height: 0,
                scale: [1.0, 1.0]
            };
            this._cLookAt = new FireHare.Vector(0, 0);
            this._nDesiredDistance = this._nDistance;
            this.updateViewport();
        }
        Camera.CAMERA = function () {
            return Camera.SINGLETON;
        };
        Camera.INIT = function (cContext) {
            if (hasValue(Camera.SINGLETON))
                throw new Error("Can only have one instance of Camera");
            Camera.SINGLETON = new Camera(cContext);
        };
        ///
        /// PUBLIC
        ///
        Camera.prototype.update = function () {
            var nDistanceDifference = this._nDistance - this._nDesiredDistance;
            if (Math.abs(nDistanceDifference) > 1)
                this._nDistance -= (nDistanceDifference * 0.05);
            else
                this._nDistance = this._nDesiredDistance;
            if (this._nDistance < 500)
                this._nDistance = 500;
            this.updateViewport();
        };
        Camera.prototype.updateViewport = function () {
            this._nAspectRatio = this._cContext.canvas.width / this._cContext.canvas.height;
            this._aViewport.width = this._nDistance * Math.tan(this._nFieldOfView);
            this._aViewport.height = this._aViewport.width / this._nAspectRatio;
            this._aViewport.left = this._cLookAt.X - (this._aViewport.width / 2.0);
            this._aViewport.top = this._cLookAt.Y - (this._aViewport.height / 2.0);
            this._aViewport.right = this._aViewport.left + this._aViewport.width;
            this._aViewport.bottom = this._aViewport.top + this._aViewport.height;
            this._aViewport.scale[0] = this._cContext.canvas.width / this._aViewport.width;
            this._aViewport.scale[1] = this._cContext.canvas.height / this._aViewport.height;
        };
        ///
        /// PRIVATE
        ///
        Camera.prototype.applyScale = function () {
            this._cContext.scale(this._aViewport.scale[0], this._aViewport.scale[1]);
        };
        Camera.prototype.applyTranslation = function () {
            this._cContext.translate(-this._aViewport.left, -this._aViewport.top);
        };
        ///
        /// PUBLIC
        ///
        Camera.prototype.changeContext = function (cPosition, nRotation) {
            this._cContext.save();
            this._cContext.translate(cPosition.X, cPosition.Y);
            this._cContext.rotate(nRotation);
        };
        Camera.prototype.begin = function () {
            this._cContext.save();
            this.applyScale();
            this.applyTranslation();
        };
        Camera.prototype.end = function () {
            this._cContext.restore();
        };
        Camera.prototype.zoomIn = function () {
            this._nDesiredDistance -= this._nDistanceSpeed;
        };
        Camera.prototype.zoomOut = function () {
            this._nDesiredDistance += this._nDistanceSpeed;
        };
        Camera.prototype.zoomTo = function (nZoom) {
            this._nDesiredDistance = nZoom;
        };
        Camera.prototype.moveTo = function (cPosition) {
            this._cLookAt.X = cPosition.X;
            this._cLookAt.Y = cPosition.Y;
            this.updateViewport();
        };
        Camera.prototype.screenToWorld = function (cPosition) {
            var nX = (cPosition.X / this._aViewport.scale[0]) + this._aViewport.left;
            var nY = (cPosition.Y / this._aViewport.scale[1]) + this._aViewport.top;
            return new FireHare.Vector(nX, nY);
        };
        Camera.prototype.worldToScreen = function (cPosition) {
            var nX = (cPosition.X - this._aViewport.left) * (this._aViewport.scale[0]);
            var nY = (cPosition.Y - this._aViewport.top) * (this._aViewport.scale[1]);
            return new FireHare.Vector(nX, nY);
        };
        ///
        /// STATIC
        ///
        Camera.ZoomIn = function () {
            Camera.CAMERA().zoomIn();
        };
        Camera.ZoomOut = function () {
            Camera.CAMERA().zoomOut();
        };
        Camera.SetZoom = function (nZoom) {
            Camera.CAMERA().zoomTo(nZoom);
        };
        Camera.WorldToScreen = function (cPosition) {
            return Camera.CAMERA().worldToScreen(cPosition);
        };
        Camera.ScreenToWorld = function (cPosition) {
            return Camera.CAMERA().screenToWorld(cPosition);
        };
        return Camera;
    }());
    FireHare.Camera = Camera;
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Canvas = /** @class */ (function () {
        function Canvas(cContext) {
            var _this = this;
            this._cContext = cContext;
            this._cContext.canvas.height = window.innerHeight;
            this._cContext.canvas.width = window.innerWidth;
            FireHare.Camera.INIT(cContext);
            FireHare.Camera.CAMERA().zoomTo(2000);
            window.addEventListener("resize", function (e) {
                _this._cContext.canvas.height = window.innerHeight;
                _this._cContext.canvas.width = window.innerWidth;
                FireHare.Camera.CAMERA().updateViewport();
            });
        }
        Object.defineProperty(Canvas, "DEFAULT_COLOUR", {
            ///
            /// STATIC
            ///
            get: function () {
                return FireHare.Colour.White;
            },
            enumerable: true,
            configurable: true
        });
        ///
        /// PUBLIC
        ///
        Canvas.prototype.update = function () {
            FireHare.Camera.CAMERA().update();
        };
        /**
         * Clears the canvas back to the optional colour specified
         * @param sColour The colour you wish the canvas to clear to (default: black)
         */
        Canvas.prototype.clear = function () {
            this._cContext.fillStyle = FireHare.Colour.Black.toString();
            this._cContext.fillRect(0, 0, this._cContext.canvas.width, this._cContext.canvas.height);
        };
        Canvas.prototype.setColour = function (cColour) {
            this._cContext.fillStyle = cColour.toString();
            this._cContext.strokeStyle = cColour.toString();
        };
        Canvas.prototype.setStrokeColour = function (cColour) {
            this._cContext.strokeStyle = cColour.toString();
        };
        Canvas.prototype.setFillColour = function (cColour) {
            this._cContext.fillStyle = cColour.toString();
        };
        Canvas.prototype.changeContext = function (cPosition, nRotation) {
            FireHare.Camera.CAMERA().changeContext(cPosition, nRotation);
        };
        Canvas.prototype.restoreContext = function () {
            FireHare.Camera.CAMERA().end();
        };
        Canvas.prototype.moveToWorldSpace = function () {
            FireHare.Camera.CAMERA().begin();
        };
        Canvas.prototype.moveToScreenSpace = function () {
            FireHare.Camera.CAMERA().end();
        };
        Canvas.prototype.moveTo = function (cPosition) {
            FireHare.Camera.CAMERA().moveTo(cPosition);
        };
        Canvas.prototype.drawCircle = function (cPosition, nRadius, cColour) {
            if (cColour === void 0) { cColour = Canvas.DEFAULT_COLOUR; }
            this._cContext.strokeStyle = cColour.toString();
            this._cContext.beginPath();
            this._cContext.arc(cPosition.X, cPosition.Y, nRadius, 0, Math.PI * 2);
            this._cContext.stroke();
            this._cContext.closePath();
        };
        Canvas.prototype.drawText = function (sText, cPosition, cColour) {
            if (cColour === void 0) { cColour = Canvas.DEFAULT_COLOUR; }
            this._cContext.fillStyle = cColour.toString();
            this._cContext.font = '10px Verdana';
            this._cContext.fillText(sText, cPosition.X, cPosition.Y);
        };
        Canvas.prototype.drawBox = function (cPosition, nWidth, nHeight, cColour) {
            if (cColour === void 0) { cColour = Canvas.DEFAULT_COLOUR; }
            this._cContext.fillRect(cPosition.X, cPosition.Y, nWidth, nHeight);
        };
        Canvas.prototype.drawPath = function (liPoints, bFill, cColour) {
            if (bFill === void 0) { bFill = true; }
            if (cColour === void 0) { cColour = Canvas.DEFAULT_COLOUR; }
            //this._cContext.strokeStyle = cColour.toString();
            this._cContext.fillStyle = cColour.toString();
            this._cContext.beginPath();
            this._cContext.moveTo(liPoints[0].X, liPoints[0].Y);
            for (var i = 1; i < liPoints.length; i++) {
                this._cContext.lineTo(liPoints[i].X, liPoints[i].Y);
            }
            this._cContext.closePath();
            this._cContext.stroke();
            if (bFill)
                this._cContext.fill();
        };
        Object.defineProperty(Canvas.prototype, "context", {
            ///
            /// PROPERTIES
            ///
            get: function () {
                return this._cContext;
            },
            enumerable: true,
            configurable: true
        });
        return Canvas;
    }());
    FireHare.Canvas = Canvas;
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Log = /** @class */ (function () {
        function Log() {
            this._liMessages = [];
            this._liStats = [];
            this._liWorldMessages = [];
            this._liScreenMessages = [];
        }
        Log.LOG = function () {
            if (!hasValue(Log.SINGLETON))
                Log.SINGLETON = new Log();
            return Log.SINGLETON;
        };
        ///
        /// STATIC
        ///
        Log.AddItem = function (sMessage) {
            Log.LOG().addMessage(sMessage);
        };
        Log.AddStat = function (sStat) {
            Log.LOG().addStat(sStat);
        };
        Log.AddWorldItem = function (sMessage, cPosition) {
            Log.LOG().addWorldMessage(sMessage, cPosition);
        };
        Log.AddScreenItem = function (sMessage, cPosition) {
            Log.LOG().addScreenMessage(sMessage, cPosition);
        };
        ///
        /// PUBLIC
        ///
        Log.prototype.addMessage = function (sMessage) {
            console.log(sMessage);
            this._liMessages.push(new FireHare.LogItem(sMessage));
        };
        Log.prototype.addStat = function (sStat) {
            this._liStats.push(new FireHare.LogItem(sStat));
        };
        Log.prototype.addWorldMessage = function (sMessage, cPosition) {
            this._liWorldMessages.push(new FireHare.LogItem(sMessage, cPosition));
        };
        Log.prototype.addScreenMessage = function (sMessage, cPosition) {
            this._liScreenMessages.push(new FireHare.LogItem(sMessage, cPosition));
        };
        Log.prototype.update = function () {
            this._liStats = [];
            this._liWorldMessages = [];
            this._liScreenMessages = [];
        };
        Log.prototype.draw = function (cCanvas) {
            cCanvas.moveToScreenSpace();
            for (var i = this._liMessages.length - 1; i > 0; i--) {
                cCanvas.drawText(this._liMessages[i].message, new FireHare.Vector(25, (i * 10) + 50));
            }
            if (this._liStats.length > 0) {
                cCanvas.drawText("-------", new FireHare.Vector(25, 350));
                cCanvas.drawText("STATS", new FireHare.Vector(25, 365));
                cCanvas.drawText("-------", new FireHare.Vector(25, 380));
            }
            for (var i = 0; i < this._liStats.length; i++) {
                cCanvas.drawText(this._liStats[i].message, new FireHare.Vector(25, (i * 10) + 395));
            }
            cCanvas.moveToWorldSpace();
            for (var i = 0; i < this._liWorldMessages.length; i++) {
                cCanvas.drawText(this._liWorldMessages[i].message, this._liWorldMessages[i].position);
            }
            cCanvas.moveToScreenSpace();
            for (var i = 0; i < this._liScreenMessages.length; i++) {
                cCanvas.drawText(this._liScreenMessages[i].message, this._liScreenMessages[i].position);
            }
            // TODO: Remove this in favour of fading/auto-deleting
            if (this._liMessages.length > 10)
                this._liMessages = this._liMessages.slice(this._liMessages.length - 10);
        };
        return Log;
    }());
    FireHare.Log = Log;
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var LogItem = /** @class */ (function () {
        function LogItem(sMessage, cPosition) {
            if (cPosition === void 0) { cPosition = FireHare.Vector.Zero; }
            this._sMessage = sMessage;
            this._cPosition = cPosition;
        }
        ///
        /// PUBLIC
        ///
        LogItem.prototype.update = function () {
            // TODO: Fading...
        };
        Object.defineProperty(LogItem.prototype, "message", {
            ///
            /// PROPERTIES
            ///
            get: function () {
                return this._sMessage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LogItem.prototype, "position", {
            get: function () {
                return this._cPosition;
            },
            enumerable: true,
            configurable: true
        });
        return LogItem;
    }());
    FireHare.LogItem = LogItem;
})(FireHare || (FireHare = {}));
if (typeof Array.prototype.clear !== 'function') {
    Array.prototype.clear = function () {
        this.length = 0;
    };
}
else {
    throw new Error("This dialog cannot start due to a compatibility issue (1). Please contact CML Support.");
}
if (typeof Array.prototype.remove !== 'function') {
    Array.prototype.remove = function (item) {
        this.splice(this.indexOf(item), 1);
    };
}
else {
    throw new Error("This dialog cannot start due to a compatibility issue (1). Please contact CML Support.");
}
var FireHare;
(function (FireHare) {
    var Colour = /** @class */ (function () {
        function Colour(nR, nG, nB, nA) {
            if (nR === void 0) { nR = 255; }
            if (nG === void 0) { nG = 255; }
            if (nB === void 0) { nB = 255; }
            if (nA === void 0) { nA = 255; }
            this._nR = nR;
            this._nG = nG;
            this._nB = nB;
            this._nA = nA;
        }
        Object.defineProperty(Colour, "White", {
            ///
            /// STATIC
            ///
            get: function () {
                return new Colour(255, 255, 255);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Colour, "Black", {
            get: function () {
                return new Colour(0, 0, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Colour, "Grey", {
            get: function () {
                return new Colour(100, 100, 100);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Colour, "Red", {
            get: function () {
                return new Colour(255, 0, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Colour, "Green", {
            get: function () {
                return new Colour(0, 255, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Colour, "Blue", {
            get: function () {
                return new Colour(0, 0, 255);
            },
            enumerable: true,
            configurable: true
        });
        ///
        /// PUBLIC
        ///
        Colour.prototype.toString = function () {
            return String.format("rgba({0}, {1}, {2}, {3}", this._nR, this._nG, this._nB, this._nA);
        };
        Object.defineProperty(Colour.prototype, "r", {
            ///
            /// PROPERTIES
            ///
            get: function () {
                return this._nR;
            },
            set: function (nR) {
                this._nR = nR;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Colour.prototype, "g", {
            get: function () {
                return this._nG;
            },
            set: function (nG) {
                this._nG = nG;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Colour.prototype, "b", {
            get: function () {
                return this._nB;
            },
            set: function (nB) {
                this._nB = nB;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Colour.prototype, "a", {
            get: function () {
                return this._nA;
            },
            set: function (nA) {
                this._nA = nA;
            },
            enumerable: true,
            configurable: true
        });
        return Colour;
    }());
    FireHare.Colour = Colour;
})(FireHare || (FireHare = {}));
function hasValue(a) {
    if (a === undefined || a === null)
        return false;
    return true;
}
var FireHare;
(function (FireHare) {
    var Event = /** @class */ (function () {
        function Event() {
            this._liHandlers = [];
        }
        ///
        /// PUBLIC
        ///
        Event.prototype.addHandler = function (aEventHandler) {
            this._liHandlers.push(aEventHandler);
        };
        Event.prototype.raise = function (sender, cArgs) {
            for (var i = 0; i < this._liHandlers.length; i++) {
                this._liHandlers[i](sender, cArgs);
            }
        };
        return Event;
    }());
    FireHare.Event = Event;
})(FireHare || (FireHare = {}));
var Guid = /** @class */ (function () {
    function Guid(sGuid) {
        if (sGuid === void 0) { sGuid = Guid.UUID(); }
        this._sValue = sGuid;
    }
    ///
    /// PRIVATE
    ///
    Guid.prototype.uuidv4 = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    ///
    /// PUBLIC
    ///
    Guid.prototype.toString = function () {
        return this._sValue;
    };
    Guid.prototype.equals = function (gGuid) {
        if (this._sValue.equals(gGuid._sValue))
            return true;
        return false;
    };
    ///
    /// STATIC
    ///
    Guid.UUID = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    Guid.NewGuid = function () {
        return new Guid();
    };
    return Guid;
}());
var FireHare;
(function (FireHare) {
    var Input = /** @class */ (function () {
        function Input() {
            this._liKeysDown = [];
            this._liKeysDownPrev = [];
            this._bUpdated = false;
            //this._cMousePosition = new Vector(0, 0);
            window.addEventListener('keydown', this.onKeyDown.bind(this));
            window.addEventListener('keyup', this.onKeyUp.bind(this));
            window.addEventListener("mouseenter", this.onMouseMove.bind(this));
            window.addEventListener("mousemove", this.onMouseMove.bind(this));
        }
        Input.INPUT = function () {
            if (!hasValue(Input.SINGLETON))
                Input.SINGLETON = new Input();
            return Input.SINGLETON;
        };
        ///
        /// PUBLIC
        ///
        Input.prototype.update = function () {
            if (!this._bUpdated) {
                this._liKeysDownPrev = this._liKeysDown;
                this._bUpdated = true;
            }
        };
        Input.prototype.isKeyDown = function (eKey) {
            if (this._liKeysDown.indexOf(eKey) != -1)
                return true;
            return false;
        };
        Input.prototype.isKeyPressed = function (eKey) {
            if (this._liKeysDown.indexOf(eKey) != -1)
                if (this._liKeysDownPrev.indexOf(eKey) == -1)
                    return true;
            return false;
        };
        ///
        /// STATIC
        ///
        Input.Update = function () {
            Input.INPUT().update();
        };
        Object.defineProperty(Input, "MousePosition", {
            get: function () {
                return Input.INPUT().mousePosition;
            },
            enumerable: true,
            configurable: true
        });
        Input.IsKeyDown = function (eKey) {
            return Input.INPUT().isKeyDown(eKey);
        };
        Input.IsKeyPressed = function (eKey) {
            return Input.INPUT().isKeyPressed(eKey);
        };
        ///
        /// EVENT HANDLER
        ///
        Input.prototype.onMouseMove = function (e) {
            this._cMousePosition = new FireHare.Vector(e.clientX, e.clientY);
        };
        Input.prototype.onKeyDown = function (e) {
            this._liKeysDownPrev = this._liKeysDown.slice(0);
            if (this._liKeysDown.indexOf(e.keyCode) != -1) {
                return;
            }
            this._liKeysDown.push(e.keyCode);
            this._bUpdated = false;
        };
        Input.prototype.onKeyUp = function (e) {
            var nIndex = this._liKeysDown.indexOf(e.keyCode);
            this._liKeysDown.splice(nIndex, 1);
            this._liKeysDownPrev = this._liKeysDown.slice(0);
        };
        Object.defineProperty(Input.prototype, "mousePosition", {
            ///
            /// PROPERTIES
            ///
            get: function () {
                return this._cMousePosition;
            },
            enumerable: true,
            configurable: true
        });
        return Input;
    }());
    FireHare.Input = Input;
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Random = /** @class */ (function () {
        function Random() {
        }
        Random.Next = function (nMin, nMax) {
            if (nMin === void 0) { nMin = 0; }
            if (nMax === void 0) { nMax = 0; }
            return Math.random() * (nMax - nMin) + nMin;
        };
        return Random;
    }());
    FireHare.Random = Random;
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Settings = /** @class */ (function () {
        function Settings() {
            this._bIsDebug = true;
        }
        Settings.SETTINGS = function () {
            if (!hasValue(Settings.SINGLETON))
                Settings.SINGLETON = new Settings();
            return Settings.SINGLETON;
        };
        Object.defineProperty(Settings, "IsDebug", {
            ///
            /// STATIC
            ///
            get: function () {
                return Settings.SETTINGS().isDebug;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings.prototype, "isDebug", {
            ///
            /// PROPERTIES
            ///
            get: function () {
                return this._bIsDebug;
            },
            set: function (bIsDebug) {
                this._bIsDebug = bIsDebug;
            },
            enumerable: true,
            configurable: true
        });
        return Settings;
    }());
    FireHare.Settings = Settings;
})(FireHare || (FireHare = {}));
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
                case 1 /* CaseInsensitive */:
                    return this.toUpperCase() === s.toUpperCase();
                default: //case sensitive
                    return this.valueOf() === s.valueOf();
            }
        }
    };
}
if (typeof String.prototype.contains !== 'function') {
    String.prototype.contains = function (contains) {
        return (this.indexOf(contains) >= 0);
    };
}
if (typeof String.format !== 'function') {
    String.format = function (format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)(:*)([\w#,/]*)}/g, function (match, number) {
            if (args[number] == null) {
                return String.empty;
            }
            else {
                if (match.contains(":")) {
                    var rawMatch = args[number];
                    var formatChars = match.split(":")[1].split("}")[0];
                    if (typeof rawMatch === 'string') {
                        return typeof args[number] != 'undefined' ? args[number] : match;
                    }
                }
                else {
                    return typeof args[number] != 'undefined' ? args[number] : match;
                }
            }
        });
    };
}
if (typeof String.isNullOrEmpty !== 'function') {
    String.isNullOrEmpty = function (str) { return !str; };
}
else {
    throw new Error("This dialog cannot start due to a compatibility issue (1). Please contact CML Support.");
}
if (typeof String.isNullOrWhiteSpace !== 'function') {
    String.isNullOrWhiteSpace = function (str) { return (!str || (str.trim().length <= 0)); };
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
var FireHare;
(function (FireHare) {
    var Timer = /** @class */ (function () {
        function Timer() {
            this._cNow = Date.now();
            this._cPrevious = this._cNow;
        }
        Timer.TIMER = function () {
            if (!hasValue(Timer.SINGLETON))
                Timer.SINGLETON = new Timer();
            return Timer.SINGLETON;
        };
        ///
        /// PUBLIC
        ///
        Timer.prototype.getElapsedTime = function () {
            return this._cNow - this._cPrevious;
        };
        Timer.prototype.update = function () {
            this._cPrevious = this._cNow;
            this._cNow = Date.now();
        };
        ///
        /// STATIC
        ///
        Timer.Init = function () {
            Timer.TIMER();
        };
        Object.defineProperty(Timer, "ElapsedTime", {
            get: function () {
                return Timer.TIMER().getElapsedTime();
            },
            enumerable: true,
            configurable: true
        });
        return Timer;
    }());
    FireHare.Timer = Timer;
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Vector = /** @class */ (function () {
        function Vector(nX, nY) {
            this._nX = nX;
            this._nY = nY;
        }
        ///
        /// STATIC
        ///
        Vector.DirectionFromRotation = function (nRotation, nMagnitude) {
            if (nMagnitude === void 0) { nMagnitude = 1; }
            return new Vector(Math.cos(nRotation) * nMagnitude, Math.sin(nRotation) * nMagnitude);
        };
        Object.defineProperty(Vector, "Zero", {
            get: function () {
                return new Vector(0, 0);
            },
            enumerable: true,
            configurable: true
        });
        Vector.Magnitude = function (cVector) {
            return Math.sqrt(cVector.X * cVector.X + cVector.Y * cVector.Y);
        };
        Vector.Distance = function (cVectorA, cVectorB) {
            return Vector.Magnitude(new Vector(cVectorB.X - cVectorA.X, cVectorB.Y - cVectorA.Y));
        };
        Vector.Unit = function (cVector) {
            var nLength = Vector.Magnitude(cVector);
            var nX = cVector.X / nLength;
            var nY = cVector.Y / nLength;
            return new Vector(nX, nY);
        };
        Vector.DirectionTo = function (cVectorFrom, cVectorTo) {
            var nX = cVectorTo.X - cVectorFrom.X;
            var nY = cVectorTo.Y - cVectorFrom.Y;
            return Math.atan2(nY, nX);
        };
        Vector.FromSAT = function (cVector) {
            return new Vector(cVector.x, cVector.y);
        };
        ///
        /// PUBLIC
        ///
        Vector.prototype.add = function (cVector) {
            return new Vector(this._nX + cVector.X, this._nY + cVector.Y);
        };
        Vector.prototype.subtract = function (cVector) {
            return new Vector(this._nX - cVector.X, this._nY - cVector.Y);
        };
        Vector.prototype.multiply = function (nMultiple) {
            return new Vector(this._nX * nMultiple, this._nY * nMultiple);
        };
        Vector.prototype.equals = function (cVector) {
            if (cVector.X == this.X && cVector.Y == this.Y)
                return true;
            return false;
        };
        Vector.prototype.limit = function (nLimit) {
            if (this._nX >= nLimit)
                this._nX = nLimit;
            if (this._nX <= -nLimit)
                this._nX = -nLimit;
            if (this._nY >= nLimit)
                this._nY = nLimit;
            if (this._nY <= -nLimit)
                this._nY = -nLimit;
        };
        Object.defineProperty(Vector.prototype, "X", {
            ///
            /// PROPERTIES
            ///
            get: function () {
                return this._nX;
            },
            set: function (nX) {
                this._nX = nX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector.prototype, "Y", {
            get: function () {
                return this._nY;
            },
            set: function (nY) {
                this._nY = nY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector.prototype, "magnitude", {
            get: function () {
                return Math.sqrt(this.X * this.X + this.Y * this.Y);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector.prototype, "length", {
            get: function () {
                return Math.atan2(this._nY, this._nX);
            },
            enumerable: true,
            configurable: true
        });
        return Vector;
    }());
    FireHare.Vector = Vector;
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var CollisionManager = /** @class */ (function () {
            function CollisionManager() {
            }
            CollisionManager.prototype.collisionCheck = function (cObject, cOtherObject) {
                var cComponents = cObject.components;
                var cOtherComponents = cOtherObject.components;
                for (var i = 0; i < cComponents.length; i++) {
                    var cComponent = cComponents[i];
                    for (var j = 0; j < cOtherComponents.length; j++) {
                        var cOtherComponent = cOtherComponents[j];
                    }
                }
            };
            return CollisionManager;
        }());
        Asteroids.CollisionManager = CollisionManager;
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
// namespace SAT {
//     export class Circle {
//         constructor(cVector: Vector, nRadius: number) {
//         }
//     };
//     export class Vector {
//         constructor(nX: number, nY: number) {
//         }
//     };
//     export function pointInCircle() {};
//     export function testCircleCircle(c1: Circle, c2: Circle, a1: any): any {};
// }
var FireHare;
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var Game = /** @class */ (function () {
            function Game() {
                this._cCollisionManager = new Asteroids.CollisionManager();
                this._liGameObjects = [];
                this.objectDestroyed = new FireHare.Event();
                this.objectSpawned = new FireHare.Event();
                this.objectDamaged = new FireHare.Event();
            }
            ///
            /// PRIVATE
            ///
            Game.prototype.getGameObject = function (gId) {
                var cObject;
                for (var i = 0; i < this._liGameObjects.length; i++) {
                    if (this._liGameObjects[i].identifier.equals(gId))
                        cObject = this._liGameObjects[i];
                }
                return cObject;
            };
            Game.prototype.getTeamObjects = function (gTeam) {
                var liObjects = [];
                for (var i = 0; i < this._liGameObjects.length; i++) {
                    if (this._liGameObjects[i].team.equals(gTeam))
                        liObjects.push(this._liGameObjects[i]);
                }
                return liObjects;
            };
            Game.prototype.checkForCollisions = function (cObject, liObjects) {
                for (var i = 0; i < liObjects.length; i++) {
                    var cOtherObject = liObjects[i];
                    if (cObject === cOtherObject)
                        continue;
                    if (!cObject.isAlive)
                        return;
                    if (!cOtherObject.isAlive)
                        continue;
                    if (cObject.team.equals(cOtherObject.team))
                        return;
                    this._cCollisionManager.collisionCheck(cObject, cOtherObject);
                    return;
                    var nRadii = cObject.radius + cOtherObject.radius;
                    var nDistance = FireHare.Vector.Distance(cObject.position, cOtherObject.position);
                    var nDifference = nDistance - nRadii;
                    if (nDifference < 0) {
                        var cCollisionVector = new FireHare.Vector(cObject.position.X - cOtherObject.position.X, cObject.position.Y - cOtherObject.position.Y);
                        if (cCollisionVector.X == 0)
                            cCollisionVector.X = 0.00001;
                        if (cCollisionVector.Y == 0)
                            cCollisionVector.Y = 0.00001;
                        var eType = Asteroids.GameObject.GetType(cObject);
                        var eOtherType = Asteroids.GameObject.GetType(cOtherObject);
                        if (eType == Asteroids.ObjectType.Laser || eOtherType == Asteroids.ObjectType.Laser) {
                            cObject.applyDamage(10);
                            cOtherObject.applyDamage(10);
                            if (eType != Asteroids.ObjectType.Laser)
                                this.objectDamaged.raise(this, new Asteroids.Args.ObjectDamagedArgs(cObject.identifier, 10));
                            if (eOtherType != Asteroids.ObjectType.Laser)
                                this.objectDamaged.raise(this, new Asteroids.Args.ObjectDamagedArgs(cOtherObject.identifier, 10));
                        }
                        else {
                            // PERFORM SAT COLLISION DETECTION!
                            this._cCollisionManager.collisionCheck(cObject, cOtherObject);
                            //cObject.collision(Vector.Unit(cCollisionVector));
                            //cOtherObject.collision(Vector.Unit(cCollisionVector.multiply(-1)));
                        }
                    }
                }
            };
            ///
            /// PUBLIC
            ///
            Game.prototype.applyAction = function (cArgs) {
                var cShip = this.getGameObject(new Guid(cArgs.identifier));
                if (!hasValue(cShip))
                    return;
                switch (cArgs.action) {
                    case Asteroids.PlayerAction.Accellerate:
                        cShip.accellerate();
                        break;
                    case Asteroids.PlayerAction.Decellerate:
                        cShip.decellerate();
                        break;
                    case Asteroids.PlayerAction.TurnToPort:
                        cShip.turnToPort();
                        break;
                    case Asteroids.PlayerAction.TurnToStarboard:
                        cShip.turnToStarboard();
                        break;
                    case Asteroids.PlayerAction.Fire:
                        cShip.fire();
                        break;
                    case Asteroids.PlayerAction.SelfDestruct:
                        cShip.destroy();
                        break;
                }
            };
            Game.prototype.addGameObjects = function (liGameObject) {
                for (var i = 0; i < liGameObject.length; i++) {
                    this.addGameObject(liGameObject[i]);
                }
            };
            Game.prototype.addGameObject = function (cGameObject) {
                var _this = this;
                cGameObject.destroyed.addHandler(function () {
                    _this.objectDestroyed.raise(_this, new Asteroids.Args.ObjectDestroyedArgs(cGameObject.identifier, Asteroids.Scrap.FromGameObject(cGameObject)));
                });
                if (cGameObject instanceof Asteroids.Ship) {
                    cGameObject.fired.addHandler(function () {
                        var cLaser = Asteroids.Laser.FromShip(cGameObject);
                        _this.objectSpawned.raise(_this, new Asteroids.Args.ObjectSpawnedArgs(Asteroids.ObjectType.Laser, cLaser, cGameObject));
                    });
                }
                this._liGameObjects.push(cGameObject);
            };
            Game.prototype.removeGameObject = function (gId) {
                var cObject = this.getGameObject(gId);
                if (hasValue(cObject))
                    this._liGameObjects.remove(cObject);
            };
            Game.prototype.removeTeam = function (gTeam) {
                var liObjects = this.getTeamObjects(gTeam);
                for (var i = 0; i < liObjects.length; i++) {
                    this.removeGameObject(liObjects[i].identifier);
                }
            };
            Game.prototype.synchronise = function (cArgs) {
                for (var i = 0; i < cArgs.objectId.length; i++) {
                    var cObject = this.getGameObject(new Guid(cArgs.objectId[i]));
                    var cPosition = new FireHare.Vector(cArgs.positionX[i], cArgs.positionY[i]);
                    if (!hasValue(cObject))
                        continue;
                    cObject.position = cPosition;
                    cObject.rotation = cArgs.rotation[i];
                }
            };
            Game.prototype.damageObject = function (cArgs) {
                var cObject = this.getGameObject(new Guid(cArgs.identifier));
                if (!hasValue(cObject)) {
                    console.log("Object does not exist!");
                    return;
                }
                cObject.applyDamage(cArgs.damage);
            };
            Game.prototype.destroyObject = function (cArgs) {
                var cObject = this.getGameObject(new Guid(cArgs.objectId));
                if (!hasValue(cObject)) {
                    console.log("Object does not exist!");
                    return;
                }
                this.addGameObjects(Asteroids.Scrap.FromArgs(cObject, cArgs));
                this.removeGameObject(cObject.identifier);
            };
            Game.prototype.spawnObject = function (cArgs) {
                var cObject;
                switch (cArgs.objectType) {
                    case Asteroids.ObjectType.Laser:
                        var cShip = this.getGameObject(new Guid(cArgs.spawnerId));
                        if (!hasValue(cShip))
                            return;
                        cObject = Asteroids.Laser.FromShip(cShip);
                        cObject.identifier = new Guid(cArgs.objectId);
                        break;
                }
                this.addGameObject(cObject);
            };
            Game.prototype.update = function () {
                for (var i = 0; i < this._liGameObjects.length; i++) {
                    var cGameObject = this._liGameObjects[i];
                    if (!cGameObject.isAlive) {
                        this._liGameObjects.remove(cGameObject);
                        continue;
                    }
                    cGameObject.update();
                }
                FireHare.Log.AddStat(String.format("Game Objects: {0}", this._liGameObjects.length));
            };
            Game.prototype.draw = function (cCanvas) {
                cCanvas.moveToWorldSpace();
                for (var i = 0; i < this._liGameObjects.length; i++) {
                    var cGameObject = this._liGameObjects[i];
                    cGameObject.draw(cCanvas);
                }
                cCanvas.moveToScreenSpace();
            };
            Game.prototype.reset = function () {
                this._liGameObjects.clear();
            };
            Game.prototype.collisionDetection = function () {
                var liObjects = this._liGameObjects.slice();
                for (var i = 0; i < this._liGameObjects.length; i++) {
                    var cObjectA = this._liGameObjects[i];
                    //liObjects.remove(cObjectA);
                    if (!cObjectA.isAlive)
                        continue;
                    this.checkForCollisions(cObjectA, liObjects);
                }
            };
            Object.defineProperty(Game.prototype, "gameObjects", {
                ///
                /// PROPERTIES
                ///
                get: function () {
                    return this._liGameObjects;
                    var liObjs = [];
                    for (var i = 0; i < this._liGameObjects.length; i++) {
                        if (this._liGameObjects[i].isAlive)
                            liObjs.push(this._liGameObjects[i]);
                    }
                    return liObjs;
                },
                enumerable: true,
                configurable: true
            });
            return Game;
        }());
        Asteroids.Game = Game;
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var ObjectType;
        (function (ObjectType) {
            ObjectType[ObjectType["Ship"] = 0] = "Ship";
            ObjectType[ObjectType["Laser"] = 1] = "Laser";
            ObjectType[ObjectType["Scrap"] = 2] = "Scrap";
            ObjectType[ObjectType["Unknown"] = 3] = "Unknown";
        })(ObjectType = Asteroids.ObjectType || (Asteroids.ObjectType = {}));
        var GameObject = /** @class */ (function () {
            function GameObject(gTeam) {
                if (gTeam === void 0) { gTeam = Guid.NewGuid(); }
                this._gId = Guid.NewGuid();
                this._gTeam = gTeam;
                //this._cPosition = Vector.Zero;
                this._cPosition = Asteroids.District.RandomSpawn();
                this._cVelocity = new FireHare.Vector(0, 0);
                this._nRotation = 0;
                this._bIsAlive = true;
                this._nRadius = 60;
                this._liComponents = [];
                this._cStats = new Asteroids.Stats();
                this.destroyed = new FireHare.Event();
            }
            GameObject.prototype.rotateToDesiredTarget = function () {
                var nDesiredRotation = FireHare.Vector.DirectionTo(this.position, this._cRotationTarget);
                var nDiff = Asteroids.Helper.WrapRotation(nDesiredRotation - this._nRotation);
                nDiff = Asteroids.Helper.Clamp(nDiff, -this._cStats.rotationSpeed, this._cStats.rotationSpeed);
                if (Math.abs(nDiff) < this._cStats.rotationSpeed)
                    this._nRotation = Asteroids.Helper.WrapRotation(nDesiredRotation);
                else
                    this._nRotation = Asteroids.Helper.WrapRotation(this._nRotation + nDiff);
            };
            ///
            /// PUBLIC
            ///
            GameObject.prototype.collision = function (cForce) {
                this.onCollision(cForce);
            };
            GameObject.prototype.applyDamage = function (nDamage) {
                this.onApplyDamage(nDamage);
            };
            GameObject.prototype.update = function () {
                this._cStats.update();
                for (var i = 0; i < this._liComponents.length; i++) {
                    this._liComponents[i].update(this);
                }
                if (hasValue(this._cRotationTarget))
                    this.rotateToDesiredTarget();
                this._nSpeed = this._cVelocity.magnitude;
                if (this._nSpeed > this._cStats.maxSpeed) {
                    this._cVelocity.X += (this._cVelocity.X / this._nSpeed) * (this._cStats.maxSpeed - this._nSpeed);
                    this._cVelocity.Y += (this._cVelocity.Y / this._nSpeed) * (this._cStats.maxSpeed - this._nSpeed);
                }
                this._cPosition.X += (this._cVelocity.X * FireHare.Timer.ElapsedTime);
                this._cPosition.Y += (this._cVelocity.Y * FireHare.Timer.ElapsedTime);
            };
            GameObject.prototype.draw = function (cCanvas) {
                if (!this.isAlive)
                    return;
                for (var i = 0; i < this._liComponents.length; i++) {
                    var cComponent = this._liComponents[i];
                    cComponent.draw(cCanvas);
                }
                cCanvas.drawCircle(this.position, this.radius, FireHare.Colour.Red);
            };
            GameObject.prototype.applyForce = function (cForce) {
                this.onApplyForce(cForce);
            };
            GameObject.prototype.stop = function () {
                this._cVelocity.X = 0;
                this._cVelocity.Y = 0;
            };
            GameObject.prototype.destroy = function () {
                if (this._bIsAlive)
                    this.onDestroy();
            };
            GameObject.prototype.turnToFace = function (cTarget) {
                this._cRotationTarget = cTarget;
            };
            ///
            /// PRIVATE
            /// 
            ///
            /// STATIC
            ///
            GameObject.GetType = function (cObject) {
                if (cObject instanceof Asteroids.Ship)
                    return ObjectType.Ship;
                if (cObject instanceof Asteroids.Laser)
                    return ObjectType.Laser;
                if (cObject instanceof Asteroids.Scrap)
                    return ObjectType.Scrap;
                return ObjectType.Unknown;
            };
            ///
            /// EVENT HANDLERS
            ///
            GameObject.prototype.onApplyDamage = function (nTotalDamage) {
                FireHare.Log.AddItem(String.format("Applying {0} damage to {1}", nTotalDamage, this.identifier.toString()));
                if (this._cStats.applyDamage(nTotalDamage))
                    this.destroy();
            };
            GameObject.prototype.onApplyForce = function (cForce) {
                this._cVelocity.X += cForce.X;
                this._cVelocity.Y += cForce.Y;
            };
            GameObject.prototype.onCollision = function (cForce) {
                //this._cPosition.subtract(cForce);
                this.applyForce(cForce.multiply(0.1));
            };
            GameObject.prototype.onDestroy = function () {
                this._bIsAlive = false;
                this.destroyed.raise(this);
            };
            Object.defineProperty(GameObject.prototype, "team", {
                ///
                /// PROPERTIES
                ///
                get: function () {
                    return this._gTeam;
                },
                set: function (gTeam) {
                    this._gTeam = gTeam;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameObject.prototype, "isAlive", {
                get: function () {
                    return this._bIsAlive;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameObject.prototype, "identifier", {
                get: function () {
                    return this._gId;
                },
                set: function (gId) {
                    this._gId = gId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameObject.prototype, "position", {
                get: function () {
                    return this._cPosition;
                },
                set: function (cPosition) {
                    this._cPosition = cPosition;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameObject.prototype, "velocity", {
                get: function () {
                    return this._cVelocity;
                },
                set: function (cVector) {
                    this._cVelocity = cVector;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameObject.prototype, "rotation", {
                get: function () {
                    return this._nRotation;
                },
                set: function (nRotation) {
                    this._nRotation = nRotation;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameObject.prototype, "radius", {
                get: function () {
                    return this._nRadius;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameObject.prototype, "speed", {
                get: function () {
                    return this._nSpeed;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameObject.prototype, "components", {
                get: function () {
                    return this._liComponents;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameObject.prototype, "stats", {
                get: function () {
                    return this._cStats;
                },
                enumerable: true,
                configurable: true
            });
            return GameObject;
        }());
        Asteroids.GameObject = GameObject;
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
/// <reference path="gameObject.ts" />
var FireHare;
/// <reference path="gameObject.ts" />
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var Scrap = /** @class */ (function (_super) {
            __extends(Scrap, _super);
            function Scrap(gTeam, cComponent, cVelocity) {
                var _this = _super.call(this) || this;
                _this.team = gTeam;
                _this.position = new FireHare.Vector(cComponent.position.X, cComponent.position.Y);
                _this.rotation = cComponent.rotation;
                _this._nRadius = 5;
                cComponent.offset = FireHare.Vector.Zero;
                var cNudge = _this.randomForce();
                _this.velocity = cVelocity.add(cNudge);
                //this.velocity = Vector.Zero;
                //this.velocity = this.randomForce();
                _this._liComponents.push(cComponent);
                return _this;
            }
            ///
            /// STATIC
            ///
            Scrap.FromGameObject = function (cObject) {
                var liScrap = [];
                for (var i = 0; i < cObject.components.length; i++) {
                    var cScrap = new Scrap(cObject.team, cObject.components[i], cObject.velocity);
                    liScrap.push(cScrap);
                }
                return liScrap;
            };
            Scrap.FromArgs = function (cObject, cArgs) {
                var liScrap = [];
                for (var i = 0; i < cObject.components.length; i++) {
                    var cScrap = new Scrap(cObject.team, cObject.components[i], cObject.velocity);
                    var cPosition = new FireHare.Vector(cArgs.scrapX[i], cArgs.scrapY[i]);
                    cScrap.identifier = new Guid(cArgs.scrapId[i]);
                    cScrap.position = cPosition;
                    cScrap.rotation = cArgs.scrapRotation[i];
                    liScrap.push(cScrap);
                }
                return liScrap;
            };
            ///
            /// PRIVATE
            ///
            Scrap.prototype.randomForce = function () {
                var nX = FireHare.Random.Next(-0.01, 0.01);
                var nY = FireHare.Random.Next(-0.01, 0.01);
                return new FireHare.Vector(nX, nY);
            };
            return Scrap;
        }(Asteroids.GameObject));
        Asteroids.Scrap = Scrap;
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var Components;
        (function (Components) {
            var Component = /** @class */ (function () {
                function Component(cOffset, bMirror, nScale) {
                    if (bMirror === void 0) { bMirror = false; }
                    if (nScale === void 0) { nScale = 1; }
                    this._eType = Components.Components.Unknown;
                    this._cOffset = cOffset;
                    this._liOutline = [];
                    this._cPrimaryColour = FireHare.Colour.White;
                    this._cSecondaryColour = FireHare.Colour.Grey;
                    this._cPosition = new FireHare.Vector(0, 0);
                    this._cCenter = new FireHare.Vector(0, 0);
                    this._nRotation = 0;
                    this._nScale = nScale;
                    this._bMirror = bMirror;
                    this.setType();
                }
                ///
                /// PRIVATE
                ///
                Component.prototype.updateOffsets = function (cOwner) {
                    var nRotationOffset = Math.atan2(this._cOffset.Y, this._cOffset.X);
                    nRotationOffset += cOwner.rotation;
                    var nX = this._cOffset.magnitude * Math.cos(nRotationOffset);
                    var nY = this._cOffset.magnitude * Math.sin(nRotationOffset);
                    this._cPosition = new FireHare.Vector(cOwner.position.X + nX, cOwner.position.Y + nY);
                    this._nRotation = cOwner.rotation;
                };
                Component.prototype.updateCenter = function () {
                    var nX = 0;
                    var nY = 0;
                    for (var i = 0; i < this._liOutline.length; i++) {
                        var cOutline = this._liOutline[i];
                        nX += cOutline.X;
                        nY += cOutline.Y;
                    }
                    nX = nX / this._liOutline.length;
                    nY = nY / this._liOutline.length;
                    this._cCenter = new FireHare.Vector(nX, nY);
                };
                Component.prototype.centerOutline = function () {
                    var liAdjusted = [];
                    for (var i = 0; i < this._liOutline.length; i++) {
                        var cPoint = this._liOutline[i];
                        liAdjusted.push(cPoint.subtract(this._cCenter));
                    }
                    this._liOutline = liAdjusted;
                };
                Component.prototype.scaleOutline = function () {
                    var liAdjusted = [];
                    for (var i = 0; i < this._liOutline.length; i++) {
                        var cPoint = this._liOutline[i];
                        liAdjusted.push(cPoint.multiply(this._nScale));
                    }
                    this._liOutline = liAdjusted;
                };
                Component.prototype.mirrorOutline = function () {
                    var liMirror = [];
                    for (var i = 0; i < this._liOutline.length; i++) {
                        liMirror.push(new FireHare.Vector(this._liOutline[i].X, this._liOutline[i].Y * -1));
                    }
                    var nIndex = this._liOutline.length;
                    this._liOutline = [];
                    // Reinput list from scratch
                    for (var i = 0; i < liMirror.length; i++) {
                        nIndex -= 1;
                        this._liOutline.push(liMirror[nIndex]);
                    }
                };
                ///
                /// PROTECTED
                ///
                Component.prototype.beginDraw = function (cCanvas, bMirror, bCenter) {
                    if (bMirror === void 0) { bMirror = this._bMirror; }
                    if (bCenter === void 0) { bCenter = true; }
                    cCanvas.context.save();
                    cCanvas.context.translate(this._cPosition.X, this._cPosition.Y);
                    cCanvas.context.rotate(this._nRotation);
                    if (bCenter)
                        cCanvas.context.translate(-this._cCenter.X, -this._cCenter.Y);
                    if (bMirror)
                        cCanvas.context.scale(1, -1);
                    cCanvas.context.scale(this._nScale, this._nScale);
                };
                Component.prototype.endDraw = function (cCanvas) {
                    cCanvas.context.restore();
                };
                Component.prototype.createOutline = function () {
                };
                Component.prototype.afterDraw = function (cCanvas) {
                };
                ///
                /// PUBLIC
                ///
                Component.prototype.update = function (cOwner) {
                    this.updateOffsets(cOwner);
                    this.createOutline();
                    if (this._bMirror) {
                        this.mirrorOutline();
                    }
                    this.scaleOutline();
                    this.updateCenter();
                    this.centerOutline();
                };
                Component.prototype.draw = function (cCanvas) {
                    cCanvas.changeContext(this._cPosition, this._nRotation);
                    cCanvas.setStrokeColour(FireHare.Colour.Black);
                    cCanvas.drawPath(this._liOutline, true, FireHare.Colour.White);
                    cCanvas.restoreContext();
                    this.afterDraw(cCanvas);
                };
                ///
                /// STATIC
                ///
                Component.CreateComponent = function (eType, bMirror, nScale, cOffset) {
                    var cComponent;
                    switch (eType) {
                        case Components.Components.Cockpit:
                            cComponent = new Components.Cockpit(cOffset, bMirror, nScale);
                            break;
                        case Components.Components.Pad:
                            cComponent = new Components.Pad(cOffset, bMirror, nScale);
                            break;
                        case Components.Components.Wing:
                            cComponent = new Components.Wing(cOffset, bMirror, nScale);
                            break;
                        case Components.Components.RearWing:
                            cComponent = new Components.RearWing(cOffset, bMirror, nScale);
                            break;
                    }
                    return cComponent;
                };
                Object.defineProperty(Component.prototype, "position", {
                    ///
                    /// PROPERTIES
                    ///
                    get: function () {
                        return this._cPosition;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Component.prototype, "offset", {
                    get: function () {
                        return this._cOffset;
                    },
                    set: function (cOffset) {
                        this._cOffset = cOffset;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Component.prototype, "rotation", {
                    get: function () {
                        return this._nRotation;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Component.prototype, "isMirror", {
                    get: function () {
                        return this._bMirror;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Component.prototype, "scale", {
                    get: function () {
                        return this._nScale;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Component.prototype, "type", {
                    get: function () {
                        return this._eType;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Component;
            }());
            Components.Component = Component;
        })(Components = Asteroids.Components || (Asteroids.Components = {}));
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var Components;
        (function (Components_1) {
            var Components;
            (function (Components) {
                Components[Components["Cockpit"] = 0] = "Cockpit";
                Components[Components["Wing"] = 1] = "Wing";
                Components[Components["RearWing"] = 2] = "RearWing";
                Components[Components["Pad"] = 3] = "Pad";
                Components[Components["Unknown"] = 4] = "Unknown";
            })(Components = Components_1.Components || (Components_1.Components = {}));
        })(Components = Asteroids.Components || (Asteroids.Components = {}));
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var Components;
        (function (Components) {
            var Pad = /** @class */ (function (_super) {
                __extends(Pad, _super);
                function Pad() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Pad.prototype.setType = function () {
                    this._eType = Components.Components.Pad;
                };
                ///
                /// PROTECTED
                ///
                Pad.prototype.createOutline = function () {
                    this._liOutline = [];
                    this._liOutline.push(new FireHare.Vector(2, -5));
                    this._liOutline.push(new FireHare.Vector(10, -7));
                    this._liOutline.push(new FireHare.Vector(20, -12));
                    this._liOutline.push(new FireHare.Vector(25, -10));
                    this._liOutline.push(new FireHare.Vector(27, -5));
                    this._liOutline.push(new FireHare.Vector(20, 0));
                    this._liOutline.push(new FireHare.Vector(0, 0));
                };
                Pad.prototype.afterDraw = function (cCanvas) {
                    this.beginDraw(cCanvas);
                    cCanvas.setStrokeColour(FireHare.Colour.Black);
                    cCanvas.setFillColour(this._cSecondaryColour);
                    // Highlight
                    cCanvas.context.beginPath();
                    cCanvas.context.moveTo(10, 0);
                    cCanvas.context.lineTo(23, -11);
                    cCanvas.context.lineTo(20, -12);
                    cCanvas.context.lineTo(10, -7);
                    cCanvas.context.lineTo(2, -5);
                    cCanvas.context.lineTo(0, 0);
                    cCanvas.context.closePath();
                    cCanvas.context.stroke();
                    cCanvas.context.fill();
                    this.endDraw(cCanvas);
                };
                return Pad;
            }(Components.Component));
            Components.Pad = Pad;
        })(Components = Asteroids.Components || (Asteroids.Components = {}));
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var Components;
        (function (Components) {
            var Cockpit = /** @class */ (function (_super) {
                __extends(Cockpit, _super);
                function Cockpit() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Cockpit.prototype.setType = function () {
                    this._eType = Components.Components.Cockpit;
                };
                ///
                /// PROTECTED
                ///
                Cockpit.prototype.createOutline = function () {
                    this._liOutline = [];
                    this._liOutline.push(new FireHare.Vector(-1, 1));
                    this._liOutline.push(new FireHare.Vector(-3, 2));
                    this._liOutline.push(new FireHare.Vector(-5, 3));
                    this._liOutline.push(new FireHare.Vector(-7, 4));
                    this._liOutline.push(new FireHare.Vector(-15, 4));
                    this._liOutline.push(new FireHare.Vector(-18, 6));
                    this._liOutline.push(new FireHare.Vector(-25, 8));
                    this._liOutline.push(new FireHare.Vector(-25, -8));
                    this._liOutline.push(new FireHare.Vector(-18, -6));
                    this._liOutline.push(new FireHare.Vector(-15, -4));
                    this._liOutline.push(new FireHare.Vector(-7, -4));
                    this._liOutline.push(new FireHare.Vector(-5, -3));
                    this._liOutline.push(new FireHare.Vector(-3, -2));
                    this._liOutline.push(new FireHare.Vector(-1, -1));
                    this._liOutline.push(new FireHare.Vector(0, 0));
                };
                Cockpit.prototype.afterDraw = function (cCanvas) {
                    this.beginDraw(cCanvas);
                    cCanvas.setStrokeColour(FireHare.Colour.Black);
                    cCanvas.setFillColour(this._cSecondaryColour);
                    // Tip Highlight
                    cCanvas.context.beginPath();
                    cCanvas.context.moveTo(0, 0);
                    cCanvas.context.lineTo(-1, -1);
                    cCanvas.context.lineTo(-3, -2);
                    cCanvas.context.lineTo(-5, -3);
                    cCanvas.context.lineTo(-7, -4);
                    cCanvas.context.lineTo(-9, -4);
                    cCanvas.context.lineTo(-9, 4);
                    cCanvas.context.lineTo(-7, 4);
                    cCanvas.context.lineTo(-5, 3);
                    cCanvas.context.lineTo(-3, 2);
                    cCanvas.context.lineTo(-1, 1);
                    cCanvas.context.closePath();
                    cCanvas.context.stroke();
                    cCanvas.context.fill();
                    //cCanvas.setStrokeColour(Colour.Black);
                    // Tip Highlight Strip
                    cCanvas.context.beginPath();
                    cCanvas.context.moveTo(-11, -4);
                    cCanvas.context.lineTo(-11, 4);
                    cCanvas.context.lineTo(-12, 4);
                    cCanvas.context.lineTo(-12, -4);
                    cCanvas.context.closePath();
                    cCanvas.context.stroke();
                    cCanvas.context.fill();
                    cCanvas.setStrokeColour(FireHare.Colour.Black);
                    cCanvas.setFillColour(FireHare.Colour.Green);
                    // Actual Cockpit
                    cCanvas.context.save();
                    cCanvas.context.scale(1.75, 1);
                    cCanvas.context.beginPath();
                    cCanvas.context.arc(-14, 0, 5, 0, Math.PI * 2);
                    cCanvas.context.stroke();
                    cCanvas.context.fill();
                    cCanvas.context.closePath();
                    cCanvas.context.restore();
                    cCanvas.setStrokeColour(FireHare.Colour.Black);
                    cCanvas.setStrokeColour(this._cSecondaryColour);
                    // Actual Cockpit Tail Strips
                    cCanvas.context.beginPath();
                    cCanvas.context.moveTo(-25, -5);
                    cCanvas.context.lineTo(-30, 0);
                    cCanvas.context.lineTo(-25, 5);
                    cCanvas.context.lineTo(-27, 5);
                    cCanvas.context.lineTo(-35, 0);
                    cCanvas.context.lineTo(-27, -5);
                    cCanvas.context.closePath();
                    cCanvas.context.stroke();
                    cCanvas.context.fill();
                    this.endDraw(cCanvas);
                };
                return Cockpit;
            }(Components.Component));
            Components.Cockpit = Cockpit;
        })(Components = Asteroids.Components || (Asteroids.Components = {}));
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var Components;
        (function (Components) {
            var RearWing = /** @class */ (function (_super) {
                __extends(RearWing, _super);
                function RearWing() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                RearWing.prototype.setType = function () {
                    this._eType = Components.Components.RearWing;
                };
                ///
                /// PROTECTED
                ///
                RearWing.prototype.createOutline = function () {
                    this._liOutline = [];
                    this._liOutline.push(new FireHare.Vector(-12, 0));
                    this._liOutline.push(new FireHare.Vector(-19, -26));
                    this._liOutline.push(new FireHare.Vector(-18, -33));
                    this._liOutline.push(new FireHare.Vector(0, -10));
                };
                RearWing.prototype.afterDraw = function (cCanvas) {
                    this.beginDraw(cCanvas);
                    cCanvas.setStrokeColour(FireHare.Colour.Black);
                    cCanvas.setFillColour(this._cSecondaryColour);
                    // Highlight Line
                    cCanvas.context.beginPath();
                    cCanvas.context.moveTo(-8, -3);
                    cCanvas.context.lineTo(-16, -26);
                    cCanvas.context.lineTo(-15, -29);
                    cCanvas.context.lineTo(-18, -33);
                    cCanvas.context.lineTo(-19, -26);
                    cCanvas.context.lineTo(-12, 0);
                    cCanvas.context.closePath();
                    cCanvas.context.stroke();
                    cCanvas.context.fill();
                    // Smaller Highlight Line
                    cCanvas.context.beginPath();
                    cCanvas.context.moveTo(-1, -9);
                    cCanvas.context.lineTo(-7, -16);
                    cCanvas.context.lineTo(-6, -18);
                    cCanvas.context.lineTo(0, -10);
                    cCanvas.context.closePath();
                    cCanvas.context.stroke();
                    cCanvas.context.fill();
                    this.endDraw(cCanvas);
                };
                return RearWing;
            }(Components.Component));
            Components.RearWing = RearWing;
        })(Components = Asteroids.Components || (Asteroids.Components = {}));
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var Components;
        (function (Components) {
            var Wing = /** @class */ (function (_super) {
                __extends(Wing, _super);
                function Wing() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Wing.prototype.setType = function () {
                    this._eType = Components.Components.Wing;
                };
                ///
                /// PROTECTED
                ///
                Wing.prototype.createOutline = function () {
                    this._liOutline = [];
                    this._liOutline.push(new FireHare.Vector(-5, -32));
                    this._liOutline.push(new FireHare.Vector(0, -30));
                    this._liOutline.push(new FireHare.Vector(20, -15));
                    this._liOutline.push(new FireHare.Vector(30, -5));
                    this._liOutline.push(new FireHare.Vector(30, 0));
                    this._liOutline.push(new FireHare.Vector(0, 0));
                };
                Wing.prototype.afterDraw = function (cCanvas) {
                    this.beginDraw(cCanvas);
                    cCanvas.setStrokeColour(FireHare.Colour.Black);
                    cCanvas.setFillColour(this._cSecondaryColour);
                    cCanvas.context.lineWidth = 1;
                    // Highlight Line
                    cCanvas.context.beginPath();
                    cCanvas.context.moveTo(30, -3);
                    cCanvas.context.lineTo(20, -13);
                    cCanvas.context.lineTo(0, -28);
                    cCanvas.context.lineTo(-5, -30);
                    cCanvas.context.lineTo(-5, -32);
                    cCanvas.context.lineTo(0, -30);
                    cCanvas.context.lineTo(20, -15);
                    cCanvas.context.lineTo(30, -5);
                    cCanvas.context.closePath();
                    cCanvas.context.stroke();
                    cCanvas.context.fill();
                    cCanvas.setStrokeColour(FireHare.Colour.Black);
                    cCanvas.setFillColour(this._cSecondaryColour);
                    // Larger Circle
                    cCanvas.context.beginPath();
                    cCanvas.context.arc(5, -6, 5, 0, 2 * Math.PI);
                    cCanvas.context.fill();
                    cCanvas.context.stroke();
                    cCanvas.context.closePath();
                    // Smaller Circle
                    cCanvas.context.beginPath();
                    cCanvas.context.arc(5, -6, 3, 0, 2 * Math.PI);
                    cCanvas.context.fill();
                    cCanvas.context.stroke();
                    cCanvas.context.closePath();
                    this.endDraw(cCanvas);
                };
                return Wing;
            }(Components.Component));
            Components.Wing = Wing;
        })(Components = Asteroids.Components || (Asteroids.Components = {}));
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var Laser = /** @class */ (function (_super) {
            __extends(Laser, _super);
            function Laser() {
                var _this = _super.call(this) || this;
                _this._nRadius = 1;
                return _this;
            }
            ///
            /// STATIC
            ///
            Laser.FromShip = function (cShip) {
                var cLaser = new Laser();
                cLaser.team = cShip.team;
                cLaser.position = new FireHare.Vector(cShip.position.X, cShip.position.Y);
                cLaser.rotation = cShip.rotation;
                cLaser.applyForce(FireHare.Vector.DirectionFromRotation(cShip.rotation, 3));
                cLaser.applyForce(cShip.velocity.multiply(3));
                return cLaser;
            };
            ///
            /// PUBLIC
            ///
            Laser.prototype.draw = function (cCanvas) {
                cCanvas.drawCircle(this.position, 2, FireHare.Colour.Red);
                _super.prototype.draw.call(this, cCanvas);
            };
            ///
            /// EVENT HANDLERS
            ///
            Laser.prototype.onApplyDamage = function (nDamage) {
                this.destroy();
            };
            Laser.prototype.onCollision = function (cForce) {
                this.destroy();
            };
            return Laser;
        }(Asteroids.GameObject));
        Asteroids.Laser = Laser;
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var Ship = /** @class */ (function (_super) {
            __extends(Ship, _super);
            function Ship(gTeam) {
                var _this = _super.call(this, gTeam) || this;
                _this.fired = new FireHare.Event();
                return _this;
            }
            ///
            /// PUBLIC
            ///
            Ship.prototype.fire = function () {
                this.fired.raise(this);
            };
            Ship.prototype.accellerate = function () {
                var nX = Math.cos(this.rotation) * (this._cStats.accelleration * (FireHare.Timer.ElapsedTime));
                var nY = Math.sin(this.rotation) * (this._cStats.accelleration * (FireHare.Timer.ElapsedTime));
                this.applyForce(new FireHare.Vector(nX, nY));
            };
            Ship.prototype.decellerate = function () {
                var nX = Math.cos(this.rotation) * (this._cStats.accelleration * (FireHare.Timer.ElapsedTime));
                var nY = Math.sin(this.rotation) * (this._cStats.accelleration * (FireHare.Timer.ElapsedTime));
                this.applyForce(new FireHare.Vector(-nX, -nY));
            };
            Ship.prototype.turnToPort = function () {
                this._nRotation -= this._cStats.rotationSpeed;
            };
            Ship.prototype.turnToStarboard = function () {
                this._nRotation += this._cStats.rotationSpeed;
            };
            Ship.prototype.update = function () {
                _super.prototype.update.call(this);
            };
            Ship.prototype.draw = function (cCanvas) {
                _super.prototype.draw.call(this, cCanvas);
                cCanvas.drawCircle(this.position, this.radius, FireHare.Colour.Blue);
                var cPosition = new FireHare.Vector(this.position.X, this.position.Y + 50);
                FireHare.Log.AddWorldItem(String.format("Id: {0}", this.identifier), cPosition);
                cPosition = cPosition.add(new FireHare.Vector(0, 10));
                FireHare.Log.AddWorldItem(String.format("Position: X: {0}", Math.round(this.position.X)), cPosition);
                cPosition = cPosition.add(new FireHare.Vector(0, 10));
                FireHare.Log.AddWorldItem(String.format("Position: Y: {0}", Math.round(this.position.Y)), cPosition);
                cPosition = cPosition.add(new FireHare.Vector(0, 10));
                FireHare.Log.AddWorldItem(String.format("Shields: {0}", Math.round(this.stats.shields)), cPosition);
                cPosition = cPosition.add(new FireHare.Vector(0, 10));
                FireHare.Log.AddWorldItem(String.format("Armour: {0}", Math.round(this.stats.armour)), cPosition);
                cPosition = cPosition.add(new FireHare.Vector(0, 10));
                FireHare.Log.AddWorldItem(String.format("Hull: {0}", Math.round(this.stats.hull)), cPosition);
                cPosition = cPosition.add(new FireHare.Vector(0, 10));
                FireHare.Log.AddWorldItem(String.format("Is Alive: {0}", this.isAlive), cPosition);
            };
            return Ship;
        }(Asteroids.GameObject));
        Asteroids.Ship = Ship;
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
/// <reference path="ship.ts" />
var FireHare;
/// <reference path="ship.ts" />
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var Havok = /** @class */ (function (_super) {
            __extends(Havok, _super);
            function Havok(gTeam) {
                var _this = _super.call(this, gTeam) || this;
                _this._liComponents.push(new Asteroids.Components.RearWing(new FireHare.Vector(-30, -12), false, 1));
                _this._liComponents.push(new Asteroids.Components.RearWing(new FireHare.Vector(-30, 12), true, 1));
                _this._liComponents.push(new Asteroids.Components.Wing(new FireHare.Vector(-10, -20), false, 1));
                _this._liComponents.push(new Asteroids.Components.Wing(new FireHare.Vector(-10, 20), true, 1));
                _this._liComponents.push(new Asteroids.Components.Cockpit(new FireHare.Vector(40, 0), false, 1.5));
                _this._liComponents.push(new Asteroids.Components.Pad(new FireHare.Vector(0, -8), false, 1.5));
                _this._liComponents.push(new Asteroids.Components.Pad(new FireHare.Vector(0, 8), true, 1.5));
                return _this;
            }
            return Havok;
        }(Asteroids.Ship));
        Asteroids.Havok = Havok;
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var Player = /** @class */ (function () {
            function Player(gId, gShipId, gTeam) {
                this._gId = gId;
                this._gTeam = gTeam;
                this._cShip = new Asteroids.Havok(this._gTeam);
                this._cShip.identifier = gShipId;
            }
            ///
            /// PUBLIC
            ///
            Player.prototype.update = function () {
            };
            Player.prototype.draw = function (cCanvas) {
            };
            Object.defineProperty(Player.prototype, "identifier", {
                ///
                /// PROPERTIES
                ///
                get: function () {
                    return this._gId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Player.prototype, "ship", {
                get: function () {
                    return this._cShip;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Player.prototype, "team", {
                get: function () {
                    return this._gTeam;
                },
                enumerable: true,
                configurable: true
            });
            return Player;
        }());
        Asteroids.Player = Player;
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
/// <reference path="player.ts" />
var FireHare;
/// <reference path="player.ts" />
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var LocalPlayer = /** @class */ (function (_super) {
            __extends(LocalPlayer, _super);
            function LocalPlayer(gId, gShipId, gTeam) {
                var _this = _super.call(this, gId, gShipId, gTeam) || this;
                _this.fired = new FireHare.Event();
                _this.selfDestruct = new FireHare.Event();
                _this.turnToPort = new FireHare.Event();
                _this.turnToStarboard = new FireHare.Event();
                _this.accellerate = new FireHare.Event();
                _this.decellerate = new FireHare.Event();
                _this._cShip.position = FireHare.Vector.Zero;
                FireHare.Input.INPUT();
                _this.initEvents();
                return _this;
            }
            LocalPlayer.prototype.initEvents = function () {
                var _this = this;
                window.addEventListener('touchstart', function (e) {
                    for (var i = 0; i < e.touches.length; i++) {
                        var cTouch = e.touches.item(i);
                        _this._cShip.turnToFace(FireHare.Camera.ScreenToWorld(new FireHare.Vector(cTouch.clientX, cTouch.clientY)));
                    }
                    e.preventDefault();
                    e.cancelBubble = true;
                });
            };
            ///
            /// PUBLIC
            ///
            LocalPlayer.prototype.update = function () {
                if (this._cShip.isAlive) {
                    if (FireHare.Input.IsKeyDown(87 /* W */))
                        this.accellerate.raise(this);
                    if (FireHare.Input.IsKeyDown(83 /* S */))
                        this.decellerate.raise(this);
                    if (FireHare.Input.IsKeyDown(65 /* A */))
                        this.turnToPort.raise(this);
                    if (FireHare.Input.IsKeyDown(68 /* D */))
                        this.turnToStarboard.raise(this);
                    if (FireHare.Input.IsKeyPressed(32 /* Spacebar */))
                        this.fired.raise(this);
                    if (FireHare.Input.IsKeyPressed(46 /* Delete */))
                        this.selfDestruct.raise(this);
                }
                else {
                    if (FireHare.Input.IsKeyDown(87 /* W */))
                        this._cCameraPosition.Y -= 1;
                    if (FireHare.Input.IsKeyDown(83 /* S */))
                        this._cCameraPosition.Y += 1;
                    if (FireHare.Input.IsKeyDown(65 /* A */))
                        this._cCameraPosition.X -= 1;
                    if (FireHare.Input.IsKeyDown(68 /* D */))
                        this._cCameraPosition.X += 1;
                }
            };
            LocalPlayer.prototype.draw = function (cCanvas) {
                FireHare.Log.AddScreenItem("LOCAL PLAYER ID: " + this.identifier.toString(), new FireHare.Vector(500, 25));
                if (this._cShip.isAlive)
                    this._cCameraPosition = new FireHare.Vector(this._cShip.position.X, this._cShip.position.Y);
                cCanvas.moveTo(this._cCameraPosition);
                _super.prototype.draw.call(this, cCanvas);
            };
            return LocalPlayer;
        }(Asteroids.Player));
        Asteroids.LocalPlayer = LocalPlayer;
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var PlayerAction;
        (function (PlayerAction) {
            PlayerAction[PlayerAction["TurnToPort"] = 0] = "TurnToPort";
            PlayerAction[PlayerAction["TurnToStarboard"] = 1] = "TurnToStarboard";
            PlayerAction[PlayerAction["Accellerate"] = 2] = "Accellerate";
            PlayerAction[PlayerAction["Decellerate"] = 3] = "Decellerate";
            PlayerAction[PlayerAction["SelfDestruct"] = 4] = "SelfDestruct";
            PlayerAction[PlayerAction["Fire"] = 5] = "Fire";
        })(PlayerAction = Asteroids.PlayerAction || (Asteroids.PlayerAction = {}));
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
/// <reference path="player.ts" />
var FireHare;
/// <reference path="player.ts" />
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var ServerPlayer = /** @class */ (function (_super) {
            __extends(ServerPlayer, _super);
            function ServerPlayer(cSocket) {
                var _this = _super.call(this, Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid()) || this;
                _this._cSocket = cSocket;
                return _this;
            }
            Object.defineProperty(ServerPlayer.prototype, "socket", {
                ///
                /// PROPERTIES
                ///
                get: function () {
                    return this._cSocket;
                },
                enumerable: true,
                configurable: true
            });
            return ServerPlayer;
        }(Asteroids.Player));
        Asteroids.ServerPlayer = ServerPlayer;
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var Args;
        (function (Args) {
            var PlayerActionArgs = /** @class */ (function () {
                function PlayerActionArgs(gIdentifier, eAction) {
                    this.identifier = gIdentifier.toString();
                    this.action = eAction;
                }
                return PlayerActionArgs;
            }());
            Args.PlayerActionArgs = PlayerActionArgs;
            var ObjectDamagedArgs = /** @class */ (function () {
                function ObjectDamagedArgs(gId, nDamage) {
                    this.identifier = gId.toString();
                    this.damage = nDamage;
                }
                return ObjectDamagedArgs;
            }());
            Args.ObjectDamagedArgs = ObjectDamagedArgs;
            var ObjectSpawnedArgs = /** @class */ (function () {
                function ObjectSpawnedArgs(eType, cObject, cSpawner) {
                    this.objectType = eType;
                    this.objectId = cObject.identifier.toString();
                    this.positionX = cObject.position.X;
                    this.positionY = cObject.position.Y;
                    this.rotation = cObject.rotation;
                    if (hasValue(cSpawner))
                        this.spawnerId = cSpawner.identifier.toString();
                    else
                        this.spawnerId = String.empty;
                }
                return ObjectSpawnedArgs;
            }());
            Args.ObjectSpawnedArgs = ObjectSpawnedArgs;
            var SynchroniseArgs = /** @class */ (function () {
                function SynchroniseArgs(liObjects) {
                    this.objectId = [];
                    this.positionX = [];
                    this.positionY = [];
                    this.rotation = [];
                    for (var i = 0; i < liObjects.length; i++) {
                        this.objectId.push(liObjects[i].identifier.toString());
                        this.positionX.push(liObjects[i].position.X);
                        this.positionY.push(liObjects[i].position.Y);
                        this.rotation.push(liObjects[i].rotation);
                    }
                }
                return SynchroniseArgs;
            }());
            Args.SynchroniseArgs = SynchroniseArgs;
            var ObjectDestroyedArgs = /** @class */ (function () {
                function ObjectDestroyedArgs(gId, liScrap) {
                    this.objectId = gId.toString();
                    this.scrapId = [];
                    this.scrapX = [];
                    this.scrapY = [];
                    this.scrapRotation = [];
                    for (var i = 0; i < liScrap.length; i++) {
                        this.scrapId.push(liScrap[i].identifier.toString());
                        this.scrapX.push(liScrap[i].position.X);
                        this.scrapY.push(liScrap[i].position.Y);
                        this.scrapRotation.push(liScrap[i].rotation);
                    }
                }
                return ObjectDestroyedArgs;
            }());
            Args.ObjectDestroyedArgs = ObjectDestroyedArgs;
            var PlayerHandshakeArgs = /** @class */ (function () {
                function PlayerHandshakeArgs(gId, gShipId, gTeam, liGameObjects) {
                    this.identifier = gId.toString();
                    this.shipIdentifier = gShipId.toString();
                    this.teamIdentifier = gTeam.toString();
                    this.objects = [];
                    this.objectTypes = [];
                    this.scrapData = [];
                    this.positionX = [];
                    this.positionY = [];
                    for (var i = 0; i < liGameObjects.length; i++) {
                        this.objects.push(liGameObjects[i].identifier.toString());
                        var aObject = liGameObjects[i];
                        var eType = Asteroids.ObjectType.Unknown;
                        if (aObject instanceof Asteroids.Ship)
                            eType = Asteroids.ObjectType.Ship;
                        if (aObject instanceof Asteroids.Scrap) {
                            eType = Asteroids.ObjectType.Scrap;
                            var cComponent = aObject.components[0];
                            this.scrapData.push({
                                team: aObject.team,
                                type: cComponent.type,
                                mirror: cComponent.isMirror,
                                scale: cComponent.scale,
                                xOffset: cComponent.offset.X,
                                yOffset: cComponent.offset.Y
                            });
                        }
                        if (aObject instanceof Asteroids.Laser)
                            eType = Asteroids.ObjectType.Laser;
                        this.objectTypes.push(eType);
                        this.positionX.push(liGameObjects[i].position.X);
                        this.positionY.push(liGameObjects[i].position.Y);
                    }
                }
                return PlayerHandshakeArgs;
            }());
            Args.PlayerHandshakeArgs = PlayerHandshakeArgs;
            var PlayerConnectedArgs = /** @class */ (function () {
                function PlayerConnectedArgs(gId, gShip, gTeam) {
                    this.identifier = gId.toString();
                    this.shipIdentifier = gShip.toString();
                    this.teamIdentifier = gTeam.toString();
                }
                return PlayerConnectedArgs;
            }());
            Args.PlayerConnectedArgs = PlayerConnectedArgs;
            var PlayerDisconnectedArgs = /** @class */ (function () {
                function PlayerDisconnectedArgs(gId) {
                    this.identifier = gId.toString();
                }
                return PlayerDisconnectedArgs;
            }());
            Args.PlayerDisconnectedArgs = PlayerDisconnectedArgs;
        })(Args = Asteroids.Args || (Asteroids.Args = {}));
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var Helper = /** @class */ (function () {
            function Helper() {
            }
            Helper.WrapRotation = function (nRotation) {
                while (nRotation < -Math.PI) {
                    nRotation += (Math.PI * 2);
                }
                while (nRotation > Math.PI) {
                    nRotation -= (Math.PI * 2);
                }
                return nRotation;
            };
            Helper.Clamp = function (nNumber, nMin, nMax) {
                if (nNumber > nMax) {
                    return nMax;
                }
                if (nNumber < nMin) {
                    return nMin;
                }
                return nNumber;
            };
            return Helper;
        }());
        Asteroids.Helper = Helper;
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var Messages = /** @class */ (function () {
            function Messages() {
            }
            /// MISC
            Messages.PlayerConnected = "PlayerConnected";
            Messages.PlayerDisconnected = "PlayerDisconnected";
            Messages.PlayerHandshake = "PlayerHandshake";
            /// GAMEPLAY
            Messages.PlayerAction = "PlayerAction";
            Messages.ObjectSpawned = "ObjectSpawned";
            Messages.ObjectDestroyed = "ObjectDestroyed";
            Messages.ObjectDamaged = "ObjectDamaged";
            Messages.ShipFired = "ShipFired";
            Messages.Synchronise = "Synchronise";
            return Messages;
        }());
        Asteroids.Messages = Messages;
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var Stats = /** @class */ (function () {
            function Stats() {
                // Set general
                this._nAccelleration = 0.001;
                this._nMinSpeed = 0;
                this._nMaxSpeed = 1;
                this._nRotationSpeed = 0.05;
                // Set shields
                this._nShieldRegenerationCap = 1000; // 1s
                this._nShieldRegen = 0;
                //this._nShieldCap = 100;
                this._nShieldCap = 0;
                this._nShields = this._nShieldCap;
                // Set armour
                //this._nArmourCap = 100;
                this._nArmourCap = 0;
                this._nArmour = this._nArmourCap;
                this._nArmourRegen = 1000;
                // Set hull
                this._nHullCap = 200;
                this._nHull = this._nHullCap;
                this._nHullRegen = 1000;
            }
            ///
            /// PUBLIC
            ///
            Stats.prototype.update = function () {
                //this.regenStats();
            };
            Stats.prototype.applyDamage = function (nTotalDamage) {
                FireHare.Log.AddItem(String.format("Applying {0} damage", nTotalDamage));
                var nDamage = nTotalDamage;
                // Check if hit is on shields	
                if (this._nShields > 0) {
                    // Impacts on shields
                    this._nShields -= nDamage;
                    // Reset shield regen timer
                    this._nShieldRegen = this._nShieldRegenerationCap;
                    // Object lives on!
                    return false;
                }
                if (this._nArmour > 0) {
                    if (this._nArmour > nDamage) {
                        // Impact on the armour
                        this._nArmour -= nDamage;
                        // No damage remaining
                        nDamage -= nTotalDamage;
                    }
                    else {
                        nDamage = nTotalDamage - this._nArmour;
                        this._nArmour -= nDamage;
                    }
                }
                FireHare.Log.AddItem(String.format("Before applying {0} damage to hull ({1})", nDamage, this._nHull));
                if (this._nHull > nDamage) {
                    // Impact on the health
                    this._nHull -= nDamage;
                    FireHare.Log.AddItem(String.format("After applying {0} damage to hull ({1})", nDamage, this._nHull));
                }
                else {
                    // KA-BOOM!
                    return true; // Object died!
                }
                // Reset shield regen timer
                this._nShieldRegen = this._nShieldRegenerationCap;
                return false;
            };
            ///
            /// PRIVATE
            ///
            Stats.prototype.regenStats = function () {
                var nElapsedTime = FireHare.Timer.ElapsedTime;
                // Count Down Shield Regen Timer
                if (this._nShieldRegen > 0)
                    this._nShieldRegen -= nElapsedTime;
                // Calculate how much to regen by this frame
                var nHullRegenAmount = (this._nHullRegen / 1000) * nElapsedTime;
                var nArmourRegenAmount = (this._nArmourRegen / 1000) * nElapsedTime;
                // Regen armour
                if (this._nArmour < this._nArmourCap)
                    this._nArmour += nArmourRegenAmount;
                // Regen hull
                if (this._nHull < this._nHullCap)
                    this._nHull += nHullRegenAmount;
                // Check if shields should regen
                if (this._nShieldRegen <= 0 && this._nShields < this._nShieldCap) {
                    // Regen shields
                    this._nShields += (this._nShieldCap / 1000) * nElapsedTime; // Regen in 1 second
                    // Make sure shields dont overflow
                    if (this._nShields > this._nShieldCap)
                        this._nShields = this._nShieldCap;
                }
                // Just to be safe...
                if (this._nShields < 0)
                    this._nShields = 0;
                // Just to be safe...
                if (this._nShields > this._nShieldCap)
                    this._nShields = this._nShieldCap;
                // Just to be safe...
                if (this._nArmour < 0)
                    this._nArmour = 0;
                // Just to be safe...
                if (this._nArmour > this._nArmourCap)
                    this._nArmour = this._nArmourCap;
                // Just to be safe...
                if (this._nHull < 0)
                    this._nHull = 0;
                // Just to be safe...
                if (this._nHull > this._nHullCap)
                    this._nHull = this._nHullCap;
            };
            Object.defineProperty(Stats.prototype, "accelleration", {
                ///
                /// PROPERTIES
                ///
                get: function () {
                    return this._nAccelleration;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stats.prototype, "rotationSpeed", {
                get: function () {
                    return this._nRotationSpeed;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stats.prototype, "maxSpeed", {
                get: function () {
                    return this._nMaxSpeed;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stats.prototype, "maxShields", {
                get: function () {
                    return this._nShieldCap;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stats.prototype, "shields", {
                get: function () {
                    return this._nShields;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stats.prototype, "maxArmour", {
                get: function () {
                    return this._nArmourCap;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stats.prototype, "armour", {
                get: function () {
                    return this._nArmour;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stats.prototype, "maxHull", {
                get: function () {
                    return this._nHullCap;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stats.prototype, "hull", {
                get: function () {
                    return this._nHull;
                },
                enumerable: true,
                configurable: true
            });
            return Stats;
        }());
        Asteroids.Stats = Stats;
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
var FireHare;
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var District = /** @class */ (function () {
            function District() {
            }
            District.LimitPositionToDistrict = function (cVector) {
                var nX = cVector.X;
                var nY = cVector.Y;
                if (cVector.X < District.DISTRICT_MIN.X)
                    nX = District.DISTRICT_MAX.X;
                if (cVector.Y < District.DISTRICT_MIN.Y)
                    nY = District.DISTRICT_MAX.Y;
                if (cVector.X > District.DISTRICT_MAX.X)
                    nX = District.DISTRICT_MIN.X;
                if (cVector.Y > District.DISTRICT_MAX.Y)
                    nY = District.DISTRICT_MIN.Y;
                return new FireHare.Vector(nX, nY);
            };
            District.RandomSpawn = function () {
                var cPosition = new FireHare.Vector(FireHare.Random.Next(0, District.DISTRICT_MAX.X), FireHare.Random.Next(0, District.DISTRICT_MAX.Y));
                return cPosition;
            };
            District.draw = function (cCanvas) {
            };
            District.drawGrid = function (cCanvas, cOffset) {
                var nSize = 5000;
                var nGridSize = 10;
                var nSmallGridSize = 10;
                var nThick = 2;
                var nThin = 1;
                var nX = (Math.round(cOffset.X / nSize) * nSize) - (nSize * (nGridSize / 2));
                var nY = (Math.round(cOffset.Y / nSize) * nSize) - (nSize * (nGridSize / 2));
                var nSmallX = 0;
                var nSmallY = 0;
                var m_kContext = cCanvas.context;
                m_kContext.strokeStyle = 'darkgray';
                // Draw first two lines
                cCanvas.moveToWorldSpace();
                m_kContext.beginPath();
                m_kContext.lineWidth = nThick;
                m_kContext.moveTo(nX, nY);
                m_kContext.lineTo(nX + (nSize * nGridSize), nY);
                m_kContext.moveTo(nX, nY);
                m_kContext.lineTo(nX, nY + (nSize * nGridSize));
                m_kContext.stroke();
                cCanvas.moveToScreenSpace();
                for (var i = 0; i < nGridSize; i++) {
                    nSmallX = nX;
                    nSmallY = nY;
                    cCanvas.moveToWorldSpace();
                    for (var j = 0; j < nSmallGridSize; j++) {
                        m_kContext.beginPath();
                        m_kContext.lineWidth = nThin;
                        m_kContext.moveTo(nSmallX, nSmallY);
                        m_kContext.lineTo(nSmallX + (nSize * nGridSize), nSmallY);
                        m_kContext.stroke();
                        nSmallY += (nSize / nSmallGridSize);
                    }
                    nY += nSize;
                    m_kContext.beginPath();
                    m_kContext.lineWidth = nThick;
                    m_kContext.moveTo(nX, nY);
                    m_kContext.lineTo(nX + (nSize * nGridSize), nY);
                    m_kContext.stroke();
                    cCanvas.moveToScreenSpace();
                }
                nX = (Math.round(cOffset.X / nSize) * nSize) - (nSize * (nGridSize / 2));
                nY = (Math.round(cOffset.Y / nSize) * nSize) - (nSize * (nGridSize / 2));
                for (var i = 0; i < nGridSize; i++) {
                    nSmallX = nX;
                    nSmallY = nY;
                    cCanvas.moveToWorldSpace();
                    for (var j = 0; j < nSmallGridSize; j++) {
                        m_kContext.beginPath();
                        m_kContext.lineWidth = nThin;
                        m_kContext.moveTo(nSmallX, nSmallY);
                        m_kContext.lineTo(nSmallX, nSmallY + (nSize * nGridSize));
                        m_kContext.stroke();
                        nSmallX += (nSize / nSmallGridSize);
                    }
                    nX += nSize;
                    m_kContext.beginPath();
                    m_kContext.lineWidth = nThick;
                    m_kContext.moveTo(nX, nY);
                    m_kContext.lineTo(nX, nY + (nSize * nGridSize));
                    m_kContext.stroke();
                    cCanvas.moveToScreenSpace();
                }
            };
            District.DISTRICT_MIN = new FireHare.Vector(0, 0);
            District.DISTRICT_MAX = new FireHare.Vector(500, 500);
            return District;
        }());
        Asteroids.District = District;
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
/// <reference path="../game/util/messages.ts" />
/// <reference path="../game/player/player.ts" />
/// <reference path="../game/player/serverPlayer.ts" />
/// <reference path="../game/util/args.ts" />
/// <reference path="../core/util/guid.ts" />
/// <reference path="../core/util/common.ts" />
/// <reference path="../game/game.ts" />
/// <reference path="../core/util/string.ts" />
/// <reference path="../core/util/event.ts" />
/// <reference path="../core/util/timer.ts" />
/// DEBUG
/// <reference path="../game/objects/scrap.ts" />
/// <reference path="../game/collisionManager.ts" />
var FireHare;
/// <reference path="../game/util/messages.ts" />
/// <reference path="../game/player/player.ts" />
/// <reference path="../game/player/serverPlayer.ts" />
/// <reference path="../game/util/args.ts" />
/// <reference path="../core/util/guid.ts" />
/// <reference path="../core/util/common.ts" />
/// <reference path="../game/game.ts" />
/// <reference path="../core/util/string.ts" />
/// <reference path="../core/util/event.ts" />
/// <reference path="../core/util/timer.ts" />
/// DEBUG
/// <reference path="../game/objects/scrap.ts" />
/// <reference path="../game/collisionManager.ts" />
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var Server = /** @class */ (function () {
            function Server() {
                var _this = this;
                this._cSAT = require('SAT');
                this._cExpress = require('express');
                this._cApp = this._cExpress();
                this._cHttp = require('http').Server(this._cApp);
                this._cPath = require('path');
                this._cSocketServer = require('socket.io')(this._cHttp);
                console.log(this._cSAT);
                FireHare.Timer.Init();
                this._liPlayers = [];
                this._liSockets = [];
                this._cGame = new Asteroids.Game();
                // Send everything in the client directory of the dist folder
                this._cApp.use(this._cExpress.static(this._cPath.join(__dirname + '/../client')));
                this._cApp.get('/', function (cRequest, cResponse) {
                    cResponse.sendFile(_this._cPath.join(__dirname + '/../client/index.html'));
                });
                this._cHttp.listen(5000, function () {
                    console.log("Listening on *:5000");
                });
                //new CollisionManager();
                return;
                this._cSocketServer.on('connection', this.onPlayerConnection.bind(this));
                this._cGame.objectDestroyed.addHandler(this.onObjectDestroyed.bind(this));
                this._cGame.objectSpawned.addHandler(this.onObjectSpawned.bind(this));
                this._cGame.objectDamaged.addHandler(this.onObjectDamaged.bind(this));
            }
            ///
            /// PUBLIC
            ///
            Server.prototype.update = function () {
                FireHare.Timer.TIMER().update();
                if (hasValue(this._cGame)) {
                    this._cGame.update();
                    this._cGame.collisionDetection();
                    this.synchronise();
                }
            };
            ///
            /// PRIVATE
            ///
            Server.prototype.synchronise = function () {
                this._cSocketServer.emit(Asteroids.Messages.Synchronise, new Asteroids.Args.SynchroniseArgs(this._cGame.gameObjects));
            };
            ///
            /// EVENT HANDLERS
            ///
            Server.prototype.onObjectDamaged = function (sender, cArgs) {
                this._cGame.damageObject(cArgs);
                this._cSocketServer.emit(Asteroids.Messages.ObjectDamaged, cArgs);
            };
            Server.prototype.onObjectSpawned = function (sender, cArgs) {
                this._cGame.spawnObject(cArgs);
                this._cSocketServer.emit(Asteroids.Messages.ObjectSpawned, cArgs);
            };
            Server.prototype.onObjectDestroyed = function (sender, cArgs) {
                this._cGame.destroyObject(cArgs);
                this._cSocketServer.emit(Asteroids.Messages.ObjectDestroyed, cArgs);
            };
            Server.prototype.onPlayerConnection = function (cSocket) {
                console.log("Player connected");
                var cPlayer = new Asteroids.ServerPlayer(cSocket);
                this._liPlayers.push(cPlayer);
                this._liSockets.push(cSocket);
                // Tell all existing players about this new one
                cSocket.broadcast.emit(Asteroids.Messages.PlayerConnected, new Asteroids.Args.PlayerConnectedArgs(cPlayer.identifier, cPlayer.ship.identifier, cPlayer.team));
                // Tell this new player about the existing ones
                cSocket.emit(Asteroids.Messages.PlayerHandshake, new Asteroids.Args.PlayerHandshakeArgs(cPlayer.identifier, cPlayer.ship.identifier, cPlayer.team, this._cGame.gameObjects));
                this._cGame.addGameObject(cPlayer.ship);
                cSocket.on('disconnect', this.onPlayerDisconnected.bind(this, cSocket));
                cSocket.on(Asteroids.Messages.PlayerAction, this.onPlayerAction.bind(this));
            };
            Server.prototype.onPlayerAction = function (cArgs) {
                this._cGame.applyAction(cArgs);
            };
            Server.prototype.onPlayerDisconnected = function (cSocket) {
                console.log("Player disconnected");
                var cPlayer = this._liPlayers[this._liSockets.indexOf(cSocket)];
                cPlayer.socket.broadcast.emit(Asteroids.Messages.PlayerDisconnected, new Asteroids.Args.PlayerDisconnectedArgs(cPlayer.identifier));
                this._cGame.removeGameObject(cPlayer.ship.identifier);
            };
            return Server;
        }());
        Asteroids.Server = Server;
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
/// <reference path="server/Server.ts" />
var cServer = new FireHare.Asteroids.Server();
setInterval(function () {
    cServer.update();
}, 10);
/// <reference path="../game/game.ts" />
// var C = SAT.Circle;
// var V = SAT.Vector;
// var circle1 = new C(new V(0, 0), 100);
// var circle2 = new C(new V(0, 0), 100);
// var result;
// SAT.testCircleCircle(circle1, circle2, result);
//console.log(result);
var FireHare;
/// <reference path="../game/game.ts" />
// var C = SAT.Circle;
// var V = SAT.Vector;
// var circle1 = new C(new V(0, 0), 100);
// var circle2 = new C(new V(0, 0), 100);
// var result;
// SAT.testCircleCircle(circle1, circle2, result);
//console.log(result);
(function (FireHare) {
    var Asteroids;
    (function (Asteroids) {
        var Client = /** @class */ (function () {
            function Client(cSocket) {
                FireHare.Timer.Init();
                this._cSocket = cSocket;
                var cCanvas = document.getElementById("canvas");
                var cContext = cCanvas.getContext("2d");
                this._cCanvas = new FireHare.Canvas(cContext);
                this._cSocket.on('disconnect', this.onServerDisconnected.bind(this));
                this._cSocket.on(Asteroids.Messages.PlayerHandshake, this.onPlayerHandshake.bind(this));
                this._cSocket.on(Asteroids.Messages.PlayerConnected, this.onPlayerConnected.bind(this));
                this._cSocket.on(Asteroids.Messages.PlayerDisconnected, this.onPlayerDisconnect.bind(this));
                this._cSocket.on(Asteroids.Messages.Synchronise, this.onSynchronise.bind(this));
                this._cSocket.on(Asteroids.Messages.ObjectDestroyed, this.onObjectDestroyed.bind(this));
                this._cSocket.on(Asteroids.Messages.ObjectSpawned, this.onObjectSpawned.bind(this));
                this._cSocket.on(Asteroids.Messages.ObjectDamaged, this.onObjectDamaged.bind(this));
                this._liPlayers = [];
                this._cGame = new Asteroids.Game();
                this.onRequestAnimationFrame();
            }
            ///
            /// PRIVATE
            ///
            Client.prototype.getPlayer = function (gPlayer) {
                for (var i = 0; i < this._liPlayers.length; i++) {
                    if (this._liPlayers[i].identifier.equals(gPlayer))
                        return this._liPlayers[i];
                }
            };
            ///
            /// EVENT HANDLERS
            ///
            Client.prototype.onServerDisconnected = function () {
                window.location.href = window.location.href;
            };
            Client.prototype.onObjectDamaged = function (cArgs) {
                this._cGame.damageObject(cArgs);
            };
            Client.prototype.onObjectSpawned = function (cArgs) {
                this._cGame.spawnObject(cArgs);
            };
            Client.prototype.onObjectDestroyed = function (cArgs) {
                this._cGame.destroyObject(cArgs);
            };
            Client.prototype.onSynchronise = function (cArgs) {
                this._cGame.synchronise(cArgs);
            };
            Client.prototype.onPlayerHandshake = function (cArgs) {
                var _this = this;
                FireHare.Log.AddItem("Player handshake received");
                var gId = new Guid(cArgs.shipIdentifier);
                this._cPlayer = new Asteroids.LocalPlayer(gId, new Guid(cArgs.shipIdentifier), new Guid(cArgs.teamIdentifier));
                this._cPlayer.accellerate.addHandler(function () {
                    _this._cSocket.emit(Asteroids.Messages.PlayerAction, new Asteroids.Args.PlayerActionArgs(gId, Asteroids.PlayerAction.Accellerate));
                });
                this._cPlayer.decellerate.addHandler(function () {
                    _this._cSocket.emit(Asteroids.Messages.PlayerAction, new Asteroids.Args.PlayerActionArgs(gId, Asteroids.PlayerAction.Decellerate));
                });
                this._cPlayer.turnToPort.addHandler(function () {
                    _this._cSocket.emit(Asteroids.Messages.PlayerAction, new Asteroids.Args.PlayerActionArgs(gId, Asteroids.PlayerAction.TurnToPort));
                });
                this._cPlayer.turnToStarboard.addHandler(function () {
                    _this._cSocket.emit(Asteroids.Messages.PlayerAction, new Asteroids.Args.PlayerActionArgs(gId, Asteroids.PlayerAction.TurnToStarboard));
                });
                this._cPlayer.selfDestruct.addHandler(function () {
                    _this._cSocket.emit(Asteroids.Messages.PlayerAction, new Asteroids.Args.PlayerActionArgs(gId, Asteroids.PlayerAction.SelfDestruct));
                });
                this._cPlayer.fired.addHandler(function () {
                    _this._cSocket.emit(Asteroids.Messages.PlayerAction, new Asteroids.Args.PlayerActionArgs(gId, Asteroids.PlayerAction.Fire));
                });
                this._cGame.addGameObject(this._cPlayer.ship);
                for (var i = 0; i < cArgs.objects.length; i++) {
                    var gId_1 = new Guid(cArgs.objects[i]);
                    var cPosition = new FireHare.Vector(cArgs.positionX[i], cArgs.positionY[i]);
                    switch (cArgs.objectTypes[i]) {
                        case Asteroids.ObjectType.Ship:
                            var cShip = new Asteroids.Havok();
                            cShip.identifier = gId_1;
                            cShip.position = cPosition;
                            this._cGame.addGameObject(cShip);
                            break;
                        case Asteroids.ObjectType.Laser:
                            var cLaser = new Asteroids.Laser();
                            cLaser.identifier = gId_1;
                            cLaser.position = cPosition;
                            this._cGame.addGameObject(cLaser);
                            break;
                        case Asteroids.ObjectType.Scrap:
                            var aData = cArgs.scrapData.splice(0, 1)[0];
                            var gTeam = new Guid(aData['team']);
                            var cScrap = new Asteroids.Scrap(gTeam, Asteroids.Components.Component.CreateComponent(aData['type'], aData['mirror'], aData['scale'], new FireHare.Vector(aData['xOffset'], aData['yOffset'])), FireHare.Vector.Zero);
                            cScrap.identifier = gId_1;
                            cScrap.position = cPosition;
                            this._cGame.addGameObject(cScrap);
                            break;
                    }
                }
            };
            Client.prototype.onPlayerConnected = function (cArgs) {
                FireHare.Log.AddItem(String.format("Player connected ({0}).", cArgs.identifier));
                var cPlayer = new Asteroids.Player(new Guid(cArgs.identifier), new Guid(cArgs.shipIdentifier), new Guid(cArgs.teamIdentifier));
                this._liPlayers.push(cPlayer);
                this._cGame.addGameObject(cPlayer.ship);
            };
            Client.prototype.onPlayerDisconnect = function (cArgs) {
                var cPlayer = this.getPlayer(new Guid(cArgs.identifier));
                if (!hasValue(cPlayer))
                    return;
                this._cGame.removeGameObject(cPlayer.ship.identifier);
                FireHare.Log.AddItem("Player disconnected.");
            };
            Client.prototype.onRequestAnimationFrame = function () {
                FireHare.Timer.TIMER().update();
                FireHare.Log.LOG().update();
                this._cCanvas.update();
                // Clear the canvas back to black
                this._cCanvas.clear();
                if (FireHare.Input.IsKeyDown(107 /* NumpadPlus */)) {
                    FireHare.Camera.ZoomIn();
                }
                if (FireHare.Input.IsKeyDown(109 /* NumpadMinus */)) {
                    FireHare.Camera.ZoomOut();
                }
                if (hasValue(this._cPlayer)) {
                    Asteroids.District.drawGrid(this._cCanvas, this._cPlayer.ship.position);
                    this._cGame.update();
                    this._cPlayer.update();
                    //this._cCanvas.moveTo(this._cGame.gameObjects[0].position);
                    //this._cCanvas.moveTo(this._cPlayer.ship.position);
                    this._cPlayer.draw(this._cCanvas);
                    this._cGame.draw(this._cCanvas);
                }
                // Draw the log on top of everything
                FireHare.Log.LOG().draw(this._cCanvas);
                FireHare.Input.Update();
                window.requestAnimationFrame(this.onRequestAnimationFrame.bind(this));
            };
            return Client;
        }());
        Asteroids.Client = Client;
    })(Asteroids = FireHare.Asteroids || (FireHare.Asteroids = {}));
})(FireHare || (FireHare = {}));
