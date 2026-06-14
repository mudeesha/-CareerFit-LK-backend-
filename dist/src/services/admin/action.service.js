"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminActionsService = getAdminActionsService;
const action_repository_1 = require("../../repositories/admin/action.repository");
async function getAdminActionsService(filters) {
    const actions = await (0, action_repository_1.findAdminActions)(filters);
    return {
        items: actions,
        count: actions.length,
    };
}
//# sourceMappingURL=action.service.js.map