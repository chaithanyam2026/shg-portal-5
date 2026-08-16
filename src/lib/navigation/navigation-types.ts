import type { SvgIconComponent } from "@mui/icons-material";

import type { UserRole } from "@/lib/auth/roles";

export type NavigationItem = {
  title: string;

  href: string;

  icon: SvgIconComponent;

  roles?: readonly UserRole[];

  allowOfficeBearers?: boolean;

  children?: NavigationItem[];
};
