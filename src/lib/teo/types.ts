/**
 * Content model for the QR card experience at /teo.
 *
 * A Drop is one post in the feed. Each Drop is an ordered list of Blocks —
 * the admin builder is just a block list editor, nothing more.
 */

export type BlockType =
  | "title"
  | "subtitle"
  | "text"
  | "reveal"
  | "image"
  | "video"
  | "link"
  | "divider";

interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface TitleBlock extends BaseBlock {
  type: "title";
  text: string;
}

export interface SubtitleBlock extends BaseBlock {
  type: "subtitle";
  text: string;
}

export interface TextBlock extends BaseBlock {
  type: "text";
  text: string;
}

/** Invisible-ink block: blurred + noisy until the reader presses and holds. */
export interface RevealBlock extends BaseBlock {
  type: "reveal";
  text: string;
  /** Shown above the smudge as an instruction, e.g. "hold to reveal". */
  hint?: string;
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  url: string;
  alt?: string;
  caption?: string;
}

export interface VideoBlock extends BaseBlock {
  type: "video";
  url: string;
  /** Optional still shown before playback. */
  posterUrl?: string;
  caption?: string;
}

export interface LinkBlock extends BaseBlock {
  type: "link";
  label: string;
  url: string;
}

export interface DividerBlock extends BaseBlock {
  type: "divider";
}

export type Block =
  | TitleBlock
  | SubtitleBlock
  | TextBlock
  | RevealBlock
  | ImageBlock
  | VideoBlock
  | LinkBlock
  | DividerBlock;

export interface Drop {
  id: string;
  /** Short label shown in the feed's LCD strip, e.g. "TRACK 04". */
  tag: string;
  blocks: Block[];
  /** Epoch ms. Feed sorts newest first. */
  createdAt: number;
  updatedAt: number;
  /** Unpublished drops are admin-only. */
  published: boolean;
}

export interface Subscriber {
  email: string;
  createdAt: number;
  /** Where the signup came from, e.g. "card" for a QR scan. */
  source: string;
}

/** Payment handles rendered on the GIVE side. Edited from the admin page. */
export interface GiveConfig {
  venmo: string;
  cashApp: string;
  zelle: string;
  /** Mission blurb shown above the handles. */
  blurb: string;
}

export const DEFAULT_GIVE: GiveConfig = {
  venmo: "",
  cashApp: "",
  zelle: "",
  blurb:
    "Sons and daughters of God, becoming fully alive through music and through pursuing His purpose for our lives.",
};

export const BLOCK_LABELS: Record<BlockType, string> = {
  title: "Title",
  subtitle: "Subtitle",
  text: "Text",
  reveal: "Hidden text",
  image: "Image",
  video: "Video",
  link: "Button",
  divider: "Divider",
};

/** Fresh block with sensible empty defaults, used by the admin builder. */
export function emptyBlock(type: BlockType, id: string): Block {
  switch (type) {
    case "title":
      return { id, type, text: "" };
    case "subtitle":
      return { id, type, text: "" };
    case "text":
      return { id, type, text: "" };
    case "reveal":
      return { id, type, text: "", hint: "hold to reveal" };
    case "image":
      return { id, type, url: "", alt: "" };
    case "video":
      return { id, type, url: "" };
    case "link":
      return { id, type, label: "", url: "" };
    case "divider":
      return { id, type };
  }
}
