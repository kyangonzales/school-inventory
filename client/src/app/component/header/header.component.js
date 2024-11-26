"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var HeaderComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'header',
            standalone: true,
            imports: [forms_1.ReactiveFormsModule, common_1.CommonModule],
            templateUrl: './header.component.html',
            styleUrl: './header.component.css'
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _modalTitle_decorators;
    var _modalTitle_initializers = [];
    var _fields_decorators;
    var _fields_initializers = [];
    var _onSubmitCallback_decorators;
    var _onSubmitCallback_initializers = [];
    var _search_decorators;
    var _search_initializers = [];
    var HeaderComponent = _classThis = /** @class */ (function () {
        function HeaderComponent_1(formBuilder) {
            this.formBuilder = (__runInitializers(this, _instanceExtraInitializers), formBuilder);
            this.title = __runInitializers(this, _title_initializers, '');
            this.modalTitle = __runInitializers(this, _modalTitle_initializers, '');
            this.fields = __runInitializers(this, _fields_initializers, []);
            this.onSubmitCallback = __runInitializers(this, _onSubmitCallback_initializers, new core_1.EventEmitter());
            this.search = __runInitializers(this, _search_initializers, new core_1.EventEmitter());
            this.isModalOpen = false;
            this.formGroup = this.formBuilder.group({});
        }
        HeaderComponent_1.prototype.onSearch = function (event) {
            this.search.emit(event.target.value);
        };
        HeaderComponent_1.prototype.ngOnInit = function () {
            var formControls = {};
            this.fields.forEach(function (field) {
                formControls[field.name] = ['', forms_1.Validators.required];
            });
            this.formGroup = this.formBuilder.group(formControls);
        };
        HeaderComponent_1.prototype.onSubmit = function () {
            if (this.formGroup.valid) {
                this.onSubmitCallback.emit(this.formGroup.value);
                this.isModalOpen = false;
                console.log("child component: ", this.formGroup.value);
            }
        };
        return HeaderComponent_1;
    }());
    __setFunctionName(_classThis, "HeaderComponent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _title_decorators = [(0, core_1.Input)()];
        _modalTitle_decorators = [(0, core_1.Input)()];
        _fields_decorators = [(0, core_1.Input)()];
        _onSubmitCallback_decorators = [(0, core_1.Input)()];
        _search_decorators = [(0, core_1.Output)()];
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _modalTitle_decorators, { kind: "field", name: "modalTitle", static: false, private: false, access: { has: function (obj) { return "modalTitle" in obj; }, get: function (obj) { return obj.modalTitle; }, set: function (obj, value) { obj.modalTitle = value; } }, metadata: _metadata }, _modalTitle_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _fields_decorators, { kind: "field", name: "fields", static: false, private: false, access: { has: function (obj) { return "fields" in obj; }, get: function (obj) { return obj.fields; }, set: function (obj, value) { obj.fields = value; } }, metadata: _metadata }, _fields_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _onSubmitCallback_decorators, { kind: "field", name: "onSubmitCallback", static: false, private: false, access: { has: function (obj) { return "onSubmitCallback" in obj; }, get: function (obj) { return obj.onSubmitCallback; }, set: function (obj, value) { obj.onSubmitCallback = value; } }, metadata: _metadata }, _onSubmitCallback_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HeaderComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HeaderComponent = _classThis;
}();
exports.HeaderComponent = HeaderComponent;
