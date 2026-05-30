"use client";

import RenderComponent
from "./RenderComponent";

type Props = {
  page: any;
};

export default function RenderPage({
  page
}: Props) {

  return (

    <div className="space-y-6">

      <h1 className="text-4xl font-bold">
        {page.name}
      </h1>

      <div className="grid gap-6">

        {page.components.map(
          (component: any, index: number) => (

            <RenderComponent
              key={index}
              component={component}
            />

          )
        )}

      </div>

    </div>

  );

}