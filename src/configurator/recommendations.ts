import { getPackage } from "./packages";
import { STYLES } from "./questions";

export function recommendedPackageId(
  styleId: string | null,
  budgetId: string | null,
) {
  const style = STYLES.find((entry) => entry.id === styleId);
  const fromStyle = style?.packageId ?? "natural";

  if (budgetId === "25-40" && fromStyle === "monolith") {
    return "gallery";
  }

  return fromStyle;
}

export function recommendedPackage(
  styleId: string | null,
  budgetId: string | null,
) {
  return getPackage(recommendedPackageId(styleId, budgetId));
}
