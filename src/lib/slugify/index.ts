import slugify from "slugify";

export default function slugifyString(string: string) {
  return slugify(string, {
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    lower: true,
  });
}
