/** Keep delete failures helpful without exposing raw server or database errors. */
export function getListDeleteErrorMessage(
  error: unknown,
  singular: string,
  isParent = false,
): string {
  const status =
    typeof error === "object" && error !== null && "status" in error
      ? error.status
      : undefined;

  if (status === 409) {
    if (isParent) {
      return "This parent category still contains subcategories. Move them to another parent or delete them first, then try again.";
    }
    if (singular === "industry") {
      return "This industry is still in use. Choose another industry for the companies using it, then try deleting it again.";
    }
    if (singular === "job category") {
      return "This job category is still in use. Choose another category for the jobs using it, then try deleting it again.";
    }
    return "This skill is still in use. Remove or replace it wherever it is used, such as jobs and resumes, then try deleting it again.";
  }

  if (status === 401) {
    return "Your session has expired. Sign in again before deleting this item.";
  }
  if (status === 403) {
    return `You don't have permission to delete this ${singular}. Ask an administrator for help.`;
  }
  if (status === 404) {
    return `This ${singular} could not be found. Close this window and refresh the list; someone may have already deleted it.`;
  }
  if (status === "FETCH_ERROR" || status === "TIMEOUT_ERROR") {
    return "We couldn't confirm whether this item was deleted. Check your connection and refresh the list before trying again.";
  }

  return `We couldn't delete this ${singular}. Please try again in a moment.`;
}
