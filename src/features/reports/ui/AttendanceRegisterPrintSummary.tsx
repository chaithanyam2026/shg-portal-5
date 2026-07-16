import type {
  AttendanceRegister,
} from "../domain";

type Props = {
  register: AttendanceRegister;
};

/**
 * Printable footer summary.
 *
 * Displays:
 * - Present count
 * - Absent count
 * - Leave count
 * - Fine generated
 */
export default function AttendanceRegisterPrintSummary({
  register,
}: Props) {
  const summary =
    register.summary;

  const emptyCells = (
    <>
      <td />
      <td />
      <td />
    </>
  );

  return (
    <>
      <tr>
        <td
          colSpan={3}
          style={{
            fontWeight: "bold",
          }}
        >
          Present
        </td>

        {summary.map(
          (item) => (
            <td
              key={
                item.meetingId
              }
              style={{
                textAlign:
                  "center",
              }}
            >
              {
                item.presentCount
              }
            </td>
          ),
        )}

        {emptyCells}
      </tr>

      <tr>
        <td
          colSpan={3}
          style={{
            fontWeight: "bold",
          }}
        >
          Absent
        </td>

        {summary.map(
          (item) => (
            <td
              key={
                item.meetingId
              }
              style={{
                textAlign:
                  "center",
              }}
            >
              {
                item.absentCount
              }
            </td>
          ),
        )}

        {emptyCells}
      </tr>

      <tr>
        <td
          colSpan={3}
          style={{
            fontWeight: "bold",
          }}
        >
          Leave
        </td>

        {summary.map(
          (item) => (
            <td
              key={
                item.meetingId
              }
              style={{
                textAlign:
                  "center",
              }}
            >
              {
                item.leaveCount
              }
            </td>
          ),
        )}

        {emptyCells}
      </tr>

      <tr>
        <td
          colSpan={3}
          style={{
            fontWeight: "bold",
          }}
        >
          Fine Generated
        </td>

        {summary.map(
          (item) => (
            <td
              key={
                item.meetingId
              }
              style={{
                textAlign:
                  "right",
              }}
            >
              ₹
              {
                item.fineGenerated
              }
            </td>
          ),
        )}

        {emptyCells}
      </tr>
    </>
  );
}