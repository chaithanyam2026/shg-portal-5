import type { AttendanceRegisterCell } from "../domain";

type Props = {
  cell: AttendanceRegisterCell;
};

/**
 * Printable attendance cell.
 *
 * No colors or chips are used to
 * keep the print layout clean.
 */
export default function AttendanceRegisterPrintCell({ cell }: Props) {
  switch (cell.status) {
    case "PRESENT":
      return <>✓</>;

    case "LEAVE":
      return <>L</>;

    case "ABSENT":
      if (cell.fineCharged <= 0) {
        return <>A</>;
      }

      return <>A{cell.fineCharged}</>;

    default:
      return <>-</>;
  }
}
