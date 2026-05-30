type ComponentConfig = {
  type: string;
  props: any;
};

export default function RuntimeRenderer({
  component
}: {
  component: ComponentConfig;
}) {

  switch (component.type) {

    case "StatsCard":

      return (
        <div
          style={{
            border: "1px solid gray",
            padding: "20px",
            marginBottom: "10px"
          }}
        >
          <h2>
            {component.props.title}
          </h2>
        </div>
      );

    case "Table":

      return (
        <table border={1}>
          <thead>
            <tr>
              {component.props.columns.map(
                (col: string) => (
                  <th key={col}>{col}</th>
                )
              )}
            </tr>
          </thead>
        </table>
      );

    default:

      return (
        <div>
          Unknown Component
        </div>
      );
  }

}