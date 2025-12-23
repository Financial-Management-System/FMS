import { Organization } from "../model/organization.model";

export default async function generateOrgId() {
  const lastOrg = await Organization.findOne(
    { org_id: /^org_\d+$/ },
    { org_id: 1 }
  ).sort({ createdAt: -1 });

  if (!lastOrg) return "org_1";

  const lastNumber = Number(lastOrg.org_id.split("_")[1]);
  return `org_${lastNumber + 1}`;
}