import { GetAdminActionsQueryDto } from "../../dtos/admin/action.dto";
import { findAdminActions } from "../../repositories/admin/action.repository";

export async function getAdminActionsService(filters: GetAdminActionsQueryDto) {
  const actions = await findAdminActions(filters);

  return {
    items: actions,
    count: actions.length,
  };
}