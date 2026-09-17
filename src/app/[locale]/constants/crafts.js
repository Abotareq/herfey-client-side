import potteryImg from "@public/crafts/pottery-and-ceramics.jpg";
import jewelryImg from "@public/crafts/handmade-jewelry.jpg";
import textilesImg from "@public/crafts/textiles-and-rugs.jpg";
import woodworkImg from "@public/crafts/woodwork.jpg";
import leatherImg from "@public/crafts/leather-goods.jpg";
import glassImg from "@public/crafts/glass-and-lanterns.jpg";

// Curated photo per craft, keyed by the category slug. Anything the map
// doesn't know falls back to the image stored on the category itself.
export const CRAFT_IMAGES = {
  "pottery-and-ceramics": potteryImg,
  "handmade-jewelry": jewelryImg,
  "textiles-and-rugs": textilesImg,
  woodwork: woodworkImg,
  "leather-goods": leatherImg,
  "glass-and-lanterns": glassImg,
};

export const craftImage = (category) =>
  CRAFT_IMAGES[category?.slug] || category?.image || null;
