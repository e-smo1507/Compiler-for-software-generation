"use client";

type Props = {
  component: any;
};

export default function RenderComponent({
  component
}: Props) {

  // =========================
  // CARD
  // =========================

  if (component.type === "Card") {

    return (

      <div className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700">

        <h3 className="text-zinc-400 text-sm">
          {component.props.title}
        </h3>

        <div className="text-4xl font-bold mt-2">
          {component.props.value}
        </div>

      </div>

    );

  }

  // =========================
  // TABLE
  // =========================

  if (component.type === "Table") {

    return (

      <div className="border border-zinc-700 rounded-2xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-zinc-800">

            <tr>

              {component.props.columns.map(
                (column: string) => (

                  <th
                    key={column}
                    className="p-4 text-left"
                  >
                    {column}
                  </th>

                )
              )}

            </tr>

          </thead>

          <tbody>

            <tr className="border-t border-zinc-700">

              {component.props.columns.map(
                (column: string) => (

                  <td
                    key={column}
                    className="p-4 text-zinc-400"
                  >
                    Sample {column}
                  </td>

                )
              )}

            </tr>

          </tbody>

        </table>

      </div>

    );

  }

  // =========================
  // BUTTON
  // =========================

  if (component.type === "Button") {

    return (

      <button className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-semibold">

        {component.props.label}

      </button>

    );

  }

  // =========================
  // UNKNOWN
  // =========================

  return (

    <div className="bg-red-950 border border-red-700 p-4 rounded-xl">

      Unknown Component:
      {" "}
      {component.type}

    </div>

  );

}