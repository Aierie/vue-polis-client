const configFields = [
  "conversation_id",
  "site_id",
  "page_id",
  "parent_url",
  "xid",
  "x_name",
  "x_profile_image_url",
  "border",
  "border_radius",
  "padding",
  "height",
  "demo",
  "ucv",
  "ucw",
  "ucsh",
  "ucst",
  "ucsd",
  "ucsv",
  "ucsf",
  "build",
  "ui_lang",
  "subscribe_type",
  "show_vis",
  "show_share",
  "bg_white",
  "auth_needed_to_vote",
  "auth_needed_to_write",
  "auth_opt_fb",
  "auth_opt_tw",
  "auth_opt_allow_3rdparty",
  "dwok",
  "topic",
];

const defaults = {
  border: "1px solid #ccc",
  height: 930,
  border_radius: "4px",
  padding: "4px",
};
const withDefaults = (k) => ({
  type: typeof defaults[k] === "number" ? Number : String,
  default: defaults[k] || null,
});
const polisProps = configFields.reduce(
  (p, k) => ({ ...p, [k]: withDefaults(k) }),
  {}
);

export default polisProps;
