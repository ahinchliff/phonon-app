import { PhononDTO } from "../../types";

export const getTagValue = (
  phonon: PhononDTO,
  tagName: string
): string | undefined => {
  return phonon.ExtendedTLV.filter((tag) => {
    return tag.TagName === tagName;
  })[0].TagValue;
};
