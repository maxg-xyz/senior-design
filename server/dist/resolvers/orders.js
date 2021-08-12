"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderResolver = void 0;
const Order_1 = require("../entities/Order");
const isAuth_1 = require("../middleware/isAuth");
const type_graphql_1 = require("type-graphql");
let OrderInput = class OrderInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Array)
], OrderInput.prototype, "items", void 0);
OrderInput = __decorate([
    type_graphql_1.InputType()
], OrderInput);
class OrderResolver {
    createOrder(input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            return Order_1.Order.create(Object.assign(Object.assign({}, input), { customerId: req.session.userId })).save();
        });
    }
}
__decorate([
    type_graphql_1.Mutation(() => Order_1.Order),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("input")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [OrderInput, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "createOrder", null);
exports.OrderResolver = OrderResolver;
//# sourceMappingURL=orders.js.map