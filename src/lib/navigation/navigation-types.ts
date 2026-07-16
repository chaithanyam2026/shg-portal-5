import type {
  SvgIconComponent,
} from "@mui/icons-material";

export type NavigationItem = {
  title: string;

  href: string;

  icon: SvgIconComponent;

  children?: NavigationItem[];
};